/**
 * Auth Guards — Componentes para proteger rotas.
 */
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "./storage";

interface GuardProps {
    children: React.ReactNode;
}

/** Redireciona para /login se não autenticado. */
export const RequireAuth = ({ children }: GuardProps) => {
    const location = useLocation();
    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
};

/** Redireciona para / se já autenticado (para páginas de login/register). */
export const RequireGuest = ({ children }: GuardProps) => {
    if (isAuthenticated()) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};
