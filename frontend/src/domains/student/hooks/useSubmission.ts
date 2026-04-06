/**
 * useSubmission — React hook for submitting evaluation results to the backend.
 *
 * Orchestrates the full submission flow:
 * 1. Receives an EvaluationResult (from useCodeExecution / evaluator)
 * 2. Sends it to POST /api/v1/student/submissions/ for persistence
 * 3. Manages loading, success, and error states
 *
 * Business Rules:
 * - BR-012: Each submission generates exactly one result (atomic POST)
 * - BR-013: Feedback does not expose expected answers (generated upstream)
 */

import { useState, useCallback } from "react";

import {
  createSubmissionApi,
  type CreateSubmissionPayload,
  type SubmissionResponse,
} from "@/domains/student/api/submissions";

import type { EvaluationResult } from "@/domains/student/types";

// ─── Types ──────────────────────────────────────────────────────────────────

export type SubmissionState = "idle" | "submitting" | "success" | "error";

export interface UseSubmissionReturn {
  /** Submit an evaluation result to the backend for persistence. */
  submit: (
    exerciseId: string,
    sourceCode: string,
    evaluationResult: EvaluationResult,
  ) => Promise<SubmissionResponse | null>;

  /** Current state of the submission lifecycle. */
  state: SubmissionState;

  /** Backend response after successful submission. */
  response: SubmissionResponse | null;

  /** Error message if submission failed. */
  error: string | null;

  /** Reset the hook to idle state. */
  reset: () => void;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * React hook for submitting evaluated code results to the backend.
 *
 * Usage:
 * ```tsx
 * const { submit, state, response, error, reset } = useSubmission();
 *
 * // After code evaluation completes:
 * if (evaluationResult) {
 *   const res = await submit(exerciseId, sourceCode, evaluationResult);
 * }
 *
 * // Check result:
 * if (state === "success" && response) {
 *   console.log("Submission ID:", response.id);
 * }
 * ```
 */
export function useSubmission(): UseSubmissionReturn {
  const [state, setState] = useState<SubmissionState>("idle");
  const [response, setResponse] = useState<SubmissionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (
      exerciseId: string,
      sourceCode: string,
      evaluationResult: EvaluationResult,
    ): Promise<SubmissionResponse | null> => {
      setState("submitting");
      setResponse(null);
      setError(null);

      const payload: CreateSubmissionPayload = {
        exercise_id: exerciseId,
        source_code: sourceCode,
        score_percentage: evaluationResult.scorePercentage,
        passed_tests_count: evaluationResult.passedCount,
        failed_tests_count: evaluationResult.failedCount,
        result_status: evaluationResult.resultStatus,
        feedback_message: evaluationResult.feedbackMessage,
      };

      try {
        const data = await createSubmissionApi(payload);
        setResponse(data);
        setState("success");
        return data;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro ao enviar submissão. Tente novamente.";
        setError(errorMessage);
        setState("error");
        return null;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setState("idle");
    setResponse(null);
    setError(null);
  }, []);

  return { submit, state, response, error, reset };
}
