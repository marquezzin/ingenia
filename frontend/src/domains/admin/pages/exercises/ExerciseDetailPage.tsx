/**
 * ExerciseDetailPage — Detalhe do exercício com lista de test cases.
 */
import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  NumberInput,
  SimpleGrid,
  Switch,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Check,
  Edit,
  EyeOff,
  Hash,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ConfirmModal,
  DataTable,
  PageHeader,
  StatusBadge,
} from "@/shared/ui/components";
import {
  useCreateTestCase,
  useDeleteTestCase,
  useExercise,
  useExerciseTestCases,
  useLesson,
  useModule,
  useUpdateExercise,
  useUpdateTestCase,
} from "../../hooks";
import { formatDate, PUBLICATION_STATUS_MAP } from "../../model";
import type {
  PublicationStatus,
  TestCaseListItem,
} from "../../types";

const testCaseSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(255, "Máximo 255 caracteres"),
  input_data: z.string().nullable().optional(),
  expected_output: z.string().min(1, "Saída esperada é obrigatória"),
  sequence_order: z
    .number({ invalid_type_error: "Ordem é obrigatória" })
    .int()
    .min(1, "Ordem deve ser no mínimo 1"),
  is_hidden: z.boolean(),
});

type TestCaseFormData = z.infer<typeof testCaseSchema>;

export default function ExerciseDetailPage() {
  const { moduleId, lessonId, exerciseId } = useParams<{
    moduleId: string;
    lessonId: string;
    exerciseId: string;
  }>();
  const navigate = useNavigate();
  const {
    data: exercise,
    isLoading,
    isError,
  } = useExercise(moduleId!, lessonId!, exerciseId!);
  const { data: module } = useModule(moduleId!);
  const { data: lesson } = useLesson(moduleId!, lessonId!);
  const { data: testCasesData, isLoading: testCasesLoading } =
    useExerciseTestCases(moduleId!, lessonId!, exerciseId!);
  const updateExercise = useUpdateExercise();
  const createTestCase = useCreateTestCase();
  const updateTestCase = useUpdateTestCase();
  const deleteTestCase = useDeleteTestCase();

  const [tcModalOpened, { open: openTcModal, close: closeTcModal }] =
    useDisclosure(false);
  const [editingTestCase, setEditingTestCase] = useState<TestCaseListItem | null>(
    null,
  );
  const [deletingTestCaseId, setDeletingTestCaseId] = useState<string | null>(
    null,
  );

  const tcForm = useForm<TestCaseFormData>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      name: "",
      input_data: "",
      expected_output: "",
      sequence_order: 1,
      is_hidden: false,
    },
  });

  const handleTogglePublish = () => {
    if (!exercise) return;
    const newStatus: PublicationStatus =
      exercise.publication_status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    updateExercise.mutate({
      moduleId: moduleId!,
      lessonId: lessonId!,
      exerciseId: exerciseId!,
      payload: {
        title: exercise.title,
        statement: exercise.statement,
        support_message: exercise.support_message,
        sequence_order: exercise.sequence_order,
        publication_status: newStatus,
      },
    });
  };

  const openCreateTestCase = () => {
    setEditingTestCase(null);
    tcForm.reset({
      name: "",
      input_data: "",
      expected_output: "",
      sequence_order: (testCasesData?.results?.length ?? 0) + 1,
      is_hidden: false,
    });
    openTcModal();
  };

  const openEditTestCase = (tc: TestCaseListItem) => {
    setEditingTestCase(tc);
    tcForm.reset({
      name: tc.name,
      input_data: "",
      expected_output: "",
      sequence_order: tc.sequence_order,
      is_hidden: tc.is_hidden,
    });
    openTcModal();
  };

  const handleSaveTestCase = (data: TestCaseFormData) => {
    const payload = {
      name: data.name,
      input_data: data.input_data || null,
      expected_output: data.expected_output,
      sequence_order: data.sequence_order,
      is_hidden: data.is_hidden,
    };

    if (editingTestCase) {
      updateTestCase.mutate(
        {
          moduleId: moduleId!,
          lessonId: lessonId!,
          exerciseId: exerciseId!,
          testCaseId: editingTestCase.id,
          payload,
        },
        { onSuccess: () => closeTcModal() },
      );
    } else {
      createTestCase.mutate(
        {
          moduleId: moduleId!,
          lessonId: lessonId!,
          exerciseId: exerciseId!,
          payload,
        },
        { onSuccess: () => closeTcModal() },
      );
    }
  };

  const handleDeleteTestCase = () => {
    if (!deletingTestCaseId) return;
    deleteTestCase.mutate(
      {
        moduleId: moduleId!,
        lessonId: lessonId!,
        exerciseId: exerciseId!,
        testCaseId: deletingTestCaseId,
      },
      { onSuccess: () => setDeletingTestCaseId(null) },
    );
  };

  if (isLoading) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  if (isError || !exercise) {
    return (
      <Alert
        icon={<AlertCircle size={16} />}
        title="Erro ao carregar exercício"
        color="red"
      >
        Não foi possível carregar os dados do exercício.
      </Alert>
    );
  }

  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Módulos", href: "/admin/modules" },
    { label: module?.title ?? "Módulo", href: `/admin/modules/${moduleId}` },
    {
      label: lesson?.title ?? "Aula",
      href: `/admin/modules/${moduleId}/lessons/${lessonId}`,
    },
    { label: exercise.title },
  ];

  const testCases = testCasesData?.results ?? [];
  const hasNoTestCases = exercise.test_cases_count === 0;

  return (
    <>
      <PageHeader
        title={exercise.title}
        breadcrumbs={breadcrumbs}
        actions={
          <Group gap="xs">
            <Button
              variant="light"
              color={
                exercise.publication_status === "PUBLISHED" ? "orange" : "green"
              }
              leftSection={
                exercise.publication_status === "PUBLISHED" ? (
                  <EyeOff size={16} />
                ) : (
                  <Check size={16} />
                )
              }
              onClick={handleTogglePublish}
              loading={updateExercise.isPending}
            >
              {exercise.publication_status === "PUBLISHED"
                ? "Despublicar"
                : "Publicar"}
            </Button>
            <Button
              leftSection={<Edit size={16} />}
              variant="light"
              onClick={() =>
                navigate(
                  `/admin/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}/edit`,
                )
              }
            >
              Editar
            </Button>
          </Group>
        }
      />

      {/* BR-010 Alert */}
      {hasNoTestCases && (
        <Alert
          icon={<AlertTriangle size={16} />}
          title="Atenção (BR-010)"
          color="yellow"
          mb="lg"
        >
          Este exercício não possui test cases. Todo exercício deve possuir ao
          menos um teste de correção antes de ser publicado.
        </Alert>
      )}

      {/* Exercise Info */}
      <Card withBorder mb="lg" padding="lg">
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md" mb="md">
          <Group gap="xs">
            <Hash size={16} color="var(--mantine-color-dimmed)" />
            <div>
              <Text size="xs" c="dimmed">
                Ordem
              </Text>
              <Text size="sm" fw={600}>
                {exercise.sequence_order}
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            <Hash size={16} color="var(--mantine-color-dimmed)" />
            <div>
              <Text size="xs" c="dimmed">
                Test Cases
              </Text>
              <Text size="sm" fw={600}>
                {exercise.test_cases_count}
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            <Calendar size={16} color="var(--mantine-color-dimmed)" />
            <div>
              <Text size="xs" c="dimmed">
                Criado em
              </Text>
              <Text size="sm" fw={600}>
                {formatDate(exercise.created_at)}
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            <Calendar size={16} color="var(--mantine-color-dimmed)" />
            <div>
              <Text size="xs" c="dimmed">
                Atualizado em
              </Text>
              <Text size="sm" fw={600}>
                {formatDate(exercise.updated_at)}
              </Text>
            </div>
          </Group>
        </SimpleGrid>

        <Group mb="md">
          <StatusBadge
            status={exercise.publication_status}
            statusMap={PUBLICATION_STATUS_MAP}
          />
        </Group>

        <Text size="sm" c="dimmed" mb="xs">
          Enunciado
        </Text>
        <Text size="sm" mb="md" style={{ whiteSpace: "pre-wrap" }}>
          {exercise.statement}
        </Text>

        {exercise.support_message && (
          <>
            <Text size="sm" c="dimmed" mb="xs">
              Mensagem de Apoio
            </Text>
            <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
              {exercise.support_message}
            </Text>
          </>
        )}
      </Card>

      {/* Test Cases List */}
      <PageHeader
        title="Test Cases"
        subtitle={`${testCases.length} test case(s) neste exercício`}
        actions={
          <Button leftSection={<Plus size={16} />} onClick={openCreateTestCase}>
            Novo Test Case
          </Button>
        }
      />

      <DataTable<TestCaseListItem>
        columns={[
          { key: "name", label: "Nome", sortable: true },
          {
            key: "sequence_order",
            label: "Ordem",
            sortable: true,
            width: 80,
          },
          {
            key: "is_hidden",
            label: "Visibilidade",
            width: 120,
            render: (row) =>
              row.is_hidden ? (
                <Badge variant="light" color="gray" size="sm">
                  Oculto
                </Badge>
              ) : (
                <Badge variant="light" color="blue" size="sm">
                  Visível
                </Badge>
              ),
          },
          {
            key: "id",
            label: "Ações",
            width: 120,
            render: (row) => (
              <Group gap="xs">
                <Button
                  variant="subtle"
                  size="compact-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditTestCase(row);
                  }}
                >
                  <Edit size={14} />
                </Button>
                <Button
                  variant="subtle"
                  size="compact-sm"
                  color="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingTestCaseId(row.id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </Group>
            ),
          },
        ]}
        data={testCases}
        loading={testCasesLoading}
        rowKey={(row) => row.id}
        emptyState={{
          title: "Nenhum test case cadastrado",
          description:
            "Adicione test cases para que este exercício possa ser publicado.",
        }}
      />

      {/* Test Case Create/Edit Modal */}
      <Modal
        opened={tcModalOpened}
        onClose={closeTcModal}
        title={editingTestCase ? "Editar Test Case" : "Novo Test Case"}
        size="lg"
      >
        <form onSubmit={tcForm.handleSubmit(handleSaveTestCase)}>
          <TextInput
            label="Nome"
            placeholder="Ex: Teste básico soma"
            error={tcForm.formState.errors.name?.message}
            mb="md"
            {...tcForm.register("name")}
          />
          <Textarea
            label="Dados de Entrada (input)"
            placeholder="Dados enviados como entrada do programa (opcional)"
            minRows={3}
            mb="md"
            {...tcForm.register("input_data")}
          />
          <Textarea
            label="Saída Esperada"
            placeholder="A saída que o programa deve produzir"
            minRows={3}
            error={tcForm.formState.errors.expected_output?.message}
            mb="md"
            {...tcForm.register("expected_output")}
          />
          <NumberInput
            label="Ordem"
            min={1}
            error={tcForm.formState.errors.sequence_order?.message}
            value={tcForm.watch("sequence_order")}
            onChange={(val) =>
              tcForm.setValue(
                "sequence_order",
                typeof val === "number" ? val : 1,
                { shouldValidate: true },
              )
            }
            maw={200}
            mb="md"
          />
          <Switch
            label="Ocultar do aluno"
            description="Test cases ocultos não são visíveis para o aluno no resultado"
            checked={tcForm.watch("is_hidden")}
            onChange={(e) =>
              tcForm.setValue("is_hidden", e.currentTarget.checked)
            }
            mb="lg"
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={closeTcModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={createTestCase.isPending || updateTestCase.isPending}
            >
              {editingTestCase ? "Salvar Alterações" : "Criar Test Case"}
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Delete Test Case Confirm */}
      <ConfirmModal
        opened={!!deletingTestCaseId}
        onClose={() => setDeletingTestCaseId(null)}
        onConfirm={handleDeleteTestCase}
        title="Excluir test case"
        message="Tem certeza que deseja excluir este test case? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        confirmColor="red"
        loading={deleteTestCase.isPending}
      />
    </>
  );
}
