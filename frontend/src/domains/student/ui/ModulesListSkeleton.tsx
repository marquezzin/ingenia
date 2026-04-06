/**
 * ModulesListSkeleton — Placeholder de carregamento para a lista de módulos.
 */
import { Card, Group, SimpleGrid, Skeleton, Stack } from "@mantine/core";

export function ModulesListSkeleton() {
  return (
    <Stack gap="lg">
      {/* Search + filters skeleton */}
      <Group gap="md">
        <Skeleton height={36} style={{ flex: 1 }} radius="md" />
        <Skeleton height={36} width={320} radius="md" />
      </Group>

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
