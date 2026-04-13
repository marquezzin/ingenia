/**
 * Admin Dashboard Page — Visão geral com métricas, turmas, professores e atalhos rápidos.
 */
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Progress,
  RingProgress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  FileCode2,
  GraduationCap,
  Layers,
  Plus,
  School,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatusBadge } from "@/shared/ui/components";
import { useAdminDashboardStats, useClassGroups, useModules, useUsers } from "../hooks";
import { CLASS_STATUS_MAP, PUBLICATION_STATUS_MAP, formatDate } from "../model";
import type { ClassGroupListItem, ModuleListItem, UserListItem } from "../types";

const BREADCRUMBS = [
  { label: "Admin", href: "/admin" },
  { label: "Dashboard" },
];

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const ROLE_COLORS: Record<string, string> = {
  STUDENT: "blue",
  TEACHER: "grape",
  ADMIN: "orange",
};

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "Alunos",
  TEACHER: "Professores",
  ADMIN: "Admins",
};

/* ─── Section Header ───────────────────────────────────────────────────────── */

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <Group justify="space-between" align="flex-end" mb="md" mt="xl">
      <div>
        <Title
          order={3}
          fw={700}
          style={{ color: "var(--color-text)", letterSpacing: "-0.01em" }}
        >
          {title}
        </Title>
        {subtitle && (
          <Text size="sm" c="dimmed" mt={2}>
            {subtitle}
          </Text>
        )}
      </div>
      {action}
    </Group>
  );
}

/* ─── Module Row ───────────────────────────────────────────────────────────── */

function ModuleRow({
  module,
  index,
  onClick,
}: {
  module: ModuleListItem;
  index: number;
  onClick: () => void;
}) {
  return (
    <Card
      withBorder
      padding="sm"
      radius="md"
      onClick={onClick}
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
        <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          <ThemeIcon
            size="lg"
            radius="md"
            variant="light"
            color="brand"
            style={{ flexShrink: 0 }}
          >
            <Text size="sm" fw={700}>
              {index + 1}
            </Text>
          </ThemeIcon>
          <div style={{ minWidth: 0 }}>
            <Text fw={600} size="sm" truncate="end" style={{ color: "var(--color-text)" }}>
              {module.title}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {module.description}
            </Text>
          </div>
        </Group>
        <Group gap="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
          <Badge variant="light" color="blue" size="sm" leftSection={<GraduationCap size={12} />}>
            {module.lesson_count} {module.lesson_count === 1 ? "aula" : "aulas"}
          </Badge>
          <StatusBadge status={module.publication_status} statusMap={PUBLICATION_STATUS_MAP} />
        </Group>
      </Group>
    </Card>
  );
}

/* ─── Class Group Row ──────────────────────────────────────────────────────── */

function ClassGroupRow({
  classGroup,
  onClick,
}: {
  classGroup: ClassGroupListItem;
  onClick: () => void;
}) {
  return (
    <Card
      withBorder
      padding="sm"
      radius="md"
      onClick={onClick}
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
        <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          <ThemeIcon
            size="lg"
            radius="md"
            variant="light"
            color="grape"
            style={{ flexShrink: 0 }}
          >
            <School size={18} />
          </ThemeIcon>
          <div style={{ minWidth: 0 }}>
            <Text fw={600} size="sm" truncate="end" style={{ color: "var(--color-text)" }}>
              {classGroup.name}
            </Text>
            <Text size="xs" c="dimmed" truncate="end">
              Prof. {classGroup.teacher_name}
            </Text>
          </div>
        </Group>
        <Group gap="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
          <Badge variant="light" color="blue" size="sm" leftSection={<Users size={12} />}>
            {classGroup.student_count} {classGroup.student_count === 1 ? "aluno" : "alunos"}
          </Badge>
          <StatusBadge status={classGroup.class_status} statusMap={CLASS_STATUS_MAP} />
        </Group>
      </Group>
    </Card>
  );
}

/* ─── Dashboard Stat Card ──────────────────────────────────────────────────── */

function DashboardStatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card
      withBorder
      radius="md"
      padding="md"
      style={{
        borderColor: "var(--color-border)",
        transition: "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.borderColor = `var(--mantine-color-${color}-5)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
    >
      <Group justify="flex-start" wrap="nowrap" gap="md">
        <ThemeIcon size={46} radius="md" variant="light" color={color}>
          {icon}
        </ThemeIcon>
        <div>
          <Text size="xs" tt="uppercase" fw={700} c="dimmed">
            {title}
          </Text>
          <Text size="xl" fw={800} style={{ lineHeight: 1.1, marginTop: 4 }}>
            {value}
          </Text>
        </div>
      </Group>
    </Card>
  );
}

/* ─── Dashboard Page ───────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useAdminDashboardStats();
  const { data: modulesData, isLoading: modulesLoading } = useModules({ ordering: "sequence_order" });
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const { data: classesData, isLoading: classesLoading } = useClassGroups();
  const navigate = useNavigate();

  // Derive user breakdown by role
  const userBreakdown = useMemo(() => {
    const users = usersData?.results ?? [];
    const counts: Record<string, number> = { STUDENT: 0, TEACHER: 0, ADMIN: 0 };
    users.forEach((u: UserListItem) => {
      counts[u.role] = (counts[u.role] ?? 0) + 1;
    });
    const total = users.length || 1;
    return { counts, total };
  }, [usersData]);

  // Derive user status breakdown
  const userStatusBreakdown = useMemo(() => {
    const users = usersData?.results ?? [];
    let active = 0;
    let inactive = 0;
    users.forEach((u: UserListItem) => {
      if (u.account_status === "ACTIVE") active++;
      else inactive++;
    });
    return { active, inactive };
  }, [usersData]);

  // Derive module status breakdown
  const moduleStatusBreakdown = useMemo(() => {
    const modules = modulesData?.results ?? [];
    let published = 0;
    let draft = 0;
    let archived = 0;
    modules.forEach((m: ModuleListItem) => {
      if (m.publication_status === "PUBLISHED") published++;
      else if (m.publication_status === "DRAFT") draft++;
      else archived++;
    });
    const total = modules.length || 1;
    return { published, draft, archived, total };
  }, [modulesData]);

  // Recent classes
  const recentClasses = useMemo(() => {
    return (classesData?.results ?? []).slice(0, 5);
  }, [classesData]);

  // Recent modules
  const recentModules = useMemo(() => {
    return (modulesData?.results ?? []).slice(0, 5);
  }, [modulesData]);

  // Teachers from class groups (unique)
  const teachers = useMemo(() => {
    const classes = classesData?.results ?? [];
    const seen = new Set<string>();
    const result: { name: string; classCount: number; studentCount: number }[] = [];
    classes.forEach((cg: ClassGroupListItem) => {
      if (!seen.has(cg.teacher_name)) {
        seen.add(cg.teacher_name);
        const teacherClasses = classes.filter((c: ClassGroupListItem) => c.teacher_name === cg.teacher_name);
        result.push({
          name: cg.teacher_name,
          classCount: teacherClasses.length,
          studentCount: teacherClasses.reduce((sum: number, c: ClassGroupListItem) => sum + c.student_count, 0),
        });
      }
    });
    return result;
  }, [classesData]);

  const totalStudentsEnrolled = useMemo(() => {
    return (classesData?.results ?? []).reduce(
      (sum: number, cg: ClassGroupListItem) => sum + cg.student_count,
      0
    );
  }, [classesData]);

  const totalClasses = classesData?.results?.length ?? 0;
  const activeClasses = (classesData?.results ?? []).filter(
    (c: ClassGroupListItem) => c.class_status === "ACTIVE"
  ).length;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral da plataforma Ingenia"
        breadcrumbs={BREADCRUMBS}
      />

      {statsError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar estatísticas"
          color="red"
          mb="lg"
        >
          Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.
        </Alert>
      )}

      {/* ─── Stat Cards ──────────────────────────────────────────────── */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="lg" mb="xl">
        {statsLoading || classesLoading ? (
          <>
            <Skeleton height={80} radius="md" />
            <Skeleton height={80} radius="md" />
            <Skeleton height={80} radius="md" />
            <Skeleton height={80} radius="md" />
            <Skeleton height={80} radius="md" />
            <Skeleton height={80} radius="md" />
          </>
        ) : (
          <>
            <DashboardStatCard
              title="Módulos no Currículo"
              value={stats?.total_modules ?? 0}
              icon={<BookOpen size={24} />}
              color="brand"
            />
            <DashboardStatCard
              title="Aulas Cadastradas"
              value={stats?.total_lessons ?? 0}
              icon={<GraduationCap size={24} />}
              color="teal"
            />
            <DashboardStatCard
              title="Exercícios de Código"
              value={stats?.total_exercises ?? 0}
              icon={<FileCode2 size={24} />}
              color="grape"
            />
            <DashboardStatCard
              title="Total de Usuários"
              value={stats?.total_users ?? 0}
              icon={<Users size={24} />}
              color="orange"
            />
            <DashboardStatCard
              title="Turmas Ativas"
              value={totalClasses}
              icon={<School size={24} />}
              color="indigo"
            />
            <DashboardStatCard
              title="Alunos Matriculados"
              value={totalStudentsEnrolled}
              icon={<UserCheck size={24} />}
              color="cyan"
            />
          </>
        )}
      </SimpleGrid>

      {/* ─── Analytics Row ───────────────────────────────────────────── */}
      <Grid gutter="lg" mb="xl">
        {/* User Role Distribution */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" padding="lg" h="100%">
            <Text size="sm" fw={700} tt="uppercase" c="dimmed" mb="lg">
              Distribuição por Perfil
            </Text>
            {usersLoading ? (
              <Skeleton height={160} radius="md" />
            ) : (
              <Flex align="center" justify="center" direction="column" gap="md">
                <RingProgress
                  size={140}
                  thickness={16}
                  roundCaps
                  sections={[
                    {
                      value: (userBreakdown.counts.STUDENT / userBreakdown.total) * 100,
                      color: "blue",
                      tooltip: `Alunos: ${userBreakdown.counts.STUDENT}`,
                    },
                    {
                      value: (userBreakdown.counts.TEACHER / userBreakdown.total) * 100,
                      color: "grape",
                      tooltip: `Professores: ${userBreakdown.counts.TEACHER}`,
                    },
                    {
                      value: (userBreakdown.counts.ADMIN / userBreakdown.total) * 100,
                      color: "orange",
                      tooltip: `Admins: ${userBreakdown.counts.ADMIN}`,
                    },
                  ]}
                  label={
                    <Text ta="center" size="lg" fw={700}>
                      {userBreakdown.total}
                    </Text>
                  }
                />
                <Group gap="lg" justify="center">
                  {(["STUDENT", "TEACHER", "ADMIN"] as const).map((role) => (
                    <Flex key={role} align="center" gap={6}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: `var(--mantine-color-${ROLE_COLORS[role]}-6)`,
                        }}
                      />
                      <Text size="xs" c="dimmed">
                        {ROLE_LABELS[role]}: <strong>{userBreakdown.counts[role]}</strong>
                      </Text>
                    </Flex>
                  ))}
                </Group>
              </Flex>
            )}
          </Card>
        </Grid.Col>

        {/* Module Status */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" padding="lg" h="100%">
            <Text size="sm" fw={700} tt="uppercase" c="dimmed" mb="lg">
              Status dos Módulos
            </Text>
            {modulesLoading ? (
              <Skeleton height={160} radius="md" />
            ) : (
              <Stack gap="md">
                <div>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm" fw={500}>
                      Publicados
                    </Text>
                    <Text size="sm" fw={700} c="green">
                      {moduleStatusBreakdown.published}
                    </Text>
                  </Group>
                  <Progress
                    value={(moduleStatusBreakdown.published / moduleStatusBreakdown.total) * 100}
                    color="green"
                    size="lg"
                    radius="xl"
                    animated
                  />
                </div>
                <div>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm" fw={500}>
                      Rascunho
                    </Text>
                    <Text size="sm" fw={700} c="gray">
                      {moduleStatusBreakdown.draft}
                    </Text>
                  </Group>
                  <Progress
                    value={(moduleStatusBreakdown.draft / moduleStatusBreakdown.total) * 100}
                    color="gray"
                    size="lg"
                    radius="xl"
                  />
                </div>
                <div>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm" fw={500}>
                      Arquivados
                    </Text>
                    <Text size="sm" fw={700} c="orange">
                      {moduleStatusBreakdown.archived}
                    </Text>
                  </Group>
                  <Progress
                    value={(moduleStatusBreakdown.archived / moduleStatusBreakdown.total) * 100}
                    color="orange"
                    size="lg"
                    radius="xl"
                  />
                </div>
              </Stack>
            )}
          </Card>
        </Grid.Col>

        {/* Class Groups + User Activity */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="md" padding="lg" h="100%">
            <Text size="sm" fw={700} tt="uppercase" c="dimmed" mb="lg">
              Visão Geral de Turmas
            </Text>
            {classesLoading || usersLoading ? (
              <Skeleton height={160} radius="md" />
            ) : (
              <Stack gap="md">
                <Group justify="space-between">
                  <Group gap="xs">
                    <ThemeIcon size="md" radius="md" variant="light" color="indigo">
                      <School size={14} />
                    </ThemeIcon>
                    <Text size="sm">Turmas Ativas</Text>
                  </Group>
                  <Text size="lg" fw={700} c="indigo">
                    {activeClasses}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Group gap="xs">
                    <ThemeIcon size="md" radius="md" variant="light" color="grape">
                      <Layers size={14} />
                    </ThemeIcon>
                    <Text size="sm">Professores</Text>
                  </Group>
                  <Text size="lg" fw={700} c="grape">
                    {teachers.length}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Group gap="xs">
                    <ThemeIcon size="md" radius="md" variant="light" color="cyan">
                      <TrendingUp size={14} />
                    </ThemeIcon>
                    <Text size="sm">Média alunos/turma</Text>
                  </Group>
                  <Text size="lg" fw={700} c="cyan">
                    {totalClasses > 0 ? (totalStudentsEnrolled / totalClasses).toFixed(1) : "—"}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Group gap="xs">
                    <ThemeIcon size="md" radius="md" variant="light" color="green">
                      <UserCheck size={14} />
                    </ThemeIcon>
                    <Text size="sm">Usuários Ativos</Text>
                  </Group>
                  <Text size="lg" fw={700} c="green">
                    {userStatusBreakdown.active}
                  </Text>
                </Group>

                {userStatusBreakdown.inactive > 0 && (
                  <Group justify="space-between">
                    <Group gap="xs">
                      <ThemeIcon size="md" radius="md" variant="light" color="red">
                        <UserX size={14} />
                      </ThemeIcon>
                      <Text size="sm">Inativos / Suspensos</Text>
                    </Group>
                    <Text size="lg" fw={700} c="red">
                      {userStatusBreakdown.inactive}
                    </Text>
                  </Group>
                )}
              </Stack>
            )}
          </Card>
        </Grid.Col>
      </Grid>

      {/* ─── Teachers ────────────────────────────────────────────────── */}
      <SectionHeader
        title="Professores"
        subtitle={`${teachers.length} professor${teachers.length !== 1 ? "es" : ""} na plataforma`}
        action={
          <Button
            variant="light"
            size="xs"
            rightSection={<ArrowRight size={14} />}
            onClick={() => navigate("/admin/users?role=TEACHER")}
          >
            Ver todos
          </Button>
        }
      />
      {classesLoading ? (
        <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }}>
          <Skeleton height={100} radius="md" />
          <Skeleton height={100} radius="md" />
          <Skeleton height={100} radius="md" />
          <Skeleton height={100} radius="md" />
        </SimpleGrid>
      ) : teachers.length === 0 ? (
        <Card withBorder radius="md" padding="xl">
          <Flex direction="column" align="center" gap="sm" style={{ opacity: 0.6 }}>
            <Users size={36} strokeWidth={1.5} />
            <Text c="dimmed" size="sm">
              Nenhum professor encontrado
            </Text>
          </Flex>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }}>
          {teachers.map((teacher) => (
            <Card
              key={teacher.name}
              withBorder
              radius="md"
              padding="md"
              style={{
                borderColor: "var(--color-border)",
                transition: "transform 150ms ease, box-shadow 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <Group gap="md" wrap="nowrap">
                <Avatar
                  size="lg"
                  radius="xl"
                  color="grape"
                  variant="light"
                >
                  {getInitials(teacher.name)}
                </Avatar>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <Text fw={600} size="sm" truncate="end">
                    {teacher.name}
                  </Text>
                  <Group gap="xs" mt={4}>
                    <Tooltip label="Turmas">
                      <Badge variant="dot" color="grape" size="sm">
                        {teacher.classCount} {teacher.classCount === 1 ? "turma" : "turmas"}
                      </Badge>
                    </Tooltip>
                    <Tooltip label="Total de alunos">
                      <Badge variant="dot" color="blue" size="sm">
                        {teacher.studentCount} {teacher.studentCount === 1 ? "aluno" : "alunos"}
                      </Badge>
                    </Tooltip>
                  </Group>
                </div>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* ─── Recent Classes ──────────────────────────────────────────── */}
      <SectionHeader
        title="Turmas Recentes"
        subtitle={`${totalClasses} turma${totalClasses !== 1 ? "s" : ""} cadastrada${totalClasses !== 1 ? "s" : ""}`}
        action={
          <Button
            variant="light"
            size="xs"
            rightSection={<ArrowRight size={14} />}
            onClick={() => navigate("/admin/classes")}
          >
            Ver todas
          </Button>
        }
      />
      {classesLoading ? (
        <Stack gap="xs">
          <Skeleton height={56} radius="md" />
          <Skeleton height={56} radius="md" />
          <Skeleton height={56} radius="md" />
        </Stack>
      ) : recentClasses.length === 0 ? (
        <Card withBorder radius="md" padding="xl">
          <Flex direction="column" align="center" gap="sm" style={{ opacity: 0.6 }}>
            <School size={36} strokeWidth={1.5} />
            <Text c="dimmed" size="sm">
              Nenhuma turma cadastrada ainda
            </Text>
          </Flex>
        </Card>
      ) : (
        <Stack gap="xs">
          {recentClasses.map((cg) => (
            <ClassGroupRow
              key={cg.id}
              classGroup={cg}
              onClick={() => navigate(`/admin/classes/${cg.id}`)}
            />
          ))}
        </Stack>
      )}

      {/* ─── Recent Modules ──────────────────────────────────────────── */}
      <SectionHeader
        title="Módulos do Currículo"
        subtitle={`${modulesData?.results?.length ?? 0} módulo${(modulesData?.results?.length ?? 0) !== 1 ? "s" : ""} cadastrado${(modulesData?.results?.length ?? 0) !== 1 ? "s" : ""}`}
        action={
          <Button
            variant="light"
            size="xs"
            rightSection={<ArrowRight size={14} />}
            onClick={() => navigate("/admin/modules")}
          >
            Ver todos
          </Button>
        }
      />
      {modulesLoading ? (
        <Stack gap="xs">
          <Skeleton height={56} radius="md" />
          <Skeleton height={56} radius="md" />
          <Skeleton height={56} radius="md" />
        </Stack>
      ) : recentModules.length === 0 ? (
        <Card withBorder radius="md" padding="xl">
          <Flex direction="column" align="center" gap="sm" style={{ opacity: 0.6 }}>
            <BookOpen size={36} strokeWidth={1.5} />
            <Text c="dimmed" size="sm">
              Nenhum módulo cadastrado ainda
            </Text>
          </Flex>
        </Card>
      ) : (
        <Stack gap="xs">
          {recentModules.map((mod, idx) => (
            <ModuleRow
              key={mod.id}
              module={mod}
              index={idx}
              onClick={() => navigate(`/admin/modules/${mod.id}`)}
            />
          ))}
        </Stack>
      )}

      {/* ─── Quick Actions ───────────────────────────────────────────── */}
      <SectionHeader title="Ações Rápidas" subtitle="Crie e gerencie conteúdo rapidamente" />
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} mb="xl">
        <Card
          withBorder
          radius="md"
          padding="md"
          onClick={() => navigate("/admin/modules/new")}
          style={{
            cursor: "pointer",
            borderColor: "var(--color-border)",
            transition: "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
            e.currentTarget.style.borderColor = "hsl(var(--brand-primary))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.borderColor = "var(--color-border)";
          }}
        >
          <Group gap="md">
            <ThemeIcon size="xl" radius="md" variant="light" color="brand">
              <Plus size={20} />
            </ThemeIcon>
            <div>
              <Text fw={600} size="sm">
                Novo Módulo
              </Text>
              <Text size="xs" c="dimmed">
                Adicionar conteúdo ao currículo
              </Text>
            </div>
          </Group>
        </Card>

        <Card
          withBorder
          radius="md"
          padding="md"
          onClick={() => navigate("/admin/users/new")}
          style={{
            cursor: "pointer",
            borderColor: "var(--color-border)",
            transition: "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
            e.currentTarget.style.borderColor = "hsl(var(--brand-primary))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.borderColor = "var(--color-border)";
          }}
        >
          <Group gap="md">
            <ThemeIcon size="xl" radius="md" variant="light" color="orange">
              <Users size={20} />
            </ThemeIcon>
            <div>
              <Text fw={600} size="sm">
                Novo Usuário
              </Text>
              <Text size="xs" c="dimmed">
                Cadastrar aluno ou professor
              </Text>
            </div>
          </Group>
        </Card>

        <Card
          withBorder
          radius="md"
          padding="md"
          onClick={() => navigate("/admin/users")}
          style={{
            cursor: "pointer",
            borderColor: "var(--color-border)",
            transition: "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
            e.currentTarget.style.borderColor = "hsl(var(--brand-primary))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.borderColor = "var(--color-border)";
          }}
        >
          <Group gap="md">
            <ThemeIcon size="xl" radius="md" variant="light" color="teal">
              <UserCheck size={20} />
            </ThemeIcon>
            <div>
              <Text fw={600} size="sm">
                Gerenciar Usuários
              </Text>
              <Text size="xs" c="dimmed">
                Buscar, filtrar e editar contas
              </Text>
            </div>
          </Group>
        </Card>

        <Card
          withBorder
          radius="md"
          padding="md"
          onClick={() => navigate("/admin/classes")}
          style={{
            cursor: "pointer",
            borderColor: "var(--color-border)",
            transition: "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
            e.currentTarget.style.borderColor = "hsl(var(--brand-primary))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.borderColor = "var(--color-border)";
          }}
        >
          <Group gap="md">
            <ThemeIcon size="xl" radius="md" variant="light" color="grape">
              <School size={20} />
            </ThemeIcon>
            <div>
              <Text fw={600} size="sm">
                Ver Turmas
              </Text>
              <Text size="xs" c="dimmed">
                Visualizar turmas e matrículas
              </Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>
    </>
  );
}
