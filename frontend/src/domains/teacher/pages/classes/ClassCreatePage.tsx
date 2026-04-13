/**
 * ClassCreatePage — Criar nova turma com seleção de alunos.
 */
import { useState } from "react";
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import {
  AlertCircle,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/shared/ui/components";
import {
  useCreateTeacherClass,
  useEnrollStudent,
  useSearchStudents,
} from "../../hooks";
import type { StudentSearchResult } from "../../types";

const BREADCRUMBS = [
  { label: "Professor", href: "/teacher" },
  { label: "Turmas", href: "/teacher/classes" },
  { label: "Nova Turma" },
];

export default function ClassCreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<
    StudentSearchResult[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const createClass = useCreateTeacherClass();
  const enrollStudent = useEnrollStudent();
  const { data: searchResults, isLoading: isSearching } =
    useSearchStudents(studentSearch);

  const isSaving = createClass.isPending || enrollStudent.isPending;

  const filteredResults = (searchResults?.results ?? []).filter(
    (student) =>
      !selectedStudents.some(
        (s) => s.student_profile_id === student.student_profile_id,
      ),
  );

  const handleAddStudent = (student: StudentSearchResult) => {
    setSelectedStudents((prev) => [...prev, student]);
    setStudentSearch("");
  };

  const handleRemoveStudent = (studentProfileId: string) => {
    setSelectedStudents((prev) =>
      prev.filter((s) => s.student_profile_id !== studentProfileId),
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("O nome da turma é obrigatório.");
      return;
    }

    setError(null);

    try {
      const newClass = await createClass.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      // Enroll selected students
      for (const student of selectedStudents) {
        await enrollStudent.mutateAsync({
          classId: newClass.id,
          payload: { student_profile_id: student.student_profile_id },
        });
      }

      navigate(`/teacher/classes/${newClass.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar turma.";
      setError(message);
    }
  };

  return (
    <Stack gap="lg">
      <PageHeader
        title="Nova Turma"
        subtitle="Crie uma turma e adicione alunos"
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

      {/* ── Class Info Form ────────────────────────────────── */}
      <Card withBorder radius="md" padding="lg">
        <Stack gap="md">
          <Text fw={600} size="lg">
            Informações da Turma
          </Text>
          <TextInput
            id="class-name"
            label="Nome da turma"
            placeholder="Ex: Turma 8A - Python Básico"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            error={
              error && !name.trim()
                ? "O nome da turma é obrigatório."
                : undefined
            }
          />
          <Textarea
            id="class-description"
            label="Descrição"
            placeholder="Descrição opcional da turma..."
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            minRows={2}
          />
        </Stack>
      </Card>

      {/* ── Student Selection ────────────────────────────── */}
      <Card withBorder radius="md" padding="lg">
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text fw={600} size="lg">
                Alunos
              </Text>
              <Text size="sm" c="dimmed">
                Busque e adicione alunos à turma
              </Text>
            </div>
            {selectedStudents.length > 0 && (
              <Badge variant="light" color="blue" size="lg">
                {selectedStudents.length}{" "}
                {selectedStudents.length === 1
                  ? "selecionado"
                  : "selecionados"}
              </Badge>
            )}
          </Group>

          {/* Search */}
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

          {/* Search Results */}
          {isSearching && (
            <Group justify="center" py="sm">
              <Loader size="sm" />
              <Text size="sm" c="dimmed">
                Buscando alunos...
              </Text>
            </Group>
          )}

          {studentSearch.length >= 2 &&
            !isSearching &&
            filteredResults.length > 0 && (
              <Card withBorder radius="sm" padding={0}>
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
                      <ActionIcon
                        variant="light"
                        color="blue"
                        size="sm"
                      >
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

          {/* Selected Students */}
          {selectedStudents.length > 0 && (
            <Stack gap="xs">
              <Text size="sm" fw={500} c="dimmed">
                Alunos selecionados
              </Text>
              {selectedStudents.map((student) => (
                <Group
                  key={student.student_profile_id}
                  justify="space-between"
                  px="md"
                  py="xs"
                  style={{
                    borderRadius: "var(--mantine-radius-sm)",
                    background: "var(--mantine-color-blue-0)",
                  }}
                >
                  <Group gap="sm">
                    <GraduationCap
                      size={16}
                      style={{
                        color: "var(--mantine-color-blue-6)",
                      }}
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
                      handleRemoveStudent(student.student_profile_id)
                    }
                  >
                    <Trash2 size={14} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          )}
        </Stack>
      </Card>

      {/* ── Actions ─────────────────────────────────────────── */}
      <Group justify="flex-end">
        <Button
          variant="default"
          onClick={() => navigate("/teacher/classes")}
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button onClick={handleSubmit} loading={isSaving}>
          Salvar Turma
        </Button>
      </Group>
    </Stack>
  );
}
