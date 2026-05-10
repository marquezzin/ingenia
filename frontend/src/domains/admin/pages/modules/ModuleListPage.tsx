/**
 * ModuleListPage — Lista de módulos com design de cards rico.
 */
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Loader,
  Pagination,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  AlertCircle,
  BookOpen,
  Eye,
  GraduationCap,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/shared/ui/components";
import { StatusBadge } from "@/shared/ui/components";
import { useModules } from "../../hooks";
import { PUBLICATION_STATUS_MAP } from "../../model";
import type { ModuleListItem, PublicationStatus } from "../../types";

const PAGE_SIZE = 10;

const BREADCRUMBS = [
  { label: "Admin", href: "/admin" },
  { label: "Módulos" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "DRAFT", label: "Rascunho" },
  { value: "PUBLISHED", label: "Publicado" },
  { value: "ARCHIVED", label: "Arquivado" },
];

function ModuleCard({ module, onView, onEdit }: {
  module: ModuleListItem;
  onView: () => void;
  onEdit: () => void;
}) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={onView}
      style={{
        cursor: "pointer",
        transition: "transform 150ms ease, box-shadow 150ms ease",
        borderColor: "var(--color-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        e.currentTarget.style.borderColor = "hsl(var(--brand-primary))";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
    >
      <Stack gap="sm">
        {/* Header: order badge + status */}
        <Group justify="space-between" align="center">
          <Badge
            size="lg"
            radius="md"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 135 }}
            style={{ fontWeight: 700, fontSize: "var(--text-sm)", minWidth: 45 }}
          >
            {String(module.sequence_order).padStart(2, "0")}
          </Badge>
          <StatusBadge
            status={module.publication_status}
            statusMap={PUBLICATION_STATUS_MAP}
          />
        </Group>

        {/* Title */}
        <Text fw={600} size="lg" lineClamp={1} style={{ color: "var(--color-text)" }}>
          {module.title}
        </Text>

        {/* Description */}
        <Text size="sm" c="dimmed" lineClamp={2} style={{ minHeight: 40 }}>
          {module.description}
        </Text>

        {/* Footer: lesson count + actions */}
        <Group justify="space-between" align="center" mt="xs">
          <Group gap={6}>
            <BookOpen size={15} style={{ color: "hsl(var(--brand-primary))" }} />
            <Text size="sm" fw={500} c="dimmed">
              {module.lesson_count} {module.lesson_count === 1 ? "aula" : "aulas"}
            </Text>
          </Group>

          <Group gap={4}>
            <Tooltip label="Ver detalhes" withArrow>
              <ActionIcon
                variant="light"
                color="blue"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                aria-label="Ver detalhes"
              >
                <Eye size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Editar" withArrow>
              <ActionIcon
                variant="light"
                color="gray"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                aria-label="Editar"
              >
                <Pencil size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}

export default function ModuleListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [ordering] = useState<string | undefined>(undefined);

  const params = {
    search: search || undefined,
    publication_status: (statusFilter || undefined) as PublicationStatus | undefined,
    page,
    page_size: PAGE_SIZE,
    ordering,
  };

  const { data, isLoading, isError } = useModules(params);

  const modules = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 1;

  return (
    <>
      <PageHeader
        title="Módulos"
        subtitle="Gerencie os módulos da trilha de aprendizagem"
        breadcrumbs={BREADCRUMBS}
        actions={
          <Button
            leftSection={<Plus size={18} />}
            onClick={() => navigate("/admin/modules/new")}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 135 }}
            size="md"
            radius="md"
            styles={{
              root: {
                fontWeight: 600,
                letterSpacing: "0.02em",
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
            Novo Módulo
          </Button>
        }
      />

      {isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar módulos"
          color="red"
          mb="lg"
        >
          Não foi possível carregar a lista de módulos. Tente novamente
          mais tarde.
        </Alert>
      )}

      {/* Search + Filter */}
      <Group mb="lg">
        <TextInput
          placeholder="Buscar por título..."
          leftSection={<Search size={16} />}
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
            setPage(1);
          }}
          maw={360}
          style={{ flex: 1, maxWidth: 360 }}
        />
        <Select
          placeholder="Filtrar por status"
          data={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val ?? "");
            setPage(1);
          }}
          clearable
          w={200}
        />
      </Group>

      {/* Content */}
      {isLoading ? (
        <Flex justify="center" py="xl">
          <Loader size="md" />
        </Flex>
      ) : modules.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={60}
          gap="md"
          style={{ opacity: 0.7 }}
        >
          <GraduationCap size={48} strokeWidth={1.5} style={{ color: "var(--color-text-muted)" }} />
          <Text size="lg" fw={500} c="dimmed">
            Nenhum módulo encontrado
          </Text>
          <Text size="sm" c="dimmed">
            Crie um novo módulo para começar a trilha.
          </Text>
        </Flex>
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing="lg"
        >
          {modules.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              onView={() => navigate(`/admin/modules/${mod.id}`)}
              onEdit={() => navigate(`/admin/modules/${mod.id}/edit`)}
            />
          ))}
        </SimpleGrid>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Flex justify="center" mt="xl">
          <Pagination
            value={page}
            total={totalPages}
            onChange={setPage}
            size="sm"
          />
        </Flex>
      )}
    </>
  );
}
