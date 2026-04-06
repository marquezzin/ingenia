/**
 * Tests for skulptRunner — Low-level Python code execution via Skulpt.
 *
 * Mocks the `skulpt` module to test runCode's orchestration: stdout capture,
 * stdin injection, timeout handling (both sentinel and TimeLimitError),
 * and error delegation to errorHandler.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Mock Skulpt module ──────────────────────────────────────────────────────

const mockConfigure = vi.fn();
const mockAsyncToPromise = vi.fn();
const mockImportMain = vi.fn();

vi.mock("skulpt", () => ({
  default: {
    configure: (...args: unknown[]) => mockConfigure(...args),
    misceval: {
      asyncToPromise: (fn: () => unknown) => {
        mockAsyncToPromise(fn);
        return fn();
      },
    },
    importMainWithBody: (...args: unknown[]) => mockImportMain(...args),
    builtinFiles: { files: {} },
    python3: {},
    // Sk.execLimit is set by configure()
  },
}));

// ── Mock errorHandler ───────────────────────────────────────────────────────

vi.mock("@/domains/student/services/errorHandler", () => ({
  formatSkulptError: vi.fn((error: unknown) => ({
    message: `Formatted: ${String(error)}`,
    category: "unknown" as const,
    line: null,
  })),
  formatTimeoutError: vi.fn(() => ({
    message: "Timeout message",
    category: "timeout" as const,
    line: null,
  })),
  TIMEOUT_SENTINEL: "__TIMEOUT__",
}));

import { runCode } from "@/domains/student/services/skulptRunner";
import {
  formatSkulptError,
  formatTimeoutError,
} from "@/domains/student/services/errorHandler";

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("runCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Successful execution ──────────────────────────────────────────────

  describe("successful execution", () => {
    it("captures stdout from print() calls", async () => {
      // Mock Skulpt to call the output callback with text
      mockConfigure.mockImplementation((config: { output: (text: string) => void }) => {
        // Store output callback to call later
        (globalThis as Record<string, unknown>).__skulptOutput = config.output;
      });

      mockImportMain.mockImplementation(() => {
        // Simulate print() calls during execution
        const output = (globalThis as Record<string, unknown>).__skulptOutput as (text: string) => void;
        output("Hello");
        output(", ");
        output("World!\n");
        return Promise.resolve();
      });

      const resultPromise = runCode('print("Hello, World!")');
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.stdout).toBe("Hello, World!\n");
      expect(result.stderr).toBe("");
      expect(result.timedOut).toBe(false);
    });

    it("returns empty stdout when code produces no output", async () => {
      mockConfigure.mockImplementation(() => {});
      mockImportMain.mockResolvedValue(undefined);

      const resultPromise = runCode("x = 1");
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.stdout).toBe("");
      expect(result.stderr).toBe("");
      expect(result.timedOut).toBe(false);
    });
  });

  // ── Stdin injection ───────────────────────────────────────────────────

  describe("stdin injection", () => {
    it("feeds stdin lines in FIFO order", async () => {
      const stdinCalls: string[] = [];

      mockConfigure.mockImplementation((config: { inputfun: () => string }) => {
        (globalThis as Record<string, unknown>).__skulptInput = config.inputfun;
      });

      mockImportMain.mockImplementation(() => {
        const inputfun = (globalThis as Record<string, unknown>).__skulptInput as () => string;
        stdinCalls.push(inputfun());
        stdinCalls.push(inputfun());
        return Promise.resolve();
      });

      const resultPromise = runCode("code", ["first", "second"]);
      await vi.runAllTimersAsync();
      await resultPromise;

      expect(stdinCalls).toEqual(["first", "second"]);
    });

    it("returns empty string for extra input() calls beyond provided stdin", async () => {
      const stdinCalls: string[] = [];

      mockConfigure.mockImplementation((config: { inputfun: () => string }) => {
        (globalThis as Record<string, unknown>).__skulptInput = config.inputfun;
      });

      mockImportMain.mockImplementation(() => {
        const inputfun = (globalThis as Record<string, unknown>).__skulptInput as () => string;
        stdinCalls.push(inputfun());
        stdinCalls.push(inputfun()); // No more lines
        return Promise.resolve();
      });

      const resultPromise = runCode("code", ["only_one"]);
      await vi.runAllTimersAsync();
      await resultPromise;

      expect(stdinCalls).toEqual(["only_one", ""]);
    });
  });

  // ── Skulpt error (syntax, runtime) ────────────────────────────────────

  describe("Skulpt errors", () => {
    it("captures syntax error via errorHandler", async () => {
      mockConfigure.mockImplementation(() => {});
      mockImportMain.mockRejectedValue(
        new Error("SyntaxError: bad input on line 1"),
      );

      const resultPromise = runCode("def foo(");
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.timedOut).toBe(false);
      expect(result.stderr).toBeTruthy();
      expect(formatSkulptError).toHaveBeenCalled();
    });

    it("captures runtime error via errorHandler", async () => {
      mockConfigure.mockImplementation(() => {});
      mockImportMain.mockRejectedValue(
        new Error("NameError: name 'x' is not defined on line 2"),
      );

      const resultPromise = runCode("print(x)");
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.timedOut).toBe(false);
      expect(result.stderr).toBeTruthy();
      expect(formatSkulptError).toHaveBeenCalled();
    });

    it("preserves partial stdout on error", async () => {
      mockConfigure.mockImplementation((config: { output: (text: string) => void }) => {
        (globalThis as Record<string, unknown>).__skulptOutput = config.output;
      });

      mockImportMain.mockImplementation(() => {
        const output = (globalThis as Record<string, unknown>).__skulptOutput as (text: string) => void;
        output("partial output\n");
        return Promise.reject(
          new Error("NameError: name 'y' is not defined"),
        );
      });

      const resultPromise = runCode("print('partial output'); print(y)");
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.stdout).toBe("partial output\n");
      expect(result.stderr).toBeTruthy();
    });
  });

  // ── Timeout — sentinel (fallback setTimeout) ─────────────────────────

  describe("timeout via sentinel", () => {
    it("returns timedOut=true when sentinel error is caught", async () => {
      mockConfigure.mockImplementation(() => {});
      mockImportMain.mockRejectedValue(new Error("__TIMEOUT__"));

      const resultPromise = runCode("while True: pass", [], 1000);
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.timedOut).toBe(true);
      expect(result.stderr).toBeTruthy();
      expect(formatTimeoutError).toHaveBeenCalled();
    });
  });

  // ── Timeout — Skulpt TimeLimitError ───────────────────────────────────

  describe("timeout via Skulpt TimeLimitError", () => {
    it("detects TimeLimitError as timeout", async () => {
      mockConfigure.mockImplementation(() => {});
      mockImportMain.mockRejectedValue(
        new Error("TimeLimitError: Program exceeded run time limit"),
      );

      const resultPromise = runCode("while True: pass", [], 1000);
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.timedOut).toBe(true);
      expect(formatTimeoutError).toHaveBeenCalled();
    });

    it("detects 'Program exceeded run time limit' message", async () => {
      mockConfigure.mockImplementation(() => {});
      mockImportMain.mockRejectedValue(
        new Error("Program exceeded run time limit on line 1"),
      );

      const resultPromise = runCode("code", [], 1000);
      await vi.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.timedOut).toBe(true);
    });
  });

  // ── Configuration ─────────────────────────────────────────────────────

  describe("Skulpt configuration", () => {
    it("configures Skulpt with the provided timeout", async () => {
      mockConfigure.mockImplementation(() => {});
      mockImportMain.mockResolvedValue(undefined);

      const resultPromise = runCode("x=1", [], 5000);
      await vi.runAllTimersAsync();
      await resultPromise;

      expect(mockConfigure).toHaveBeenCalledWith(
        expect.objectContaining({
          execLimit: 5000,
        }),
      );
    });

    it("uses default timeout when not specified", async () => {
      mockConfigure.mockImplementation(() => {});
      mockImportMain.mockResolvedValue(undefined);

      const resultPromise = runCode("x=1");
      await vi.runAllTimersAsync();
      await resultPromise;

      expect(mockConfigure).toHaveBeenCalledWith(
        expect.objectContaining({
          execLimit: 10_000,
        }),
      );
    });
  });
});
