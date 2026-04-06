/**
 * LessonPage — Tela de consumo de aula para o aluno.
 *
 * Exibe player de vídeo, conteúdo escrito em markdown, lista de exercícios
 * com status de progresso, e navegação entre aulas do módulo.
 *
 * Ao acessar a aula, marca automaticamente como IN_PROGRESS (011-F).
 * Para aulas sem exercícios, oferece botão "Concluir aula".
 */
import { useMemo } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/shared/ui/components";
import { EmptyState } from "@/shared/ui/components";
import { useStudentModuleDetail } from "../../hooks/useStudentModules";
import {
  useStudentLessonDetail,
  useAutoMarkStarted,
  useMarkLessonCompleted,
} from "../../hooks/useStudentLesson";
import type { StudentLesson } from "../../types";
import { VideoPlayer } from "../../ui/VideoPlayer";
import { MarkdownContent } from "../../ui/MarkdownContent";
import { ExerciseListItem } from "../../ui/ExerciseListItem";
import { LessonPageSkeleton } from "../../ui/LessonPageSkeleton";

export default function LessonPage() {
  const navigate = useNavigate();
  const { moduleId, lessonId } = useParams<{
    moduleId: string;
    lessonId: string;
  }>();

  // ─── Data Fetching ───────────────────────────────────────────────────────
  const {
    data: lesson,
    isLoading: lessonLoading,
    isError: lessonError,
  } = useStudentLessonDetail(moduleId ?? "", lessonId ?? "");

  const {
    data: module,
    isLoading: moduleLoading,
  } = useStudentModuleDetail(moduleId ?? "");

  const isLoading = lessonLoading || moduleLoading;

  // ─── Auto-mark as started ────────────────────────────────────────────────
  useAutoMarkStarted(lessonId);

  // ─── Mark as completed mutation ──────────────────────────────────────────
  const markCompleted = useMarkLessonCompleted();

  // ─── Navigation (prev/next) ──────────────────────────────────────────────
  const sortedLessons = useMemo((): StudentLesson[] => {
    if (!module?.lessons) return [];
    return [...module.lessons].sort(
      (a, b) => a.sequence_order - b.sequence_order,
    );
  }, [module]);

  const currentIndex = useMemo(() => {
    return sortedLessons.findIndex((l) => l.id === lessonId);
  }, [sortedLessons, lessonId]);

  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < sortedLessons.length - 1
      ? sortedLessons[currentIndex + 1]
      : null;

  const currentLessonNumber = currentIndex >= 0 ? currentIndex + 1 : null;
  const totalLessons = sortedLessons.length;

  // ─── Exercise sorting ────────────────────────────────────────────────────
  const sortedExercises = useMemo(() => {
    if (!lesson?.exercises) return [];
    return [...lesson.exercises].sort(
      (a, b) => a.sequence_order - b.sequence_order,
    );
  }, [lesson]);

  // ─── Status checks ──────────────────────────────────────────────────────
  const hasNoExercises = sortedExercises.length === 0;
  const isCompleted = lesson?.progress?.progress_status === "COMPLETED";

  // ─── Breadcrumbs ─────────────────────────────────────────────────────────
  const breadcrumbs = [
    { label: "Aluno", href: "/student" },
    { label: "Módulos", href: "/student/modules" },
    {
      label: module?.title ?? "...",
      href: `/student/modules/${moduleId}`,
    },
    { label: lesson?.title ?? "..." },
  ];

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Carregando aula..."
          breadcrumbs={breadcrumbs}
        />
        <LessonPageSkeleton />
      </>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (lessonError || !lesson) {
    return (
      <>
        <PageHeader
          title="Aula"
          breadcrumbs={breadcrumbs}
          actions={
            <Button
              variant="subtle"
              leftSection={<ArrowLeft size={16} />}
              onClick={() => navigate(`/student/modules/${moduleId}`)}
            >
              Voltar ao módulo
            </Button>
          }
        />
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar aula"
          color="red"
        >
          Não foi possível carregar a aula. Verifique se o endereço está
          correto ou tente novamente mais tarde.
        </Alert>
      </>
    );
  }

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleNavigate = (targetLessonId: string) => {
    navigate(`/student/modules/${moduleId}/lessons/${targetLessonId}`);
  };

  const handleCompleteLesson = () => {
    if (lessonId) {
      markCompleted.mutate(lessonId);
    }
  };

  // ─── Success ──────────────────────────────────────────────────────────────
  return (
    <Stack gap="lg">
      <PageHeader
        title={lesson.title}
        breadcrumbs={breadcrumbs}
        actions={
          <Group gap="xs">
            {currentLessonNumber && (
              <Badge variant="light" color="brand" size="lg">
                Aula {currentLessonNumber} de {totalLessons}
              </Badge>
            )}
            <Button
              variant="subtle"
              leftSection={<ArrowLeft size={16} />}
              onClick={() => navigate(`/student/modules/${moduleId}`)}
            >
              Voltar ao módulo
            </Button>
          </Group>
        }
      />

      {/* ── Video Player ──────────────────────────────────────────────── */}
      {lesson.video && (
        <VideoPlayer
          videoUrl={lesson.video.video_url}
          title={lesson.video.title}
        />
      )}

      {/* ── Written Content ───────────────────────────────────────────── */}
      {lesson.written_content && (
        <Card padding="lg" radius="md" withBorder>
          <MarkdownContent content={lesson.written_content} />
        </Card>
      )}

      {/* ── Completion status ─────────────────────────────────────────── */}
      {isCompleted && (
        <Alert
          color="teal"
          variant="light"
          title="Aula concluída! 🎉"
          icon={<CheckCircle2 size={16} />}
        >
          Você já concluiu esta aula. Continue para a próxima ou revise o conteúdo.
        </Alert>
      )}

      {/* ── Complete button (for lessons without exercises) ───────────── */}
      {hasNoExercises && !isCompleted && (
        <Button
          size="md"
          color="teal"
          leftSection={<CheckCircle2 size={18} />}
          onClick={handleCompleteLesson}
          loading={markCompleted.isPending}
          style={{ alignSelf: "flex-start" }}
          id="lesson-complete-button"
        >
          Concluir aula
        </Button>
      )}

      {/* ── Exercise List ─────────────────────────────────────────────── */}
      {sortedExercises.length > 0 && (
        <>
          <Divider />
          <div>
            <Group gap="xs" mb="md" align="center">
              <Code2 size={20} color="var(--mantine-color-brand-6)" />
              <Title order={4}>
                Exercícios
              </Title>
              <Badge variant="light" color="brand" size="sm">
                {sortedExercises.length}
              </Badge>
            </Group>

            <Stack gap="sm">
              {sortedExercises.map((exercise, index) => (
                <ExerciseListItem
                  key={exercise.id}
                  exercise={exercise}
                  index={index + 1}
                  onClick={() =>
                    navigate(
                      `/student/modules/${moduleId}/lessons/${lessonId}/exercises/${exercise.id}`,
                    )
                  }
                />
              ))}
            </Stack>
          </div>
        </>
      )}

      {/* ── Empty exercises (lesson has content only) ─────────────────── */}
      {lesson.exercises.length === 0 && !lesson.video && !lesson.written_content && (
        <EmptyState
          title="Conteúdo em preparação"
          description="Esta aula ainda não possui conteúdo publicado."
          icon={<BookOpen size={48} />}
        />
      )}

      {/* ── Navigation (prev/next) ────────────────────────────────────── */}
      <Divider />
      <Group justify="space-between">
        {prevLesson ? (
          <Button
            variant="light"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => handleNavigate(prevLesson.id)}
            id="lesson-prev-button"
          >
            <Stack gap={0} align="flex-start">
              <Text size="xs" c="dimmed">Aula anterior</Text>
              <Text size="sm" fw={500} lineClamp={1}>{prevLesson.title}</Text>
            </Stack>
          </Button>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Button
            variant="light"
            rightSection={<ArrowRight size={16} />}
            onClick={() => handleNavigate(nextLesson.id)}
            id="lesson-next-button"
          >
            <Stack gap={0} align="flex-end">
              <Text size="xs" c="dimmed">Próxima aula</Text>
              <Text size="sm" fw={500} lineClamp={1}>{nextLesson.title}</Text>
            </Stack>
          </Button>
        ) : (
          <div />
        )}
      </Group>
    </Stack>
  );
}
