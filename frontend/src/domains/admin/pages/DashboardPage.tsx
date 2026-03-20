/**
 * Admin Dashboard Page — Visão geral com métricas e atalhos rápidos.
 */
import { Alert, Button, Group, SimpleGrid, Skeleton } from "@mantine/core";
import {
  BookOpen,
  GraduationCap,
  FileCode2,
  Users,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/shared/ui/components";
import { StatCard } from "@/shared/ui/components";
import { useAdminDashboardStats } from "../hooks";

const BREADCRUMBS = [
  { label: "Admin", href: "/admin" },
  { label: "Dashboard" },
];

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useAdminDashboardStats();
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral da plataforma"
        breadcrumbs={BREADCRUMBS}
      />

      {isError && (
        <Alert
          icon={<AlertCircle size={16} />}
          title="Erro ao carregar estatísticas"
          color="red"
          mb="lg"
        >
          Não foi possível carregar os dados do dashboard. Tente novamente mais
          tarde.
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} mb="xl">
        {isLoading ? (
          <>
            <Skeleton height={120} radius="md" />
            <Skeleton height={120} radius="md" />
            <Skeleton height={120} radius="md" />
            <Skeleton height={120} radius="md" />
          </>
        ) : (
          <>
            <StatCard
              title="Módulos"
              value={stats?.total_modules ?? 0}
              icon={<BookOpen size={22} />}
              color="brand"
            />
            <StatCard
              title="Aulas"
              value={stats?.total_lessons ?? 0}
              icon={<GraduationCap size={22} />}
              color="teal"
            />
            <StatCard
              title="Exercícios"
              value={stats?.total_exercises ?? 0}
              icon={<FileCode2 size={22} />}
              color="grape"
            />
            <StatCard
              title="Usuários"
              value={stats?.total_users ?? 0}
              icon={<Users size={22} />}
              color="orange"
            />
          </>
        )}
      </SimpleGrid>

      <PageHeader title="Ações Rápidas" />
      <Group>
        <Button
          leftSection={<Plus size={16} />}
          onClick={() => navigate("/admin/modules/new")}
        >
          Novo Módulo
        </Button>
        <Button
          variant="light"
          leftSection={<Plus size={16} />}
          onClick={() => navigate("/admin/users/new")}
        >
          Novo Usuário
        </Button>
      </Group>
    </>
  );
}
