/**
 * EmptyState — Placeholder para listas/tabelas sem dados.
 *
 * Uso:
 *   <EmptyState
 *     icon={<FileSearch size={48} />}
 *     title="Nenhum resultado"
 *     description="Tente ajustar os filtros."
 *     action={<Button>Criar novo</Button>}
 *   />
 */
import { Flex, Text, Title } from "@mantine/core";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
}

export function EmptyState({
    title = "Nenhum item encontrado",
    description,
    icon,
    action,
}: EmptyStateProps) {
    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            gap="md"
            py="xl"
            px="md"
            style={{ minHeight: 200 }}
        >
            <div style={{ color: "var(--color-text-muted)", opacity: 0.6 }}>
                {icon || <Inbox size={48} />}
            </div>
            <Title order={4} c="dimmed" ta="center">
                {title}
            </Title>
            {description && (
                <Text size="sm" c="dimmed" ta="center" maw={360}>
                    {description}
                </Text>
            )}
            {action && <div style={{ marginTop: "var(--space-sm)" }}>{action}</div>}
        </Flex>
    );
}
