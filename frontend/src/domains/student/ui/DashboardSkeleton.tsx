/**
 * DashboardSkeleton — Placeholder de carregamento para o Dashboard do aluno.
 */
import { Card, Group, SimpleGrid, Skeleton, Stack } from "@mantine/core";

export function DashboardSkeleton() {
  return (
    <Stack gap="lg">
      {/* Stat cards skeleton */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={120} radius="md" />
        ))}
      </SimpleGrid>

      {/* Continue study card skeleton */}
      <Skeleton height={80} radius="md" />

      {/* Module cards skeleton */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} padding="lg" radius="md" withBorder>
            <Stack gap="sm">
              <Group justify="space-between">
                <Skeleton height={20} width="60%" />
                <Skeleton height={20} width={80} radius="xl" />
              </Group>
              <Skeleton height={40} />
              <Skeleton height={14} width="30%" />
              <Skeleton height={8} radius="xl" />
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
