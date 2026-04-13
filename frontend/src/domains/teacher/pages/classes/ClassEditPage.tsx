/**
 * ClassEditPage — Editar turma: alterar nome, descrição, status e composição de alunos.
 */
import { useEffect, useState } from "react";
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Select,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  AlertCircle,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmModal, PageHeader } from "@/shared/ui/components";
import {
  useEnrollStudent,
  useRemoveStudent,
  useSearchStudents,
  useTeacherClass,
  useUpdateTeacherClass,
} from "../../hooks";
import type {
  ClassStatus,
  EnrolledStudent,
  StudentSearchResult,
} from "../../types";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Ativa" },
  { value: "ARCHIVED", label: "Arquivada" },
];

export default function ClassEditPage() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const {
    data: classDetail,
    isLoading,
    isError,
  } = useTeacherClass(classId!);

  const updateClass = useUpdateTeacherClass();
  const enrollStudent = useEnrollStudent();
  const removeStudent = useRemoveStudent();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [classStatus, setClassStatus] = useState<ClassStatus>("ACTIVE");
  const [studentSearch, setStudentSearch] = useState("");
  const [pendingEnrollments, setPendingEnrollments] = useState<
    StudentSearchResult[]
  >([]);
  const [pendingRemovals, setPendingRemovals] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [studentToRemove, setStudentToRemove] = useState<EnrolledStudent | null>(
    null,
  );
  const [removeModalOpened, { open: openRemoveModal, close: closeRemoveModal }] =
    useDisclosure(false);

  const { data: searchResults, isLoading: isSearching } =
    useSearchStudents(studentSearch);

  const isSaving =
    updateClass.isPending ||
    enrollStudent.isPending ||
    removeStudent.isPending;

  // Initialize form when data loads
  useEffect(() => {
    if (classDetail) {
      setName(classDetail.name);
      setDescription(classDetail.description ?? "");
      setClassStatus(classDetail.class_status);
    }
  }, [classDetail]);

  // Filter search results — exclude already enrolled and pending enrollment
  const existingStudentIds = new Set(
    classDetail?.students
      .filter((s) => !pendingRemovals.includes(s.id))
      .map(() => "") ?? [],
  );
  const pendingStudentIds = new Set(
    pendingEnrollments.map((s) => s.student_profile_id),
  );

  const currentStudents = (classDetail?.students ?? []).filter(
    (s) => s.enrollment_status === "ACTIVE" && !pendingRemovals.includes(s.id),
  );

  const filteredResults = (searchResults?.results ?? []).filter(
    (student) =>
      !pendingStudentIds.has(student.student_profile_id) &&
      !currentStudents.some(
        (cs) =>
          cs.student_email === student.email,
      ),
  );

  const handleAddStudent = (student: StudentSearchResult) => {
    setPendingEnrollments((prev) => [...prev, student]);
    setStudentSearch("");
  };

  const handleRemovePending = (studentProfileId: string) => {
    setPendingEnrollments((prev) =>
      prev.filter((s) => s.student_profile_id !== studentProfileId),
    );
  };

  const handleConfirmRemoveExisting = () => {
    if (studentToRemove) {
      setPendingRemovals((prev) => [...prev, studentToRemove.id]);
      setStudentToRemove(null);
      closeRemoveModal();
    }
  };

  const handleUndoRemoval = (enrollmentId: string) => {
    setPendingRemovals((prev) => prev.filter((id) => id !== enrollmentId));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("O nome da turma é obrigatório.");
      return;
    }

    setError(null);

    try {
      // Update class info
      await updateClass.mutateAsync({
        id: classId!,
        payload: {
          name: name.trim(),
          description: description.trim() || undefined,
          class_status: classStatus,
        },
      });

      // Process removals
      for (const enrollmentId of pendingRemovals) {
        await removeStudent.mutateAsync({
          classId: classId!,
          enrollmentId,
        });
      }

      // Process new enrollments
      for (const student of pendingEnrollments) {
        await enrollStudent.mutateAsync({
          classId: classId!,
          payload: { student_profile_id: student.student_profile_id },
        });
      }

      navigate(`/teacher/classes/${classId}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar alterações.";
      setError(message);
    }
  };

  const BREADCRUMBS = [
    { label: "Professor", href: "/teacher" },
    { label: "Turmas", href: "/teacher/classes" },
    { label: classDetail?.name ?? "Carregando...", href: `/teacher/classes/${classId}` },
    { label: "Editar" },
  ];

  // ─── Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Stack gap="lg">
        <PageHeader title="Carregando..." breadcrumbs={BREADCRUMBS} />
        <Skeleton height={200} radius="md" />
        <Skeleton height={300} radius="md" />
      </Stack>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────
  if (isError || !classDetail) {
    return (
      <Stack gap="lg">
        <PageHeader title="Editar Turma" breadcrumbs={BREADCRUMBS} />
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar turma"
          color="red"
        >
          Não foi possível carregar os dados desta turma.
        </Alert>
      </Stack>
    );
  }

  // Students that will be removed (shown with strikethrough)
  const removedStudents = classDetail.students.filter((s) =>
    pendingRemovals.includes(s.id),
  );

  return (
    <Stack gap="lg">
      <PageHeader
        title={`Editar: ${classDetail.name}`}
        subtitle="Altere o nome, descrição, status e composição de alunos"
        breadcrumbs={BREADCRUMBS}
      />

      {error && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro"
          color="red"
          withCloseButton
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* ── Class Info Form ────────────────────────────── */}
      <Card withBorder radius="md" padding="lg">
        <Stack gap="md">
          <Text fw={600} size="lg">
            Informações da Turma
          </Text>
          <TextInput
            id="class-name"
            label="Nome da turma"
            placeholder="Nome da turma"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <Textarea
            id="class-description"
            label="Descrição"
            placeholder="Descrição opcional..."
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            minRows={2}
          />
          <Select
            id="class-status"
            label="Status"
            data={STATUS_OPTIONS}
            value={classStatus}
            onChange={(val) => setClassStatus((val ?? "ACTIVE") as ClassStatus)}
            w={200}
          />
        </Stack>
      </Card>

      {/* ── Current Students ─────────────────────────────── */}
      <Card withBorder radius="md" padding="lg">
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={600} size="lg">
                Alunos da Turma
              </Text>
              <Text size="sm" c="dimmed">
                {currentStudents.length + pendingEnrollments.length} aluno(s)
                {pendingRemovals.length > 0 &&
                  ` (${pendingRemovals.length} a remover)`}
                {pendingEnrollments.length > 0 &&
                  ` (${pendingEnrollments.length} a adicionar)`}
              </Text>
            </div>
          </Group>

          {/* Existing active students */}
          {currentStudents.length > 0 && (
            <Stack gap="xs">
              {currentStudents.map((student) => (
                <Group
                  key={student.id}
                  justify="space-between"
                  px="md"
                  py="xs"
                  style={{
                    borderRadius: "var(--mantine-radius-sm)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <Group gap="sm">
                    <GraduationCap size={16} style={{ color: "var(--mantine-color-blue-6)" }} />
                    <div>
                      <Text size="sm" fw={500}>
                        {student.student_name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {student.student_email}
                      </Text>
                    </div>
                  </Group>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() => {
                      setStudentToRemove(student);
                      openRemoveModal();
                    }}
                  >
                    <Trash2 size={14} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          )}

          {/* Students marked for removal (undo) */}
          {removedStudents.length > 0 && (
            <Stack gap="xs">
              <Text size="sm" fw={500} c="red">
                A remover
              </Text>
              {removedStudents.map((student) => (
                <Group
                  key={student.id}
                  justify="space-between"
                  px="md"
                  py="xs"
                  style={{
                    borderRadius: "var(--mantine-radius-sm)",
                    border: "1px solid var(--mantine-color-red-3)",
                    background: "var(--mantine-color-red-0)",
                    opacity: 0.7,
                  }}
                >
                  <div>
                    <Text
                      size="sm"
                      fw={500}
                      td="line-through"
                    >
                      {student.student_name}
                    </Text>
                    <Text size="xs" c="dimmed" td="line-through">
                      {student.student_email}
                    </Text>
                  </div>
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => handleUndoRemoval(student.id)}
                  >
                    Desfazer
                  </Button>
                </Group>
              ))}
            </Stack>
          )}

          {/* Pending new enrollments */}
          {pendingEnrollments.length > 0 && (
            <Stack gap="xs">
              <Text size="sm" fw={500} c="blue">
                A adicionar
              </Text>
              {pendingEnrollments.map((student) => (
                <Group
                  key={student.student_profile_id}
                  justify="space-between"
                  px="md"
                  py="xs"
                  style={{
                    borderRadius: "var(--mantine-radius-sm)",
                    background: "var(--mantine-color-blue-0)",
                    border: "1px solid var(--mantine-color-blue-3)",
                  }}
                >
                  <Group gap="sm">
                    <GraduationCap
                      size={16}
                      style={{ color: "var(--mantine-color-blue-6)" }}
                    />
                    <div>
                      <Text size="sm" fw={500}>
                        {student.full_name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {student.email}
                      </Text>
                    </div>
                  </Group>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() =>
                      handleRemovePending(student.student_profile_id)
                    }
                  >
                    <X size={14} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          )}

          {/* Search to add students */}
          <div>
            <Text size="sm" fw={500} mb="xs">
              Adicionar alunos
            </Text>
            <TextInput
              id="student-search"
              placeholder="Buscar aluno por nome ou email..."
              leftSection={<Search size={16} />}
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.currentTarget.value)}
              rightSection={
                studentSearch ? (
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={() => setStudentSearch("")}
                  >
                    <X size={14} />
                  </ActionIcon>
                ) : undefined
              }
            />

            {isSearching && (
              <Group justify="center" py="sm">
                <Loader size="sm" />
                <Text size="sm" c="dimmed">
                  Buscando...
                </Text>
              </Group>
            )}

            {studentSearch.length >= 2 &&
              !isSearching &&
              filteredResults.length > 0 && (
                <Card withBorder radius="sm" padding={0} mt="xs">
                  <Stack gap={0}>
                    {filteredResults.map((student) => (
                      <Group
                        key={student.student_profile_id}
                        justify="space-between"
                        px="md"
                        py="xs"
                        style={{
                          borderBottom: "1px solid var(--color-border)",
                          cursor: "pointer",
                          transition: "background 150ms ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "var(--mantine-color-gray-0)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "";
                        }}
                        onClick={() => handleAddStudent(student)}
                      >
                        <div>
                          <Text size="sm" fw={500}>
                            {student.full_name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {student.email}
                          </Text>
                        </div>
                        <ActionIcon variant="light" color="blue" size="sm">
                          <Plus size={14} />
                        </ActionIcon>
                      </Group>
                    ))}
                  </Stack>
                </Card>
              )}

            {studentSearch.length >= 2 &&
              !isSearching &&
              filteredResults.length === 0 && (
                <Text size="sm" c="dimmed" ta="center" py="sm">
                  Nenhum aluno encontrado para "{studentSearch}".
                </Text>
              )}
          </div>
        </Stack>
      </Card>

      {/* ── Actions ──────────────────────────────────────────── */}
      <Group justify="flex-end">
        <Button
          variant="default"
          onClick={() => navigate(`/teacher/classes/${classId}`)}
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button onClick={handleSubmit} loading={isSaving}>
          Salvar Alterações
        </Button>
      </Group>

      {/* ── Remove Confirmation Modal ────────────────────── */}
      <ConfirmModal
        opened={removeModalOpened}
        onClose={closeRemoveModal}
        onConfirm={handleConfirmRemoveExisting}
        title="Remover aluno da turma"
        message={`Tem certeza que deseja remover ${studentToRemove?.student_name} desta turma?`}
        confirmLabel="Remover"
        confirmColor="red"
      />
    </Stack>
  );
}
