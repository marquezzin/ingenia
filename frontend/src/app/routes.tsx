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

// Admin domain
const AdminDashboardPage = lazy(() => import("@/domains/admin/pages/DashboardPage"));
const ModuleListPage = lazy(() => import("@/domains/admin/pages/modules/ModuleListPage"));
const ModuleCreatePage = lazy(() => import("@/domains/admin/pages/modules/ModuleCreatePage"));
const ModuleDetailPage = lazy(() => import("@/domains/admin/pages/modules/ModuleDetailPage"));
const ModuleEditPage = lazy(() => import("@/domains/admin/pages/modules/ModuleEditPage"));

// Admin — Lesson pages
const LessonCreatePage = lazy(() => import("@/domains/admin/pages/lessons/LessonCreatePage"));
const LessonDetailPage = lazy(() => import("@/domains/admin/pages/lessons/LessonDetailPage"));
const LessonEditPage = lazy(() => import("@/domains/admin/pages/lessons/LessonEditPage"));

// Admin — Exercise pages
const ExerciseCreatePage = lazy(() => import("@/domains/admin/pages/exercises/ExerciseCreatePage"));
const ExerciseDetailPage = lazy(() => import("@/domains/admin/pages/exercises/ExerciseDetailPage"));
const ExerciseEditPage = lazy(() => import("@/domains/admin/pages/exercises/ExerciseEditPage"));

// Admin — User pages
const UserListPage = lazy(() => import("@/domains/admin/pages/users/UserListPage"));
const UserCreatePage = lazy(() => import("@/domains/admin/pages/users/UserCreatePage"));
const UserDetailPage = lazy(() => import("@/domains/admin/pages/users/UserDetailPage"));
const UserEditPage = lazy(() => import("@/domains/admin/pages/users/UserEditPage"));

// Admin — Class pages
const ClassListPage = lazy(() => import("@/domains/admin/pages/classes/ClassListPage"));
const ClassDetailPage = lazy(() => import("@/domains/admin/pages/classes/ClassDetailPage"));

// Student domain
const StudentDashboardPage = lazy(() => import("@/domains/student/pages/DashboardPage"));
const StudentModulesListPage = lazy(() => import("@/domains/student/pages/modules/ModulesListPage"));
const StudentModuleDetailPage = lazy(() => import("@/domains/student/pages/modules/ModuleDetailPage"));
const StudentLessonPage = lazy(() => import("@/domains/student/pages/lessons/LessonPage"));
const StudentExercisePage = lazy(() => import("@/domains/student/pages/exercises/ExercisePage"));
const StudentProgressPage = lazy(() => import("@/domains/student/pages/ProgressPage"));
const StudentSubmissionsPage = lazy(() => import("@/domains/student/pages/SubmissionsPage"));

// Dev tools (removível em produção)
const ComponentCatalogPage = lazy(() => import("@/shared/ui/components/ComponentCatalogPage"));

// Teacher domain
const TeacherDashboardPage = lazy(() => import("@/domains/teacher/pages/DashboardPage"));
const TeacherClassListPage = lazy(() => import("@/domains/teacher/pages/classes/ClassListPage"));
const TeacherClassCreatePage = lazy(() => import("@/domains/teacher/pages/classes/ClassCreatePage"));
const TeacherClassDetailPage = lazy(() => import("@/domains/teacher/pages/classes/ClassDetailPage"));
const TeacherClassEditPage = lazy(() => import("@/domains/teacher/pages/classes/ClassEditPage"));
const TeacherStudentListPage = lazy(() => import("@/domains/teacher/pages/students/StudentListPage"));
const TeacherStudentProgressPage = lazy(() => import("@/domains/teacher/pages/students/StudentProgressPage"));

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
                        <StudentDashboardPage />
                    </Suspense>
                ),
            },
            {
                path: "modules",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <StudentModulesListPage />
                    </Suspense>
                ),
            },
            {
                path: "modules/:moduleId",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <StudentModuleDetailPage />
                    </Suspense>
                ),
            },
            {
                path: "modules/:moduleId/lessons/:lessonId",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <StudentLessonPage />
                    </Suspense>
                ),
            },
            {
                path: "modules/:moduleId/lessons/:lessonId/exercises/:exerciseId",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <StudentExercisePage />
                    </Suspense>
                ),
            },
            {
                path: "progress",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <StudentProgressPage />
                    </Suspense>
                ),
            },
            {
                path: "submissions",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <StudentSubmissionsPage />
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
                        <TeacherDashboardPage />
                    </Suspense>
                ),
            },
            {
                path: "classes",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <TeacherClassListPage />
                    </Suspense>
                ),
            },
            {
                path: "classes/new",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <TeacherClassCreatePage />
                    </Suspense>
                ),
            },
            {
                path: "classes/:classId",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <TeacherClassDetailPage />
                    </Suspense>
                ),
            },
            {
                path: "classes/:classId/edit",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <TeacherClassEditPage />
                    </Suspense>
                ),
            },
            {
                path: "classes/:classId/students/:studentId",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <TeacherStudentProgressPage />
                    </Suspense>
                ),
            },
            {
                path: "students",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <TeacherStudentListPage />
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
                        <AdminDashboardPage />
                    </Suspense>
                ),
            },
            {
                path: "modules",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <ModuleListPage />
                    </Suspense>
                ),
            },
            {
                path: "modules/new",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <ModuleCreatePage />
                    </Suspense>
                ),
            },
            {
                path: "modules/:moduleId",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <ModuleDetailPage />
                    </Suspense>
                ),
            },
            {
                path: "modules/:moduleId/edit",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <ModuleEditPage />
                    </Suspense>
                ),
            },
            // ─── Lesson routes ──────────────────────────────────
            {
                path: "modules/:moduleId/lessons/new",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <LessonCreatePage />
                    </Suspense>
                ),
            },
            {
                path: "modules/:moduleId/lessons/:lessonId",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <LessonDetailPage />
                    </Suspense>
                ),
            },
            {
                path: "modules/:moduleId/lessons/:lessonId/edit",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <LessonEditPage />
                    </Suspense>
                ),
            },
            // ─── Exercise routes ────────────────────────────────
            {
                path: "modules/:moduleId/lessons/:lessonId/exercises/new",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <ExerciseCreatePage />
                    </Suspense>
                ),
            },
            {
                path: "modules/:moduleId/lessons/:lessonId/exercises/:exerciseId",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <ExerciseDetailPage />
                    </Suspense>
                ),
            },
            {
                path: "modules/:moduleId/lessons/:lessonId/exercises/:exerciseId/edit",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <ExerciseEditPage />
                    </Suspense>
                ),
            },
            // ─── User routes ────────────────────────────────────
            {
                path: "users",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <UserListPage />
                    </Suspense>
                ),
            },
            {
                path: "users/new",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <UserCreatePage />
                    </Suspense>
                ),
            },
            {
                path: "users/:userId",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <UserDetailPage />
                    </Suspense>
                ),
            },
            {
                path: "users/:userId/edit",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <UserEditPage />
                    </Suspense>
                ),
            },
            {
                path: "classes",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <ClassListPage />
                    </Suspense>
                ),
            },
            {
                path: "classes/:classId",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <ClassDetailPage />
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
