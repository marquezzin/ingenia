/**
 * StudentProgressPage — Progresso individual detalhado de um aluno na turma.
 *
 * Exibe cabeçalho com nome do aluno e turma, progresso por módulo/aula,
 * e exercícios resolvidos com score.
 *
 * URL: /teacher/classes/:classId/students/:studentId
 */
import { useMemo } from "react";
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  GraduationCap,
  Layers,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState, PageHeader, StatCard } from "@/shared/ui/components";
import { useStudentProgress, useTeacherClass } from "../../hooks";
import {
  getLearningStatusColor,
  getLearningStatusLabel,
} from "../../model";
import type {
  ProgressStatus,
  TeacherExerciseProgress,
  TeacherLessonProgress,
  TeacherModuleProgress,
} from "../../types";

// ─── Status helpers ─────────────────────────────────────────────────────────

const getProgressStatusLabel = (status: ProgressStatus): string => {
  switch (status) {
    case "NOT_STARTED":
      return "Não iniciado";
    case "IN_PROGRESS":
      return "Em andamento";
    case "COMPLETED":
      return "Concluído";
    default:
      return status;
  }
};

const getProgressStatusColor = (status: ProgressStatus): string => {
  switch (status) {
    case "NOT_STARTED":
      return "gray";
    case "IN_PROGRESS":
      return "blue";
    case "COMPLETED":
      return "green";
    default:
      return "gray";
  }
};

const getProgressStatusIcon = (status: ProgressStatus) => {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 size={16} />;
    case "IN_PROGRESS":
      return <Clock size={16} />;
    default:
      return null;
  }
};

const formatDate = (date: string | null): string => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function StudentProgressPage() {
  const { classId, studentId } = useParams<{
    classId: string;
    studentId: string;
  }>();
  const navigate = useNavigate();

  const {
    data: classDetail,
    isLoading: isLoadingClass,
  } = useTeacherClass(classId!);

  const {
    data: progress,
    isLoading: isLoadingProgress,
    isError: isErrorProgress,
  } = useStudentProgress(classId!, studentId!);

  const isLoading = isLoadingClass || isLoadingProgress;

  // ─── Computed stats ───────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!progress?.modules) {
      return {
        totalModules: 0,
        completedModules: 0,
        totalExercises: 0,
        completedExercises: 0,
        totalLessons: 0,
        completedLessons: 0,
      };
    }

    let totalExercises = 0;
    let completedExercises = 0;
    let totalLessons = 0;
    let completedLessons = 0;

    for (const module of progress.modules) {
      totalLessons += module.total_lessons;
      completedLessons += module.completed_lessons;
      totalExercises += module.total_exercises;
      completedExercises += module.completed_exercises;
    }

    return {
      totalModules: progress.modules.length,
      completedModules: progress.modules.filter(
        (m) => m.progress_status === "COMPLETED",
      ).length,
      totalExercises,
      completedExercises,
      totalLessons,
      completedLessons,
    };
  }, [progress]);

  const BREADCRUMBS = [
    { label: "Professor", href: "/teacher" },
    { label: "Turmas", href: "/teacher/classes" },
    {
      label: classDetail?.name ?? "Turma",
      href: `/teacher/classes/${classId}`,
    },
    { label: progress?.student_name ?? "Aluno" },
  ];

  // ─── Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Stack gap="lg">
        <PageHeader title="Carregando..." breadcrumbs={BREADCRUMBS} />
        <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
        </SimpleGrid>
        <Skeleton height={300} radius="md" />
      </Stack>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────
  if (isErrorProgress || !progress) {
    return (
      <Stack gap="lg">
        <PageHeader title="Progresso do Aluno" breadcrumbs={BREADCRUMBS} />
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar progresso"
          color="red"
        >
          Não foi possível carregar o progresso deste aluno. Verifique se o aluno
          está matriculado nesta turma.
        </Alert>
        <Button
          variant="subtle"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => navigate(`/teacher/classes/${classId}`)}
        >
          Voltar para a Turma
        </Button>
      </Stack>
    );
  }

  // ─── Empty modules ────────────────────────────────────────────────
  const hasNoProgress =
    progress.learning_status === "NOT_STARTED" &&
    stats.completedExercises === 0;

  return (
    <Stack gap="lg">
      <PageHeader
        title={progress.student_name}
        subtitle={`${progress.student_email} • ${classDetail?.name ?? "Turma"}`}
        breadcrumbs={BREADCRUMBS}
        actions={
          <Button
            variant="light"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate(`/teacher/classes/${classId}`)}
          >
            Voltar para Turma
          </Button>
        }
      />

      {/* ── Student header badge ─────────────────────────────────── */}
      <Group>
        <Badge
          variant="light"
          color={getLearningStatusColor(progress.learning_status)}
          size="lg"
          leftSection={
            <ThemeIcon
              variant="transparent"
              color={getLearningStatusColor(progress.learning_status)}
              size="xs"
            >
              <GraduationCap size={14} />
            </ThemeIcon>
          }
        >
          {getLearningStatusLabel(progress.learning_status)}
        </Badge>
      </Group>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
        <StatCard
          title="Módulos"
          value={`${stats.completedModules}/${stats.totalModules}`}
          icon={<Layers size={22} />}
          color="violet"
        />
        <StatCard
          title="Aulas"
          value={`${stats.completedLessons}/${stats.totalLessons}`}
          icon={<BookOpen size={22} />}
          color="blue"
        />
        <StatCard
          title="Exercícios"
          value={`${stats.completedExercises}/${stats.totalExercises}`}
          icon={<Code2 size={22} />}
          color="teal"
        />
        <StatCard
          title="Progresso Geral"
          value={
            stats.totalExercises > 0
              ? `${Math.round((stats.completedExercises / stats.totalExercises) * 100)}%`
              : "0%"
          }
          icon={<CheckCircle2 size={22} />}
          color="green"
        />
      </SimpleGrid>

      {/* ── Overall progress bar ─────────────────────────────────── */}
      {stats.totalExercises > 0 && (
        <Card withBorder radius="md" padding="md">
          <Text size="sm" fw={500} mb="xs">
            Progresso Geral
          </Text>
          <Progress
            value={
              stats.totalExercises > 0
                ? (stats.completedExercises / stats.totalExercises) * 100
                : 0
            }
            size="lg"
            radius="md"
            color="green"
            animated={stats.completedExercises < stats.totalExercises}
          />
          <Text size="xs" c="dimmed" mt={4}>
            {stats.completedExercises} de {stats.totalExercises} exercícios
            concluídos
          </Text>
        </Card>
      )}

      {/* ── No progress state ───────────────────────────────────── */}
      {hasNoProgress && progress.modules.length === 0 ? (
        <EmptyState
          title="Aluno ainda não iniciou a trilha"
          description="Quando o aluno começar a acessar as aulas e resolver exercícios, o progresso aparecerá aqui."
          icon={<GraduationCap size={48} />}
        />
      ) : (
        /* ── Module Accordion ────────────────────────────────────── */
        <Card withBorder radius="md" padding="lg">
          <Title order={4} mb="md">
            Progresso por Módulo
          </Title>

          <Accordion variant="separated" radius="md">
            {progress.modules.map((module) => (
              <ModuleAccordion key={module.module_id} module={module} />
            ))}
          </Accordion>
        </Card>
      )}
    </Stack>
  );
}

// ─── Module Accordion Item ──────────────────────────────────────────────────

function ModuleAccordion({ module }: { module: TeacherModuleProgress }) {
  const exercisePercent =
    module.total_exercises > 0
      ? Math.round(
          (module.completed_exercises / module.total_exercises) * 100,
        )
      : 0;

  return (
    <Accordion.Item value={module.module_id}>
      <Accordion.Control>
        <Group justify="space-between" wrap="nowrap" pr="sm">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon
              variant="light"
              color={getProgressStatusColor(module.progress_status)}
              size="md"
              radius="md"
            >
              <Layers size={16} />
            </ThemeIcon>
            <div>
              <Text fw={500} size="sm">
                {module.module_title}
              </Text>
              <Text size="xs" c="dimmed">
                {module.completed_lessons}/{module.total_lessons} aulas •{" "}
                {module.completed_exercises}/{module.total_exercises} exercícios
              </Text>
            </div>
          </Group>
          <Badge
            variant="light"
            color={getProgressStatusColor(module.progress_status)}
            size="sm"
          >
            {getProgressStatusLabel(module.progress_status)}
          </Badge>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack gap="md">
          {/* Module progress bar */}
          <div>
            <Progress
              value={exercisePercent}
              size="sm"
              radius="md"
              color={getProgressStatusColor(module.progress_status)}
            />
            <Group justify="space-between" mt={4}>
              <Text size="xs" c="dimmed">
                {formatDate(module.started_at)}{" "}
                {module.started_at ? "→" : ""}{" "}
                {module.completed_at ? formatDate(module.completed_at) : ""}
              </Text>
              <Text size="xs" c="dimmed">
                {exercisePercent}%
              </Text>
            </Group>
          </div>

          {/* Lessons list */}
          {module.lessons.length > 0 ? (
            <Stack gap="xs">
              {module.lessons.map((lesson) => (
                <LessonCard key={lesson.lesson_id} lesson={lesson} />
              ))}
            </Stack>
          ) : (
            <Text size="sm" c="dimmed" ta="center" py="sm">
              Nenhuma aula neste módulo.
            </Text>
          )}
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

// ─── Lesson Card ────────────────────────────────────────────────────────────

function LessonCard({ lesson }: { lesson: TeacherLessonProgress }) {
  return (
    <Card withBorder radius="sm" padding="sm">
      <Group justify="space-between" mb={lesson.exercises.length > 0 ? "xs" : 0}>
        <Group gap="sm">
          {getProgressStatusIcon(lesson.progress_status) || (
            <BookOpen size={14} color="var(--mantine-color-gray-5)" />
          )}
          <Text size="sm" fw={500}>
            {lesson.lesson_title}
          </Text>
        </Group>
        <Badge
          variant="dot"
          color={getProgressStatusColor(lesson.progress_status)}
          size="xs"
        >
          {getProgressStatusLabel(lesson.progress_status)}
        </Badge>
      </Group>

      {/* Exercise table */}
      {lesson.exercises.length > 0 && (
        <Table verticalSpacing={4} horizontalSpacing="sm" fz="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Exercício</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Tentativas</Table.Th>
              <Table.Th>Conclusão</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {lesson.exercises.map((exercise) => (
              <ExerciseRow key={exercise.exercise_id} exercise={exercise} />
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Card>
  );
}

// ─── Exercise Row ───────────────────────────────────────────────────────────

function ExerciseRow({
  exercise,
}: {
  exercise: TeacherExerciseProgress;
}) {
  return (
    <Table.Tr>
      <Table.Td>
        <Group gap={4}>
          <Code2 size={12} />
          <Text size="xs">{exercise.exercise_title}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge
          variant="light"
          color={getProgressStatusColor(exercise.progress_status)}
          size="xs"
        >
          {getProgressStatusLabel(exercise.progress_status)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="xs">
          {exercise.attempts_count}{" "}
          {exercise.attempts_count === 1 ? "tentativa" : "tentativas"}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed">
          {formatDate(exercise.completed_at)}
        </Text>
      </Table.Td>
    </Table.Tr>
  );
}
