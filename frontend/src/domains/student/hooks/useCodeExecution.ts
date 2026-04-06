/**
 * useCodeExecution — React hook for managing code evaluation lifecycle.
 *
 * Provides a clean interface for executing student code against test cases
 * using the Skulpt-based evaluation engine. Manages the state machine:
 * idle → running → complete | error.
 */

import { useState, useCallback, useRef } from "react";

import { evaluateCode } from "@/domains/student/services/evaluator";
import { formatSkulptError } from "@/domains/student/services/errorHandler";

import type {
  TestCase,
  EvaluationResult,
  ExecutionState,
} from "@/domains/student/types";

/** Return type of the useCodeExecution hook. */
export interface UseCodeExecutionReturn {
  /** Trigger code evaluation against provided test cases. */
  execute: (
    sourceCode: string,
    testCases: TestCase[],
    timeoutMs?: number,
  ) => Promise<void>;

  /** Current state of the execution lifecycle. */
  state: ExecutionState;

  /** Evaluation result (available when state is "complete"). */
  result: EvaluationResult | null;

  /** Error message (available when state is "error"). */
  error: string | null;

  /** Reset the hook to idle state. */
  reset: () => void;
}

/**
 * React hook for managing code execution and evaluation.
 *
 * Usage:
 * ```tsx
 * const { execute, result, state, error, reset } = useCodeExecution();
 *
 * // Run evaluation
 * await execute(sourceCode, testCases);
 *
 * // Check results
 * if (state === "complete" && result) {
 *   console.log(result.scorePercentage);
 * }
 * ```
 */
export function useCodeExecution(): UseCodeExecutionReturn {
  const [state, setState] = useState<ExecutionState>("idle");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Track the current execution to prevent race conditions
  const executionIdRef = useRef(0);

  const execute = useCallback(
    async (
      sourceCode: string,
      testCases: TestCase[],
      timeoutMs?: number,
    ): Promise<void> => {
      // Increment execution ID to invalidate previous runs
      const currentExecutionId = ++executionIdRef.current;

      // Transition to running
      setState("running");
      setResult(null);
      setError(null);

      try {
        const evaluationResult = await evaluateCode(
          sourceCode,
          testCases,
          timeoutMs,
        );

        // Only update state if this is still the current execution
        if (currentExecutionId !== executionIdRef.current) return;

        setResult(evaluationResult);
        setState("complete");
      } catch (err: unknown) {
        // Only update state if this is still the current execution
        if (currentExecutionId !== executionIdRef.current) return;

        const formatted = formatSkulptError(err);
        setError(formatted.message);
        setState("error");
      }
    },
    [],
  );

  const reset = useCallback(() => {
    // Increment execution ID to invalidate any in-flight execution
    executionIdRef.current++;
    setState("idle");
    setResult(null);
    setError(null);
  }, []);

  return { execute, state, result, error, reset };
}
