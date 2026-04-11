/**
 * Student Domain — Curriculum API Contract.
 *
 * HTTP calls for reading published modules and lessons.
 */

import { httpClient } from "@/shared/http/client";
import type { PaginatedResponse } from "@/shared/http/types";
import type { StudentModule, StudentModuleDetail, StudentLessonDetail, StudentExerciseDetail } from "../types";

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
): Promise<StudentModuleDetail> => {
  const { data } = await httpClient.get(
    `/api/v1/student/modules/${moduleId}/`,
  );
  return data;
};

// ─── Lessons ────────────────────────────────────────────────────────────────

/**
 * Get detail of a single published lesson (with video, exercises, and progress).
 *
 * GET /api/v1/student/modules/:moduleId/lessons/:lessonId/
 */
export const getStudentLessonApi = async (
  moduleId: string,
  lessonId: string,
): Promise<StudentLessonDetail> => {
  const { data } = await httpClient.get(
    `/api/v1/student/modules/${moduleId}/lessons/${lessonId}/`,
  );
  return data;
};

/**
 * Mark a lesson as started (IN_PROGRESS) — triggers on page access.
 *
 * POST /api/v1/student/lessons/:lessonId/mark-started/
 */
export const markLessonStartedApi = async (
  lessonId: string,
): Promise<void> => {
  await httpClient.post(`/api/v1/student/lessons/${lessonId}/mark-started/`);
};

/**
 * Mark a lesson as completed — only for lessons without exercises.
 *
 * POST /api/v1/student/lessons/:lessonId/mark-completed/
 */
export const markLessonCompletedApi = async (
  lessonId: string,
): Promise<void> => {
  await httpClient.post(`/api/v1/student/lessons/${lessonId}/mark-completed/`);
};

// ─── Exercises ──────────────────────────────────────────────────────────────

/**
 * Get detail of a single published exercise (with test cases and progress).
 *
 * GET /api/v1/student/modules/:moduleId/lessons/:lessonId/exercises/:exerciseId/
 */
export const getStudentExerciseApi = async (
  moduleId: string,
  lessonId: string,
  exerciseId: string,
): Promise<StudentExerciseDetail> => {
  const { data } = await httpClient.get(
    `/api/v1/student/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}/`,
  );
  return data;
};

