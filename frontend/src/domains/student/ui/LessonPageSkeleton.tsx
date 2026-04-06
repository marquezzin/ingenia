/**
 * LessonPageSkeleton — Loading skeleton for the lesson page.
 *
 * Shows placeholders for video, content, and exercise list
 * while the lesson data is being fetched.
 */
import { Card, Group, Skeleton, Stack } from "@mantine/core";

export function LessonPageSkeleton() {
  return (
    <Stack gap="lg">
      {/* Video placeholder */}
      <Skeleton
        height={0}
        style={{ paddingBottom: "56.25%", borderRadius: "var(--mantine-radius-md)" }}
      />

      {/* Content placeholder */}
      <Card padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Skeleton height={24} width="60%" />
          <Skeleton height={14} width="100%" />
          <Skeleton height={14} width="90%" />
          <Skeleton height={14} width="75%" />
          <Skeleton height={14} width="85%" />
          <Skeleton height={14} width="60%" />
        </Stack>
      </Card>

      {/* Exercise list placeholder */}
      <Stack gap="sm">
        <Skeleton height={20} width="30%" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Group key={i} wrap="nowrap" gap="md" p="sm">
            <Skeleton circle height={40} />
            <Stack gap={4} style={{ flex: 1 }}>
              <Skeleton height={12} width="30%" />
              <Skeleton height={16} width="70%" />
            </Stack>
          </Group>
        ))}
      </Stack>

      {/* Navigation placeholder */}
      <Group justify="space-between">
        <Skeleton height={36} width={140} />
        <Skeleton height={36} width={140} />
      </Group>
    </Stack>
  );
}
