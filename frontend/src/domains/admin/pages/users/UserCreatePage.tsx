/**
 * UserCreatePage — Formulário de criação de usuário por role.
 */
import {
  Alert,
  Button,
  Card,
  Group,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { AlertCircle, ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/shared/ui/components";
import { useCreateUser } from "../../hooks";
import { getApiErrorMessage } from "../../model";

const BREADCRUMBS = [
  { label: "Admin", href: "/admin" },
  { label: "Usuários", href: "/admin/users" },
  { label: "Novo Usuário" },
];

const ROLE_OPTIONS = [
  { value: "STUDENT", label: "Aluno" },
  { value: "TEACHER", label: "Professor" },
  { value: "ADMIN", label: "Administrador" },
];

const userSchema = z.object({
  full_name: z
    .string()
    .min(1, "Nome completo é obrigatório")
    .max(300, "Nome deve ter no máximo 300 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .refine((val) => /\d/.test(val), "Senha deve conter ao menos um número"),
  role: z.enum(["STUDENT", "TEACHER", "ADMIN"], {
    required_error: "Selecione um perfil",
  }),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserCreatePage() {
  const navigate = useNavigate();
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      role: "STUDENT",
    },
  });

  const onSubmit = (data: UserFormData) => {
    createUser.mutate(data, {
      onSuccess: (user) => {
        navigate(`/admin/users/${user.id}`);
      },
    });
  };

  return (
    <>
      <PageHeader
        title="Novo Usuário"
        subtitle="Crie uma nova conta de usuário na plataforma"
        breadcrumbs={BREADCRUMBS}
      />

      {createUser.isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao criar usuário"
          color="red"
          mb="lg"
        >
          {getApiErrorMessage(
            createUser.error,
            "Não foi possível criar o usuário. Verifique os dados e tente novamente.",
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
            <PasswordInput
              label="Senha"
              placeholder="Mínimo 8 caracteres, com ao menos um número"
              error={errors.password?.message}
              {...register("password")}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  label="Perfil"
                  placeholder="Selecione o perfil"
                  data={ROLE_OPTIONS}
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  error={errors.role?.message}
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
            onClick={() => navigate("/admin/users")}
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
            loading={createUser.isPending}
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
            Salvar Usuário
          </Button>
        </Group>
      </form>
    </>
  );
}
