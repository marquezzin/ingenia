/**
 * Evaluator — Test Case-based Code Evaluation.
 *
 * Orchestrates the execution of student code against a set of test cases
 * using the Skulpt runner. Produces individual verdicts per test case
 * and a consolidated evaluation result with score and feedback.
 *
 * Business Rules:
 * - BR-013: Feedback must guide without exposing the answer.
 */

import { runCode } from "@/domains/student/services/skulptRunner";
import { generateFeedback } from "@/domains/student/services/feedbackGenerator";

import type {
  TestCase,
  TestCaseResult,
  TestCaseVerdict,
  EvaluationResult,
  ResultStatus,
} from "@/domains/student/types";

/** Default execution timeout per test case in milliseconds. */
const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Evaluate student code against all provided test cases.
 *
 * Each test case is run independently: the code is re-executed for each
 * test case with its own stdin input. Outputs are trimmed before comparison.
 *
 * @param sourceCode - The student's Python source code.
 * @param testCases  - Array of test cases with input and expected output.
 * @param timeoutMs  - Timeout per test case execution (default: 10s).
 * @returns Consolidated evaluation result.
 */
export async function evaluateCode(
  sourceCode: string,
  testCases: TestCase[],
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<EvaluationResult> {
  const results: TestCaseResult[] = [];

  for (const testCase of testCases) {
    const result = await evaluateSingleTestCase(
      sourceCode,
      testCase,
      timeoutMs,
    );
    results.push(result);
  }

  // ── Calculate score ─────────────────────────────────────────────────
  const passedCount = results.filter((r) => r.verdict === "PASSED").length;
  const failedCount = results.length - passedCount;
  const scorePercentage =
    results.length > 0
      ? Math.round((passedCount / results.length) * 100 * 100) / 100
      : 0;

  // ── Determine overall status ──────────────────────────────────────────
  const resultStatus = determineResultStatus(results);

  // ── Generate pedagogical feedback (BR-013) ────────────────────────────
  const feedbackMessage = generateFeedback(
    passedCount,
    results.length,
    resultStatus,
  );

  return {
    results,
    passedCount,
    failedCount,
    scorePercentage,
    resultStatus,
    feedbackMessage,
  };
}

/**
 * Evaluate a single test case by running the code with its input
 * and comparing the output.
 */
async function evaluateSingleTestCase(
  sourceCode: string,
  testCase: TestCase,
  timeoutMs: number,
): Promise<TestCaseResult> {
  // Parse input_data into lines for stdin injection
  const stdinLines = parseInputData(testCase.input_data);

  try {
    const execution = await runCode(sourceCode, stdinLines, timeoutMs);

    // ── Timeout ───────────────────────────────────────────────────────
    if (execution.timedOut) {
      return {
        testCaseId: testCase.id,
        testCaseName: testCase.name,
        expectedOutput: testCase.expected_output.trim(),
        actualOutput: execution.stdout.trim(),
        verdict: "ERROR",
        errorMessage: execution.stderr,
      };
    }

    // ── Runtime or syntax error ───────────────────────────────────────
    if (execution.stderr) {
      return {
        testCaseId: testCase.id,
        testCaseName: testCase.name,
        expectedOutput: testCase.expected_output.trim(),
        actualOutput: execution.stdout.trim(),
        verdict: "ERROR",
        errorMessage: execution.stderr,
      };
    }

    // ── Compare output ──────────────────────────────────────────────
    const actualTrimmed = execution.stdout.trim();
    const expectedTrimmed = testCase.expected_output.trim();
    const passed = actualTrimmed === expectedTrimmed;

    const verdict: TestCaseVerdict = passed ? "PASSED" : "FAILED";

    return {
      testCaseId: testCase.id,
      testCaseName: testCase.name,
      expectedOutput: expectedTrimmed,
      actualOutput: actualTrimmed,
      verdict,
      errorMessage: null,
    };
  } catch (error: unknown) {
    // Unexpected error (should not happen — runCode catches errors)
    return {
      testCaseId: testCase.id,
      testCaseName: testCase.name,
      expectedOutput: testCase.expected_output.trim(),
      actualOutput: "",
      verdict: "ERROR",
      errorMessage:
        error instanceof Error
          ? error.message
          : "Erro inesperado durante a avaliação.",
    };
  }
}

/**
 * Parse the input_data string into individual lines for stdin.
 * Each line represents one `input()` call.
 */
function parseInputData(inputData: string | null): string[] {
  if (!inputData) return [];
  return inputData.split("\n");
}

/**
 * Determine the overall result status based on individual test results.
 *
 * - PASSED: all tests passed
 * - ERROR: at least one test had a technical error
 * - FAILED: at least one test failed (but no errors)
 */
function determineResultStatus(results: TestCaseResult[]): ResultStatus {
  const hasError = results.some((r) => r.verdict === "ERROR");
  if (hasError) return "ERROR";

  const allPassed = results.every((r) => r.verdict === "PASSED");
  return allPassed ? "PASSED" : "FAILED";
}

