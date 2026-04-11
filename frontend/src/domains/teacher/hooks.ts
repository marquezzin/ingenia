/**
 * Teacher Domain — React Query Hooks
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTeacherClassApi,
  enrollStudentApi,
  getClassProgressApi,
  getStudentProgressApi,
  getTeacherClassApi,
  listEnrollmentsApi,
  listTeacherClassesApi,
  removeStudentApi,
  updateTeacherClassApi,
} from "./api";
import type {
  CreateClassPayload,
  EnrollStudentPayload,
  ListClassesParams,
  UpdateClassPayload,
} from "./types";

// ─── Query Keys ─────────────────────────────────────────────────────────────

const TEACHER_KEYS = {
  all: ["teacher"] as const,

  // Classes
  classes: () => [...TEACHER_KEYS.all, "classes"] as const,
  classList: (params?: ListClassesParams) =>
    [...TEACHER_KEYS.classes(), "list", params] as const,
  classDetail: (id: string) =>
    [...TEACHER_KEYS.classes(), "detail", id] as const,

  // Enrollments
  enrollments: (classId: string) =>
    [...TEACHER_KEYS.classes(), classId, "enrollments"] as const,

  // Progress
  classProgress: (classId: string) =>
    [...TEACHER_KEYS.classes(), classId, "progress"] as const,
  studentProgress: (classId: string, studentId: string) =>
    [...TEACHER_KEYS.classes(), classId, "students", studentId, "progress"] as const,
};

// ─── Class Queries ──────────────────────────────────────────────────────────

export const useTeacherClasses = (params?: ListClassesParams) =>
  useQuery({
    queryKey: TEACHER_KEYS.classList(params),
    queryFn: () => listTeacherClassesApi(params),
  });

export const useTeacherClass = (id: string) =>
  useQuery({
    queryKey: TEACHER_KEYS.classDetail(id),
    queryFn: () => getTeacherClassApi(id),
    enabled: !!id,
  });

// ─── Class Mutations ────────────────────────────────────────────────────────

export const useCreateTeacherClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClassPayload) =>
      createTeacherClassApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.classes() });
    },
  });
};

export const useUpdateTeacherClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateClassPayload }) =>
      updateTeacherClassApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.classes() });
    },
  });
};

// ─── Enrollment Queries ─────────────────────────────────────────────────────

export const useEnrollments = (classId: string) =>
  useQuery({
    queryKey: TEACHER_KEYS.enrollments(classId),
    queryFn: () => listEnrollmentsApi(classId),
    enabled: !!classId,
  });

// ─── Enrollment Mutations ───────────────────────────────────────────────────

export const useEnrollStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      classId,
      payload,
    }: {
      classId: string;
      payload: EnrollStudentPayload;
    }) => enrollStudentApi(classId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: TEACHER_KEYS.enrollments(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: TEACHER_KEYS.classDetail(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: TEACHER_KEYS.classes(),
      });
    },
  });
};

export const useRemoveStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      classId,
      enrollmentId,
    }: {
      classId: string;
      enrollmentId: string;
    }) => removeStudentApi(classId, enrollmentId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: TEACHER_KEYS.enrollments(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: TEACHER_KEYS.classDetail(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: TEACHER_KEYS.classes(),
      });
    },
  });
};

// ─── Progress Queries ───────────────────────────────────────────────────────

export const useClassProgress = (classId: string) =>
  useQuery({
    queryKey: TEACHER_KEYS.classProgress(classId),
    queryFn: () => getClassProgressApi(classId),
    enabled: !!classId,
  });

export const useStudentProgress = (classId: string, studentId: string) =>
  useQuery({
    queryKey: TEACHER_KEYS.studentProgress(classId, studentId),
    queryFn: () => getStudentProgressApi(classId, studentId),
    enabled: !!classId && !!studentId,
  });
