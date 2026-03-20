/**
 * LessonEditPage — Formulário de edição de aula (design aprimorado).
 */
import {
  Alert,
  Button,
  Card,
  Checkbox,
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
import { AlertCircle, ArrowLeft, Check, EyeOff, Save, Trash2, Video } from "lucide-react";
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
                duration_seconds: data.video_lesson.duration_seconds ?? null,
              }
              : null,
        },
      },
      {
        onSuccess: () => {
          navigate(`/admin/modules/${moduleId}/lessons/${lessonId}`);
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
      <Flex justify="center" py="xl">
        <Loader />
      </Flex>
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
    { label: module?.title ?? "Módulo", href: `/admin/modules/${moduleId}` },
    { label: lesson.title, href: `/admin/modules/${moduleId}/lessons/${lessonId}` },
    { label: "Editar" },
  ];

  const isPublished = lesson.publication_status === "PUBLISHED";

  return (
    <>
      <PageHeader
        title="Editar Aula"
        subtitle={lesson.title}
        breadcrumbs={breadcrumbs}
        actions={
          <Group gap="sm">
            <Button
              variant={isPublished ? "light" : "gradient"}
              color={isPublished ? "orange" : undefined}
              gradient={!isPublished ? { from: "teal", to: "green", deg: 135 } : undefined}
              leftSection={isPublished ? <EyeOff size={16} /> : <Check size={16} />}
              onClick={handleTogglePublish}
              loading={updateLesson.isPending}
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

      {updateLesson.isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao atualizar aula"
          color="red"
          mb="lg"
        >
          {getApiErrorMessage(updateLesson.error, "Não foi possível salvar as alterações. Tente novamente.")}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* General Info */}
        <Card withBorder padding="xl" radius="md" mb="lg">
          <Text size="sm" fw={600} tt="uppercase" c="dimmed" mb="lg">
            Informações da Aula
          </Text>
          <Stack gap="md">
            <TextInput
              label="Título"
              placeholder="Ex: Variáveis e Tipos de Dados"
              error={errors.title?.message}
              {...register("title")}
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

        {/* Written Content — separate card for large markdown */}
        <Card withBorder padding="xl" radius="md" mb="lg">
          <Text size="sm" fw={600} tt="uppercase" c="dimmed" mb="lg">
            Conteúdo Escrito
          </Text>
          <Textarea
            placeholder="Escreva o conteúdo da aula (suporta Markdown)..."
            minRows={6}
            autosize
            maxRows={20}
            error={errors.written_content?.message}
            styles={{ input: { fontFamily: 'monospace', fontSize: 'var(--text-sm)' } }}
            {...register("written_content")}
          />
        </Card>

        {/* Video Section */}
        <Card withBorder padding="xl" radius="md" mb="xl">
          <Group gap="sm" mb="lg">
            <Video size={18} style={{ color: "var(--mantine-color-blue-5)" }} />
            <Text size="sm" fw={600} tt="uppercase" c="dimmed">
              Videoaula
            </Text>
          </Group>
          <Checkbox
            label="Incluir videoaula"
            checked={hasVideo}
            onChange={(e) => setValue("has_video", e.currentTarget.checked)}
            mb={hasVideo ? "md" : 0}
          />
          {hasVideo && (
            <Stack gap="md" mt="md">
              <TextInput
                label="Título do vídeo"
                placeholder="Ex: Aula 1 - Introdução"
                error={errors.video_lesson?.title?.message}
                {...register("video_lesson.title")}
              />
              <TextInput
                label="URL do vídeo"
                placeholder="https://youtube.com/watch?v=..."
                error={errors.video_lesson?.video_url?.message}
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
            </Stack>
          )}
        </Card>

        <Group justify="flex-end">
          <Button
            variant="default"
            radius="md"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate(`/admin/modules/${moduleId}/lessons/${lessonId}`)}
            styles={{ root: { transition: "transform 150ms ease" } }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={updateLesson.isPending}
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
        title="Excluir aula"
        message={`Tem certeza que deseja excluir a aula "${lesson.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        confirmColor="red"
        loading={deleteLesson.isPending}
      />
    </>
  );
}
