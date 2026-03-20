/**
 * ModuleDetailPage — Detalhe do módulo com lista de aulas (design aprimorado).
 */
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Edit,
  EyeOff,
  GraduationCap,
  Hash,
  Play,
  Plus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, StatusBadge } from "@/shared/ui/components";
import { useModule, useModuleLessons, useUpdateModule } from "../../hooks";
import { formatDate, PUBLICATION_STATUS_MAP } from "../../model";
import type { LessonListItem, PublicationStatus } from "../../types";

const BREADCRUMBS_BASE = [
  { label: "Admin", href: "/admin" },
  { label: "Módulos", href: "/admin/modules" },
];

export default function ModuleDetailPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { data: module, isLoading, isError } = useModule(moduleId!);
  const { data: lessonsData, isLoading: lessonsLoading } = useModuleLessons(
    moduleId!,
  );
  const updateModule = useUpdateModule();

  const handleTogglePublish = () => {
    if (!module) return;
    const newStatus: PublicationStatus =
      module.publication_status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    updateModule.mutate({
      id: module.id,
      payload: {
        title: module.title,
        description: module.description,
        sequence_order: module.sequence_order,
        publication_status: newStatus,
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

  if (isError || !module) {
    return (
      <Alert
        icon={<AlertCircle size={16} />}
        title="Erro ao carregar módulo"
        color="red"
      >
        Não foi possível carregar os dados do módulo.
      </Alert>
    );
  }

  const breadcrumbs = [
    ...BREADCRUMBS_BASE,
    { label: module.title },
  ];

  const lessons = lessonsData?.results ?? [];

  const isPublished = module.publication_status === "PUBLISHED";

  return (
    <>
      <PageHeader
        title={module.title}
        breadcrumbs={breadcrumbs}
        actions={
          <Group gap="sm">
            <Button
              variant={isPublished ? "light" : "gradient"}
              color={isPublished ? "orange" : undefined}
              gradient={!isPublished ? { from: "teal", to: "green", deg: 135 } : undefined}
              leftSection={isPublished ? <EyeOff size={16} /> : <Check size={16} />}
              onClick={handleTogglePublish}
              loading={updateModule.isPending}
              radius="md"
              styles={{
                root: {
                  transition: "transform 150ms ease, box-shadow 150ms ease",
                },
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {isPublished ? "Despublicar" : "Publicar"}
            </Button>
            <Button
              leftSection={<Edit size={16} />}
              variant="light"
              radius="md"
              onClick={() => navigate(`/admin/modules/${module.id}/edit`)}
              styles={{
                root: {
                  transition: "transform 150ms ease",
                },
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Editar
            </Button>
          </Group>
        }
      />

      {/* Module Info Card */}
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
          {/* Status + Order badge row */}
          <Group justify="space-between">
            <Group gap="sm">
              <Badge
                size="lg"
                radius="md"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan", deg: 135 }}
                style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}
              >
                Módulo {String(module.sequence_order).padStart(2, "0")}
              </Badge>
              <StatusBadge
                status={module.publication_status}
                statusMap={PUBLICATION_STATUS_MAP}
              />
            </Group>
          </Group>

          {/* Description */}
          <Text size="md" style={{ color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            {module.description}
          </Text>

          {/* Stats row */}
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg" mt="xs">
            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                <Hash size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>
                  Ordem
                </Text>
                <Text size="lg" fw={700} lh={1.3}>
                  {module.sequence_order}
                </Text>
              </div>
            </Group>

            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="teal" size="lg" radius="md">
                <BookOpen size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>
                  Aulas
                </Text>
                <Text size="lg" fw={700} lh={1.3}>
                  {module.lesson_count}
                </Text>
              </div>
            </Group>

            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="grape" size="lg" radius="md">
                <Calendar size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>
                  Criado em
                </Text>
                <Text size="sm" fw={600} lh={1.3}>
                  {formatDate(module.created_at)}
                </Text>
              </div>
            </Group>

            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="orange" size="lg" radius="md">
                <Clock size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>
                  Atualizado em
                </Text>
                <Text size="sm" fw={600} lh={1.3}>
                  {formatDate(module.updated_at)}
                </Text>
              </div>
            </Group>
          </SimpleGrid>
        </Stack>
      </Card>

      {/* Lessons Section */}
      <Group justify="space-between" align="center" mb="lg">
        <div>
          <Text size="xl" fw={700} style={{ color: "var(--color-text)" }}>
            Aulas
          </Text>
          <Text size="sm" c="dimmed">
            {lessons.length} {lessons.length === 1 ? "aula" : "aulas"} neste módulo
          </Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          onClick={() => navigate(`/admin/modules/${moduleId}/lessons/new`)}
          variant="gradient"
          gradient={{ from: "blue", to: "cyan", deg: 135 }}
          radius="md"
          styles={{
            root: {
              fontWeight: 600,
              transition: "transform 150ms ease, box-shadow 150ms ease",
              boxShadow: "0 4px 14px rgba(58, 134, 255, 0.25)",
            },
            section: {
              transition: "transform 200ms ease",
            },
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
          Nova Aula
        </Button>
      </Group>

      {/* Lesson Cards */}
      {lessonsLoading ? (
        <Flex justify="center" py="xl">
          <Loader size="md" />
        </Flex>
      ) : lessons.length === 0 ? (
        <Card withBorder padding="xl" radius="md" style={{ borderStyle: "dashed", borderColor: "var(--color-border)" }}>
          <Flex direction="column" align="center" justify="center" py="lg" gap="md" style={{ opacity: 0.7 }}>
            <GraduationCap size={48} strokeWidth={1.5} style={{ color: "var(--color-text-muted)" }} />
            <Text size="lg" fw={500} c="dimmed">
              Nenhuma aula cadastrada
            </Text>
            <Text size="sm" c="dimmed">
              Este módulo ainda não possui aulas. Crie a primeira!
            </Text>
          </Flex>
        </Card>
      ) : (
        <Stack gap="sm">
          {lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              onClick={() =>
                navigate(`/admin/modules/${moduleId}/lessons/${lesson.id}`)
              }
            />
          ))}
        </Stack>
      )}
    </>
  );
}

function LessonRow({
  lesson,
  onClick,
}: {
  lesson: LessonListItem;
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
        {/* Left: order + info */}
        <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          {/* Order circle */}
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
              {String(lesson.sequence_order).padStart(2, "0")}
            </Text>
          </Box>

          {/* Title */}
          <Text fw={600} size="md" truncate="end" style={{ color: "var(--color-text)" }}>
            {lesson.title}
          </Text>
        </Group>

        {/* Right: badges */}
        <Group gap="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
          {lesson.has_video ? (
            <Badge
              leftSection={<Play size={11} />}
              variant="light"
              color="blue"
              size="sm"
              radius="md"
            >
              Vídeo
            </Badge>
          ) : (
            <Badge variant="light" color="gray" size="sm" radius="md">
              Sem vídeo
            </Badge>
          )}
          <StatusBadge
            status={lesson.publication_status}
            statusMap={PUBLICATION_STATUS_MAP}
          />
        </Group>
      </Group>
    </Card>
  );
}
