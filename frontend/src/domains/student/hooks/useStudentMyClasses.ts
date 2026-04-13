/**
 * Student Domain — useStudentMyClasses hook.
 *
 * React Query hook for reading the student's class enrollments.
 */

import { useQuery } from "@tanstack/react-query";
import { listStudentMyClassesApi } from "../api/classes";

export const STUDENT_CLASSES_KEYS = {
  all: ["student", "my-classes"] as const,
  list: () => [...STUDENT_CLASSES_KEYS.all, "list"] as const,
};

/** Fetch the classes the student is enrolled in. */
export const useStudentMyClasses = () =>
  useQuery({
    queryKey: STUDENT_CLASSES_KEYS.list(),
    queryFn: listStudentMyClassesApi,
  });
