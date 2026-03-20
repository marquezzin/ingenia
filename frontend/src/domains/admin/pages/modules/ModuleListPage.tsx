/**
 * ModuleListPage — Lista de módulos com busca, filtro e paginação.
 */
import { ActionIcon, Alert, Button, Group, Select, TextInput, Tooltip } from "@mantine/core";
import { AlertCircle, Eye, Pencil, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/shared/ui/components";
import { PageHeader } from "@/shared/ui/components";
import { StatusBadge } from "@/shared/ui/components";
import { useModules } from "../../hooks";
import { PUBLICATION_STATUS_MAP } from "../../model";
import type { ModuleListItem, PublicationStatus } from "../../types";

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

export default function ModuleListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState<string | undefined>(undefined);

  const params = {
    search: search || undefined,
    publication_status: (statusFilter || undefined) as PublicationStatus | undefined,
    page,
    ordering,
  };

  const { data, isLoading, isError } = useModules(params);

  const modules = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setOrdering(direction === "desc" ? `-${key}` : key);
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="Módulos"
        subtitle="Gerencie os módulos da trilha de aprendizagem"
        breadcrumbs={BREADCRUMBS}
        actions={
          <Button
            leftSection={<Plus size={16} />}
            onClick={() => navigate("/admin/modules/new")}
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
          Não foi possível carregar a lista de módulos. Tente novamente mais
          tarde.
        </Alert>
      )}

      {/* Search + Filter inline */}
      <Group mb="md">
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

      <DataTable<ModuleListItem>
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
            key: "actions",
            label: "Ações",
            width: 100,
            render: (row) => (
              <Group gap={4}>
                <Tooltip label="Ver detalhes" withArrow>
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/modules/${row.id}`);
                    }}
                    aria-label="Ver detalhes"
                  >
                    <Eye size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Editar" withArrow>
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/modules/${row.id}/edit`);
                    }}
                    aria-label="Editar"
                  >
                    <Pencil size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            ),
          },
        ]}
        data={modules}
        loading={isLoading}
        rowKey={(row) => row.id}
        onRowClick={(row) => navigate(`/admin/modules/${row.id}`)}
        onSort={handleSort}
        pagination={{
          page,
          total: totalPages,
          onChange: setPage,
        }}
        emptyState={{
          title: "Nenhum módulo encontrado",
          description: "Crie um novo módulo para começar.",
        }}
      />
    </>
  );
}
