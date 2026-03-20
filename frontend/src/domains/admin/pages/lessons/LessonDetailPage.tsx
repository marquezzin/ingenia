/**
 * LessonDetailPage — Detalhe da aula com lista de exercícios (design aprimorado).
 */
import {
  Alert,
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Collapse,
  Flex,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  TypographyStylesProvider,
} from "@mantine/core";
import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  Edit,
  ExternalLink,
  EyeOff,
  FileCheck,
  Hash,
  Plus,
  Video,
} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, StatusBadge } from "@/shared/ui/components";
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
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

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
      <Flex justify="center" py="xl">
        <Loader />
      </Flex>
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
  const isPublished = lesson.publication_status === "PUBLISHED";

  return (
    <>
      <PageHeader
        title={lesson.title}
        breadcrumbs={breadcrumbs}
        actions={
          <Group gap="sm">
            <Button
              variant={isPublished ? "light" : "gradient"}
              color={isPublished ? "orange" : undefined}
              gradient={!isPublished ? { from: "teal", to: "green", deg: 135 } : undefined}
              leftSection={isPublished ? <EyeOff size={16} /> : <Check size={16} />}
              onClick={handleTogglePublish}
              loading={updateLesson.isPending}
              radius="md"
              styles={{ root: { transition: "transform 150ms ease" } }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {isPublished ? "Despublicar" : "Publicar"}
            </Button>
            <Button
              leftSection={<Edit size={16} />}
              variant="light"
              radius="md"
              onClick={() => navigate(`/admin/modules/${moduleId}/lessons/${lessonId}/edit`)}
              styles={{ root: { transition: "transform 150ms ease" } }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
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

      {/* Lesson Info Card */}
      <Card
        withBorder
        mb="xl"
        padding="xl"
        radius="md"
        style={{
          borderColor: "var(--color-border)",
          background: "linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-elevated) 60%, var(--color-bg-subtle) 100%)",
        }}
      >
        <Stack gap="md">
          {/* Badges */}
          <Group gap="sm">
            <Badge
              size="lg"
              radius="md"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 135 }}
              style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}
            >
              Aula {String(lesson.sequence_order).padStart(2, "0")}
            </Badge>
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
                {lesson.video.title}
              </Badge>
            ) : (
              <Badge variant="light" color="gray" size="sm">
                Sem vídeo
              </Badge>
            )}
          </Group>

          {/* Stats */}
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg" mt="xs">
            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                <Hash size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>Ordem</Text>
                <Text size="lg" fw={700} lh={1.3}>{lesson.sequence_order}</Text>
              </div>
            </Group>
            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="teal" size="lg" radius="md">
                <Code2 size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>Exercícios</Text>
                <Text size="lg" fw={700} lh={1.3}>{lesson.exercise_count}</Text>
              </div>
            </Group>
            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="grape" size="lg" radius="md">
                <Calendar size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>Criado em</Text>
                <Text size="sm" fw={600} lh={1.3}>{formatDate(lesson.created_at)}</Text>
              </div>
            </Group>
            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="orange" size="lg" radius="md">
                <Clock size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>Atualizado em</Text>
                <Text size="sm" fw={600} lh={1.3}>{formatDate(lesson.updated_at)}</Text>
              </div>
            </Group>
          </SimpleGrid>
        </Stack>
      </Card>

      {/* Video Section */}
      {lesson.video && (
        <Card withBorder mb="xl" padding="lg" radius="md">
          <Text size="sm" fw={600} mb="sm">
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
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <ExternalLink size={14} />
              Abrir vídeo em nova aba
            </Anchor>
          )}
        </Card>
      )}

      {/* Written Content — collapsible */}
      <WrittenContentCard content={lesson.written_content} />

      {/* Exercises Section Header */}
      <Group justify="space-between" align="center" mb="lg">
        <div>
          <Text size="xl" fw={700} style={{ color: "var(--color-text)" }}>
            Exercícios
          </Text>
          <Text size="sm" c="dimmed">
            {exercises.length} {exercises.length === 1 ? "exercício" : "exercícios"} nesta aula
          </Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          onClick={() =>
            navigate(`/admin/modules/${moduleId}/lessons/${lessonId}/exercises/new`)
          }
          variant="gradient"
          gradient={{ from: "blue", to: "cyan", deg: 135 }}
          radius="md"
          styles={{
            root: {
              fontWeight: 600,
              transition: "transform 150ms ease, box-shadow 150ms ease",
              boxShadow: "0 4px 14px rgba(58, 134, 255, 0.25)",
            },
            section: { transition: "transform 200ms ease" },
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(58, 134, 255, 0.4)";
            const icon = e.currentTarget.querySelector(".mantine-Button-section");
            if (icon instanceof HTMLElement) icon.style.transform = "rotate(90deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(58, 134, 255, 0.25)";
            const icon = e.currentTarget.querySelector(".mantine-Button-section");
            if (icon instanceof HTMLElement) icon.style.transform = "rotate(0deg)";
          }}
        >
          Novo Exercício
        </Button>
      </Group>

      {/* Exercise Cards */}
      {exercisesLoading ? (
        <Flex justify="center" py="xl">
          <Loader size="md" />
        </Flex>
      ) : exercises.length === 0 ? (
        <Card withBorder padding="xl" radius="md" style={{ borderStyle: "dashed", borderColor: "var(--color-border)" }}>
          <Flex direction="column" align="center" justify="center" py="lg" gap="md" style={{ opacity: 0.7 }}>
            <Code2 size={48} strokeWidth={1.5} style={{ color: "var(--color-text-muted)" }} />
            <Text size="lg" fw={500} c="dimmed">
              Nenhum exercício cadastrado
            </Text>
            <Text size="sm" c="dimmed">
              Esta aula ainda não possui exercícios. Crie o primeiro!
            </Text>
          </Flex>
        </Card>
      ) : (
        <Stack gap="sm">
          {exercises.map((exercise) => (
            <ExerciseRow
              key={exercise.id}
              exercise={exercise}
              onClick={() =>
                navigate(
                  `/admin/modules/${moduleId}/lessons/${lessonId}/exercises/${exercise.id}`,
                )
              }
            />
          ))}
        </Stack>
      )}
    </>
  );
}

function ExerciseRow({
  exercise,
  onClick,
}: {
  exercise: ExerciseListItem;
  onClick: () => void;
}) {
  return (
    <Card
      withBorder
      padding="md"
      radius="md"
      onClick={onClick}
      style={{
        cursor: "pointer",
        transition: "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
        borderColor: "var(--color-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateX(4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.borderColor = "hsl(var(--brand-primary))";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateX(0)";
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
    >
      <Group justify="space-between" align="center" wrap="nowrap">
        {/* Left: order circle + title */}
        <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, hsl(217, 100%, 61%), hsl(191, 86%, 62%))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Text size="sm" fw={700} c="white">
              {String(exercise.sequence_order).padStart(2, "0")}
            </Text>
          </Box>
          <Text fw={600} size="md" truncate="end" style={{ color: "var(--color-text)" }}>
            {exercise.title}
          </Text>
        </Group>

        {/* Right: test cases badge + status */}
        <Group gap="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
          {exercise.test_cases_count === 0 ? (
            <Badge leftSection={<AlertTriangle size={11} />} variant="light" color="red" size="sm" radius="md">
              0 testes
            </Badge>
          ) : (
            <Badge leftSection={<FileCheck size={11} />} variant="light" color="teal" size="sm" radius="md">
              {exercise.test_cases_count} {exercise.test_cases_count === 1 ? "teste" : "testes"}
            </Badge>
          )}
          <StatusBadge
            status={exercise.publication_status}
            statusMap={PUBLICATION_STATUS_MAP}
          />
        </Group>
      </Group>
    </Card>
  );
}

const CONTENT_PREVIEW_HEIGHT = 800;

function WrittenContentCard({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);

  if (!content) {
    return (
      <Card withBorder mb="xl" padding="lg" radius="md">
        <Text size="sm" fw={600} mb="sm">Conteúdo Escrito</Text>
        <Text size="sm" c="dimmed">Nenhum conteúdo escrito cadastrado.</Text>
      </Card>
    );
  }

  return (
    <Card withBorder mb="xl" padding="lg" radius="md">
      <Group justify="space-between" align="center" mb="sm">
        <Text size="sm" fw={600}>Conteúdo Escrito</Text>
        <Button
          variant="subtle"
          size="compact-sm"
          rightSection={expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Recolher" : "Ver conteúdo completo"}
        </Button>
      </Group>

      {/* Preview (collapsed) */}
      {!expanded && (
        <Box
          style={{
            position: "relative",
            maxHeight: CONTENT_PREVIEW_HEIGHT,
            overflow: "hidden",
          }}
        >
          <TypographyStylesProvider>
            <Markdown remarkPlugins={[remarkGfm]}>
              {content}
            </Markdown>
          </TypographyStylesProvider>
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
              background: "linear-gradient(transparent, var(--mantine-color-body))",
              pointerEvents: "none",
            }}
          />
        </Box>
      )}

      {/* Full content (expanded) */}
      <Collapse in={expanded}>
        <TypographyStylesProvider>
          <Markdown remarkPlugins={[remarkGfm]}>
            {content}
          </Markdown>
        </TypographyStylesProvider>
      </Collapse>
    </Card>
  );
}
