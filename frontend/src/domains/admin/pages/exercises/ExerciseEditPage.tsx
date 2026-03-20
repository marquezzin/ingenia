/**
 * ExerciseEditPage — Formulário de edição de exercício com publish/unpublish e delete.
 */
import {
  Alert,
  Button,
  Group,
  Loader,
  NumberInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AlertCircle, Check, EyeOff, Trash2 } from "lucide-react";
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

  // Populate form when data loads
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
    {
      label: module?.title ?? "Módulo",
      href: `/admin/modules/${moduleId}`,
    },
    {
      label: lesson?.title ?? "Aula",
      href: `/admin/modules/${moduleId}/lessons/${lessonId}`,
    },
    {
      label: exercise.title,
      href: `/admin/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}`,
    },
    { label: "Editar" },
  ];

  return (
    <>
      <PageHeader
        title="Editar Exercício"
        subtitle={exercise.title}
        breadcrumbs={breadcrumbs}
        actions={
          <Group gap="xs">
            <Button
              variant="light"
              color={
                exercise.publication_status === "PUBLISHED"
                  ? "orange"
                  : "green"
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
              variant="light"
              color="red"
              leftSection={<Trash2 size={16} />}
              onClick={openDelete}
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
          {getApiErrorMessage(
            updateExercise.error,
            "Não foi possível salvar as alterações. Tente novamente.",
          )}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Título"
          placeholder="Ex: Soma de dois números"
          error={errors.title?.message}
          mb="md"
          {...register("title")}
        />
        <Textarea
          label="Enunciado"
          placeholder="Descreva o problema que o aluno deve resolver..."
          minRows={6}
          error={errors.statement?.message}
          mb="md"
          {...register("statement")}
        />
        <Textarea
          label="Mensagem de Apoio (opcional)"
          placeholder="Dica ou orientação para ajudar o aluno..."
          minRows={3}
          mb="md"
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
          maw={200}
        />

        <Group justify="flex-end" mt="xl">
          <Button
            variant="default"
            onClick={() =>
              navigate(
                `/admin/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}`,
              )
            }
          >
            Cancelar
          </Button>
          <Button type="submit" loading={updateExercise.isPending}>
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
