/**
 * StudentListPage — Lista consolidada de alunos do professor.
 *
 * Visão transversal de todos os alunos ligados às turmas do professor,
 * com filtros por turma e status de progresso.
 *
 * URL: /teacher/students
 */
import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Card,
  Group,
  Select,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useQueries } from "@tanstack/react-query";
import {
  AlertCircle,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EmptyState, PageHeader, StatCard } from "@/shared/ui/components";
import { getClassProgressApi } from "../../api";
import { useTeacherClasses } from "../../hooks";
import {
  getLearningStatusColor,
  getLearningStatusLabel,
  sortStudentsByAttention,
} from "../../model";
import type { StudentProgressSummary } from "../../types";

const BREADCRUMBS = [
  { label: "Professor", href: "/teacher" },
  { label: "Alunos" },
];

/** Enriched student with class context. */
interface StudentWithClass extends StudentProgressSummary {
  class_id: string;
  class_name: string;
}

export default function StudentListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // ─── Data fetching ────────────────────────────────────────────────
  const {
    data: classesData,
    isLoading: isLoadingClasses,
    isError: isErrorClasses,
  } = useTeacherClasses();

  const classes = useMemo(
    () => classesData?.results ?? [],
    [classesData],
  );

  // Fetch progress for each class using useQueries
  const progressQueries = useQueries({
    queries: classes.map((cls) => ({
      queryKey: ["teacher", "classes", cls.id, "progress"] as const,
      queryFn: () => getClassProgressApi(cls.id),
      enabled: !!cls.id,
    })),
  });

  const isLoading =
    isLoadingClasses || progressQueries.some((q) => q.isLoading);
  const isError = isErrorClasses;

  // ─── Merge students from all classes ──────────────────────────────
  const allStudents = useMemo(() => {
    const students: StudentWithClass[] = [];
    const seenKeys = new Set<string>();

    progressQueries.forEach((query, index) => {
      if (!query.data?.students) return;
      const cls = classes[index];
      if (!cls) return;

      for (const student of query.data.students) {
        const key = `${student.student_profile_id}-${cls.id}`;
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);

        students.push({
          ...student,
          class_id: cls.id,
          class_name: cls.name,
        });
      }
    });

    return students;
  }, [progressQueries, classes]);

  // ─── Filtering ────────────────────────────────────────────────────
  const filteredStudents = useMemo(() => {
    let result = allStudents;

    if (classFilter) {
      result = result.filter((s) => s.class_id === classFilter);
    }

    if (statusFilter) {
      result = result.filter((s) => s.learning_status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.student_name.toLowerCase().includes(query) ||
          s.student_email.toLowerCase().includes(query),
      );
    }

    return sortStudentsByAttention(
      result as StudentProgressSummary[],
    ) as StudentWithClass[];
  }, [allStudents, classFilter, statusFilter, searchQuery]);

  // ─── Stats ────────────────────────────────────────────────────────
  const totalStudents = allStudents.length;
  const uniqueStudents = new Set(
    allStudents.map((s) => s.student_profile_id),
  ).size;
  const studentsStarted = new Set(
    allStudents
      .filter((s) => s.learning_status !== "NOT_STARTED")
      .map((s) => s.student_profile_id),
  ).size;
  const studentsCompleted = new Set(
    allStudents
      .filter((s) => s.learning_status === "COMPLETED")
      .map((s) => s.student_profile_id),
  ).size;

  // Class filter options
  const classOptions = useMemo(
    () =>
      classes.map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [classes],
  );

  const statusOptions = [
    { value: "NOT_STARTED", label: "Não iniciou" },
    { value: "IN_PROGRESS", label: "Em andamento" },
    { value: "COMPLETED", label: "Concluído" },
  ];

  // ─── Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Stack gap="lg">
        <PageHeader title="Alunos" breadcrumbs={BREADCRUMBS} />
        <Skeleton height={120} radius="md" />
        <Skeleton height={400} radius="md" />
      </Stack>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────
  if (isError) {
    return (
      <Stack gap="lg">
        <PageHeader title="Alunos" breadcrumbs={BREADCRUMBS} />
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar alunos"
          color="red"
        >
          Não foi possível carregar os dados dos alunos. Tente novamente mais
          tarde.
        </Alert>
      </Stack>
    );
  }

  // ─── Empty ────────────────────────────────────────────────────────
  if (totalStudents === 0) {
    return (
      <Stack gap="lg">
        <PageHeader
          title="Alunos"
          subtitle="Visão consolidada de todos os alunos"
          breadcrumbs={BREADCRUMBS}
        />
        <EmptyState
          title="Nenhum aluno vinculado"
          description="Adicione alunos às suas turmas para acompanhar o progresso."
          icon={<GraduationCap size={48} />}
        />
      </Stack>
    );
  }

  // ─── Success ──────────────────────────────────────────────────────
  return (
    <Stack gap="lg">
      <PageHeader
        title="Alunos"
        subtitle="Visão consolidada de todos os alunos acompanhados"
        breadcrumbs={BREADCRUMBS}
      />

      {/* ── Stats ──────────────────────────────────────────────── */}
      <Group grow>
        <StatCard
          title="Alunos únicos"
          value={uniqueStudents}
          icon={<Users size={22} />}
          color="blue"
        />
        <StatCard
          title="Iniciaram trilha"
          value={studentsStarted}
          icon={<GraduationCap size={22} />}
          color="teal"
        />
        <StatCard
          title="Concluíram"
          value={studentsCompleted}
          icon={<GraduationCap size={22} />}
          color="green"
        />
      </Group>

      {/* ── Students Table ──────────────────────────────────────── */}
      <Card withBorder radius="md" padding="lg">
        <Group justify="space-between" mb="md" wrap="wrap">
          <div>
            <Text fw={600} size="lg">
              Todos os Alunos
            </Text>
            <Text size="sm" c="dimmed">
              {filteredStudents.length} de {totalStudents} registros
            </Text>
          </div>
          <Group gap="sm" wrap="wrap">
            <TextInput
              id="student-search"
              placeholder="Buscar aluno..."
              leftSection={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              w={220}
            />
            <Select
              id="filter-class"
              placeholder="Filtrar por turma"
              data={classOptions}
              value={classFilter}
              onChange={setClassFilter}
              clearable
              w={200}
            />
            <Select
              id="filter-status"
              placeholder="Filtrar por status"
              data={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              clearable
              w={180}
            />
          </Group>
        </Group>

        {filteredStudents.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="xl">
            Nenhum aluno encontrado com os filtros selecionados.
          </Text>
        ) : (
          <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Turma</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Módulos</Table.Th>
                <Table.Th>Exercícios</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredStudents.map((student) => (
                <Table.Tr
                  key={`${student.student_profile_id}-${student.class_id}`}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(
                      `/teacher/classes/${student.class_id}/students/${student.student_profile_id}`,
                    )
                  }
                >
                  <Table.Td>
                    <Text fw={500} size="sm">
                      {student.student_name}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {student.student_email}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="outline" size="sm">
                      {student.class_name}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={getLearningStatusColor(student.learning_status)}
                      size="sm"
                    >
                      {getLearningStatusLabel(student.learning_status)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{student.modules_completed}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{student.exercises_completed}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </Stack>
  );
}
