/**
 * ExercisePageSkeleton — Loading skeleton for the exercise page.
 */
import { Card, Skeleton, Stack } from "@mantine/core";

export function ExercisePageSkeleton() {
  return (
    <Stack gap="lg">
      {/* Header skeleton */}
      <Skeleton height={32} width="60%" />
      <Skeleton height={16} width="40%" />

      <Card padding="lg" radius="md" withBorder>
        <Stack gap="sm">
          <Skeleton height={20} width="35%" />
          <Skeleton height={14} />
          <Skeleton height={14} />
          <Skeleton height={14} width="85%" />
          <Skeleton height={14} width="60%" />
        </Stack>
      </Card>

      <Skeleton height={520} radius="md" />
      <Skeleton height={340} radius="md" />
    </Stack>
  );
}
