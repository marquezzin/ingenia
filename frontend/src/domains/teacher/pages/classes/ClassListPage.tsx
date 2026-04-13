/**
 * ClassListPage — Lista de turmas do professor com busca e filtros.
 */
import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Loader,
  Pagination,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  AlertCircle,
  Plus,
  School,
  Search,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EmptyState, PageHeader, StatusBadge } from "@/shared/ui/components";
import type { StatusMap } from "@/shared/ui/components";
import { useTeacherClasses } from "../../hooks";
import type { ClassStatus, TeacherClassListItem } from "../../types";

const BREADCRUMBS = [
  { label: "Professor", href: "/teacher" },
  { label: "Turmas" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "ACTIVE", label: "Ativa" },
  { value: "ARCHIVED", label: "Arquivada" },
];

const CLASS_STATUS_MAP: StatusMap = {
  ACTIVE: { label: "Ativa", color: "green" },
  ARCHIVED: { label: "Arquivada", color: "gray" },
};

function ClassCard({
  classGroup,
  onView,
}: {
  classGroup: TeacherClassListItem;
  onView: () => void;
}) {
  return (
    <Card
      withBorder
      padding="sm"
      radius="md"
      onClick={onView}
      style={{
        cursor: "pointer",
        borderColor: "var(--color-border)",
        transition:
          "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
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
        <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          <School
            size={20}
            strokeWidth={1.5}
            style={{ color: "hsl(var(--brand-primary))", flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <Text
              fw={600}
              size="sm"
              truncate="end"
              style={{ color: "var(--color-text)" }}
            >
              {classGroup.name}
            </Text>
            <Text size="xs" c="dimmed">
              Criada em{" "}
              {new Date(classGroup.created_at).toLocaleDateString("pt-BR")}
            </Text>
          </div>
        </Group>
        <Group gap="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
          <Badge
            variant="light"
            color="blue"
            size="sm"
            leftSection={<Users size={12} />}
          >
            {classGroup.student_count}{" "}
            {classGroup.student_count === 1 ? "aluno" : "alunos"}
          </Badge>
          <StatusBadge
            status={classGroup.class_status}
            statusMap={CLASS_STATUS_MAP}
          />
        </Group>
      </Group>
    </Card>
  );
}

export default function ClassListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  const params = {
    search: search || undefined,
    class_status: (statusFilter || undefined) as ClassStatus | undefined,
    page,
  };

  const { data, isLoading, isError } = useTeacherClasses(params);

  const classes = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  return (
    <Stack gap="lg">
      <PageHeader
        title="Minhas Turmas"
        subtitle="Gerencie suas turmas e acompanhe seus alunos"
        breadcrumbs={BREADCRUMBS}
        actions={
          <Button
            leftSection={<Plus size={16} />}
            onClick={() => navigate("/teacher/classes/new")}
          >
            Nova Turma
          </Button>
        }
      />

      {isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar turmas"
          color="red"
        >
          Não foi possível carregar a lista de turmas. Tente novamente mais
          tarde.
        </Alert>
      )}

      {/* Search + Filters */}
      <Group>
        <TextInput
          id="class-search"
          placeholder="Buscar por nome da turma..."
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
          id="class-status-filter"
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
      ) : classes.length === 0 ? (
        <EmptyState
          title="Nenhuma turma encontrada"
          description={
            search || statusFilter
              ? "Tente ajustar os filtros de busca."
              : "Crie sua primeira turma para começar a acompanhar seus alunos."
          }
          icon={<School size={48} />}
          action={
            !search && !statusFilter ? (
              <Button
                leftSection={<Plus size={16} />}
                onClick={() => navigate("/teacher/classes/new")}
              >
                Nova Turma
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Stack gap="xs">
          {classes.map((cls) => (
            <ClassCard
              key={cls.id}
              classGroup={cls}
              onView={() => navigate(`/teacher/classes/${cls.id}`)}
            />
          ))}
        </Stack>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Flex justify="center" mt="md">
          <Pagination
            value={page}
            total={totalPages}
            onChange={setPage}
            size="sm"
          />
        </Flex>
      )}
    </Stack>
  );
}
