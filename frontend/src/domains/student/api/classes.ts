/**
 * Student Domain — My Classes API
 *
 * Endpoint para o aluno visualizar suas turmas.
 */
import { httpClient } from "@/shared/http/client";
import type { StudentMyClass } from "../types";

/**
 * Lista as turmas em que o aluno está matriculado.
 * GET /api/v1/student/my-classes/
 */
export const listStudentMyClassesApi = async (): Promise<StudentMyClass[]> => {
  const { data } = await httpClient.get("/api/v1/student/my-classes/");
  return data;
};
