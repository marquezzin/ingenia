/**
 * App Routes — Definição centralizada de todas as rotas.
 * Use lazy loading para cada domínio.
 */
/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RequireAuth, RequireGuest } from "@/shared/auth/guards";

// Lazy imports por domínio
const LandingPage = lazy(() => import("@/domains/landing/pages/LandingPage"));
const LoginPage = lazy(() => import("@/domains/auth/pages/LoginPage"));

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

    // ─── Rotas protegidas ───────────────────────────────────────────────────
    {
        path: "/dashboard",
        element: (
            <RequireAuth>
                <Suspense fallback={<Spinner />}>
                    {/* Layout principal aqui */}
                    <div>Dashboard — adicione seu layout aqui</div>
                </Suspense>
            </RequireAuth>
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
    //     <RequireAuth>
    //       <Suspense fallback={<Spinner />}>
    //         <MyEntityListPage />
    //       </Suspense>
    //     </RequireAuth>
    //   ),
    // },
]);
