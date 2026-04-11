/**
 * useStudentExercise — React Query hook for fetching exercise detail.
 *
 * Provides the exercise data (statement, test cases, progress) needed
 * for the exercise page with Skulpt evaluation.
 */

import { useQuery } from "@tanstack/react-query";

import { getStudentExerciseApi } from "@/domains/student/api/curriculum";

const EXERCISE_KEYS = {
  all: ["student-exercises"] as const,
  detail: (moduleId: string, lessonId: string, exerciseId: string) =>
    [...EXERCISE_KEYS.all, "detail", moduleId, lessonId, exerciseId] as const,
};

/**
 * Fetch exercise detail with test cases and progress.
 */
export const useStudentExerciseDetail = (
  moduleId: string,
  lessonId: string,
  exerciseId: string,
) =>
  useQuery({
    queryKey: EXERCISE_KEYS.detail(moduleId, lessonId, exerciseId),
    queryFn: () => getStudentExerciseApi(moduleId, lessonId, exerciseId),
    enabled: !!moduleId && !!lessonId && !!exerciseId,
  });
