/**
 * ProgressPageSkeleton — Skeleton de carregamento para a tela de progresso.
 *
 * Exibe placeholders para os stat cards, ring progress e cards de módulos.
 */

import { Card, Group, SimpleGrid, Skeleton, Stack } from "@mantine/core";

export function ProgressPageSkeleton() {
  return (
    <Stack gap="lg">
      {/* Stat cards skeleton */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Skeleton width={80} height={12} mb="xs" />
                <Skeleton width={60} height={24} />
              </div>
              <Skeleton width={40} height={40} radius="md" />
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {/* Ring progress skeleton */}
      <Card padding="xl" radius="md" withBorder>
        <Group justify="center" gap="xl">
          <Skeleton width={120} height={120} circle />
          <div>
            <Skeleton width={200} height={16} mb="sm" />
            <Skeleton width={150} height={14} mb="xs" />
            <Skeleton width={180} height={14} />
          </div>
        </Group>
      </Card>

      {/* Module cards skeleton */}
      <div>
        <Skeleton width={180} height={20} mb="md" />
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} padding="lg" radius="md" withBorder>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Skeleton width="60%" height={16} />
                  <Skeleton width={70} height={20} radius="sm" />
                </Group>
                <Skeleton width="100%" height={6} radius="xl" />
                <Group gap="md">
                  <Skeleton width={100} height={12} />
                  <Skeleton width={120} height={12} />
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </div>
    </Stack>
  );
}
