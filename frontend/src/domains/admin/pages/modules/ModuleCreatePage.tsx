/**
 * ModuleCreatePage — Formulário de criação de módulo.
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
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/shared/ui/components";
import { useCreateModule } from "../../hooks";
import { getApiErrorMessage } from "../../model";

const BREADCRUMBS = [
  { label: "Admin", href: "/admin" },
  { label: "Módulos", href: "/admin/modules" },
  { label: "Novo Módulo" },
];

const moduleSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(255, "Título deve ter no máximo 255 caracteres"),
  description: z.string().min(1, "Descrição é obrigatória"),
  sequence_order: z
    .number({ invalid_type_error: "Ordem é obrigatória" })
    .int("Deve ser um número inteiro")
    .min(1, "Ordem deve ser no mínimo 1"),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

export default function ModuleCreatePage() {
  const navigate = useNavigate();
  const createModule = useCreateModule();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
      sequence_order: 1,
    },
  });

  const onSubmit = (data: ModuleFormData) => {
    createModule.mutate(data, {
      onSuccess: (module) => {
        navigate(`/admin/modules/${module.id}`);
      },
    });
  };

  return (
    <>
      <PageHeader
        title="Novo Módulo"
        subtitle="Crie um novo módulo para a trilha de aprendizagem"
        breadcrumbs={BREADCRUMBS}
      />

      {createModule.isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao criar módulo"
          color="red"
          mb="lg"
        >
          {getApiErrorMessage(createModule.error, "Não foi possível criar o módulo. Verifique os dados e tente novamente.")}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
            label="Título"
            placeholder="Ex: Introdução à Programação"
            error={errors.title?.message}
            mb="md"
            {...register("title")}
          />
          <Textarea
            label="Descrição"
            placeholder="Descreva o conteúdo e os objetivos do módulo..."
            minRows={4}
            error={errors.description?.message}
            mb="md"
            {...register("description")}
          />
          <NumberInput
            label="Ordem na trilha"
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
            onClick={() => navigate("/admin/modules")}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={createModule.isPending}>
            Salvar Módulo
          </Button>
        </Group>
      </form>
    </>
  );
}
