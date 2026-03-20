/**
 * ModuleEditPage — Formulário de edição de módulo (design aprimorado).
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
import { useDeleteModule, useModule, useUpdateModule } from "../../hooks";
import { getApiErrorMessage } from "../../model";
import type { PublicationStatus } from "../../types";

const BREADCRUMBS_BASE = [
  { label: "Admin", href: "/admin" },
  { label: "Módulos", href: "/admin/modules" },
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

export default function ModuleEditPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { data: module, isLoading, isError } = useModule(moduleId!);
  const updateModule = useUpdateModule();
  const deleteModule = useDeleteModule();
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
  });

  useEffect(() => {
    if (module) {
      reset({
        title: module.title,
        description: module.description,
        sequence_order: module.sequence_order,
      });
    }
  }, [module, reset]);

  const onSubmit = (data: ModuleFormData) => {
    if (!module) return;
    updateModule.mutate(
      {
        id: module.id,
        payload: {
          ...data,
          publication_status: module.publication_status,
        },
      },
      {
        onSuccess: () => {
          navigate(`/admin/modules/${module.id}`);
        },
      },
    );
  };

  const handleTogglePublish = () => {
    if (!module) return;
    const newStatus: PublicationStatus =
      module.publication_status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    updateModule.mutate({
      id: module.id,
      payload: {
        title: module.title,
        description: module.description,
        sequence_order: module.sequence_order,
        publication_status: newStatus,
      },
    });
  };

  const handleDelete = () => {
    if (!moduleId) return;
    deleteModule.mutate(moduleId, {
      onSuccess: () => {
        navigate("/admin/modules");
      },
    });
  };

  if (isLoading) {
    return (
      <Flex justify="center" py="xl">
        <Loader />
      </Flex>
    );
  }

  if (isError || !module) {
    return (
      <Alert
        icon={<AlertCircle size={16} />}
        title="Erro ao carregar módulo"
        color="red"
      >
        Não foi possível carregar os dados do módulo.
      </Alert>
    );
  }

  const breadcrumbs = [
    ...BREADCRUMBS_BASE,
    { label: module.title, href: `/admin/modules/${module.id}` },
    { label: "Editar" },
  ];

  const isPublished = module.publication_status === "PUBLISHED";

  return (
    <>
      <PageHeader
        title="Editar Módulo"
        subtitle={module.title}
        breadcrumbs={breadcrumbs}
        actions={
          <Group gap="sm">
            <Button
              variant={isPublished ? "light" : "gradient"}
              color={isPublished ? "orange" : undefined}
              gradient={!isPublished ? { from: "teal", to: "green", deg: 135 } : undefined}
              leftSection={isPublished ? <EyeOff size={16} /> : <Check size={16} />}
              onClick={handleTogglePublish}
              loading={updateModule.isPending}
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

      {updateModule.isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao atualizar módulo"
          color="red"
          mb="lg"
        >
          {getApiErrorMessage(updateModule.error, "Não foi possível salvar as alterações. Tente novamente.")}
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
            onClick={() => navigate(`/admin/modules/${module.id}`)}
            styles={{ root: { transition: "transform 150ms ease" } }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={updateModule.isPending}
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
        title="Excluir módulo"
        message={`Tem certeza que deseja excluir o módulo "${module.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        confirmColor="red"
        loading={deleteModule.isPending}
      />
    </>
  );
}
