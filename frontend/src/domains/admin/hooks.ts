/**
 * Admin Domain — React Query Hooks
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExerciseApi,
  createLessonApi,
  createModuleApi,
  createTestCaseApi,
  createUserApi,
  deleteExerciseApi,
  deleteLessonApi,
  deleteModuleApi,
  deleteTestCaseApi,
  getAdminDashboardStatsApi,
  getExerciseApi,
  getLessonApi,
  getModuleApi,
  getUserApi,
  listExercisesApi,
  listModuleLessonsApi,
  listModulesApi,
  listTestCasesApi,
  listUsersApi,
  updateExerciseApi,
  updateLessonApi,
  updateModuleApi,
  updateTestCaseApi,
  updateUserApi,
} from "./api";
import type {
  CreateExercisePayload,
  CreateLessonPayload,
  CreateModulePayload,
  CreateTestCasePayload,
  CreateUserPayload,
  ListModulesParams,
  ListUsersParams,
  UpdateExercisePayload,
  UpdateLessonPayload,
  UpdateModulePayload,
  UpdateTestCasePayload,
  UpdateUserPayload,
} from "./types";

// ─── Query Keys ─────────────────────────────────────────────────────────────

const ADMIN_KEYS = {
  all: ["admin"] as const,
  stats: () => [...ADMIN_KEYS.all, "stats"] as const,

  // Module
  modules: () => [...ADMIN_KEYS.all, "modules"] as const,
  moduleList: (params?: ListModulesParams) =>
    [...ADMIN_KEYS.modules(), "list", params] as const,
  moduleDetail: (id: string) =>
    [...ADMIN_KEYS.modules(), "detail", id] as const,

  // Lesson
  lessons: (moduleId: string) =>
    [...ADMIN_KEYS.modules(), moduleId, "lessons"] as const,
  lessonList: (moduleId: string) =>
    [...ADMIN_KEYS.lessons(moduleId), "list"] as const,
  lessonDetail: (moduleId: string, lessonId: string) =>
    [...ADMIN_KEYS.lessons(moduleId), "detail", lessonId] as const,

  // Exercise
  exercises: (moduleId: string, lessonId: string) =>
    [...ADMIN_KEYS.lessons(moduleId), lessonId, "exercises"] as const,
  exerciseList: (moduleId: string, lessonId: string) =>
    [...ADMIN_KEYS.exercises(moduleId, lessonId), "list"] as const,
  exerciseDetail: (moduleId: string, lessonId: string, exerciseId: string) =>
    [...ADMIN_KEYS.exercises(moduleId, lessonId), "detail", exerciseId] as const,

  // Test Case
  testCases: (moduleId: string, lessonId: string, exerciseId: string) =>
    [...ADMIN_KEYS.exercises(moduleId, lessonId), exerciseId, "testCases"] as const,
  testCaseList: (moduleId: string, lessonId: string, exerciseId: string) =>
    [...ADMIN_KEYS.testCases(moduleId, lessonId, exerciseId), "list"] as const,

  // User
  users: () => [...ADMIN_KEYS.all, "users"] as const,
  userList: (params?: ListUsersParams) =>
    [...ADMIN_KEYS.users(), "list", params] as const,
  userDetail: (id: string) =>
    [...ADMIN_KEYS.users(), "detail", id] as const,
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
    queryKey: ADMIN_KEYS.lessonList(moduleId),
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

// ─── Lesson Queries ─────────────────────────────────────────────────────────

export const useLesson = (moduleId: string, lessonId: string) =>
  useQuery({
    queryKey: ADMIN_KEYS.lessonDetail(moduleId, lessonId),
    queryFn: () => getLessonApi(moduleId, lessonId),
    enabled: !!moduleId && !!lessonId,
  });

// ─── Lesson Mutations ───────────────────────────────────────────────────────

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moduleId,
      payload,
    }: {
      moduleId: string;
      payload: CreateLessonPayload;
    }) => createLessonApi(moduleId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.lessons(variables.moduleId),
      });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
      // Also refresh module detail (lesson_count)
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.moduleDetail(variables.moduleId),
      });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moduleId,
      lessonId,
      payload,
    }: {
      moduleId: string;
      lessonId: string;
      payload: UpdateLessonPayload;
    }) => updateLessonApi(moduleId, lessonId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.lessons(variables.moduleId),
      });
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.lessonDetail(variables.moduleId, variables.lessonId),
      });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moduleId,
      lessonId,
    }: {
      moduleId: string;
      lessonId: string;
    }) => deleteLessonApi(moduleId, lessonId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.lessons(variables.moduleId),
      });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.moduleDetail(variables.moduleId),
      });
    },
  });
};

// ─── Exercise Queries ───────────────────────────────────────────────────────

export const useLessonExercises = (moduleId: string, lessonId: string) =>
  useQuery({
    queryKey: ADMIN_KEYS.exerciseList(moduleId, lessonId),
    queryFn: () => listExercisesApi(moduleId, lessonId),
    enabled: !!moduleId && !!lessonId,
  });

export const useExercise = (
  moduleId: string,
  lessonId: string,
  exerciseId: string,
) =>
  useQuery({
    queryKey: ADMIN_KEYS.exerciseDetail(moduleId, lessonId, exerciseId),
    queryFn: () => getExerciseApi(moduleId, lessonId, exerciseId),
    enabled: !!moduleId && !!lessonId && !!exerciseId,
  });

// ─── Exercise Mutations ─────────────────────────────────────────────────────

export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moduleId,
      lessonId,
      payload,
    }: {
      moduleId: string;
      lessonId: string;
      payload: CreateExercisePayload;
    }) => createExerciseApi(moduleId, lessonId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.exercises(variables.moduleId, variables.lessonId),
      });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
      // Refresh lesson detail (exercise_count)
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.lessonDetail(variables.moduleId, variables.lessonId),
      });
    },
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moduleId,
      lessonId,
      exerciseId,
      payload,
    }: {
      moduleId: string;
      lessonId: string;
      exerciseId: string;
      payload: UpdateExercisePayload;
    }) => updateExerciseApi(moduleId, lessonId, exerciseId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.exercises(variables.moduleId, variables.lessonId),
      });
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.exerciseDetail(
          variables.moduleId,
          variables.lessonId,
          variables.exerciseId,
        ),
      });
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moduleId,
      lessonId,
      exerciseId,
    }: {
      moduleId: string;
      lessonId: string;
      exerciseId: string;
    }) => deleteExerciseApi(moduleId, lessonId, exerciseId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.exercises(variables.moduleId, variables.lessonId),
      });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.lessonDetail(variables.moduleId, variables.lessonId),
      });
    },
  });
};

// ─── Test Case Queries ──────────────────────────────────────────────────────

export const useExerciseTestCases = (
  moduleId: string,
  lessonId: string,
  exerciseId: string,
) =>
  useQuery({
    queryKey: ADMIN_KEYS.testCaseList(moduleId, lessonId, exerciseId),
    queryFn: () => listTestCasesApi(moduleId, lessonId, exerciseId),
    enabled: !!moduleId && !!lessonId && !!exerciseId,
  });

// ─── Test Case Mutations ────────────────────────────────────────────────────

export const useCreateTestCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moduleId,
      lessonId,
      exerciseId,
      payload,
    }: {
      moduleId: string;
      lessonId: string;
      exerciseId: string;
      payload: CreateTestCasePayload;
    }) => createTestCaseApi(moduleId, lessonId, exerciseId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.testCases(
          variables.moduleId,
          variables.lessonId,
          variables.exerciseId,
        ),
      });
      // Refresh exercise detail (test_cases_count)
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.exerciseDetail(
          variables.moduleId,
          variables.lessonId,
          variables.exerciseId,
        ),
      });
    },
  });
};

export const useUpdateTestCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moduleId,
      lessonId,
      exerciseId,
      testCaseId,
      payload,
    }: {
      moduleId: string;
      lessonId: string;
      exerciseId: string;
      testCaseId: string;
      payload: UpdateTestCasePayload;
    }) => updateTestCaseApi(moduleId, lessonId, exerciseId, testCaseId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.testCases(
          variables.moduleId,
          variables.lessonId,
          variables.exerciseId,
        ),
      });
    },
  });
};

export const useDeleteTestCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moduleId,
      lessonId,
      exerciseId,
      testCaseId,
    }: {
      moduleId: string;
      lessonId: string;
      exerciseId: string;
      testCaseId: string;
    }) => deleteTestCaseApi(moduleId, lessonId, exerciseId, testCaseId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.testCases(
          variables.moduleId,
          variables.lessonId,
          variables.exerciseId,
        ),
      });
      // Refresh exercise detail (test_cases_count)
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.exerciseDetail(
          variables.moduleId,
          variables.lessonId,
          variables.exerciseId,
        ),
      });
    },
  });
};

// ─── User Queries ───────────────────────────────────────────────────────────

export const useUsers = (params?: ListUsersParams) =>
  useQuery({
    queryKey: ADMIN_KEYS.userList(params),
    queryFn: () => listUsersApi(params),
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: ADMIN_KEYS.userDetail(id),
    queryFn: () => getUserApi(id),
    enabled: !!id,
  });

// ─── User Mutations ─────────────────────────────────────────────────────────

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUserApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.users() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.stats() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUserApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.users() });
    },
  });
};
