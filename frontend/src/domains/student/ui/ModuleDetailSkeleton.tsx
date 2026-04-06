/**
 * ModuleDetailSkeleton — Placeholder de carregamento para o detalhe do módulo.
 */
import { Card, Group, Skeleton, Stack } from "@mantine/core";

export function ModuleDetailSkeleton() {
  return (
    <Stack gap="lg">
      {/* Module header */}
      <Card padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Skeleton height={28} width="60%" />
          <Skeleton height={16} width="90%" />
          <Skeleton height={16} width="40%" />
          <Group justify="space-between" mt="xs">
            <Skeleton height={14} width={100} />
            <Skeleton height={14} width={40} />
          </Group>
          <Skeleton height={10} radius="xl" />
        </Stack>
      </Card>

      {/* CTA button skeleton */}
      <Skeleton height={42} width={200} radius="md" />

      {/* Lessons list */}
      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={60} radius="md" />
        ))}
      </Stack>
    </Stack>
  );
}
