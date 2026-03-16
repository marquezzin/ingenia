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
import { AppLayout } from "@/shared/components/Layout";

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

    // ─── Rotas protegidas (Aluno) ───────────────────────────────────────────
    {
        path: "/student",
        element: (
            <ProtectedRoute>
                <StudentRoute>
                    <AppLayout />
                </StudentRoute>
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Spinner />}>
                        <div>Dashboard do Aluno — Em construção</div>
                    </Suspense>
                ),
            },
        ],
    },

    // ─── Rotas protegidas (Professor) ───────────────────────────────────────
    {
        path: "/teacher",
        element: (
            <ProtectedRoute>
                <TeacherRoute>
                    <AppLayout />
                </TeacherRoute>
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Spinner />}>
                        <div>Dashboard do Professor — Em construção</div>
                    </Suspense>
                ),
            },
        ],
    },

    // ─── Rotas protegidas (Admin) ───────────────────────────────────────────
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <AdminRoute>
                    <AppLayout />
                </AdminRoute>
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Spinner />}>
                        <div>Dashboard Admin — Em construção</div>
                    </Suspense>
                ),
            },
        ],
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
