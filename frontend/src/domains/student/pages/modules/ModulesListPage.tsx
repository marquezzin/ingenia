/**
 * ModulesListPage — Lista de módulos para o aluno.
 *
 * Exibe todos os módulos publicados com busca por nome,
 * filtro por status de progresso e indicadores visuais.
 */
import { useMemo, useState } from "react";
import {
  Alert,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  AlertCircle,
  BookOpen,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/shared/ui/components";
import { EmptyState } from "@/shared/ui/components";
import { useStudentModules } from "../../hooks/useStudentModules";
import { useStudentProgress } from "../../hooks/useStudentProgress";
import type { ModuleProgressSummary, ProgressStatus } from "../../types";
import { ModuleCard } from "../../ui/ModuleCard";
import { ModulesListSkeleton } from "../../ui/ModulesListSkeleton";

const BREADCRUMBS = [
  { label: "Aluno", href: "/student" },
  { label: "Módulos" },
];

type FilterOption = "ALL" | ProgressStatus;

const FILTER_OPTIONS: { label: string; value: FilterOption }[] = [
  { label: "Todos", value: "ALL" },
  { label: "Não iniciados", value: "NOT_STARTED" },
  { label: "Em andamento", value: "IN_PROGRESS" },
  { label: "Concluídos", value: "COMPLETED" },
];

export default function ModulesListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("ALL");

  const {
    data: modulesData,
    isLoading: modulesLoading,
    isError: modulesError,
  } = useStudentModules();

  const {
    data: progressData,
    isLoading: progressLoading,
    isError: progressError,
  } = useStudentProgress();

  const isLoading = modulesLoading || progressLoading;
  const isError = modulesError || progressError;

  const modules = useMemo(
    () => modulesData?.results ?? [],
    [modulesData],
  );

  const progressList = useMemo(
    () => progressData?.results ?? [],
    [progressData],
  );

  // Build a map of moduleId → progress
  const progressMap = useMemo(() => {
    const map = new Map<string, ModuleProgressSummary>();
    for (const p of progressList) {
      map.set(p.module_id, p);
    }
    return map;
  }, [progressList]);

  // Compute completion % for a module
  const getModulePercent = (moduleId: string): number => {
    const p = progressMap.get(moduleId);
    if (!p || p.total_lessons === 0) return 0;
    return Math.round((p.completed_lessons / p.total_lessons) * 100);
  };

  // Filtered and searched modules
  const filteredModules = useMemo(() => {
    let result = [...modules].sort(
      (a, b) => a.sequence_order - b.sequence_order,
    );

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q),
      );
    }

    // Progress filter
    if (filter !== "ALL") {
      result = result.filter((m) => {
        const status = m.progress?.progress_status ?? "NOT_STARTED";
        return status === filter;
      });
    }

    return result;
  }, [modules, search, filter]);

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Módulos"
          subtitle="Explore todos os módulos da trilha"
          breadcrumbs={BREADCRUMBS}
        />
        <ModulesListSkeleton />
      </>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <>
        <PageHeader
          title="Módulos"
          subtitle="Explore todos os módulos da trilha"
          breadcrumbs={BREADCRUMBS}
        />
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar módulos"
          color="red"
        >
          Não foi possível carregar a lista de módulos. Tente novamente mais
          tarde.
        </Alert>
      </>
    );
  }

  // ─── Empty (no modules at all) ────────────────────────────────────────────
  if (modules.length === 0) {
    return (
      <>
        <PageHeader
          title="Módulos"
          subtitle="Explore todos os módulos da trilha"
          breadcrumbs={BREADCRUMBS}
        />
        <EmptyState
          title="Nenhum módulo disponível"
          description="Os módulos serão adicionados em breve pelo administrador. Volte mais tarde!"
          icon={<BookOpen size={48} />}
        />
      </>
    );
  }

  // ─── Success ──────────────────────────────────────────────────────────────
  return (
    <Stack gap="lg">
      <PageHeader
        title="Módulos"
        subtitle={`${modules.length} ${modules.length === 1 ? "módulo disponível" : "módulos disponíveis"} na trilha`}
        breadcrumbs={BREADCRUMBS}
      />

      {/* ── Search + Filters ──────────────────────────────────────────── */}
      <Group gap="md" align="flex-end" wrap="wrap">
        <TextInput
          placeholder="Buscar módulo por nome..."
          leftSection={<Search size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ flex: 1, minWidth: 200 }}
          id="module-search-input"
        />
        <SegmentedControl
          data={FILTER_OPTIONS}
          value={filter}
          onChange={(val) => setFilter(val as FilterOption)}
          size="sm"
          id="module-progress-filter"
        />
      </Group>

      {/* ── Results ───────────────────────────────────────────────────── */}
      {filteredModules.length === 0 ? (
        <EmptyState
          title="Nenhum módulo encontrado"
          description={
            search.trim()
              ? `Nenhum resultado para "${search.trim()}". Tente outra busca.`
              : "Nenhum módulo nesta categoria."
          }
          icon={<Search size={48} />}
        />
      ) : (
        <>
          <Text size="sm" c="dimmed">
            {filteredModules.length}{" "}
            {filteredModules.length === 1
              ? "módulo encontrado"
              : "módulos encontrados"}
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {filteredModules.map((mod) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                completionPercent={getModulePercent(mod.id)}
                onClick={() => navigate(`/student/modules/${mod.id}`)}
              />
            ))}
          </SimpleGrid>
        </>
      )}
    </Stack>
  );
}
