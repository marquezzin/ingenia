/**
 * ModuleDetailPage — Detalhe do módulo com lista de aulas.
 */
import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  SimpleGrid,
  Text,
} from "@mantine/core";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  Check,
  Edit,
  EyeOff,
  Hash,
  Video,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { DataTable, PageHeader, StatusBadge } from "@/shared/ui/components";
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
      <Group justify="center" py="xl">
        <Loader />
      </Group>
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

  return (
    <>
      <PageHeader
        title={module.title}
        breadcrumbs={breadcrumbs}
        actions={
          <Group gap="xs">
            <Button
              variant="light"
              color={module.publication_status === "PUBLISHED" ? "orange" : "green"}
              leftSection={module.publication_status === "PUBLISHED" ? <EyeOff size={16} /> : <Check size={16} />}
              onClick={handleTogglePublish}
              loading={updateModule.isPending}
            >
              {module.publication_status === "PUBLISHED"
                ? "Despublicar"
                : "Publicar"}
            </Button>
            <Button
              leftSection={<Edit size={16} />}
              variant="light"
              onClick={() => navigate(`/admin/modules/${module.id}/edit`)}
            >
              Editar
            </Button>
          </Group>
        }
      />

      {/* Module Info */}
      <Card withBorder mb="lg" padding="lg">
        <Text size="sm" c="dimmed" mb="xs">
          Descrição
        </Text>
        <Text mb="md">{module.description}</Text>

        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          <Group gap="xs">
            <Hash size={16} color="var(--mantine-color-dimmed)" />
            <div>
              <Text size="xs" c="dimmed">
                Ordem
              </Text>
              <Text size="sm" fw={600}>
                {module.sequence_order}
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            <BookOpen size={16} color="var(--mantine-color-dimmed)" />
            <div>
              <Text size="xs" c="dimmed">
                Aulas
              </Text>
              <Text size="sm" fw={600}>
                {module.lesson_count}
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
                {formatDate(module.created_at)}
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
                {formatDate(module.updated_at)}
              </Text>
            </div>
          </Group>
        </SimpleGrid>

        <Group mt="md">
          <StatusBadge
            status={module.publication_status}
            statusMap={PUBLICATION_STATUS_MAP}
          />
        </Group>
      </Card>

      {/* Lessons List */}
      <PageHeader title="Aulas" subtitle={`${lessons.length} aula(s) neste módulo`} />

      <DataTable<LessonListItem>
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
            key: "has_video",
            label: "Vídeo",
            width: 80,
            render: (row) =>
              row.has_video ? (
                <Badge
                  leftSection={<Video size={12} />}
                  variant="light"
                  color="blue"
                  size="sm"
                >
                  Sim
                </Badge>
              ) : (
                <Text size="sm" c="dimmed">
                  —
                </Text>
              ),
          },
        ]}
        data={lessons}
        loading={lessonsLoading}
        rowKey={(row) => row.id}
        emptyState={{
          title: "Nenhuma aula cadastrada",
          description: "Este módulo ainda não possui aulas.",
        }}
      />
    </>
  );
}
