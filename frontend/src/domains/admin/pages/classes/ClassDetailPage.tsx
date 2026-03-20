/**
 * ClassDetailPage — Detalhe de turma com lista de alunos matriculados.
 */
import {
  Alert,
  Badge,
  Card,
  Flex,
  Group,
  Loader,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Mail,
  School,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, StatusBadge } from "@/shared/ui/components";
import { useClassGroup } from "../../hooks";
import { CLASS_STATUS_MAP, formatDate } from "../../model";

const BREADCRUMBS = [
  { label: "Admin", href: "/admin" },
  { label: "Turmas", href: "/admin/classes" },
  { label: "Detalhe" },
];

const ENROLLMENT_STATUS_MAP = {
  ACTIVE: { label: "Ativo", color: "green" },
  REMOVED: { label: "Removido", color: "red" },
} as const;

export default function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { data: classGroup, isLoading, isError } = useClassGroup(classId ?? "");

  if (isLoading) {
    return (
      <Flex justify="center" py="xl">
        <Loader size="md" />
      </Flex>
    );
  }

  if (isError || !classGroup) {
    return (
      <Alert
        icon={<AlertCircle size={16} />}
        title="Erro ao carregar turma"
        color="red"
      >
        Não foi possível carregar os dados da turma.
      </Alert>
    );
  }

  const activeStudents = classGroup.students.filter(
    (s) => s.enrollment_status === "ACTIVE",
  );
  const removedStudents = classGroup.students.filter(
    (s) => s.enrollment_status === "REMOVED",
  );

  return (
    <>
      <PageHeader
        title={classGroup.name}
        subtitle="Detalhes da turma"
        breadcrumbs={BREADCRUMBS}
        actions={
          <Badge
            variant="light"
            color="gray"
            size="lg"
            leftSection={<ArrowLeft size={14} />}
            onClick={() => navigate("/admin/classes")}
            style={{ cursor: "pointer" }}
          >
            Voltar
          </Badge>
        }
      />

      {/* Info Card */}
      <Card withBorder padding="lg" radius="md" mb="lg">
        <Stack gap="sm">
          <Group gap="lg" wrap="wrap">
            <Group gap="xs">
              <School size={16} style={{ color: "var(--color-text-muted)" }} />
              <Text size="sm" fw={600}>
                Status:
              </Text>
              <StatusBadge
                status={classGroup.class_status}
                statusMap={CLASS_STATUS_MAP}
              />
            </Group>
            <Group gap="xs">
              <User size={16} style={{ color: "var(--color-text-muted)" }} />
              <Text size="sm" fw={600}>
                Professor:
              </Text>
              <Text size="sm">{classGroup.teacher_name}</Text>
            </Group>
            <Group gap="xs">
              <Mail size={16} style={{ color: "var(--color-text-muted)" }} />
              <Text size="sm" c="dimmed">
                {classGroup.teacher_email}
              </Text>
            </Group>
          </Group>

          {classGroup.description && (
            <Text size="sm" c="dimmed">
              {classGroup.description}
            </Text>
          )}

          <Group gap="lg">
            <Text size="xs" c="dimmed">
              Criada em: {formatDate(classGroup.created_at)}
            </Text>
            <Text size="xs" c="dimmed">
              Atualizada em: {formatDate(classGroup.updated_at)}
            </Text>
          </Group>
        </Stack>
      </Card>

      {/* Students Section */}
      <Group gap="sm" mb="md" align="center">
        <GraduationCap
          size={20}
          style={{ color: "hsl(var(--brand-primary))" }}
        />
        <Title order={4}>
          Alunos Matriculados ({activeStudents.length})
        </Title>
      </Group>

      {classGroup.students.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={40}
          gap="md"
          style={{ opacity: 0.7 }}
        >
          <GraduationCap
            size={40}
            strokeWidth={1.5}
            style={{ color: "var(--color-text-muted)" }}
          />
          <Text size="md" fw={500} c="dimmed">
            Nenhum aluno matriculado
          </Text>
          <Text size="sm" c="dimmed">
            Os alunos aparecerão aqui quando forem matriculados na turma.
          </Text>
        </Flex>
      ) : (
        <Card withBorder radius="md" padding={0}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Matriculado em</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {[...activeStudents, ...removedStudents].map((student) => (
                <Table.Tr key={student.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {student.student_name}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {student.student_email}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <StatusBadge
                      status={student.enrollment_status}
                      statusMap={ENROLLMENT_STATUS_MAP}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {formatDate(student.enrolled_at)}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}
    </>
  );
}
