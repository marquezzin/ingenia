/**
 * Student Dashboard Page — Visão geral da trilha de aprendizagem.
 *
 * Exibe estatísticas de progresso, card "Continuar de onde parei"
 * e a grade de módulos com progresso visual.
 */
import { useMemo } from "react";
import { Alert, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  FileCode2,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatCard } from "@/shared/ui/components";
import { EmptyState } from "@/shared/ui/components";
import { useMe } from "@/domains/auth/hooks";
import { useStudentModules } from "../hooks/useStudentModules";
import { useStudentProgress } from "../hooks/useStudentProgress";
import {
  computeOverallProgress,
  getLastAccessedModule,
} from "../model";
import type { ModuleProgressSummary } from "../types";
import { ContinueStudyCard } from "../ui/ContinueStudyCard";
import { DashboardSkeleton } from "../ui/DashboardSkeleton";
import { ModuleCard } from "../ui/ModuleCard";

const BREADCRUMBS = [
  { label: "Aluno", href: "/student" },
  { label: "Trilha" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: user } = useMe();

  const {
    data: modulesData,
    isLoading: modulesLoading,
    isError: modulesError,
  } = useStudentModules();

  const {
    data: progressData,
    isLoading: progressLoading,
    isError: progressError,
  } = useStudentProgress();

  const isLoading = modulesLoading || progressLoading;
  const isError = modulesError || progressError;

  const modules = useMemo(
    () => modulesData?.results ?? [],
    [modulesData],
  );

  const progressList = useMemo(
    () => progressData?.results ?? [],
    [progressData],
  );

  // Build a map of moduleId → progress for quick lookup
  const progressMap = useMemo(() => {
    const map = new Map<string, ModuleProgressSummary>();
    for (const p of progressList) {
      map.set(p.module_id, p);
    }
    return map;
  }, [progressList]);

  // Compute aggregate metrics
  const overall = useMemo(
    () => computeOverallProgress(progressList, modules.length),
    [progressList, modules.length],
  );

  // Determine "continue where you left off"
  const continueModule = useMemo(
    () => getLastAccessedModule(modules),
    [modules],
  );

  // Calculate completion % for a module
  const getModulePercent = (moduleId: string): number => {
    const p = progressMap.get(moduleId);
    if (!p || p.total_lessons === 0) return 0;
    return Math.round((p.completed_lessons / p.total_lessons) * 100);
  };

  // ─── Greeting ─────────────────────────────────────────────────────────────
  const firstName = user?.fullName?.split(" ")[0] ?? "Aluno";

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <PageHeader
          title={`Olá, ${firstName}!`}
          subtitle="Carregando sua trilha de aprendizagem..."
          breadcrumbs={BREADCRUMBS}
        />
        <DashboardSkeleton />
      </>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <>
        <PageHeader
          title={`Olá, ${firstName}!`}
          subtitle="Sua trilha de aprendizagem"
          breadcrumbs={BREADCRUMBS}
        />
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar dados"
          color="red"
        >
          Não foi possível carregar sua trilha de aprendizagem. Tente novamente
          mais tarde.
        </Alert>
      </>
    );
  }

  // ─── Empty ────────────────────────────────────────────────────────────────
  if (modules.length === 0) {
    return (
      <>
        <PageHeader
          title={`Olá, ${firstName}!`}
          subtitle="Sua trilha de aprendizagem"
          breadcrumbs={BREADCRUMBS}
        />
        <EmptyState
          title="Nenhum módulo disponível"
          description="Os módulos serão adicionados em breve pelo administrador. Volte mais tarde!"
          icon={<BookOpen size={48} />}
        />
      </>
    );
  }

  // ─── Success ──────────────────────────────────────────────────────────────
  return (
    <Stack gap="lg">
      <PageHeader
        title={`Olá, ${firstName}! 👋`}
        subtitle="Sua trilha de aprendizagem"
        breadcrumbs={BREADCRUMBS}
      />

      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
        <StatCard
          title="Módulos"
          value={`${overall.completedModules}/${overall.totalModules}`}
          icon={<BookOpen size={22} />}
          color="brand"
        />
        <StatCard
          title="Aulas concluídas"
          value={overall.completedLessons}
          icon={<CheckCircle2 size={22} />}
          color="teal"
        />
        <StatCard
          title="Exercícios resolvidos"
          value={overall.completedExercises}
          icon={<FileCode2 size={22} />}
          color="grape"
        />
        <StatCard
          title="Progresso geral"
          value={`${overall.overallPercentage}%`}
          icon={<TrendingUp size={22} />}
          color="orange"
        />
      </SimpleGrid>

      {/* ── Continue where you left off ────────────────────────────────── */}
      <ContinueStudyCard
        module={continueModule}
        onContinue={() => {
          if (continueModule) {
            navigate(`/student/modules/${continueModule.id}`);
          }
        }}
      />

      {/* ── Module Trail ───────────────────────────────────────────────── */}
      <div>
        <Title order={4} mb="md">
          Trilha de Módulos
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          {modules.length}{" "}
          {modules.length === 1 ? "módulo disponível" : "módulos disponíveis"}
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {modules
            .sort((a, b) => a.sequence_order - b.sequence_order)
            .map((mod) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                completionPercent={getModulePercent(mod.id)}
                onClick={() => navigate(`/student/modules/${mod.id}`)}
              />
            ))}
        </SimpleGrid>
      </div>
    </Stack>
  );
}
