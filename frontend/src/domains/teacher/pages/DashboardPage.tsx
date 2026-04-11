/**
 * Teacher Dashboard Page — Visão consolidada das turmas e desempenho dos alunos.
 *
 * Exibe cards-resumo (turmas, alunos), lista resumida de turmas
 * e atalhos para ações rápidas.
 */
import { useMemo } from "react";
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
  Title,
} from "@mantine/core";
import {
  AlertCircle,
  GraduationCap,
  Plus,
  School,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMe } from "@/domains/auth/hooks";
import { EmptyState, PageHeader, StatCard } from "@/shared/ui/components";
import { useTeacherClasses } from "../hooks";

const BREADCRUMBS = [
  { label: "Professor", href: "/teacher" },
  { label: "Dashboard" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: user } = useMe();

  const {
    data: classesData,
    isLoading,
    isError,
  } = useTeacherClasses();

  const classes = useMemo(
    () => classesData?.results ?? [],
    [classesData],
  );

  // Aggregate metrics from class list data
  const totalClasses = classes.length;
  const totalStudents = useMemo(
    () => classes.reduce((sum, c) => sum + c.student_count, 0),
    [classes],
  );
  const activeClasses = useMemo(
    () => classes.filter((c) => c.class_status === "ACTIVE").length,
    [classes],
  );

  const firstName = user?.fullName?.split(" ")[0] ?? "Professor";

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Stack gap="lg">
        <PageHeader
          title={`Olá, ${firstName}!`}
          subtitle="Carregando seu painel..."
          breadcrumbs={BREADCRUMBS}
        />
        <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
        </SimpleGrid>
        <Skeleton height={200} radius="md" />
      </Stack>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <Stack gap="lg">
        <PageHeader
          title={`Olá, ${firstName}!`}
          subtitle="Seu painel de acompanhamento"
          breadcrumbs={BREADCRUMBS}
        />
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar dados"
          color="red"
        >
          Não foi possível carregar os dados do painel. Tente novamente mais
          tarde.
        </Alert>
      </Stack>
    );
  }

  // ─── Empty (no classes) ───────────────────────────────────────────────────
  if (classes.length === 0) {
    return (
      <Stack gap="lg">
        <PageHeader
          title={`Olá, ${firstName}! 👋`}
          subtitle="Seu painel de acompanhamento"
          breadcrumbs={BREADCRUMBS}
        />
        <EmptyState
          title="Nenhuma turma cadastrada"
          description="Crie sua primeira turma para começar a acompanhar o progresso dos seus alunos."
          icon={<School size={48} />}
          action={
            <Button
              leftSection={<Plus size={16} />}
              onClick={() => navigate("/teacher/classes/new")}
            >
              Nova Turma
            </Button>
          }
        />
      </Stack>
    );
  }

  // ─── Success ──────────────────────────────────────────────────────────────
  return (
    <Stack gap="lg">
      <PageHeader
        title={`Olá, ${firstName}! 👋`}
        subtitle="Seu painel de acompanhamento"
        breadcrumbs={BREADCRUMBS}
      />

      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
        <StatCard
          title="Turmas"
          value={totalClasses}
          icon={<School size={22} />}
          color="brand"
        />
        <StatCard
          title="Turmas ativas"
          value={activeClasses}
          icon={<School size={22} />}
          color="teal"
        />
        <StatCard
          title="Alunos acompanhados"
          value={totalStudents}
          icon={<GraduationCap size={22} />}
          color="grape"
        />
        <StatCard
          title="Média alunos/turma"
          value={totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0}
          icon={<Users size={22} />}
          color="orange"
        />
      </SimpleGrid>

      {/* ── Class List Summary ─────────────────────────────────────────── */}
      <Card withBorder radius="md" padding="lg">
        <Group justify="space-between" mb="md">
          <div>
            <Title order={4}>Minhas Turmas</Title>
            <Text size="sm" c="dimmed">
              {classes.length}{" "}
              {classes.length === 1 ? "turma cadastrada" : "turmas cadastradas"}
            </Text>
          </div>
          <Button
            variant="light"
            leftSection={<Plus size={16} />}
            onClick={() => navigate("/teacher/classes/new")}
          >
            Nova Turma
          </Button>
        </Group>

        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Alunos</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {classes.slice(0, 5).map((cls) => (
              <Table.Tr
                key={cls.id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/teacher/classes/${cls.id}`)}
              >
                <Table.Td>
                  <Text fw={500}>{cls.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={cls.class_status === "ACTIVE" ? "green" : "gray"}
                    variant="light"
                    size="sm"
                  >
                    {cls.class_status === "ACTIVE" ? "Ativa" : "Arquivada"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <Users size={14} />
                    <Text size="sm">{cls.student_count}</Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {classes.length > 5 && (
          <Button
            variant="subtle"
            fullWidth
            mt="sm"
            onClick={() => navigate("/teacher/classes")}
          >
            Ver todas as turmas →
          </Button>
        )}
      </Card>

      {/* ── Quick Actions ──────────────────────────────────────────────── */}
      <div>
        <Title order={4} mb="md">
          Ações Rápidas
        </Title>
        <Group>
          <Button
            leftSection={<Plus size={16} />}
            onClick={() => navigate("/teacher/classes/new")}
          >
            Nova Turma
          </Button>
          <Button
            variant="light"
            leftSection={<GraduationCap size={16} />}
            onClick={() => navigate("/teacher/students")}
          >
            Ver Alunos
          </Button>
        </Group>
      </div>
    </Stack>
  );
}
