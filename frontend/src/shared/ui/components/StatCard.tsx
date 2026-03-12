/**
 * StatCard — Card de estatística com valor, label, ícone e trend.
 *
 * Uso:
 *   <StatCard
 *     title="Usuários Ativos"
 *     value={1234}
 *     icon={<Users size={24} />}
 *     trend={{ value: 12.5, label: "vs mês anterior" }}
 *   />
 */
import { Card, Flex, Group, Text, ThemeIcon } from "@mantine/core";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

export interface StatCardTrend {
    value: number;  // positivo = up, negativo = down
    label?: string;
}

export interface StatCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: StatCardTrend;
    color?: string;
}

export function StatCard({ title, value, icon, trend, color = "brand" }: StatCardProps) {
    const trendColor = trend && trend.value >= 0 ? "teal" : "red";
    const TrendIcon = trend && trend.value >= 0 ? TrendingUp : TrendingDown;

    return (
        <Card padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
                <div>
                    <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                        {title}
                    </Text>
                    <Text size="xl" fw={700} mt="xs">
                        {value}
                    </Text>
                </div>
                {icon && (
                    <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="light"
                        color={color}
                    >
                        {icon}
                    </ThemeIcon>
                )}
            </Group>
            {trend && (
                <Flex align="center" gap={4} mt="md">
                    <TrendIcon size={16} color={`var(--mantine-color-${trendColor}-6)`} />
                    <Text size="sm" c={trendColor} fw={500}>
                        {trend.value > 0 ? "+" : ""}
                        {trend.value}%
                    </Text>
                    {trend.label && (
                        <Text size="xs" c="dimmed">
                            {trend.label}
                        </Text>
                    )}
                </Flex>
            )}
        </Card>
    );
}
