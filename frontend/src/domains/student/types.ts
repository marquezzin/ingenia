/**
 * Student Domain — TypeScript Types
 *
 * Types for the Skulpt-based code evaluation engine, test case comparison,
 * and the React hook that drives the execution lifecycle.
 */

// ─── Test Case (input for evaluation) ───────────────────────────────────────

/** A single test case as received from the API (ExerciseTestCase subset). */
export interface TestCase {
  id: string;
  name: string;
  input_data: string | null;
  expected_output: string;
  sequence_order: number;
  is_hidden: boolean;
}

// ─── Code Execution (Skulpt runner output) ──────────────────────────────────

/** Low-level result from running code through Skulpt. */
export interface CodeExecutionResult {
  /** Captured stdout (concatenation of all `print()` calls). */
  stdout: string;
  /** Error message, if any (syntax error, runtime error, etc). */
  stderr: string;
  /** True if the execution timed out before completing. */
  timedOut: boolean;
}

// ─── Test Case Result (per-test evaluation) ─────────────────────────────────

export type TestCaseVerdict = "PASSED" | "FAILED" | "ERROR";

/** Result of evaluating a single test case. */
export interface TestCaseResult {
  /** ID of the test case that was evaluated. */
  testCaseId: string;
  /** Human-readable name of the test case. */
  testCaseName: string;
  /** The expected output (trimmed). */
  expectedOutput: string;
  /** The actual output produced by the student's code (trimmed). */
  actualOutput: string;
  /** Whether the test passed, failed, or had an error. */
  verdict: TestCaseVerdict;
  /** Error message if verdict is ERROR. */
  errorMessage: string | null;
}

// ─── Evaluation Result (consolidated) ───────────────────────────────────────

export type ResultStatus = "PASSED" | "FAILED" | "ERROR";

/** Consolidated result of evaluating all test cases for a single submission. */
export interface EvaluationResult {
  /** Individual results per test case. */
  results: TestCaseResult[];
  /** Number of test cases that passed. */
  passedCount: number;
  /** Number of test cases that failed or had errors. */
  failedCount: number;
  /** Score as percentage: (passedCount / total) * 100. */
  scorePercentage: number;
  /** Overall status: PASSED if all passed, ERROR if any had errors, FAILED otherwise. */
  resultStatus: ResultStatus;
  /** Pedagogical feedback message (BR-013: no answer exposure). */
  feedbackMessage: string;
}

// ─── Execution State (hook lifecycle) ────────────────────────────────────────

export type ExecutionState = "idle" | "running" | "complete" | "error";
