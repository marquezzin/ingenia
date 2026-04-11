/**
 * useSubmissionHistory — React Query hook for global submissions listing.
 *
 * Fetches all submissions for the current student,
 * with optional filtering by evaluation_status.
 * Used by the SubmissionsPage (/student/submissions).
 */

import { useQuery } from "@tanstack/react-query";

import {
  listAllSubmissionsApi,
  type SubmissionListFilters,
} from "@/domains/student/api/submissions";

const SUBMISSION_HISTORY_KEYS = {
  all: ["submission-history"] as const,
  list: (filters?: SubmissionListFilters) =>
    [...SUBMISSION_HISTORY_KEYS.all, filters ?? {}] as const,
};

/**
 * Fetch all submissions for the current student.
 *
 * Returns paginated list of submissions with optional filters.
 */
export const useSubmissionHistory = (filters?: SubmissionListFilters) =>
  useQuery({
    queryKey: SUBMISSION_HISTORY_KEYS.list(filters),
    queryFn: () => listAllSubmissionsApi(filters),
  });
