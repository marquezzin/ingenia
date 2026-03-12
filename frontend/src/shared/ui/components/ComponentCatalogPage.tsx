/**
 * Component Catalog — Interface de Documentação Visual (IDV)
 *
 * Acessível em /dev/components quando VITE_DEV_ROUTES=true.
 * Mostra todos os componentes da lib com variações e uso.
 */
import {
    Box,
    Button,
    Container,
    Divider,
    SimpleGrid,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import {
    BarChart3,
    DollarSign,
    Plus,
    ShoppingCart,
    Trash2,
    Users,
} from "lucide-react";
import { useState } from "react";
import {
    ConfirmModal,
    DataTable,
    EmptyState,
    FormSection,
    PageHeader,
    StatCard,
    StatusBadge,
} from "@/shared/ui/components";

// ─── Mock data ───────────────────────────────────────────────────────────────
const MOCK_USERS = [
    { id: "1", name: "João Silva", email: "joao@example.com", status: "active", role: "Admin" },
    { id: "2", name: "Maria Santos", email: "maria@example.com", status: "pending", role: "User" },
    { id: "3", name: "Pedro Costa", email: "pedro@example.com", status: "inactive", role: "User" },
    { id: "4", name: "Ana Oliveira", email: "ana@example.com", status: "active", role: "Manager" },
    { id: "5", name: "Carlos Lima", email: "carlos@example.com", status: "active", role: "User" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Box mb="xl">
            <Title order={3} mb="md" c="brand">
                {title}
            </Title>
            <Divider mb="md" />
            {children}
        </Box>
    );
}

export default function ComponentCatalogPage() {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredUsers = MOCK_USERS.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container size="lg" py="xl">
            <Title order={1} mb="xs">
                🧩 Component Catalog
            </Title>
            <Text c="dimmed" mb="xl">
                Interface de Documentação Visual — todos os componentes da lib com exemplos de uso.
            </Text>

            {/* ─── PageHeader ───────────────────────────────────────────── */}
            <Section title="PageHeader">
                <PageHeader
                    title="Gerenciar Usuários"
                    subtitle="Visualize e edite os usuários do sistema."
                    breadcrumbs={[
                        { label: "Home", href: "/" },
                        { label: "Admin", href: "/admin" },
                        { label: "Usuários" },
                    ]}
                    actions={
                        <Button leftSection={<Plus size={16} />}>
                            Novo Usuário
                        </Button>
                    }
                />
            </Section>

            {/* ─── StatCard ─────────────────────────────────────────────── */}
            <Section title="StatCard">
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
                    <StatCard
                        title="Receita Total"
                        value="R$ 125.430"
                        icon={<DollarSign size={24} />}
                        trend={{ value: 12.5, label: "vs mês anterior" }}
                    />
                    <StatCard
                        title="Usuários Ativos"
                        value="1.234"
                        icon={<Users size={24} />}
                        trend={{ value: -3.2, label: "vs mês anterior" }}
                    />
                    <StatCard
                        title="Pedidos"
                        value="456"
                        icon={<ShoppingCart size={24} />}
                        color="teal"
                    />
                    <StatCard
                        title="Conversão"
                        value="8.7%"
                        icon={<BarChart3 size={24} />}
                        trend={{ value: 1.2 }}
                        color="violet"
                    />
                </SimpleGrid>
            </Section>

            {/* ─── StatusBadge ──────────────────────────────────────────── */}
            <Section title="StatusBadge">
                <SimpleGrid cols={{ base: 2, sm: 4, lg: 6 }}>
                    <StatusBadge status="active" />
                    <StatusBadge status="inactive" />
                    <StatusBadge status="pending" />
                    <StatusBadge status="approved" />
                    <StatusBadge status="rejected" />
                    <StatusBadge status="draft" />
                    <StatusBadge status="running" />
                    <StatusBadge status="success" />
                    <StatusBadge status="failed" />
                    <StatusBadge status="cancelled" />
                    <StatusBadge status="unknown_status" />
                </SimpleGrid>
            </Section>

            {/* ─── DataTable ────────────────────────────────────────────── */}
            <Section title="DataTable">
                <DataTable
                    columns={[
                        { key: "name", label: "Nome", sortable: true },
                        { key: "email", label: "E-mail", sortable: true },
                        { key: "role", label: "Perfil" },
                        {
                            key: "status",
                            label: "Status",
                            render: (row) => <StatusBadge status={row.status as string} />,
                        },
                    ]}
                    data={filteredUsers}
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Buscar por nome ou email..."
                    pagination={{ page: 1, total: 3, onChange: () => { } }}
                    rowKey={(row) => row.id as string}
                />
            </Section>

            {/* ─── EmptyState ───────────────────────────────────────────── */}
            <Section title="EmptyState">
                <EmptyState
                    title="Nenhum projeto encontrado"
                    description="Crie um novo projeto para começar a organizar seu trabalho."
                    action={<Button leftSection={<Plus size={16} />}>Novo Projeto</Button>}
                />
            </Section>

            {/* ─── FormSection ──────────────────────────────────────────── */}
            <Section title="FormSection">
                <FormSection
                    title="Informações Pessoais"
                    description="Dados básicos do perfil do usuário."
                >
                    <TextInput label="Nome completo" placeholder="João Silva" />
                    <TextInput label="E-mail" placeholder="joao@example.com" />
                </FormSection>
                <FormSection
                    title="Configurações"
                    description="Preferências de notificação."
                    withDivider={false}
                >
                    <TextInput label="Webhook URL" placeholder="https://..." />
                </FormSection>
            </Section>

            {/* ─── ConfirmModal ─────────────────────────────────────────── */}
            <Section title="ConfirmModal">
                <Button
                    color="red"
                    variant="light"
                    leftSection={<Trash2 size={16} />}
                    onClick={() => setConfirmOpen(true)}
                >
                    Abrir modal de confirmação
                </Button>
                <ConfirmModal
                    opened={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={() => setConfirmOpen(false)}
                    title="Excluir registro"
                    message="Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita."
                    confirmLabel="Excluir"
                    confirmColor="red"
                />
            </Section>
        </Container>
    );
}
