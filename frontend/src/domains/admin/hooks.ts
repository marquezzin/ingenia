/**
 * Admin Domain — React Query Hooks
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createModuleApi,
  deleteModuleApi,
  getAdminDashboardStatsApi,
  getModuleApi,
  listModuleLessonsApi,
  listModulesApi,
  updateModuleApi,
} from "./api";
import type {
  CreateModulePayload,
  ListModulesParams,
  UpdateModulePayload,
} from "./types";

// ─── Query Keys ─────────────────────────────────────────────────────────────

const ADMIN_KEYS = {
  all: ["admin"] as const,
  stats: () => [...ADMIN_KEYS.all, "stats"] as const,
  modules: () => [...ADMIN_KEYS.all, "modules"] as const,
  moduleList: (params?: ListModulesParams) =>
    [...ADMIN_KEYS.modules(), "list", params] as const,
  moduleDetail: (id: string) =>
    [...ADMIN_KEYS.modules(), "detail", id] as const,
  moduleLessons: (moduleId: string) =>
    [...ADMIN_KEYS.modules(), moduleId, "lessons"] as const,
};

// ─── Dashboard ──────────────────────────────────────────────────────────────

export const useAdminDashboardStats = () =>
  useQuery({
    queryKey: ADMIN_KEYS.stats(),
    queryFn: getAdminDashboardStatsApi,
  });

// ─── Module Queries ─────────────────────────────────────────────────────────

export const useModules = (params?: ListModulesParams) =>
  useQuery({
    queryKey: ADMIN_KEYS.moduleList(params),
    queryFn: () => listModulesApi(params),
  });

export const useModule = (id: string) =>
  useQuery({
    queryKey: ADMIN_KEYS.moduleDetail(id),
    queryFn: () => getModuleApi(id),
    enabled: !!id,
  });

export const useModuleLessons = (moduleId: string) =>
  useQuery({
    queryKey: ADMIN_KEYS.moduleLessons(moduleId),
    queryFn: () => listModuleLessonsApi(moduleId),
    enabled: !!moduleId,
  });

// ─── Module Mutations ───────────────────────────────────────────────────────

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateModulePayload) => createModuleApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.modules() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateModulePayload }) =>
      updateModuleApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.modules() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteModuleApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.modules() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
    },
  });
};
