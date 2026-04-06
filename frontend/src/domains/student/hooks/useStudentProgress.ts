/**
 * Student Domain — useStudentProgress hook.
 *
 * React Query hook for reading the student's consolidated progress.
 */

import { useQuery } from "@tanstack/react-query";
import { listStudentProgressApi } from "../api/progress";

export const STUDENT_PROGRESS_KEYS = {
  all: ["student", "progress"] as const,
  list: () => [...STUDENT_PROGRESS_KEYS.all, "list"] as const,
  moduleDetail: (id: string) =>
    [...STUDENT_PROGRESS_KEYS.all, "module", id] as const,
};

/** Fetch consolidated progress for all modules the student has started. */
export const useStudentProgress = () =>
  useQuery({
    queryKey: STUDENT_PROGRESS_KEYS.list(),
    queryFn: listStudentProgressApi,
  });
