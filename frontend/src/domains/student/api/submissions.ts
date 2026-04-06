/**
 * Student Domain — Submissions API Contract.
 *
 * HTTP calls for submitting evaluated code results to the backend.
 * The frontend evaluates via Skulpt and sends the consolidated result.
 */

import { httpClient } from "@/shared/http/client";

import type { ResultStatus } from "@/domains/student/types";

// ─── Payload (what we send) ─────────────────────────────────────────────────

/** Payload for creating a submission with pre-evaluated results (Skulpt). */
export interface CreateSubmissionPayload {
  exercise_id: string;
  source_code: string;
  score_percentage: number;
  passed_tests_count: number;
  failed_tests_count: number;
  result_status: ResultStatus;
  feedback_message: string;
}

// ─── Response (what we get back) ────────────────────────────────────────────

/** Response after successfully persisting a submission. */
export interface SubmissionResponse {
  id: string;
  evaluation_status: string;
  score_percentage: string;
  submitted_at: string;
}

// ─── API Call ────────────────────────────────────────────────────────────────

/**
 * Submit an evaluated code result to the backend for persistence.
 *
 * POST /api/v1/student/submissions/
 *
 * @param payload - The submission data including source code and evaluation results.
 * @returns The persisted submission confirmation.
 */
export const createSubmissionApi = async (
  payload: CreateSubmissionPayload,
): Promise<SubmissionResponse> => {
  const { data } = await httpClient.post(
    "/api/v1/student/submissions/",
    payload,
  );
  return data;
};
