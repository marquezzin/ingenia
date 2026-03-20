/**
 * ModuleCreatePage — Formulário de criação de módulo (design aprimorado).
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
        <Card withBorder padding="xl" radius="md" mb="xl">
          <Text size="sm" fw={600} tt="uppercase" c="dimmed" mb="lg">
            Informações do Módulo
          </Text>
          <Stack gap="md">
            <TextInput
              label="Título"
              placeholder="Ex: Introdução à Programação"
              error={errors.title?.message}
              {...register("title")}
            />
            <Textarea
              label="Descrição"
              placeholder="Descreva o conteúdo e os objetivos do módulo..."
              minRows={4}
              error={errors.description?.message}
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
              w={120}
            />
          </Stack>
        </Card>

        <Group justify="flex-end">
          <Button
            variant="default"
            radius="md"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate("/admin/modules")}
            styles={{ root: { transition: "transform 150ms ease" } }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={createModule.isPending}
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
            Salvar Módulo
          </Button>
        </Group>
      </form>
    </>
  );
}
