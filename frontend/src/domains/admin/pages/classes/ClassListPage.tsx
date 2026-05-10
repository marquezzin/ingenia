/**
 * ClassListPage — Lista read-only de turmas para o admin.
 */
import {
  Alert,
  Badge,
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
import { AlertCircle, School, Search, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatusBadge } from "@/shared/ui/components";
import { useClassGroups } from "../../hooks";
import { CLASS_STATUS_MAP } from "../../model";
import type { ClassGroupListItem, ClassStatus } from "../../types";

const PAGE_SIZE = 10;

const BREADCRUMBS = [
  { label: "Admin", href: "/admin" },
  { label: "Turmas" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "ACTIVE", label: "Ativa" },
  { value: "ARCHIVED", label: "Arquivada" },
];

function ClassRow({ classGroup, onView }: { classGroup: ClassGroupListItem; onView: () => void }) {
  return (
    <Card
      withBorder
      padding="sm"
      radius="md"
      onClick={onView}
      style={{
        cursor: "pointer",
        borderColor: "var(--color-border)",
        transition: "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
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
        {/* Left: name + teacher */}
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
            <Text size="xs" c="dimmed" truncate="end">
              Professor: {classGroup.teacher_name}
            </Text>
          </div>
        </Group>

        {/* Right: student count + status */}
        <Group gap="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
          <Badge
            variant="light"
            color="blue"
            size="sm"
            leftSection={<Users size={12} />}
          >
            {classGroup.student_count} {classGroup.student_count === 1 ? "aluno" : "alunos"}
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
    page_size: PAGE_SIZE,
  };

  const { data, isLoading, isError } = useClassGroups(params);

  const classGroups = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 1;

  return (
    <>
      <PageHeader
        title="Turmas"
        subtitle="Visão geral das turmas da plataforma"
        breadcrumbs={BREADCRUMBS}
      />

      {isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar turmas"
          color="red"
          mb="lg"
        >
          Não foi possível carregar a lista de turmas. Tente novamente mais
          tarde.
        </Alert>
      )}

      {/* Search + Filters */}
      <Group mb="lg">
        <TextInput
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
      ) : classGroups.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={60}
          gap="md"
          style={{ opacity: 0.7 }}
        >
          <School
            size={48}
            strokeWidth={1.5}
            style={{ color: "var(--color-text-muted)" }}
          />
          <Text size="lg" fw={500} c="dimmed">
            Nenhuma turma encontrada
          </Text>
          <Text size="sm" c="dimmed">
            As turmas serão exibidas aqui quando forem criadas pelos professores.
          </Text>
        </Flex>
      ) : (
        <Stack gap="xs">
          {classGroups.map((cg) => (
            <ClassRow
              key={cg.id}
              classGroup={cg}
              onView={() => navigate(`/admin/classes/${cg.id}`)}
            />
          ))}
        </Stack>
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
