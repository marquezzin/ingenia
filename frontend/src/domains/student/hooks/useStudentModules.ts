/**
 * Student Domain — useStudentModules hook.
 *
 * React Query hook for listing published modules with progress.
 */

import { useQuery } from "@tanstack/react-query";
import { listStudentModulesApi } from "../api/curriculum";

export const STUDENT_MODULE_KEYS = {
  all: ["student", "modules"] as const,
  list: () => [...STUDENT_MODULE_KEYS.all, "list"] as const,
  detail: (id: string) => [...STUDENT_MODULE_KEYS.all, "detail", id] as const,
};

/** Fetch all published modules for the current student. */
export const useStudentModules = () =>
  useQuery({
    queryKey: STUDENT_MODULE_KEYS.list(),
    queryFn: listStudentModulesApi,
  });
