/**
 * ExerciseCreatePage — Formulário de criação de exercício (design aprimorado).
 */
import {
  Alert,
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { AlertCircle, ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/shared/ui/components";
import { useCreateExercise, useLesson, useModule } from "../../hooks";
import { getApiErrorMessage } from "../../model";

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

export default function ExerciseCreatePage() {
  const { moduleId, lessonId } = useParams<{
    moduleId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const createExercise = useCreateExercise();
  const { data: module } = useModule(moduleId!);
  const { data: lesson } = useLesson(moduleId!, lessonId!);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      title: "",
      statement: "",
      support_message: "",
      sequence_order: 1,
    },
  });

  const onSubmit = (data: ExerciseFormData) => {
    createExercise.mutate(
      {
        moduleId: moduleId!,
        lessonId: lessonId!,
        payload: {
          title: data.title,
          statement: data.statement,
          support_message: data.support_message || null,
          sequence_order: data.sequence_order,
        },
      },
      {
        onSuccess: (exercise) => {
          navigate(
            `/admin/modules/${moduleId}/lessons/${lessonId}/exercises/${exercise.id}`,
          );
        },
      },
    );
  };

  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: "Módulos", href: "/admin/modules" },
    { label: module?.title ?? "Módulo", href: `/admin/modules/${moduleId}` },
    { label: lesson?.title ?? "Aula", href: `/admin/modules/${moduleId}/lessons/${lessonId}` },
    { label: "Novo Exercício" },
  ];

  return (
    <>
      <PageHeader
        title="Novo Exercício"
        subtitle="Crie um novo exercício para esta aula"
        breadcrumbs={breadcrumbs}
      />

      {createExercise.isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao criar exercício"
          color="red"
          mb="lg"
        >
          {getApiErrorMessage(createExercise.error, "Não foi possível criar o exercício. Verifique os dados e tente novamente.")}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card withBorder padding="xl" radius="md" mb="lg">
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
            onClick={() => navigate(`/admin/modules/${moduleId}/lessons/${lessonId}`)}
            styles={{ root: { transition: "transform 150ms ease" } }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={createExercise.isPending}
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
            Salvar Exercício
          </Button>
        </Group>
      </form>
    </>
  );
}
