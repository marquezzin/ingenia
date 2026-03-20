/**
 * Admin Domain — API Contracts
 */
import { httpClient } from "@/shared/http/client";
import type { PaginatedResponse } from "@/shared/http/types";
import type {
  AdminDashboardStats,
  CreateModulePayload,
  LessonListItem,
  ListModulesParams,
  ModuleDetail,
  ModuleListItem,
  UpdateModulePayload,
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

// ─── Lessons for Module ─────────────────────────────────────────────────────

export const listModuleLessonsApi = async (
  moduleId: string,
): Promise<PaginatedResponse<LessonListItem>> => {
  const { data } = await httpClient.get(`/api/v1/modules/${moduleId}/lessons/`);
  return data;
};
