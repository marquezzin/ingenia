/**
 * ModuleEditPage — Formulário de edição de módulo com publish/unpublish.
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

  // Populate form when data loads
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
      <Group justify="center" py="xl">
        <Loader />
      </Group>
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

  return (
    <>
      <PageHeader
        title="Editar Módulo"
        subtitle={module.title}
        breadcrumbs={breadcrumbs}
        actions={
          <Group gap="xs">
            <Button
              variant="light"
              color={module.publication_status === "PUBLISHED" ? "orange" : "green"}
              leftSection={module.publication_status === "PUBLISHED" ? <EyeOff size={16} /> : <Check size={16} />}
              onClick={handleTogglePublish}
              loading={updateModule.isPending}
            >
              {module.publication_status === "PUBLISHED"
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
            onClick={() => navigate(`/admin/modules/${module.id}`)}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={updateModule.isPending}>
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
