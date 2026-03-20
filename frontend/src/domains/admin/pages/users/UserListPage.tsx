/**
 * UserListPage — Lista compacta de usuários com filtros e busca.
 */
import {
  ActionIcon,
  Alert,
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
  Tooltip,
} from "@mantine/core";
import {
  AlertCircle,
  Eye,
  Pencil,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatusBadge } from "@/shared/ui/components";
import { useUsers } from "../../hooks";
import { ACCOUNT_STATUS_MAP, ROLE_MAP } from "../../model";
import type { AccountStatus, UserListItem, UserRole } from "../../types";

const BREADCRUMBS = [
  { label: "Admin", href: "/admin" },
  { label: "Usuários" },
];

const ROLE_OPTIONS = [
  { value: "", label: "Todos os perfis" },
  { value: "STUDENT", label: "Aluno" },
  { value: "TEACHER", label: "Professor" },
  { value: "ADMIN", label: "Administrador" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "ACTIVE", label: "Ativo" },
  { value: "INACTIVE", label: "Inativo" },
  { value: "SUSPENDED", label: "Suspenso" },
];

function UserRow({
  user,
  onView,
  onEdit,
}: {
  user: UserListItem;
  onView: () => void;
  onEdit: () => void;
}) {
  return (
    <Card
      withBorder
      padding="sm"
      radius="md"
      onClick={onView}
      style={{
        cursor: "pointer",
        transition:
          "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
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
        {/* Left: name + email */}
        <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            <Text
              fw={600}
              size="sm"
              truncate="end"
              style={{ color: "var(--color-text)" }}
            >
              {user.full_name}
            </Text>
            <Text size="xs" c="dimmed" truncate="end">
              {user.email}
            </Text>
          </div>
        </Group>

        {/* Right: badges + actions */}
        <Group gap="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
          <StatusBadge status={user.role} statusMap={ROLE_MAP} />
          <StatusBadge
            status={user.account_status}
            statusMap={ACCOUNT_STATUS_MAP}
          />
          <Group gap={4}>
            <Tooltip label="Ver detalhes" withArrow>
              <ActionIcon
                variant="light"
                color="blue"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                aria-label="Ver detalhes"
              >
                <Eye size={14} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Editar" withArrow>
              <ActionIcon
                variant="light"
                color="gray"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                aria-label="Editar"
              >
                <Pencil size={14} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Group>
    </Card>
  );
}

export default function UserListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  const params = {
    search: search || undefined,
    role: (roleFilter || undefined) as UserRole | undefined,
    account_status: (statusFilter || undefined) as AccountStatus | undefined,
    page,
  };

  const { data, isLoading, isError } = useUsers(params);

  const users = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  return (
    <>
      <PageHeader
        title="Usuários"
        subtitle="Gerencie os usuários da plataforma"
        breadcrumbs={BREADCRUMBS}
        actions={
          <Button
            leftSection={<Plus size={18} />}
            onClick={() => navigate("/admin/users/new")}
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
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(58, 134, 255, 0.4)";
              const icon = e.currentTarget.querySelector(
                ".mantine-Button-section",
              );
              if (icon instanceof HTMLElement)
                icon.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(58, 134, 255, 0.25)";
              const icon = e.currentTarget.querySelector(
                ".mantine-Button-section",
              );
              if (icon instanceof HTMLElement)
                icon.style.transform = "rotate(0deg)";
            }}
          >
            Novo Usuário
          </Button>
        }
      />

      {isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar usuários"
          color="red"
          mb="lg"
        >
          Não foi possível carregar a lista de usuários. Tente novamente mais
          tarde.
        </Alert>
      )}

      {/* Search + Filters */}
      <Group mb="lg">
        <TextInput
          placeholder="Buscar por nome ou email..."
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
          placeholder="Filtrar por perfil"
          data={ROLE_OPTIONS}
          value={roleFilter}
          onChange={(val) => {
            setRoleFilter(val ?? "");
            setPage(1);
          }}
          clearable
          w={200}
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
      ) : users.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={60}
          gap="md"
          style={{ opacity: 0.7 }}
        >
          <Users
            size={48}
            strokeWidth={1.5}
            style={{ color: "var(--color-text-muted)" }}
          />
          <Text size="lg" fw={500} c="dimmed">
            Nenhum usuário encontrado
          </Text>
          <Text size="sm" c="dimmed">
            Crie um novo usuário para começar.
          </Text>
        </Flex>
      ) : (
        <Stack gap="xs">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onView={() => navigate(`/admin/users/${user.id}`)}
              onEdit={() => navigate(`/admin/users/${user.id}/edit`)}
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
