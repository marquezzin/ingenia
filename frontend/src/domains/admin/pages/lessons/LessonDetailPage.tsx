/**
 * LessonDetailPage — Detalhe da aula com lista de exercícios.
 */
import {
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  SimpleGrid,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Calendar,
  Check,
  Edit,
  ExternalLink,
  EyeOff,
  Hash,
  Plus,
  Video,
} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate, useParams } from "react-router-dom";
import { DataTable, PageHeader, StatusBadge } from "@/shared/ui/components";
import {
  useLesson,
  useLessonExercises,
  useModule,
  useUpdateLesson,
} from "../../hooks";
import { formatDate, PUBLICATION_STATUS_MAP } from "../../model";
import type { ExerciseListItem, PublicationStatus } from "../../types";

/**
 * Tenta extrair um embed URL para YouTube ou Vimeo.
 * Retorna null se não for reconhecido.
 */
function getVideoEmbedUrl(url: string): string | null {
  // YouTube: youtube.com/watch?v=ID or youtu.be/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo: vimeo.com/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}

export default function LessonDetailPage() {
  const { moduleId, lessonId } = useParams<{
    moduleId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const { data: lesson, isLoading, isError } = useLesson(moduleId!, lessonId!);
  const { data: module } = useModule(moduleId!);
  const { data: exercisesData, isLoading: exercisesLoading } =
    useLessonExercises(moduleId!, lessonId!);
  const updateLesson = useUpdateLesson();

  const handleTogglePublish = () => {
    if (!lesson) return;
    const newStatus: PublicationStatus =
      lesson.publication_status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    updateLesson.mutate({
      moduleId: moduleId!,
      lessonId: lessonId!,
      payload: {
        title: lesson.title,
        written_content: lesson.written_content,
        sequence_order: lesson.sequence_order,
        publication_status: newStatus,
        video_lesson: lesson.video
          ? {
              title: lesson.video.title,
              video_url: lesson.video.video_url,
              duration_seconds: lesson.video.duration_seconds,
            }
          : null,
      },
    });
  };

  if (isLoading) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  if (isError || !lesson) {
    return (
      <Alert
        icon={<AlertCircle size={16} />}
        title="Erro ao carregar aula"
        color="red"
      >
        Não foi possível carregar os dados da aula.
      </Alert>
    );
  }

  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Módulos", href: "/admin/modules" },
    { label: module?.title ?? "Módulo", href: `/admin/modules/${moduleId}` },
    { label: lesson.title },
  ];

  const exercises = exercisesData?.results ?? [];
  const hasNoVideo = !lesson.video;
  const hasNoContent = !lesson.written_content || lesson.written_content.trim() === "";

  const embedUrl = lesson.video ? getVideoEmbedUrl(lesson.video.video_url) : null;

  return (
    <>
      <PageHeader
        title={lesson.title}
        breadcrumbs={breadcrumbs}
        actions={
          <Group gap="xs">
            <Button
              variant="light"
              color={lesson.publication_status === "PUBLISHED" ? "orange" : "green"}
              leftSection={
                lesson.publication_status === "PUBLISHED" ? (
                  <EyeOff size={16} />
                ) : (
                  <Check size={16} />
                )
              }
              onClick={handleTogglePublish}
              loading={updateLesson.isPending}
            >
              {lesson.publication_status === "PUBLISHED"
                ? "Despublicar"
                : "Publicar"}
            </Button>
            <Button
              leftSection={<Edit size={16} />}
              variant="light"
              onClick={() =>
                navigate(
                  `/admin/modules/${moduleId}/lessons/${lessonId}/edit`,
                )
              }
            >
              Editar
            </Button>
          </Group>
        }
      />

      {/* BR-008 Alert */}
      {(hasNoVideo || hasNoContent) && (
        <Alert
          icon={<AlertTriangle size={16} />}
          title="Atenção (BR-008)"
          color="yellow"
          mb="lg"
        >
          {hasNoVideo && hasNoContent
            ? "Esta aula não possui videoaula nem conteúdo escrito. Ambos são necessários para garantir o fluxo pedagógico."
            : hasNoVideo
              ? "Esta aula não possui videoaula. Cada aula deve possuir material escrito e uma videoaula associada."
              : "Esta aula não possui conteúdo escrito. Cada aula deve possuir material escrito e uma videoaula associada."}
        </Alert>
      )}

      {/* Lesson Info */}
      <Card withBorder mb="lg" padding="lg">
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md" mb="md">
          <Group gap="xs">
            <Hash size={16} color="var(--mantine-color-dimmed)" />
            <div>
              <Text size="xs" c="dimmed">
                Ordem
              </Text>
              <Text size="sm" fw={600}>
                {lesson.sequence_order}
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            <BookOpen size={16} color="var(--mantine-color-dimmed)" />
            <div>
              <Text size="xs" c="dimmed">
                Exercícios
              </Text>
              <Text size="sm" fw={600}>
                {lesson.exercise_count}
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            <Calendar size={16} color="var(--mantine-color-dimmed)" />
            <div>
              <Text size="xs" c="dimmed">
                Criado em
              </Text>
              <Text size="sm" fw={600}>
                {formatDate(lesson.created_at)}
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            <Calendar size={16} color="var(--mantine-color-dimmed)" />
            <div>
              <Text size="xs" c="dimmed">
                Atualizado em
              </Text>
              <Text size="sm" fw={600}>
                {formatDate(lesson.updated_at)}
              </Text>
            </div>
          </Group>
        </SimpleGrid>

        <Group mb="md">
          <StatusBadge
            status={lesson.publication_status}
            statusMap={PUBLICATION_STATUS_MAP}
          />
          {lesson.video ? (
            <Badge
              leftSection={<Video size={12} />}
              variant="light"
              color="blue"
              size="sm"
            >
              Vídeo: {lesson.video.title}
            </Badge>
          ) : (
            <Badge variant="light" color="gray" size="sm">
              Sem vídeo
            </Badge>
          )}
        </Group>

        {/* Video Section */}
        {lesson.video && (
          <>
            <Divider mb="md" />
            <Text size="sm" fw={600} mb="xs">
              <Video size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              Videoaula — {lesson.video.title}
              {lesson.video.duration_seconds && (
                <Text span c="dimmed" size="xs" ml="xs">
                  ({Math.floor(lesson.video.duration_seconds / 60)}:{String(lesson.video.duration_seconds % 60).padStart(2, "0")} min)
                </Text>
              )}
            </Text>

            {embedUrl ? (
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: "var(--mantine-radius-md)",
                  marginBottom: "var(--mantine-spacing-md)",
                }}
              >
                <iframe
                  src={embedUrl}
                  title={lesson.video.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                    borderRadius: "var(--mantine-radius-md)",
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <Anchor
                href={lesson.video.video_url}
                target="_blank"
                rel="noopener noreferrer"
                mb="md"
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                <ExternalLink size={14} />
                Abrir vídeo em nova aba
              </Anchor>
            )}
          </>
        )}

        {/* Written Content — Markdown */}
        <Divider mb="md" />
        <Text size="sm" fw={600} mb="xs">
          Conteúdo Escrito
        </Text>
        {lesson.written_content ? (
          <TypographyStylesProvider>
            <Markdown remarkPlugins={[remarkGfm]}>
              {lesson.written_content}
            </Markdown>
          </TypographyStylesProvider>
        ) : (
          <Text size="sm" c="dimmed">
            Nenhum conteúdo escrito cadastrado.
          </Text>
        )}
      </Card>

      {/* Exercises List */}
      <PageHeader
        title="Exercícios"
        subtitle={`${exercises.length} exercício(s) nesta aula`}
        actions={
          <Button
            leftSection={<Plus size={16} />}
            onClick={() =>
              navigate(
                `/admin/modules/${moduleId}/lessons/${lessonId}/exercises/new`,
              )
            }
          >
            Novo Exercício
          </Button>
        }
      />

      <DataTable<ExerciseListItem>
        columns={[
          { key: "title", label: "Título", sortable: true },
          {
            key: "sequence_order",
            label: "Ordem",
            sortable: true,
            width: 80,
          },
          {
            key: "publication_status",
            label: "Status",
            width: 120,
            render: (row) => (
              <StatusBadge
                status={row.publication_status}
                statusMap={PUBLICATION_STATUS_MAP}
              />
            ),
          },
          {
            key: "test_cases_count",
            label: "Test Cases",
            width: 110,
            render: (row) =>
              row.test_cases_count === 0 ? (
                <Badge variant="light" color="red" size="sm">
                  0 ⚠
                </Badge>
              ) : (
                <Text size="sm">{row.test_cases_count}</Text>
              ),
          },
        ]}
        data={exercises}
        loading={exercisesLoading}
        rowKey={(row) => row.id}
        onRowClick={(row) =>
          navigate(
            `/admin/modules/${moduleId}/lessons/${lessonId}/exercises/${row.id}`,
          )
        }
        emptyState={{
          title: "Nenhum exercício cadastrado",
          description: "Esta aula ainda não possui exercícios.",
        }}
      />
    </>
  );
}
