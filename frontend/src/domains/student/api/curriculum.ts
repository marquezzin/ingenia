/**
 * Student Domain — Curriculum API Contract.
 *
 * HTTP calls for reading published modules and lessons.
 */

import { httpClient } from "@/shared/http/client";
import type { PaginatedResponse } from "@/shared/http/types";
import type { StudentModule } from "../types";

// ─── Modules ────────────────────────────────────────────────────────────────

/**
 * List all published modules with student progress.
 *
 * GET /api/v1/student/modules/
 */
export const listStudentModulesApi = async (): Promise<
  PaginatedResponse<StudentModule>
> => {
  const { data } = await httpClient.get("/api/v1/student/modules/");
  return data;
};

/**
 * Get detail of a single published module (with lessons and progress).
 *
 * GET /api/v1/student/modules/:id/
 */
export const getStudentModuleApi = async (
  moduleId: string,
): Promise<StudentModule> => {
  const { data } = await httpClient.get(
    `/api/v1/student/modules/${moduleId}/`,
  );
  return data;
};
