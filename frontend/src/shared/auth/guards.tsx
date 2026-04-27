/**
 * Auth Guards — Componentes para proteger rotas.
 */
import { Navigate, useLocation } from "react-router-dom";
import { Center, Loader } from "@mantine/core";
import { useMe } from "@/domains/auth/hooks";
import type { UserRole } from "@/domains/auth/types";
import { isAuthenticated } from "./storage";

interface GuardProps {
    children: React.ReactNode;
}

export const homePathForRole = (role: UserRole): string => {
    switch (role) {
        case "STUDENT":
            return "/student";
        case "TEACHER":
            return "/teacher";
        case "ADMIN":
            return "/admin";
    }
};

/** Redireciona para /login se não autenticado. */
export const RequireAuth = ({ children }: GuardProps) => {
    const location = useLocation();
    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
};

/**
 * Redireciona usuários autenticados para a home de seu perfil.
 * Usado em rotas públicas (landing, login, register) para evitar
 * que um usuário já logado fique preso na landing/login.
 */
export const RedirectIfAuthenticated = ({ children }: GuardProps) => {
    const authed = isAuthenticated();
    const { data: user, isLoading } = useMe();

    if (!authed) {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <Center h="100vh">
                <Loader />
            </Center>
        );
    }

    if (user) {
        return <Navigate to={homePathForRole(user.role)} replace />;
    }

    return <>{children}</>;
};

/** Alias semântico para páginas de login/register. */
export const RequireGuest = RedirectIfAuthenticated;
