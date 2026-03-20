/**
 * Admin Domain — Pure Business Logic
 *
 * Funções puras sem side effects.
 */
import type { AxiosError } from "axios";
import type { StatusMap } from "@/shared/ui/components/StatusBadge";
import type { ApiError } from "@/shared/http/types";

/** Mapa de status de publicação para o StatusBadge */
export const PUBLICATION_STATUS_MAP: StatusMap = {
  DRAFT: { label: "Rascunho", color: "gray" },
  PUBLISHED: { label: "Publicado", color: "green" },
  ARCHIVED: { label: "Arquivado", color: "orange" },
};

/** Formata ISO date para exibição pt-BR */
export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/** Extrai mensagem de erro legível de um erro da API (axios) */
export const getApiErrorMessage = (
  error: unknown,
  fallback = "Ocorreu um erro inesperado.",
): string => {
  const axiosError = error as AxiosError<ApiError>;
  return axiosError?.response?.data?.detail ?? fallback;
};

/** Mapa de roles para exibição */
export const ROLE_MAP: StatusMap = {
  STUDENT: { label: "Aluno", color: "blue" },
  TEACHER: { label: "Professor", color: "grape" },
  ADMIN: { label: "Administrador", color: "orange" },
};

/** Mapa de status de conta para exibição */
export const ACCOUNT_STATUS_MAP: StatusMap = {
  ACTIVE: { label: "Ativo", color: "green" },
  INACTIVE: { label: "Inativo", color: "gray" },
  SUSPENDED: { label: "Suspenso", color: "red" },
};

/** Mapa de status de turma para exibição */
export const CLASS_STATUS_MAP: StatusMap = {
  ACTIVE: { label: "Ativa", color: "green" },
  ARCHIVED: { label: "Arquivada", color: "orange" },
};


