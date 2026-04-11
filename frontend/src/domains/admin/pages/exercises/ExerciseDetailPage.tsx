/**
 * ExerciseDetailPage — Detalhe do exercício com lista de test cases (design aprimorado).
 */
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Loader,
  Modal,
  NumberInput,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Check,
  Clock,
  Edit,
  Eye,
  EyeOff,
  FileCheck,
  Hash,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ConfirmModal,
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
      input_data: tc.input_data ?? "",
      expected_output: tc.expected_output,
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
      <Flex justify="center" py="xl">
        <Loader />
      </Flex>
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
  const isPublished = exercise.publication_status === "PUBLISHED";

  return (
    <>
      <PageHeader
        title={exercise.title}
        breadcrumbs={breadcrumbs}
        actions={
          <Group gap="sm">
            <Button
              variant={isPublished ? "light" : "gradient"}
              color={isPublished ? "orange" : undefined}
              gradient={!isPublished ? { from: "teal", to: "green", deg: 135 } : undefined}
              leftSection={isPublished ? <EyeOff size={16} /> : <Check size={16} />}
              onClick={handleTogglePublish}
              loading={updateExercise.isPending}
              radius="md"
              styles={{ root: { transition: "transform 150ms ease" } }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {isPublished ? "Despublicar" : "Publicar"}
            </Button>
            <Button
              leftSection={<Edit size={16} />}
              variant="light"
              radius="md"
              onClick={() =>
                navigate(
                  `/admin/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}/edit`,
                )
              }
              styles={{ root: { transition: "transform 150ms ease" } }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
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

      {/* Exercise Info Card */}
      <Card
        withBorder
        mb="xl"
        padding="xl"
        radius="md"
        style={{
          borderColor: "var(--color-border)",
          background: "linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-elevated) 60%, var(--color-bg-subtle) 100%)",
        }}
      >
        <Stack gap="md">
          {/* Badges */}
          <Group gap="sm">
            <Badge
              size="lg"
              radius="md"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 135 }}
              style={{ fontWeight: 700, fontSize: "var(--text-sm)" }}
            >
              Exercício {String(exercise.sequence_order).padStart(2, "0")}
            </Badge>
            <StatusBadge
              status={exercise.publication_status}
              statusMap={PUBLICATION_STATUS_MAP}
            />
            {exercise.test_cases_count === 0 ? (
              <Badge leftSection={<AlertTriangle size={11} />} variant="light" color="red" size="sm" radius="md">
                0 testes
              </Badge>
            ) : (
              <Badge leftSection={<FileCheck size={11} />} variant="light" color="teal" size="sm" radius="md">
                {exercise.test_cases_count} {exercise.test_cases_count === 1 ? "teste" : "testes"}
              </Badge>
            )}
          </Group>

          {/* Stats */}
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg" mt="xs">
            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                <Hash size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>Ordem</Text>
                <Text size="lg" fw={700} lh={1.3}>{exercise.sequence_order}</Text>
              </div>
            </Group>
            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="teal" size="lg" radius="md">
                <ShieldCheck size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>Test Cases</Text>
                <Text size="lg" fw={700} lh={1.3}>{exercise.test_cases_count}</Text>
              </div>
            </Group>
            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="grape" size="lg" radius="md">
                <Calendar size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>Criado em</Text>
                <Text size="sm" fw={600} lh={1.3}>{formatDate(exercise.created_at)}</Text>
              </div>
            </Group>
            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="orange" size="lg" radius="md">
                <Clock size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>Atualizado em</Text>
                <Text size="sm" fw={600} lh={1.3}>{formatDate(exercise.updated_at)}</Text>
              </div>
            </Group>
          </SimpleGrid>

          {/* Enunciado */}
          <Card withBorder padding="md" radius="md" mt="xs" bg="var(--color-bg-elevated)">
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">
              Enunciado
            </Text>
            <Text size="sm" style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {exercise.statement}
            </Text>
          </Card>

          {/* Support message */}
          {exercise.support_message && (
            <Card withBorder padding="md" radius="md" bg="var(--color-bg-elevated)">
              <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="xs">
                Mensagem de Apoio
              </Text>
              <Text size="sm" style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {exercise.support_message}
              </Text>
            </Card>
          )}
        </Stack>
      </Card>

      {/* Test Cases Section Header */}
      <Group justify="space-between" align="center" mb="lg">
        <div>
          <Text size="xl" fw={700} style={{ color: "var(--color-text)" }}>
            Test Cases
          </Text>
          <Text size="sm" c="dimmed">
            {testCases.length} {testCases.length === 1 ? "test case" : "test cases"} neste exercício
          </Text>
        </div>
        <Button
          leftSection={<Plus size={18} />}
          onClick={openCreateTestCase}
          variant="gradient"
          gradient={{ from: "blue", to: "cyan", deg: 135 }}
          radius="md"
          styles={{
            root: {
              fontWeight: 600,
              transition: "transform 150ms ease, box-shadow 150ms ease",
              boxShadow: "0 4px 14px rgba(58, 134, 255, 0.25)",
            },
            section: { transition: "transform 200ms ease" },
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(58, 134, 255, 0.4)";
            const icon = e.currentTarget.querySelector(".mantine-Button-section");
            if (icon instanceof HTMLElement) icon.style.transform = "rotate(90deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(58, 134, 255, 0.25)";
            const icon = e.currentTarget.querySelector(".mantine-Button-section");
            if (icon instanceof HTMLElement) icon.style.transform = "rotate(0deg)";
          }}
        >
          Novo Test Case
        </Button>
      </Group>

      {/* Test Case Cards */}
      {testCasesLoading ? (
        <Flex justify="center" py="xl">
          <Loader size="md" />
        </Flex>
      ) : testCases.length === 0 ? (
        <Card withBorder padding="xl" radius="md" style={{ borderStyle: "dashed", borderColor: "var(--color-border)" }}>
          <Flex direction="column" align="center" justify="center" py="lg" gap="md" style={{ opacity: 0.7 }}>
            <ShieldCheck size={48} strokeWidth={1.5} style={{ color: "var(--color-text-muted)" }} />
            <Text size="lg" fw={500} c="dimmed">
              Nenhum test case cadastrado
            </Text>
            <Text size="sm" c="dimmed">
              Adicione test cases para que este exercício possa ser publicado.
            </Text>
          </Flex>
        </Card>
      ) : (
        <Stack gap="sm">
          {testCases.map((tc) => (
            <TestCaseRow
              key={tc.id}
              testCase={tc}
              onEdit={() => openEditTestCase(tc)}
              onDelete={() => setDeletingTestCaseId(tc.id)}
            />
          ))}
        </Stack>
      )}

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

function TestCaseRow({
  testCase,
  onEdit,
  onDelete,
}: {
  testCase: TestCaseListItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card
      withBorder
      padding="md"
      radius="md"
      style={{
        cursor: "default",
        transition: "transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
        borderColor: "var(--color-border)",
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
        {/* Left: order circle + name */}
        <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, hsl(217, 100%, 61%), hsl(191, 86%, 62%))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Text size="sm" fw={700} c="white">
              {String(testCase.sequence_order).padStart(2, "0")}
            </Text>
          </Box>
          <Text fw={600} size="md" truncate="end" style={{ color: "var(--color-text)" }}>
            {testCase.name}
          </Text>
        </Group>

        {/* Right: visibility badge + actions */}
        <Group gap="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
          {testCase.is_hidden ? (
            <Badge leftSection={<EyeOff size={11} />} variant="light" color="gray" size="sm" radius="md">
              Oculto
            </Badge>
          ) : (
            <Badge leftSection={<Eye size={11} />} variant="light" color="blue" size="sm" radius="md">
              Visível
            </Badge>
          )}
          <Group gap={4}>
            <Tooltip label="Editar" withArrow>
              <ActionIcon
                variant="light"
                color="blue"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                aria-label="Editar test case"
              >
                <Edit size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Excluir" withArrow>
              <ActionIcon
                variant="light"
                color="red"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                aria-label="Excluir test case"
              >
                <Trash2 size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Group>
    </Card>
  );
}
