/**
 * ClassDetailPage — Detalhe da turma com tabela de alunos e indicadores de progresso.
 */
import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import {
  AlertCircle,
  Edit,
  GraduationCap,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState, PageHeader, StatCard } from "@/shared/ui/components";
import {
  useClassProgress,
  useTeacherClass,
} from "../../hooks";
import {
  getLearningStatusColor,
  getLearningStatusLabel,
  sortStudentsByAttention,
} from "../../model";

export default function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [studentSearch, setStudentSearch] = useState("");

  const {
    data: classDetail,
    isLoading: isLoadingClass,
    isError: isErrorClass,
  } = useTeacherClass(classId!);

  const {
    data: progress,
    isLoading: isLoadingProgress,
  } = useClassProgress(classId!);

  const isLoading = isLoadingClass || isLoadingProgress;

  const sortedStudents = useMemo(() => {
    if (!progress?.students) return [];
    return sortStudentsByAttention(progress.students);
  }, [progress]);

  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return sortedStudents;
    const query = studentSearch.toLowerCase();
    return sortedStudents.filter(
      (s) =>
        s.student_name.toLowerCase().includes(query) ||
        s.student_email.toLowerCase().includes(query),
    );
  }, [sortedStudents, studentSearch]);

  const BREADCRUMBS = [
    { label: "Professor", href: "/teacher" },
    { label: "Turmas", href: "/teacher/classes" },
    { label: classDetail?.name ?? "Carregando..." },
  ];

  // ─── Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Stack gap="lg">
        <PageHeader
          title="Carregando..."
          breadcrumbs={BREADCRUMBS}
        />
        <SimpleGrid cols={{ base: 1, xs: 3 }}>
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
        </SimpleGrid>
        <Skeleton height={300} radius="md" />
      </Stack>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────
  if (isErrorClass || !classDetail) {
    return (
      <Stack gap="lg">
        <PageHeader title="Turma" breadcrumbs={BREADCRUMBS} />
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar turma"
          color="red"
        >
          Não foi possível carregar os dados desta turma. Verifique se a turma
          existe ou tente novamente mais tarde.
        </Alert>
      </Stack>
    );
  }

  const totalStudents = progress?.total_students ?? classDetail.student_count;
  const studentsStarted = progress?.students_started ?? 0;
  const studentsCompleted = progress?.students_completed ?? 0;

  return (
    <Stack gap="lg">
      <PageHeader
        title={classDetail.name}
        subtitle={
          classDetail.description ||
          `Criada em ${new Date(classDetail.created_at).toLocaleDateString("pt-BR")}`
        }
        breadcrumbs={BREADCRUMBS}
        actions={
          <Button
            variant="light"
            leftSection={<Edit size={16} />}
            onClick={() => navigate(`/teacher/classes/${classId}/edit`)}
          >
            Editar Turma
          </Button>
        }
      />

      {/* ── Stats ──────────────────────────────────────────── */}
      <SimpleGrid cols={{ base: 1, xs: 3 }}>
        <StatCard
          title="Total de Alunos"
          value={totalStudents}
          icon={<Users size={22} />}
          color="blue"
        />
        <StatCard
          title="Iniciaram Trilha"
          value={studentsStarted}
          icon={<GraduationCap size={22} />}
          color="teal"
        />
        <StatCard
          title="Concluíram"
          value={studentsCompleted}
          icon={<TrendingUp size={22} />}
          color="green"
        />
      </SimpleGrid>

      {/* ── Students Table ─────────────────────────────────── */}
      <Card withBorder radius="md" padding="lg">
        <Group justify="space-between" mb="md">
          <div>
            <Text fw={600} size="lg">
              Alunos da Turma
            </Text>
            <Text size="sm" c="dimmed">
              {totalStudents}{" "}
              {totalStudents === 1 ? "aluno matriculado" : "alunos matriculados"}
            </Text>
          </div>
          {totalStudents > 0 && (
            <TextInput
              id="student-filter"
              placeholder="Buscar aluno..."
              leftSection={<Search size={16} />}
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.currentTarget.value)}
              w={260}
            />
          )}
        </Group>

        {totalStudents === 0 ? (
          <EmptyState
            title="Nenhum aluno matriculado"
            description="Adicione alunos a esta turma para acompanhar o progresso."
            icon={<GraduationCap size={48} />}
            action={
              <Button
                variant="light"
                leftSection={<Edit size={16} />}
                onClick={() => navigate(`/teacher/classes/${classId}/edit`)}
              >
                Editar Turma
              </Button>
            }
          />
        ) : filteredStudents.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="xl">
            Nenhum aluno encontrado para "{studentSearch}".
          </Text>
        ) : (
          <Table highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Módulos</Table.Th>
                <Table.Th>Exercícios</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredStudents.map((student) => (
                <Table.Tr key={student.student_profile_id}>
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
