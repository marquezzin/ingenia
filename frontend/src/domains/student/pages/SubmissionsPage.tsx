/**
 * SubmissionsPage — Tela de histórico geral de submissões do aluno.
 *
 * Exibe tabela de todas as submissões com filtros por status,
 * link para reabrir exercício e modal de detalhe do feedback.
 *
 * URL: /student/submissions
 */

import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import {
  AlertCircle,
  BookOpen,
  Clock,
  FileCode2,
} from "lucide-react";

import { PageHeader } from "@/shared/ui/components";
import { EmptyState } from "@/shared/ui/components";
import { DataTable, type DataTableColumn } from "@/shared/ui/components/DataTable";
import type { SubmissionHistoryItem } from "../types";
import { useSubmissionHistory } from "../hooks/useSubmissionHistory";
import { useStudentModules } from "../hooks/useStudentModules";
import { SubmissionDetailModal } from "../ui/SubmissionDetailModal";

const BREADCRUMBS = [
  { label: "Aluno", href: "/student" },
  { label: "Histórico de Submissões" },
];

const STATUS_FILTER_OPTIONS = [
  { label: "Todas", value: "all" },
  { label: "✅ Aprovadas", value: "PASSED" },
  { label: "❌ Reprovadas", value: "FAILED" },
];

const RESULT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  PASSED: { label: "Aprovado", color: "green" },
  FAILED: { label: "Reprovado", color: "red" },
  ERROR: { label: "Erro", color: "orange" },
};

export default function SubmissionsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionHistoryItem | null>(null);

  const filters = useMemo(
    () => ({
      ...(statusFilter !== "all" && { result_status: statusFilter }),
      ...(moduleFilter && { module_id: moduleFilter }),
      page,
    }),
    [statusFilter, moduleFilter, page],
  );

  const { data, isLoading, isError } = useSubmissionHistory(filters);
  const { data: modulesData } = useStudentModules();

  const moduleOptions = useMemo(
    () =>
      (modulesData?.results ?? []).map((m) => ({
        value: m.id,
        label: m.title,
      })),
    [modulesData],
  );

  const submissions = useMemo(() => data?.results ?? [], [data]);
  const totalPages = useMemo(() => {
    if (!data?.count) return 1;
    return Math.ceil(data.count / 10); // default page size
  }, [data]);

  // Columns for the DataTable
  const columns: DataTableColumn<SubmissionHistoryItem>[] = useMemo(
    () => [
      {
        key: "exercise_title",
        label: "Exercício",
        render: (row: SubmissionHistoryItem) => (
          <Stack gap={2}>
            <Text size="sm" fw={500} lineClamp={1}>
              {row.exercise_title}
            </Text>
            <Group gap={6} wrap="nowrap">
              <BookOpen size={12} color="var(--mantine-color-dimmed)" />
              <Text size="xs" c="dimmed" lineClamp={1}>
                {row.module_title} • {row.lesson_title}
              </Text>
            </Group>
          </Stack>
        ),
      },
      {
        key: "submitted_at",
        label: "Data",
        sortable: true,
        render: (row: SubmissionHistoryItem) => (
          <Group gap={4} wrap="nowrap">
            <Clock size={14} color="var(--mantine-color-dimmed)" />
            <Text size="sm" c="dimmed">
              {new Date(row.submitted_at).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Group>
        ),
      },
      {
        key: "score_percentage",
        label: "Score",
        width: 100,
        render: (row: SubmissionHistoryItem) => {
          const score = parseFloat(row.score_percentage);
          const color =
            score >= 100 ? "green" : score > 0 ? "yellow" : "red";
          return (
            <Badge color={color} variant="light" size="md">
              {score.toFixed(0)}%
            </Badge>
          );
        },
      },
      {
        key: "evaluation_status",
        label: "Status",
        width: 120,
        render: (row: SubmissionHistoryItem) => {
          const resultStatus = row.result?.result_status ?? row.evaluation_status;
          const config = RESULT_STATUS_MAP[resultStatus] ?? {
            label: resultStatus,
            color: "gray",
          };
          return (
            <Badge color={config.color} variant="light" size="sm">
              {config.label}
            </Badge>
          );
        },
      },
    ],
    [],
  );

  // Handle filter change — reset page
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  // ─── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <>
        <PageHeader
          title="Histórico de Submissões"
          subtitle="Suas submissões de código"
          breadcrumbs={BREADCRUMBS}
        />
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar histórico"
          color="red"
        >
          Não foi possível carregar seu histórico de submissões. Tente novamente
          mais tarde.
        </Alert>
      </>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Stack gap="lg">
      <PageHeader
        title="Histórico de Submissões 📝"
        subtitle="Revise suas tentativas e feedbacks recebidos"
        breadcrumbs={BREADCRUMBS}
      />

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <Group gap="md" wrap="wrap">
        <SegmentedControl
          value={statusFilter}
          onChange={handleFilterChange}
          data={STATUS_FILTER_OPTIONS}
          size="sm"
        />
        <Select
          placeholder="Todos os módulos"
          value={moduleFilter}
          onChange={(value) => {
            setModuleFilter(value);
            setPage(1);
          }}
          data={moduleOptions}
          clearable
          searchable
          size="sm"
          miw={260}
          maw={420}
          style={{ flex: 1 }}
          leftSection={<BookOpen size={14} />}
        />
      </Group>

      {/* ── Data Table ───────────────────────────────────────────────── */}
      <DataTable
        columns={columns}
        data={submissions as unknown as Record<string, unknown>[]}
        loading={isLoading}
        rowKey={(row) => row.id as string}
        onRowClick={(row) =>
          setSelectedSubmission(row as unknown as SubmissionHistoryItem)
        }
        pagination={
          totalPages > 1
            ? { page, total: totalPages, onChange: setPage }
            : undefined
        }
        emptyState={{
          title: "Nenhuma submissão encontrada",
          description:
            statusFilter !== "all" || moduleFilter
              ? "Tente mudar os filtros para ver mais resultados."
              : "Quando você resolver exercícios, suas submissões aparecerão aqui.",
          icon: <FileCode2 size={48} />,
        }}
      />

      {/* ── Detail Modal ─────────────────────────────────────────────── */}
      <SubmissionDetailModal
        submission={selectedSubmission}
        opened={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </Stack>
  );
}
