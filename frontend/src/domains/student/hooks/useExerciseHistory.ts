/**
 * useExerciseHistory — React Query hook for fetching submission history.
 *
 * Fetches the list of past submissions for a specific exercise,
 * allowing the student to review previous attempts with scores and code.
 */

import { useQuery } from "@tanstack/react-query";

import { listExerciseSubmissionsApi } from "@/domains/student/api/submissions";

const EXERCISE_HISTORY_KEYS = {
  all: ["exercise-history"] as const,
  list: (exerciseId: string) =>
    [...EXERCISE_HISTORY_KEYS.all, exerciseId] as const,
};

/**
 * Fetch submission history for a specific exercise.
 *
 * Returns paginated list of past submissions with scores and results.
 */
export const useExerciseHistory = (exerciseId: string) =>
  useQuery({
    queryKey: EXERCISE_HISTORY_KEYS.list(exerciseId),
    queryFn: () => listExerciseSubmissionsApi(exerciseId),
    enabled: !!exerciseId,
  });
