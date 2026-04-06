/**
 * Skulpt Runner — Low-level Python code execution via Skulpt.
 *
 * Executes arbitrary Python source code in the browser using the Skulpt
 * interpreter. Provides stdin injection, stdout capture, timeout support
 * (via Sk.execLimit + setTimeout fallback), and delegates error formatting
 * to errorHandler.ts.
 */

import Sk from "skulpt";

import type { CodeExecutionResult } from "@/domains/student/types";
import {
  formatSkulptError,
  formatTimeoutError,
  TIMEOUT_SENTINEL,
} from "@/domains/student/services/errorHandler";

/** Default execution timeout in milliseconds. */
const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Execute Python code using Skulpt and capture its output.
 *
 * @param sourceCode  - The Python source code to execute.
 * @param stdinLines  - Lines to feed to `input()` calls, consumed in FIFO order.
 * @param timeoutMs   - Maximum time allowed for execution (default: 10s).
 * @returns A promise that resolves to the execution result.
 */
export async function runCode(
  sourceCode: string,
  stdinLines: string[] = [],
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<CodeExecutionResult> {
  // ── Accumulators ──────────────────────────────────────────────────────
  const stdoutParts: string[] = [];
  let stdinIndex = 0;

  // ── Configure Skulpt ──────────────────────────────────────────────────
  Sk.configure({
    // Capture print() output
    output: (text: string) => {
      stdoutParts.push(text);
    },

    // Feed stdin lines in FIFO order
    inputfun: () => {
      if (stdinIndex < stdinLines.length) {
        return stdinLines[stdinIndex++];
      }
      // If the code asks for more input than provided, return empty string
      return "";
    },

    // Read built-in library files
    read: (filename: string) => {
      if (
        Sk.builtinFiles === undefined ||
        Sk.builtinFiles.files[filename] === undefined
      ) {
        throw new Error(`File not found: '${filename}'`);
      }
      return Sk.builtinFiles.files[filename];
    },

    // Use Python 3 syntax
    __future__: Sk.python3,

    // Native Skulpt execution limit (milliseconds)
    execLimit: timeoutMs,
  });

  // ── Build execution promise ───────────────────────────────────────────
  const executionPromise = Sk.misceval.asyncToPromise(() =>
    Sk.importMainWithBody("<stdin>", false, sourceCode, true),
  );

  // ── Build timeout fallback promise ────────────────────────────────────
  // Sk.execLimit should handle most timeouts natively, but we keep a
  // setTimeout fallback in case the native limit doesn't trigger.
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(TIMEOUT_SENTINEL));
    }, timeoutMs + 500); // +500ms grace period for Sk.execLimit
  });

  try {
    // Race execution against timeout
    await Promise.race([executionPromise, timeoutPromise]);

    return {
      stdout: stdoutParts.join(""),
      stderr: "",
      timedOut: false,
    };
  } catch (error: unknown) {
    // ── Timeout (sentinel from fallback) ──────────────────────────────
    if (error instanceof Error && error.message === TIMEOUT_SENTINEL) {
      const formatted = formatTimeoutError();
      return {
        stdout: stdoutParts.join(""),
        stderr: formatted.message,
        timedOut: true,
      };
    }

    // ── Skulpt native timeout (TimeLimitError) ────────────────────────
    const rawMessage = String(error);
    if (
      rawMessage.includes("TimeLimitError") ||
      rawMessage.includes("Program exceeded run time limit")
    ) {
      const formatted = formatTimeoutError();
      return {
        stdout: stdoutParts.join(""),
        stderr: formatted.message,
        timedOut: true,
      };
    }

    // ── Skulpt error (syntax, runtime, etc.) ─────────────────────────
    const formatted = formatSkulptError(error);
    return {
      stdout: stdoutParts.join(""),
      stderr: formatted.message,
      timedOut: false,
    };
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}
