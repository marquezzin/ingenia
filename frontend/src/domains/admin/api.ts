/**
 * Admin Domain — API Contracts
 */
import { httpClient } from "@/shared/http/client";
import type { PaginatedResponse } from "@/shared/http/types";
import type {
  AdminDashboardStats,
  CreateExercisePayload,
  CreateLessonPayload,
  CreateModulePayload,
  CreateTestCasePayload,
  ExerciseDetail,
  ExerciseListItem,
  LessonDetail,
  LessonListItem,
  ListModulesParams,
  ModuleDetail,
  ModuleListItem,
  TestCaseDetail,
  TestCaseListItem,
  UpdateExercisePayload,
  UpdateLessonPayload,
  UpdateModulePayload,
  UpdateTestCasePayload,
} from "./types";

// ─── Dashboard ──────────────────────────────────────────────────────────────

export const getAdminDashboardStatsApi = async (): Promise<AdminDashboardStats> => {
  const { data } = await httpClient.get("/api/v1/admin/stats/");
  return data;
};

// ─── Module CRUD ────────────────────────────────────────────────────────────

export const listModulesApi = async (
  params?: ListModulesParams,
): Promise<PaginatedResponse<ModuleListItem>> => {
  const { data } = await httpClient.get("/api/v1/modules/", { params });
  return data;
};

export const getModuleApi = async (id: string): Promise<ModuleDetail> => {
  const { data } = await httpClient.get(`/api/v1/modules/${id}/`);
  return data;
};

export const createModuleApi = async (
  payload: CreateModulePayload,
): Promise<ModuleDetail> => {
  const { data } = await httpClient.post("/api/v1/modules/", payload);
  return data;
};

export const updateModuleApi = async (
  id: string,
  payload: UpdateModulePayload,
): Promise<ModuleDetail> => {
  const { data } = await httpClient.put(`/api/v1/modules/${id}/`, payload);
  return data;
};

export const deleteModuleApi = async (id: string): Promise<void> => {
  await httpClient.delete(`/api/v1/modules/${id}/`);
};

// ─── Lesson CRUD (nested under Module) ──────────────────────────────────────

export const listModuleLessonsApi = async (
  moduleId: string,
): Promise<PaginatedResponse<LessonListItem>> => {
  const { data } = await httpClient.get(`/api/v1/modules/${moduleId}/lessons/`);
  return data;
};

export const getLessonApi = async (
  moduleId: string,
  lessonId: string,
): Promise<LessonDetail> => {
  const { data } = await httpClient.get(
    `/api/v1/modules/${moduleId}/lessons/${lessonId}/`,
  );
  return data;
};

export const createLessonApi = async (
  moduleId: string,
  payload: CreateLessonPayload,
): Promise<LessonDetail> => {
  const { data } = await httpClient.post(
    `/api/v1/modules/${moduleId}/lessons/`,
    payload,
  );
  return data;
};

export const updateLessonApi = async (
  moduleId: string,
  lessonId: string,
  payload: UpdateLessonPayload,
): Promise<LessonDetail> => {
  const { data } = await httpClient.put(
    `/api/v1/modules/${moduleId}/lessons/${lessonId}/`,
    payload,
  );
  return data;
};

export const deleteLessonApi = async (
  moduleId: string,
  lessonId: string,
): Promise<void> => {
  await httpClient.delete(`/api/v1/modules/${moduleId}/lessons/${lessonId}/`);
};

// ─── Exercise CRUD (nested under Lesson) ────────────────────────────────────

const exerciseBasePath = (moduleId: string, lessonId: string) =>
  `/api/v1/modules/${moduleId}/lessons/${lessonId}/exercises`;

export const listExercisesApi = async (
  moduleId: string,
  lessonId: string,
): Promise<PaginatedResponse<ExerciseListItem>> => {
  const { data } = await httpClient.get(`${exerciseBasePath(moduleId, lessonId)}/`);
  return data;
};

export const getExerciseApi = async (
  moduleId: string,
  lessonId: string,
  exerciseId: string,
): Promise<ExerciseDetail> => {
  const { data } = await httpClient.get(
    `${exerciseBasePath(moduleId, lessonId)}/${exerciseId}/`,
  );
  return data;
};

export const createExerciseApi = async (
  moduleId: string,
  lessonId: string,
  payload: CreateExercisePayload,
): Promise<ExerciseDetail> => {
  const { data } = await httpClient.post(
    `${exerciseBasePath(moduleId, lessonId)}/`,
    payload,
  );
  return data;
};

export const updateExerciseApi = async (
  moduleId: string,
  lessonId: string,
  exerciseId: string,
  payload: UpdateExercisePayload,
): Promise<ExerciseDetail> => {
  const { data } = await httpClient.put(
    `${exerciseBasePath(moduleId, lessonId)}/${exerciseId}/`,
    payload,
  );
  return data;
};

export const deleteExerciseApi = async (
  moduleId: string,
  lessonId: string,
  exerciseId: string,
): Promise<void> => {
  await httpClient.delete(
    `${exerciseBasePath(moduleId, lessonId)}/${exerciseId}/`,
  );
};

// ─── Test Case CRUD (nested under Exercise) ─────────────────────────────────

const testCaseBasePath = (moduleId: string, lessonId: string, exerciseId: string) =>
  `${exerciseBasePath(moduleId, lessonId)}/${exerciseId}/test-cases`;

export const listTestCasesApi = async (
  moduleId: string,
  lessonId: string,
  exerciseId: string,
): Promise<PaginatedResponse<TestCaseListItem>> => {
  const { data } = await httpClient.get(
    `${testCaseBasePath(moduleId, lessonId, exerciseId)}/`,
  );
  return data;
};

export const getTestCaseApi = async (
  moduleId: string,
  lessonId: string,
  exerciseId: string,
  testCaseId: string,
): Promise<TestCaseDetail> => {
  const { data } = await httpClient.get(
    `${testCaseBasePath(moduleId, lessonId, exerciseId)}/${testCaseId}/`,
  );
  return data;
};

export const createTestCaseApi = async (
  moduleId: string,
  lessonId: string,
  exerciseId: string,
  payload: CreateTestCasePayload,
): Promise<TestCaseDetail> => {
  const { data } = await httpClient.post(
    `${testCaseBasePath(moduleId, lessonId, exerciseId)}/`,
    payload,
  );
  return data;
};

export const updateTestCaseApi = async (
  moduleId: string,
  lessonId: string,
  exerciseId: string,
  testCaseId: string,
  payload: UpdateTestCasePayload,
): Promise<TestCaseDetail> => {
  const { data } = await httpClient.put(
    `${testCaseBasePath(moduleId, lessonId, exerciseId)}/${testCaseId}/`,
    payload,
  );
  return data;
};

export const deleteTestCaseApi = async (
  moduleId: string,
  lessonId: string,
  exerciseId: string,
  testCaseId: string,
): Promise<void> => {
  await httpClient.delete(
    `${testCaseBasePath(moduleId, lessonId, exerciseId)}/${testCaseId}/`,
  );
};
