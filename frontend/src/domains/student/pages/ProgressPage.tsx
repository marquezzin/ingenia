/**
 * ProgressPage — Tela de progresso consolidado do aluno.
 *
 * Exibe resumo geral, ring progress, stat cards e cards
 * de progresso por módulo com barras de progresso e contagens.
 *
 * URL: /student/progress
 */

import { useMemo } from "react";
import {
  Alert,
  Button,
  Card,
  Group,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileCode2,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { EmptyState, PageHeader, StatCard } from "@/shared/ui/components";
import { useStudentModules } from "../hooks/useStudentModules";
import { useStudentProgress } from "../hooks/useStudentProgress";
import { computeOverallProgress, getLastAccessedModule } from "../model";
import { ProgressModuleCard } from "../ui/ProgressModuleCard";
import { ProgressPageSkeleton } from "../ui/ProgressPageSkeleton";

const BREADCRUMBS = [
  { label: "Aluno", href: "/student" },
  { label: "Meu Progresso" },
];

export default function ProgressPage() {
  const navigate = useNavigate();

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

  const modules = useMemo(() => modulesData?.results ?? [], [modulesData]);
  const progressList = useMemo(
    () => progressData?.results ?? [],
    [progressData],
  );

  const overall = useMemo(
    () => computeOverallProgress(progressList, modules.length),
    [progressList, modules.length],
  );

  const continueModule = useMemo(
    () => getLastAccessedModule(modules),
    [modules],
  );

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Meu Progresso"
          subtitle="Carregando seu progresso..."
          breadcrumbs={BREADCRUMBS}
        />
        <ProgressPageSkeleton />
      </>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <>
        <PageHeader
          title="Meu Progresso"
          subtitle="Acompanhe sua evolução na trilha"
          breadcrumbs={BREADCRUMBS}
        />
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar progresso"
          color="red"
        >
          Não foi possível carregar seus dados de progresso. Tente novamente mais
          tarde.
        </Alert>
      </>
    );
  }

  // ─── Empty ────────────────────────────────────────────────────────────────
  if (modules.length === 0) {
    return (
      <>
        <PageHeader
          title="Meu Progresso"
          subtitle="Acompanhe sua evolução na trilha"
          breadcrumbs={BREADCRUMBS}
        />
        <EmptyState
          title="Nenhum progresso registrado"
          description="Comece a trilha acessando os módulos disponíveis para acompanhar sua evolução!"
          icon={<TrendingUp size={48} />}
        />
      </>
    );
  }

  // ─── Success ──────────────────────────────────────────────────────────────
  const ringColor =
    overall.overallPercentage >= 100
      ? "green"
      : overall.overallPercentage > 0
        ? "blue"
        : "gray";

  return (
    <Stack gap="lg">
      <PageHeader
        title="Meu Progresso 📊"
        subtitle="Acompanhe sua evolução na trilha de aprendizagem"
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

      {/* ── Ring Progress Card ─────────────────────────────────────────── */}
      <Card padding="xl" radius="md" withBorder>
        <Group justify="center" gap="xl" wrap="wrap">
          <RingProgress
            size={140}
            thickness={12}
            roundCaps
            sections={[
              { value: overall.overallPercentage, color: ringColor },
            ]}
            label={
              <Text ta="center" fw={700} size="lg">
                {overall.overallPercentage}%
              </Text>
            }
          />
          <Stack gap="xs" style={{ maxWidth: 300 }}>
            <Title order={4}>Sua Evolução</Title>
            <Text size="sm" c="dimmed">
              Você já concluiu{" "}
              <Text span fw={600} c={ringColor}>
                {overall.completedModules} de {overall.totalModules}
              </Text>{" "}
              módulos,{" "}
              <Text span fw={600}>
                {overall.completedLessons}
              </Text>{" "}
              aulas e resolveu{" "}
              <Text span fw={600}>
                {overall.completedExercises}
              </Text>{" "}
              exercícios.
            </Text>
            {continueModule && (
              <Button
                variant="light"
                size="sm"
                rightSection={<ArrowRight size={16} />}
                onClick={() =>
                  navigate(`/student/modules/${continueModule.id}`)
                }
                mt="xs"
              >
                Continuar estudando
              </Button>
            )}
          </Stack>
        </Group>
      </Card>

      {/* ── Module Progress Cards ──────────────────────────────────────── */}
      <div>
        <Title order={4} mb="md">
          Progresso por Módulo
        </Title>

        {progressList.length === 0 ? (
          <Text size="sm" c="dimmed">
            Nenhum módulo iniciado ainda. Acesse a trilha para começar!
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {progressList.map((p) => (
              <ProgressModuleCard
                key={p.module_id}
                progress={p}
                onClick={() => navigate(`/student/modules/${p.module_id}`)}
              />
            ))}
          </SimpleGrid>
        )}
      </div>
    </Stack>
  );
}
