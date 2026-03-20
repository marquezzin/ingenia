/**
 * UserEditPage — Formulário de edição de usuário.
 * Permite alterar nome, email e status da conta.
 * O campo role é exibido como read-only (alteração bloqueada pelo backend).
 */
import {
  Alert,
  Button,
  Card,
  Flex,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { AlertCircle, ArrowLeft, Save } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader, StatusBadge } from "@/shared/ui/components";
import { useUpdateUser, useUser } from "../../hooks";
import { getApiErrorMessage, ROLE_MAP } from "../../model";

const BREADCRUMBS_BASE = [
  { label: "Admin", href: "/admin" },
  { label: "Usuários", href: "/admin/users" },
];

const ACCOUNT_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Ativo" },
  { value: "INACTIVE", label: "Inativo" },
  { value: "SUSPENDED", label: "Suspenso" },
];

const userEditSchema = z.object({
  full_name: z
    .string()
    .min(1, "Nome completo é obrigatório")
    .max(300, "Nome deve ter no máximo 300 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  account_status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"], {
    required_error: "Selecione um status",
  }),
});

type UserEditFormData = z.infer<typeof userEditSchema>;

export default function UserEditPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useUser(userId!);
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name,
        email: user.email,
        account_status: user.account_status,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: UserEditFormData) => {
    if (!user) return;
    updateUser.mutate(
      {
        id: user.id,
        payload: data,
      },
      {
        onSuccess: () => {
          navigate(`/admin/users/${user.id}`);
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

  if (isError || !user) {
    return (
      <Alert
        icon={<AlertCircle size={16} />}
        title="Erro ao carregar usuário"
        color="red"
      >
        Não foi possível carregar os dados do usuário.
      </Alert>
    );
  }

  const breadcrumbs = [
    ...BREADCRUMBS_BASE,
    { label: user.full_name, href: `/admin/users/${user.id}` },
    { label: "Editar" },
  ];

  return (
    <>
      <PageHeader
        title="Editar Usuário"
        subtitle={user.full_name}
        breadcrumbs={breadcrumbs}
      />

      {updateUser.isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao atualizar usuário"
          color="red"
          mb="lg"
        >
          {getApiErrorMessage(
            updateUser.error,
            "Não foi possível salvar as alterações. Tente novamente.",
          )}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card withBorder padding="xl" radius="md" mb="xl">
          <Text size="sm" fw={600} tt="uppercase" c="dimmed" mb="lg">
            Informações do Usuário
          </Text>
          <Stack gap="md">
            <TextInput
              label="Nome completo"
              placeholder="Ex: João da Silva"
              error={errors.full_name?.message}
              {...register("full_name")}
            />
            <TextInput
              label="Email"
              placeholder="joao@exemplo.com"
              error={errors.email?.message}
              {...register("email")}
            />

            {/* Role — read-only */}
            <div>
              <Text size="sm" fw={500} mb={4}>
                Perfil
              </Text>
              <StatusBadge status={user.role} statusMap={ROLE_MAP} />
              <Text size="xs" c="dimmed" mt={4}>
                O perfil do usuário não pode ser alterado após a criação.
              </Text>
            </div>

            <Controller
              name="account_status"
              control={control}
              render={({ field }) => (
                <Select
                  label="Status da conta"
                  placeholder="Selecione o status"
                  data={ACCOUNT_STATUS_OPTIONS}
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  error={errors.account_status?.message}
                  w={250}
                />
              )}
            />
          </Stack>
        </Card>

        <Group justify="flex-end">
          <Button
            variant="default"
            radius="md"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate(`/admin/users/${user.id}`)}
            styles={{ root: { transition: "transform 150ms ease" } }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={updateUser.isPending}
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
    </>
  );
}
