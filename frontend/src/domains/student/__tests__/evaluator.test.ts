/**
 * Tests for evaluator — Test case-based code evaluation.
 *
 * Mocks the skulptRunner (runCode) to test the evaluator's orchestration
 * logic in isolation: score calculation, verdict determination, output
 * comparison (whitespace trimming), and feedback generation (BR-013).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

import type { CodeExecutionResult } from "@/domains/student/types";
import type { TestCase } from "@/domains/student/types";

// ── Mock skulptRunner ───────────────────────────────────────────────────────
vi.mock("@/domains/student/services/skulptRunner", () => ({
  runCode: vi.fn(),
}));

// ── Mock errorHandler (used as fallback for unexpected errors) ──────────────
vi.mock("@/domains/student/services/errorHandler", () => ({
  formatSkulptError: vi.fn((error: unknown) => ({
    message: `Mocked error: ${String(error)}`,
    category: "unknown" as const,
    line: null,
  })),
}));

import { evaluateCode } from "@/domains/student/services/evaluator";
import { runCode } from "@/domains/student/services/skulptRunner";

const mockedRunCode = vi.mocked(runCode);

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeTestCase(overrides: Partial<TestCase> = {}): TestCase {
  return {
    id: "tc-1",
    name: "Test 1",
    input_data: null,
    expected_output: "hello\n",
    sequence_order: 1,
    is_hidden: false,
    ...overrides,
  };
}

function successResult(stdout: string): CodeExecutionResult {
  return { stdout, stderr: "", timedOut: false };
}

function errorResult(stderr: string): CodeExecutionResult {
  return { stdout: "", stderr, timedOut: false };
}

function timeoutResult(): CodeExecutionResult {
  return {
    stdout: "",
    stderr: "Seu código excedeu o tempo limite.",
    timedOut: true,
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("evaluateCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Success (100%) ────────────────────────────────────────────────────

  describe("success scenario", () => {
    it("returns PASSED with 100% when all tests pass", async () => {
      const testCases: TestCase[] = [
        makeTestCase({ id: "tc-1", expected_output: "hello\n" }),
        makeTestCase({ id: "tc-2", expected_output: "world\n" }),
      ];

      mockedRunCode
        .mockResolvedValueOnce(successResult("hello\n"))
        .mockResolvedValueOnce(successResult("world\n"));

      const result = await evaluateCode("code", testCases);

      expect(result.passedCount).toBe(2);
      expect(result.failedCount).toBe(0);
      expect(result.scorePercentage).toBe(100);
      expect(result.resultStatus).toBe("PASSED");
      expect(result.results).toHaveLength(2);
      expect(result.results[0].verdict).toBe("PASSED");
      expect(result.results[1].verdict).toBe("PASSED");
    });

    it("generates congratulatory feedback on 100% pass", async () => {
      mockedRunCode.mockResolvedValueOnce(successResult("42\n"));

      const result = await evaluateCode("code", [
        makeTestCase({ expected_output: "42\n" }),
      ]);

      expect(result.feedbackMessage).toContain("Parabéns");
    });
  });

  // ── Partial failure ───────────────────────────────────────────────────

  describe("partial failure scenario", () => {
    it("returns FAILED with correct score when some tests fail", async () => {
      const testCases: TestCase[] = [
        makeTestCase({ id: "tc-1", expected_output: "a" }),
        makeTestCase({ id: "tc-2", expected_output: "b" }),
        makeTestCase({ id: "tc-3", expected_output: "c" }),
      ];

      mockedRunCode
        .mockResolvedValueOnce(successResult("a"))
        .mockResolvedValueOnce(successResult("wrong"))
        .mockResolvedValueOnce(successResult("c"));

      const result = await evaluateCode("code", testCases);

      expect(result.passedCount).toBe(2);
      expect(result.failedCount).toBe(1);
      expect(result.scorePercentage).toBeCloseTo(66.67, 1);
      expect(result.resultStatus).toBe("FAILED");
    });

    it("marks individual test results correctly", async () => {
      const testCases: TestCase[] = [
        makeTestCase({ id: "tc-1", expected_output: "yes" }),
        makeTestCase({ id: "tc-2", expected_output: "no" }),
      ];

      mockedRunCode
        .mockResolvedValueOnce(successResult("yes"))
        .mockResolvedValueOnce(successResult("wrong"));

      const result = await evaluateCode("code", testCases);

      expect(result.results[0].verdict).toBe("PASSED");
      expect(result.results[1].verdict).toBe("FAILED");
      expect(result.results[1].actualOutput).toBe("wrong");
    });
  });

  // ── All failing ───────────────────────────────────────────────────────

  describe("all failing scenario", () => {
    it("returns 0% score when no tests pass", async () => {
      const testCases: TestCase[] = [
        makeTestCase({ id: "tc-1", expected_output: "expected" }),
        makeTestCase({ id: "tc-2", expected_output: "also expected" }),
      ];

      mockedRunCode
        .mockResolvedValueOnce(successResult("wrong1"))
        .mockResolvedValueOnce(successResult("wrong2"));

      const result = await evaluateCode("code", testCases);

      expect(result.passedCount).toBe(0);
      expect(result.scorePercentage).toBe(0);
      expect(result.resultStatus).toBe("FAILED");
    });
  });

  // ── Timeout ───────────────────────────────────────────────────────────

  describe("timeout scenario", () => {
    it("marks test case as ERROR on timeout", async () => {
      mockedRunCode.mockResolvedValueOnce(timeoutResult());

      const result = await evaluateCode("while True: pass", [
        makeTestCase(),
      ]);

      expect(result.results[0].verdict).toBe("ERROR");
      expect(result.results[0].errorMessage).toBeTruthy();
      expect(result.resultStatus).toBe("ERROR");
    });

    it("continues evaluating other test cases after timeout", async () => {
      const testCases: TestCase[] = [
        makeTestCase({ id: "tc-1", expected_output: "ok" }),
        makeTestCase({ id: "tc-2", expected_output: "done" }),
      ];

      mockedRunCode
        .mockResolvedValueOnce(timeoutResult())
        .mockResolvedValueOnce(successResult("done"));

      const result = await evaluateCode("code", testCases);

      expect(result.results[0].verdict).toBe("ERROR");
      expect(result.results[1].verdict).toBe("PASSED");
      expect(result.resultStatus).toBe("ERROR"); // ERROR takes precedence
    });
  });

  // ── Syntax error ──────────────────────────────────────────────────────

  describe("syntax error scenario", () => {
    it("marks test case as ERROR on syntax error", async () => {
      mockedRunCode.mockResolvedValueOnce(
        errorResult("Erro de sintaxe na linha 1: bad input"),
      );

      const result = await evaluateCode("def foo(", [makeTestCase()]);

      expect(result.results[0].verdict).toBe("ERROR");
      expect(result.results[0].errorMessage).toContain("sintaxe");
      expect(result.resultStatus).toBe("ERROR");
    });
  });

  // ── Runtime error ─────────────────────────────────────────────────────

  describe("runtime error scenario", () => {
    it("marks test case as ERROR on runtime error", async () => {
      mockedRunCode.mockResolvedValueOnce(
        errorResult("Erro de nome: name 'x' is not defined"),
      );

      const result = await evaluateCode("print(x)", [makeTestCase()]);

      expect(result.results[0].verdict).toBe("ERROR");
      expect(result.results[0].errorMessage).toBeTruthy();
      expect(result.resultStatus).toBe("ERROR");
    });
  });

  // ── Whitespace trimming ───────────────────────────────────────────────

  describe("output comparison with whitespace trimming", () => {
    it("trims trailing whitespace and newlines before comparison", async () => {
      mockedRunCode.mockResolvedValueOnce(
        successResult("hello  \n\n"),
      );

      const result = await evaluateCode("code", [
        makeTestCase({ expected_output: "  hello  \n" }),
      ]);

      expect(result.results[0].verdict).toBe("PASSED");
    });

    it("trims leading whitespace before comparison", async () => {
      mockedRunCode.mockResolvedValueOnce(successResult("  42  "));

      const result = await evaluateCode("code", [
        makeTestCase({ expected_output: "42" }),
      ]);

      expect(result.results[0].verdict).toBe("PASSED");
    });

    it("fails when content differs even after trimming", async () => {
      mockedRunCode.mockResolvedValueOnce(successResult(" abc "));

      const result = await evaluateCode("code", [
        makeTestCase({ expected_output: "xyz" }),
      ]);

      expect(result.results[0].verdict).toBe("FAILED");
    });
  });

  // ── stdin injection ───────────────────────────────────────────────────

  describe("stdin injection", () => {
    it("passes input_data as stdin lines to runCode", async () => {
      const tc = makeTestCase({
        input_data: "5\n10",
        expected_output: "15",
      });

      mockedRunCode.mockResolvedValueOnce(successResult("15"));

      await evaluateCode("code", [tc]);

      expect(mockedRunCode).toHaveBeenCalledWith(
        "code",
        ["5", "10"],
        expect.any(Number),
      );
    });

    it("passes empty array when input_data is null", async () => {
      const tc = makeTestCase({ input_data: null });

      mockedRunCode.mockResolvedValueOnce(successResult("hello"));

      await evaluateCode("code", [tc]);

      expect(mockedRunCode).toHaveBeenCalledWith(
        "code",
        [],
        expect.any(Number),
      );
    });
  });

  // ── Edge cases ────────────────────────────────────────────────────────

  describe("edge cases", () => {
    it("returns 0 score for empty test case array", async () => {
      const result = await evaluateCode("code", []);

      expect(result.passedCount).toBe(0);
      expect(result.failedCount).toBe(0);
      expect(result.scorePercentage).toBe(0);
      expect(result.results).toHaveLength(0);
    });

    it("preserves testCaseId and testCaseName in results", async () => {
      const tc = makeTestCase({ id: "uuid-123", name: "My Test" });
      mockedRunCode.mockResolvedValueOnce(successResult("hello"));

      const result = await evaluateCode("code", [tc]);

      expect(result.results[0].testCaseId).toBe("uuid-123");
      expect(result.results[0].testCaseName).toBe("My Test");
    });

    it("stores expectedOutput and actualOutput trimmed in results", async () => {
      const tc = makeTestCase({ expected_output: "  expected  \n" });
      mockedRunCode.mockResolvedValueOnce(
        successResult("  actual  \n"),
      );

      const result = await evaluateCode("code", [tc]);

      expect(result.results[0].expectedOutput).toBe("expected");
      expect(result.results[0].actualOutput).toBe("actual");
    });
  });

  // ── Feedback (BR-013) ─────────────────────────────────────────────────

  describe("feedback message (BR-013)", () => {
    it("generates feedback without exposing answers", async () => {
      mockedRunCode.mockResolvedValueOnce(successResult("wrong"));

      const result = await evaluateCode("code", [
        makeTestCase({ expected_output: "secret_answer" }),
      ]);

      expect(result.feedbackMessage).not.toContain("secret_answer");
    });

    it("includes count of passed tests in feedback", async () => {
      const testCases: TestCase[] = [
        makeTestCase({ id: "tc-1", expected_output: "a" }),
        makeTestCase({ id: "tc-2", expected_output: "b" }),
      ];

      mockedRunCode
        .mockResolvedValueOnce(successResult("a"))
        .mockResolvedValueOnce(successResult("wrong"));

      const result = await evaluateCode("code", testCases);

      expect(result.feedbackMessage).toContain("1");
      expect(result.feedbackMessage).toContain("2");
    });
  });
});
