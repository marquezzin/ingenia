/**
 * UserDetailPage — Detalhe do usuário com informações de profile.
 */
import {
  Alert,
  Button,
  Card,
  Flex,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  AlertCircle,
  Calendar,
  Edit,
  Mail,
  Shield,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, StatusBadge } from "@/shared/ui/components";
import { useUser } from "../../hooks";
import {
  ACCOUNT_STATUS_MAP,
  formatDate,
  ROLE_MAP,
} from "../../model";

/** Labels dos campos de profile — baseados no verbose_name dos models Django */
const PROFILE_FIELD_LABELS: Record<string, string> = {
  learning_status: "Status de aprendizagem",
  first_started_at: "Primeira vez iniciada em",
};

/** Labels dos valores de enums de profile */
const PROFILE_VALUE_LABELS: Record<string, string> = {
  NOT_STARTED: "Não iniciada",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluída",
};

/** Formata o valor de um campo de profile para exibição */
const formatProfileValue = (key: string, value: unknown): string => {
  if (value === null || value === undefined) return "—";
  const strValue = String(value);
  // Se é um campo de data (termina em _at), formata como data
  if (key.endsWith("_at") && strValue !== "—") {
    return formatDate(strValue);
  }
  // Se o valor tem tradução, usa ela
  return PROFILE_VALUE_LABELS[strValue] ?? strValue;
};

const BREADCRUMBS_BASE = [
  { label: "Admin", href: "/admin" },
  { label: "Usuários", href: "/admin/users" },
];

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useUser(userId!);

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

  const breadcrumbs = [...BREADCRUMBS_BASE, { label: user.full_name }];

  return (
    <>
      <PageHeader
        title={user.full_name}
        breadcrumbs={breadcrumbs}
        actions={
          <Button
            leftSection={<Edit size={16} />}
            variant="light"
            radius="md"
            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
            styles={{
              root: {
                transition: "transform 150ms ease",
              },
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Editar
          </Button>
        }
      />

      {/* User Info Card */}
      <Card
        withBorder
        mb="xl"
        padding="xl"
        radius="md"
        style={{
          borderColor: "var(--color-border)",
          background:
            "linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-elevated) 60%, var(--color-bg-subtle) 100%)",
        }}
      >
        <Stack gap="md">
          {/* Status badges */}
          <Group gap="sm">
            <StatusBadge status={user.role} statusMap={ROLE_MAP} />
            <StatusBadge
              status={user.account_status}
              statusMap={ACCOUNT_STATUS_MAP}
            />
          </Group>

          {/* Stats row */}
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt="xs">
            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                <Mail size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>
                  Email
                </Text>
                <Text size="sm" fw={600} lh={1.3}>
                  {user.email}
                </Text>
              </div>
            </Group>

            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="grape" size="lg" radius="md">
                <Shield size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>
                  Perfil
                </Text>
                <Text size="sm" fw={600} lh={1.3}>
                  {ROLE_MAP[user.role]?.label ?? user.role}
                </Text>
              </div>
            </Group>

            <Group gap="sm" align="center">
              <ThemeIcon variant="light" color="teal" size="lg" radius="md">
                <Calendar size={18} />
              </ThemeIcon>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600} lh={1}>
                  Cadastrado em
                </Text>
                <Text size="sm" fw={600} lh={1.3}>
                  {formatDate(user.date_joined)}
                </Text>
              </div>
            </Group>
          </SimpleGrid>

          {/* Profile info */}
          {user.profile_info &&
            Object.keys(user.profile_info).length > 0 && (
              <Card withBorder padding="md" radius="md" mt="xs">
                <Text
                  size="sm"
                  fw={600}
                  tt="uppercase"
                  c="dimmed"
                  mb="sm"
                >
                  Informações do Perfil
                </Text>
                <Stack gap="xs">
                  {Object.entries(user.profile_info).map(([key, value]) => (
                    <Group key={key} gap="sm">
                      <Text size="sm" c="dimmed" w={200}>
                        {PROFILE_FIELD_LABELS[key] ?? key}:
                      </Text>
                      <Text size="sm" fw={500}>
                        {formatProfileValue(key, value)}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Card>
            )}
        </Stack>
      </Card>
    </>
  );
}
