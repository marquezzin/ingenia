import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/shared/auth/storage";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Redireciona para /login se o usuário não estiver autenticado.
 * Salva a URL original no state para redirecionamento após o login.
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
