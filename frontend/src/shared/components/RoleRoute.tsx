import { Navigate } from "react-router-dom";
import { useMe } from "@/domains/auth/hooks";
import type { UserRole } from "@/domains/auth/types";
import { Loader, Center } from "@mantine/core";

interface RoleRouteProps {
    allowedRoles: UserRole[];
    children: React.ReactNode;
}

/**
 * Garante que o usuário tem uma das roles permitidas.
 * Se as roles não coincidirem, redireciona para /unauthorized.
 * Como ele usa `useMe`, isso irá engatilhar a busca dos dados do usuário.
 */
export const RoleRoute = ({ allowedRoles, children }: RoleRouteProps) => {
    const { data: user, isLoading } = useMe();

    if (isLoading) {
        return (
            <Center h="100vh">
                <Loader />
            </Center>
        );
    }

    // Se o usuário não existir (embora já devesse ter os tokens via ProtectedRoute)
    // ou se a role dele não estiver na lista permitida, recusa o acesso.
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export const StudentRoute = ({ children }: { children: React.ReactNode }) => (
    <RoleRoute allowedRoles={["STUDENT"]}>{children}</RoleRoute>
);

export const TeacherRoute = ({ children }: { children: React.ReactNode }) => (
    <RoleRoute allowedRoles={["TEACHER"]}>{children}</RoleRoute>
);

export const AdminRoute = ({ children }: { children: React.ReactNode }) => (
    <RoleRoute allowedRoles={["ADMIN"]}>{children}</RoleRoute>
);
