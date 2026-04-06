/**
 * ModuleDetailPage — Detalhe de um módulo para o aluno.
 *
 * Exibe título, descrição, barra de progresso geral, CTA para
 * continuar/iniciar módulo, e lista sequencial de aulas com status.
 */
import { useMemo } from "react";
import {
  Alert,
  Button,
  Card,
  Group,
  Progress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  PlayCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/shared/ui/components";
import { EmptyState } from "@/shared/ui/components";
import { useStudentModuleDetail } from "../../hooks/useStudentModules";
import { useStudentProgress } from "../../hooks/useStudentProgress";
import { getModuleCompletionPercent } from "../../model";
import type { ModuleProgressSummary, StudentLesson } from "../../types";
import { LessonItem } from "../../ui/LessonItem";
import { ModuleDetailSkeleton } from "../../ui/ModuleDetailSkeleton";

export default function ModuleDetailPage() {
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();

  const {
    data: module,
    isLoading: moduleLoading,
    isError: moduleError,
  } = useStudentModuleDetail(moduleId ?? "");

  const {
    data: progressData,
    isLoading: progressLoading,
  } = useStudentProgress();

  const isLoading = moduleLoading || progressLoading;

  // Find progress for this specific module
  const moduleProgress = useMemo(() => {
    if (!progressData?.results || !moduleId) return null;
    return (
      progressData.results.find(
        (p: ModuleProgressSummary) => p.module_id === moduleId,
      ) ?? null
    );
  }, [progressData, moduleId]);

  // Compute completion percentage
  const completionPercent = useMemo(() => {
    if (!moduleProgress) return 0;
    return getModuleCompletionPercent(moduleProgress);
  }, [moduleProgress]);

  // Sort lessons by sequence_order
  const sortedLessons = useMemo(() => {
    if (!module?.lessons) return [];
    return [...module.lessons].sort(
      (a, b) => a.sequence_order - b.sequence_order,
    );
  }, [module]);

  // Find next lesson to continue
  const nextLesson = useMemo((): StudentLesson | null => {
    // First IN_PROGRESS lesson
    const inProgress = sortedLessons.find(
      (l) => l.progress?.progress_status === "IN_PROGRESS",
    );
    if (inProgress) return inProgress;

    // First NOT_STARTED lesson
    const notStarted = sortedLessons.find(
      (l) => !l.progress || l.progress.progress_status === "NOT_STARTED",
    );
    if (notStarted) return notStarted;

    return null;
  }, [sortedLessons]);

  const isNew =
    !module?.progress || module.progress.progress_status === "NOT_STARTED";
  const isCompleted = module?.progress?.progress_status === "COMPLETED";

  // ─── Breadcrumbs ─────────────────────────────────────────────────────────
  const breadcrumbs = [
    { label: "Aluno", href: "/student" },
    { label: "Módulos", href: "/student/modules" },
    { label: module?.title ?? "..." },
  ];

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Carregando módulo..."
          breadcrumbs={breadcrumbs}
        />
        <ModuleDetailSkeleton />
      </>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (moduleError || !module) {
    return (
      <>
        <PageHeader
          title="Módulo"
          breadcrumbs={breadcrumbs}
          actions={
            <Button
              variant="subtle"
              leftSection={<ArrowLeft size={16} />}
              onClick={() => navigate("/student/modules")}
            >
              Voltar
            </Button>
          }
        />
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar módulo"
          color="red"
        >
          Não foi possível carregar o módulo. Verifique se o endereço está
          correto ou tente novamente mais tarde.
        </Alert>
      </>
    );
  }

  // ─── Success ──────────────────────────────────────────────────────────────
  return (
    <Stack gap="lg">
      <PageHeader
        title={module.title}
        breadcrumbs={breadcrumbs}
        actions={
          <Button
            variant="subtle"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate("/student/modules")}
          >
            Voltar
          </Button>
        }
      />

      {/* ── Module Info Card ──────────────────────────────────────────── */}
      <Card padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Text size="sm" c="dimmed" style={{ whiteSpace: "pre-line" }}>
            {module.description}
          </Text>

          <Group gap="lg" wrap="wrap">
            <Group gap={4}>
              <BookOpen size={14} color="var(--color-text-muted)" />
              <Text size="sm" c="dimmed">
                {module.lesson_count}{" "}
                {module.lesson_count === 1 ? "aula" : "aulas"}
              </Text>
            </Group>
            {moduleProgress && (
              <>
                <Text size="sm" c="dimmed">
                  {moduleProgress.completed_lessons}/{moduleProgress.total_lessons}{" "}
                  aulas concluídas
                </Text>
                <Text size="sm" c="dimmed">
                  {moduleProgress.completed_exercises}/{moduleProgress.total_exercises}{" "}
                  exercícios resolvidos
                </Text>
              </>
            )}
          </Group>

          {/* Progress bar */}
          <div>
            <Group justify="space-between" mb={4}>
              <Text size="xs" c="dimmed">
                Progresso do módulo
              </Text>
              <Text
                size="xs"
                fw={600}
                c={completionPercent === 100 ? "teal" : "dimmed"}
              >
                {completionPercent}%
              </Text>
            </Group>
            <Progress
              value={completionPercent}
              size="md"
              radius="xl"
              color={completionPercent === 100 ? "teal" : "brand"}
              animated={
                !isCompleted && completionPercent > 0
              }
            />
          </div>
        </Stack>
      </Card>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      {!isCompleted && nextLesson && (
        <Button
          size="md"
          rightSection={<ArrowRight size={16} />}
          leftSection={isNew ? <PlayCircle size={18} /> : undefined}
          onClick={() =>
            navigate(
              `/student/modules/${moduleId}/lessons/${nextLesson.id}`,
            )
          }
          style={{ alignSelf: "flex-start" }}
          id="module-continue-button"
        >
          {isNew ? "Iniciar módulo" : "Continuar módulo"}
        </Button>
      )}

      {isCompleted && (
        <Alert color="teal" variant="light" title="Módulo concluído! 🎉">
          Você completou todas as aulas deste módulo. Parabéns!
        </Alert>
      )}

      {/* ── Lesson List ───────────────────────────────────────────────── */}
      <div>
        <Title order={4} mb="md">
          Aulas
        </Title>

        {sortedLessons.length === 0 ? (
          <EmptyState
            title="Nenhuma aula disponível"
            description="Este módulo ainda não possui aulas publicadas."
            icon={<BookOpen size={48} />}
          />
        ) : (
          <Stack gap="sm">
            {sortedLessons.map((lesson, index) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                index={index + 1}
                onClick={() =>
                  navigate(
                    `/student/modules/${moduleId}/lessons/${lesson.id}`,
                  )
                }
              />
            ))}
          </Stack>
        )}
      </div>
    </Stack>
  );
}
