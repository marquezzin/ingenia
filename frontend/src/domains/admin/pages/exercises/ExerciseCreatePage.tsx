/**
 * ExerciseCreatePage — Formulário de criação de exercício dentro de uma aula.
 */
import {
  Alert,
  Button,
  Group,
  NumberInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { AlertCircle } from "lucide-react";
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
    {
      label: module?.title ?? "Módulo",
      href: `/admin/modules/${moduleId}`,
    },
    {
      label: lesson?.title ?? "Aula",
      href: `/admin/modules/${moduleId}/lessons/${lessonId}`,
    },
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
          {getApiErrorMessage(
            createExercise.error,
            "Não foi possível criar o exercício. Verifique os dados e tente novamente.",
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
              navigate(`/admin/modules/${moduleId}/lessons/${lessonId}`)
            }
          >
            Cancelar
          </Button>
          <Button type="submit" loading={createExercise.isPending}>
            Salvar Exercício
          </Button>
        </Group>
      </form>
    </>
  );
}
