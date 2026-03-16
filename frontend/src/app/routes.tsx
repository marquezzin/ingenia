/**
 * App Routes — Definição centralizada de todas as rotas.
 * Use lazy loading para cada domínio.
 */
/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RequireGuest } from "@/shared/auth/guards";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { StudentRoute, TeacherRoute, AdminRoute } from "@/shared/components/RoleRoute";

// Lazy imports por domínio
const LandingPage = lazy(() => import("@/domains/landing/pages/LandingPage"));
const LoginPage = lazy(() => import("@/domains/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/domains/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/domains/auth/pages/ForgotPasswordPage"));
const UnauthorizedPage = lazy(() => import("@/domains/auth/pages/UnauthorizedPage"));
const NotFoundPage = lazy(() => import("@/domains/auth/pages/NotFoundPage"));

// Dev tools (removível em produção)
const ComponentCatalogPage = lazy(() => import("@/shared/ui/components/ComponentCatalogPage"));

// Adicione novos domínios aqui:
// const MyEntityListPage = lazy(() => import("@/domains/my-domain/pages/MyEntityListPage"));

const Spinner = () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
        Carregando...
    </div>
);

export const router = createBrowserRouter([
    // ─── Landing page (pública) ─────────────────────────────────────────────
    {
        path: "/",
        element: (
            <Suspense fallback={<Spinner />}>
                <LandingPage />
            </Suspense>
        ),
    },

    // ─── Rotas públicas ─────────────────────────────────────────────────────
    {
        path: "/login",
        element: (
            <RequireGuest>
                <Suspense fallback={<Spinner />}>
                    <LoginPage />
                </Suspense>
            </RequireGuest>
        ),
    },

    {
        path: "/register",
        element: (
            <RequireGuest>
                <Suspense fallback={<Spinner />}>
                    {/* ISSUE-008-B — Tela de Registro */}
                    <RegisterPage />
                </Suspense>
            </RequireGuest>
        ),
    },
    {
        path: "/forgot-password",
        element: (
            <RequireGuest>
                <Suspense fallback={<Spinner />}>
                    {/* ISSUE-008-B — Tela de Forgot Password */}
                    <ForgotPasswordPage />
                </Suspense>
            </RequireGuest>
        ),
    },

    // ─── Telas de erro ──────────────────────────────────────────────────────
    {
        path: "/unauthorized",
        element: (
            <Suspense fallback={<Spinner />}>
                <UnauthorizedPage />
            </Suspense>
        ),
    },

    // ─── Rotas protegidas ───────────────────────────────────────────────────
    {
        path: "/student",
        element: (
            <ProtectedRoute>
                <StudentRoute>
                    <Suspense fallback={<Spinner />}>
                        {/* Layout do Aluno aqui */}
                        <div>Área do Aluno — Layout em construção</div>
                    </Suspense>
                </StudentRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/teacher",
        element: (
            <ProtectedRoute>
                <TeacherRoute>
                    <Suspense fallback={<Spinner />}>
                        {/* Layout do Professor aqui */}
                        <div>Área do Professor — Layout em construção</div>
                    </Suspense>
                </TeacherRoute>
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <AdminRoute>
                    <Suspense fallback={<Spinner />}>
                        {/* Layout de Admin aqui */}
                        <div>Área de Admin — Layout em construção</div>
                    </Suspense>
                </AdminRoute>
            </ProtectedRoute>
        ),
    },

    // ─── Dev tools (remova em produção se necessário) ────────────────────────
    {
        path: "/dev/components",
        element: (
            <Suspense fallback={<Spinner />}>
                <ComponentCatalogPage />
            </Suspense>
        ),
    },

    // Adicione novos domínios aqui:
    // {
    //   path: "/my-domain",
    //   element: (
    //     <ProtectedRoute>
    //       <Suspense fallback={<Spinner />}>
    //         <MyEntityListPage />
    //       </Suspense>
    //     </ProtectedRoute>
    //   ),
    // },

    // ─── Fallback (404) ─────────────────────────────────────────────────────
    {
        path: "*",
        element: (
            <Suspense fallback={<Spinner />}>
                <NotFoundPage />
            </Suspense>
        ),
    },
]);
