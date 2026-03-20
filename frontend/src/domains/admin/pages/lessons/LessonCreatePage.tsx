/**
 * LessonCreatePage — Formulário de criação de aula (design aprimorado).
 */
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Group,
  NumberInput,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { AlertCircle, ArrowLeft, Save, Video } from "lucide-react";
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
          navigate(`/admin/modules/${moduleId}/lessons/${lesson.id}`);
        },
      },
    );
  };

  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Módulos", href: "/admin/modules" },
    { label: module?.title ?? "Módulo", href: `/admin/modules/${moduleId}` },
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
          {getApiErrorMessage(createLesson.error, "Não foi possível criar a aula. Verifique os dados e tente novamente.")}
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
            Conteúdo Escrito (Markdown)
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
            onClick={() => navigate(`/admin/modules/${moduleId}`)}
            styles={{ root: { transition: "transform 150ms ease" } }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={createLesson.isPending}
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
            Salvar Aula
          </Button>
        </Group>
      </form>
    </>
  );
}
