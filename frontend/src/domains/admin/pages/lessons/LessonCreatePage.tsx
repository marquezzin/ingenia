/**
 * LessonCreatePage — Formulário de criação de aula dentro de um módulo.
 */
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Group,
  NumberInput,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/shared/ui/components";
import { useCreateLesson, useModule } from "../../hooks";
import { getApiErrorMessage } from "../../model";

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

export default function LessonCreatePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const createLesson = useCreateLesson();
  const { data: module } = useModule(moduleId!);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      written_content: "",
      sequence_order: 1,
      has_video: false,
    },
  });

  const hasVideo = watch("has_video");

  const onSubmit = (data: LessonFormData) => {
    createLesson.mutate(
      {
        moduleId: moduleId!,
        payload: {
          title: data.title,
          written_content: data.written_content,
          sequence_order: data.sequence_order,
          video_lesson: data.has_video && data.video_lesson
            ? {
                title: data.video_lesson.title,
                video_url: data.video_lesson.video_url,
                duration_seconds: data.video_lesson.duration_seconds ?? null,
              }
            : null,
        },
      },
      {
        onSuccess: (lesson) => {
          navigate(
            `/admin/modules/${moduleId}/lessons/${lesson.id}`,
          );
        },
      },
    );
  };

  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Módulos", href: "/admin/modules" },
    {
      label: module?.title ?? "Módulo",
      href: `/admin/modules/${moduleId}`,
    },
    { label: "Nova Aula" },
  ];

  return (
    <>
      <PageHeader
        title="Nova Aula"
        subtitle="Crie uma nova aula para este módulo"
        breadcrumbs={breadcrumbs}
      />

      {createLesson.isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao criar aula"
          color="red"
          mb="lg"
        >
          {getApiErrorMessage(
            createLesson.error,
            "Não foi possível criar a aula. Verifique os dados e tente novamente.",
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
              <Text size="sm" c="dimmed" mb="sm">
                Dados da videoaula
              </Text>
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
            onClick={() => navigate(`/admin/modules/${moduleId}`)}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={createLesson.isPending}>
            Salvar Aula
          </Button>
        </Group>
      </form>
    </>
  );
}
