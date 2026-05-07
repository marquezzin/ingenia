import { httpClient } from "@/shared/http/client";
import type { PaginatedResponse } from "@/shared/http/types";

import type { ResultStatus, SubmissionHistoryItem } from "@/domains/student/types";

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

// ─── API Calls ───────────────────────────────────────────────────────────────

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

/**
 * List submission history for a specific exercise.
 *
 * GET /api/v1/student/submissions/?exercise_id=X
 *
 * @param exerciseId - The exercise to fetch submissions for.
 * @returns Paginated list of submissions with results.
 */
export const listExerciseSubmissionsApi = async (
  exerciseId: string,
): Promise<PaginatedResponse<SubmissionHistoryItem>> => {
  const { data } = await httpClient.get("/api/v1/student/submissions/", {
    params: { exercise_id: exerciseId },
  });
  return data;
};

// ─── Global Submissions Listing ─────────────────────────────────────────────

/** Filters for listing all submissions. */
export interface SubmissionListFilters {
  result_status?: string;
  module_id?: string;
  page?: number;
}

/**
 * List all submissions for the current student (global history).
 *
 * GET /api/v1/student/submissions/
 *
 * @param filters - Optional filters (evaluation_status, page).
 * @returns Paginated list of all submissions with results.
 */
export const listAllSubmissionsApi = async (
  filters?: SubmissionListFilters,
): Promise<PaginatedResponse<SubmissionHistoryItem>> => {
  const { data } = await httpClient.get("/api/v1/student/submissions/", {
    params: filters,
  });
  return data;
};

