/**
 * Student Domain — Progress API Contract.
 *
 * HTTP calls for reading the student's progress data.
 */

import { httpClient } from "@/shared/http/client";
import type { PaginatedResponse } from "@/shared/http/types";
import type { ModuleProgressSummary } from "../types";

// ─── Progress ───────────────────────────────────────────────────────────────

/**
 * List progress summaries for all modules the student has started.
 *
 * GET /api/v1/student/progress/
 */
export const listStudentProgressApi = async (): Promise<
  PaginatedResponse<ModuleProgressSummary>
> => {
  const { data } = await httpClient.get("/api/v1/student/progress/");
  return data;
};

/**
 * Get detailed progress for a specific module (with nested lesson/exercise progress).
 *
 * GET /api/v1/student/progress/modules/:id/
 */
export const getStudentModuleProgressApi = async (
  moduleId: string,
): Promise<ModuleProgressSummary> => {
  const { data } = await httpClient.get(
    `/api/v1/student/progress/modules/${moduleId}/`,
  );
  return data;
};
