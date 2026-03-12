/**
 * PageHeader — Título da página com breadcrumbs e ações.
 *
 * Uso:
 *   <PageHeader
 *     title="Usuários"
 *     subtitle="Gerencie os usuários do sistema"
 *     actions={<Button>Novo Usuário</Button>}
 *     breadcrumbs={[
 *       { label: "Home", href: "/" },
 *       { label: "Usuários" },
 *     ]}
 *   />
 */
import {
    Anchor,
    Breadcrumbs,
    Flex,
    Group,
    Text,
    Title,
} from "@mantine/core";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export function PageHeader({ title, subtitle, actions, breadcrumbs }: PageHeaderProps) {
    return (
        <Flex direction="column" gap="xs" mb="lg">
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs
                    separator={<ChevronRight size={14} />}
                    separatorMargin={4}
                >
                    {breadcrumbs.map((item, i) =>
                        item.href ? (
                            <Anchor key={i} href={item.href} size="sm" c="dimmed">
                                {item.label}
                            </Anchor>
                        ) : (
                            <Text key={i} size="sm" c="dimmed">
                                {item.label}
                            </Text>
                        )
                    )}
                </Breadcrumbs>
            )}
            <Group justify="space-between" align="flex-end">
                <div>
                    <Title order={2}>{title}</Title>
                    {subtitle && (
                        <Text c="dimmed" size="sm" mt={4}>
                            {subtitle}
                        </Text>
                    )}
                </div>
                {actions && <Group gap="sm">{actions}</Group>}
            </Group>
        </Flex>
    );
}
