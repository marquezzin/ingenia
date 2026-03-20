/**
 * LessonEditPage — Formulário de edição de aula com publish/unpublish e delete.
 */
import {
  Alert,
  Button,
  Card,
  Checkbox,
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
  useDeleteLesson,
  useLesson,
  useModule,
  useUpdateLesson,
} from "../../hooks";
import { getApiErrorMessage } from "../../model";
import type { PublicationStatus } from "../../types";

const videoLessonSchema = z.object({
  title: z
    .string()
    .min(1, "Título do vídeo é obrigatório")
    .max(255, "Máximo 255 caracteres"),
  video_url: z.string().url("URL inválida").min(1, "URL do vídeo é obrigatória"),
  duration_seconds: z
    .number()
    .int()
    .min(1, "Duração deve ser maior que 0")
    .nullable()
    .optional(),
});

const lessonSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(255, "Título deve ter no máximo 255 caracteres"),
  written_content: z.string().min(1, "Conteúdo escrito é obrigatório"),
  sequence_order: z
    .number({ invalid_type_error: "Ordem é obrigatória" })
    .int("Deve ser um número inteiro")
    .min(1, "Ordem deve ser no mínimo 1"),
  has_video: z.boolean(),
  video_lesson: videoLessonSchema.optional(),
});

type LessonFormData = z.infer<typeof lessonSchema>;

export default function LessonEditPage() {
  const { moduleId, lessonId } = useParams<{
    moduleId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const { data: lesson, isLoading, isError } = useLesson(moduleId!, lessonId!);
  const { data: module } = useModule(moduleId!);
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
  });

  // Populate form when data loads
  useEffect(() => {
    if (lesson) {
      reset({
        title: lesson.title,
        written_content: lesson.written_content,
        sequence_order: lesson.sequence_order,
        has_video: !!lesson.video,
        video_lesson: lesson.video
          ? {
              title: lesson.video.title,
              video_url: lesson.video.video_url,
              duration_seconds: lesson.video.duration_seconds,
            }
          : undefined,
      });
    }
  }, [lesson, reset]);

  const hasVideo = watch("has_video");

  const onSubmit = (data: LessonFormData) => {
    if (!lesson) return;
    updateLesson.mutate(
      {
        moduleId: moduleId!,
        lessonId: lessonId!,
        payload: {
          title: data.title,
          written_content: data.written_content,
          sequence_order: data.sequence_order,
          publication_status: lesson.publication_status,
          video_lesson:
            data.has_video && data.video_lesson
              ? {
                  title: data.video_lesson.title,
                  video_url: data.video_lesson.video_url,
                  duration_seconds:
                    data.video_lesson.duration_seconds ?? null,
                }
              : null,
        },
      },
      {
        onSuccess: () => {
          navigate(
            `/admin/modules/${moduleId}/lessons/${lessonId}`,
          );
        },
      },
    );
  };

  const handleTogglePublish = () => {
    if (!lesson) return;
    const newStatus: PublicationStatus =
      lesson.publication_status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    updateLesson.mutate({
      moduleId: moduleId!,
      lessonId: lessonId!,
      payload: {
        title: lesson.title,
        written_content: lesson.written_content,
        sequence_order: lesson.sequence_order,
        publication_status: newStatus,
        video_lesson: lesson.video
          ? {
              title: lesson.video.title,
              video_url: lesson.video.video_url,
              duration_seconds: lesson.video.duration_seconds,
            }
          : null,
      },
    });
  };

  const handleDelete = () => {
    if (!moduleId || !lessonId) return;
    deleteLesson.mutate(
      { moduleId, lessonId },
      {
        onSuccess: () => {
          navigate(`/admin/modules/${moduleId}`);
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

  if (isError || !lesson) {
    return (
      <Alert
        icon={<AlertCircle size={16} />}
        title="Erro ao carregar aula"
        color="red"
      >
        Não foi possível carregar os dados da aula.
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
      label: lesson.title,
      href: `/admin/modules/${moduleId}/lessons/${lessonId}`,
    },
    { label: "Editar" },
  ];

  return (
    <>
      <PageHeader
        title="Editar Aula"
        subtitle={lesson.title}
        breadcrumbs={breadcrumbs}
        actions={
          <Group gap="xs">
            <Button
              variant="light"
              color={
                lesson.publication_status === "PUBLISHED" ? "orange" : "green"
              }
              leftSection={
                lesson.publication_status === "PUBLISHED" ? (
                  <EyeOff size={16} />
                ) : (
                  <Check size={16} />
                )
              }
              onClick={handleTogglePublish}
              loading={updateLesson.isPending}
            >
              {lesson.publication_status === "PUBLISHED"
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

      {updateLesson.isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao atualizar aula"
          color="red"
          mb="lg"
        >
          {getApiErrorMessage(
            updateLesson.error,
            "Não foi possível salvar as alterações. Tente novamente.",
          )}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Título"
          placeholder="Ex: Variáveis e Tipos de Dados"
          error={errors.title?.message}
          mb="md"
          {...register("title")}
        />
        <Textarea
          label="Conteúdo Escrito"
          placeholder="Escreva o conteúdo da aula..."
          minRows={8}
          error={errors.written_content?.message}
          mb="md"
          {...register("written_content")}
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
          mb="lg"
        />

        {/* Video Section */}
        <Card withBorder padding="md" mb="lg">
          <Checkbox
            label="Incluir videoaula"
            checked={hasVideo}
            onChange={(e) => setValue("has_video", e.currentTarget.checked)}
            mb="md"
          />
          {hasVideo && (
            <>
              <TextInput
                label="Título do vídeo"
                placeholder="Ex: Aula 1 - Introdução"
                error={errors.video_lesson?.title?.message}
                mb="md"
                {...register("video_lesson.title")}
              />
              <TextInput
                label="URL do vídeo"
                placeholder="https://youtube.com/watch?v=..."
                error={errors.video_lesson?.video_url?.message}
                mb="md"
                {...register("video_lesson.video_url")}
              />
              <NumberInput
                label="Duração (segundos)"
                placeholder="300"
                min={1}
                value={watch("video_lesson.duration_seconds") ?? undefined}
                onChange={(val) =>
                  setValue(
                    "video_lesson.duration_seconds",
                    typeof val === "number" ? val : null,
                    { shouldValidate: true },
                  )
                }
                maw={200}
              />
            </>
          )}
        </Card>

        <Group justify="flex-end" mt="xl">
          <Button
            variant="default"
            onClick={() =>
              navigate(`/admin/modules/${moduleId}/lessons/${lessonId}`)
            }
          >
            Cancelar
          </Button>
          <Button type="submit" loading={updateLesson.isPending}>
            Salvar Alterações
          </Button>
        </Group>
      </form>

      <ConfirmModal
        opened={deleteOpened}
        onClose={closeDelete}
        onConfirm={handleDelete}
        title="Excluir aula"
        message={`Tem certeza que deseja excluir a aula "${lesson.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        confirmColor="red"
        loading={deleteLesson.isPending}
      />
    </>
  );
}
