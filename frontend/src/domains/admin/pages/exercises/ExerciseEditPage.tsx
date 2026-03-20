/**
 * ExerciseEditPage — Formulário de edição de exercício (design aprimorado).
 */
import {
  Alert,
  Button,
  Card,
  Flex,
  Group,
  Loader,
  NumberInput,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AlertCircle, ArrowLeft, Check, EyeOff, Save, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ConfirmModal, PageHeader } from "@/shared/ui/components";
import {
  useDeleteExercise,
  useExercise,
  useLesson,
  useModule,
  useUpdateExercise,
} from "../../hooks";
import { getApiErrorMessage } from "../../model";
import type { PublicationStatus } from "../../types";

const exerciseSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(255, "Título deve ter no máximo 255 caracteres"),
  statement: z.string().min(1, "Enunciado é obrigatório"),
  support_message: z.string().optional(),
  sequence_order: z
    .number({ invalid_type_error: "Ordem é obrigatória" })
    .int("Deve ser um número inteiro")
    .min(1, "Ordem deve ser no mínimo 1"),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

export default function ExerciseEditPage() {
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
  const updateExercise = useUpdateExercise();
  const deleteExercise = useDeleteExercise();
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
  });

  useEffect(() => {
    if (exercise) {
      reset({
        title: exercise.title,
        statement: exercise.statement,
        support_message: exercise.support_message ?? "",
        sequence_order: exercise.sequence_order,
      });
    }
  }, [exercise, reset]);

  const onSubmit = (data: ExerciseFormData) => {
    if (!exercise) return;
    updateExercise.mutate(
      {
        moduleId: moduleId!,
        lessonId: lessonId!,
        exerciseId: exerciseId!,
        payload: {
          title: data.title,
          statement: data.statement,
          support_message: data.support_message || null,
          sequence_order: data.sequence_order,
          publication_status: exercise.publication_status,
        },
      },
      {
        onSuccess: () => {
          navigate(
            `/admin/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}`,
          );
        },
      },
    );
  };

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

  const handleDelete = () => {
    if (!moduleId || !lessonId || !exerciseId) return;
    deleteExercise.mutate(
      { moduleId, lessonId, exerciseId },
      {
        onSuccess: () => {
          navigate(`/admin/modules/${moduleId}/lessons/${lessonId}`);
        },
      },
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
    { label: lesson?.title ?? "Aula", href: `/admin/modules/${moduleId}/lessons/${lessonId}` },
    { label: exercise.title, href: `/admin/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}` },
    { label: "Editar" },
  ];

  const isPublished = exercise.publication_status === "PUBLISHED";

  return (
    <>
      <PageHeader
        title="Editar Exercício"
        subtitle={exercise.title}
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
              variant="light"
              color="red"
              radius="md"
              leftSection={<Trash2 size={16} />}
              onClick={openDelete}
              styles={{ root: { transition: "transform 150ms ease" } }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Excluir
            </Button>
          </Group>
        }
      />

      {updateExercise.isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao atualizar exercício"
          color="red"
          mb="lg"
        >
          {getApiErrorMessage(updateExercise.error, "Não foi possível salvar as alterações. Tente novamente.")}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card withBorder padding="xl" radius="md" mb="xl">
          <Text size="sm" fw={600} tt="uppercase" c="dimmed" mb="lg">
            Informações do Exercício
          </Text>
          <Stack gap="md">
            <TextInput
              label="Título"
              placeholder="Ex: Soma de dois números"
              error={errors.title?.message}
              {...register("title")}
            />
            <Textarea
              label="Enunciado"
              placeholder="Descreva o problema que o aluno deve resolver..."
              minRows={6}
              error={errors.statement?.message}
              {...register("statement")}
            />
            <Textarea
              label="Mensagem de Apoio (opcional)"
              placeholder="Dica ou orientação para ajudar o aluno..."
              minRows={3}
              {...register("support_message")}
            />
            <NumberInput
              label="Ordem na sequência"
              placeholder="1"
              min={1}
              error={errors.sequence_order?.message}
              value={watch("sequence_order")}
              onChange={(val) =>
                setValue("sequence_order", typeof val === "number" ? val : 1, {
                  shouldValidate: true,
                })
              }
              w={120}
            />
          </Stack>
        </Card>

        <Group justify="flex-end">
          <Button
            variant="default"
            radius="md"
            leftSection={<ArrowLeft size={16} />}
            onClick={() =>
              navigate(`/admin/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}`)
            }
            styles={{ root: { transition: "transform 150ms ease" } }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={updateExercise.isPending}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 135 }}
            radius="md"
            leftSection={<Save size={16} />}
            styles={{
              root: {
                fontWeight: 600,
                transition: "transform 150ms ease, box-shadow 150ms ease",
                boxShadow: "0 4px 14px rgba(58, 134, 255, 0.25)",
              },
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(58, 134, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(58, 134, 255, 0.25)";
            }}
          >
            Salvar Alterações
          </Button>
        </Group>
      </form>

      <ConfirmModal
        opened={deleteOpened}
        onClose={closeDelete}
        onConfirm={handleDelete}
        title="Excluir exercício"
        message={`Tem certeza que deseja excluir o exercício "${exercise.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        confirmColor="red"
        loading={deleteExercise.isPending}
      />
    </>
  );
}
