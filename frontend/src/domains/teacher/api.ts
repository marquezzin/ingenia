/**
 * Teacher Domain — API Contracts
 *
 * HTTP calls for teacher class management, enrollments, and progress endpoints.
 */
import { httpClient } from "@/shared/http/client";
import type { PaginatedResponse } from "@/shared/http/types";
import type {
  ClassProgress,
  CreateClassPayload,
  EnrolledStudent,
  EnrollStudentPayload,
  ListClassesParams,
  StudentDetailProgress,
  TeacherClassDetail,
  TeacherClassListItem,
  UpdateClassPayload,
} from "./types";

// ─── Class Group CRUD ───────────────────────────────────────────────────────

export const listTeacherClassesApi = async (
  params?: ListClassesParams,
): Promise<PaginatedResponse<TeacherClassListItem>> => {
  const { data } = await httpClient.get("/api/v1/teacher/classes/", { params });
  return data;
};

export const getTeacherClassApi = async (
  id: string,
): Promise<TeacherClassDetail> => {
  const { data } = await httpClient.get(`/api/v1/teacher/classes/${id}/`);
  return data;
};

export const createTeacherClassApi = async (
  payload: CreateClassPayload,
): Promise<TeacherClassDetail> => {
  const { data } = await httpClient.post("/api/v1/teacher/classes/", payload);
  return data;
};

export const updateTeacherClassApi = async (
  id: string,
  payload: UpdateClassPayload,
): Promise<TeacherClassDetail> => {
  const { data } = await httpClient.put(
    `/api/v1/teacher/classes/${id}/`,
    payload,
  );
  return data;
};

// ─── Enrollments ────────────────────────────────────────────────────────────

export const listEnrollmentsApi = async (
  classId: string,
): Promise<PaginatedResponse<EnrolledStudent>> => {
  const { data } = await httpClient.get(
    `/api/v1/teacher/classes/${classId}/enrollments/`,
  );
  return data;
};

export const enrollStudentApi = async (
  classId: string,
  payload: EnrollStudentPayload,
): Promise<EnrolledStudent> => {
  const { data } = await httpClient.post(
    `/api/v1/teacher/classes/${classId}/enrollments/`,
    payload,
  );
  return data;
};

export const removeStudentApi = async (
  classId: string,
  enrollmentId: string,
): Promise<void> => {
  await httpClient.delete(
    `/api/v1/teacher/classes/${classId}/enrollments/${enrollmentId}/`,
  );
};

// ─── Progress ───────────────────────────────────────────────────────────────

export const getClassProgressApi = async (
  classId: string,
): Promise<ClassProgress> => {
  const { data } = await httpClient.get(
    `/api/v1/teacher/classes/${classId}/progress/`,
  );
  return data;
};

export const getStudentProgressApi = async (
  classId: string,
  studentId: string,
): Promise<StudentDetailProgress> => {
  const { data } = await httpClient.get(
    `/api/v1/teacher/classes/${classId}/students/${studentId}/progress/`,
  );
  return data;
};
