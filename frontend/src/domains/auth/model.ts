/**
 * Auth Domain — Pure business logic (no side effects).
 */
import type { UserRole } from "./types";

/** Retorna o path de redirecionamento baseado no role do usuário. */
export const getRedirectPathByRole = (role: UserRole): string => {
    const routes: Record<UserRole, string> = {
        STUDENT: "/student",
        TEACHER: "/teacher",
        ADMIN: "/admin",
    };
    return routes[role] ?? "/";
};

/**
 * Extrai mensagem de erro legível de um erro axios/API.
 * Prioriza `error.response.data.detail`, com fallback genérico.
 */
export const extractApiError = (error: unknown): string => {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
    ) {
        const response = (error as { response?: { data?: { detail?: string } } }).response;
        if (response?.data?.detail) {
            return response.data.detail;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Ocorreu um erro inesperado. Tente novamente.";
};
