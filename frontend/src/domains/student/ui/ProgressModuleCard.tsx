/**
 * ProgressModuleCard — Card de progresso individual por módulo.
 *
 * Exibe título, barra de progresso, contagens (aulas X/Y, exercícios X/Y)
 * e badge de status. Clicável para navegar ao detalhe do módulo.
 */

import {
  Badge,
  Card,
  Group,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import { BookOpen, CheckCircle2, FileCode2 } from "lucide-react";

import type { ModuleProgressSummary } from "../types";
import { getProgressStatusLabel } from "../model";
import { getModuleCompletionPercent } from "../model";
import classes from "./ProgressModuleCard.module.css";

interface ProgressModuleCardProps {
  progress: ModuleProgressSummary;
  onClick?: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  NOT_STARTED: "gray",
  IN_PROGRESS: "blue",
  COMPLETED: "green",
};

export function ProgressModuleCard({ progress, onClick }: ProgressModuleCardProps) {
  const percent = getModuleCompletionPercent(progress);
  const statusColor = STATUS_COLORS[progress.progress_status] ?? "gray";

  return (
    <Card
      className={classes.card}
      padding="lg"
      radius="md"
      withBorder
      onClick={onClick}
    >
      <Stack gap="sm">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Text fw={600} size="md" lineClamp={2} style={{ flex: 1 }}>
            {progress.module_title}
          </Text>
          <Badge color={statusColor} variant="light" size="sm" radius="sm">
            {getProgressStatusLabel(progress.progress_status)}
          </Badge>
        </Group>

        {/* Progress bar */}
        <div>
          <Group justify="space-between" mb={4}>
            <Text size="xs" c="dimmed">
              Progresso
            </Text>
            <Text size="xs" fw={600} c={statusColor}>
              {percent}%
            </Text>
          </Group>
          <Progress
            value={percent}
            color={statusColor}
            size="sm"
            radius="xl"
            animated={progress.progress_status === "IN_PROGRESS"}
          />
        </div>

        {/* Counters */}
        <div className={classes.counters}>
          <div className={classes.counter}>
            <BookOpen size={14} color="var(--mantine-color-dimmed)" />
            <Text size="xs" c="dimmed">
              Aulas: {progress.completed_lessons}/{progress.total_lessons}
            </Text>
          </div>
          <div className={classes.counter}>
            <FileCode2 size={14} color="var(--mantine-color-dimmed)" />
            <Text size="xs" c="dimmed">
              Exercícios: {progress.completed_exercises}/{progress.total_exercises}
            </Text>
          </div>
          {progress.completed_at && (
            <div className={classes.counter}>
              <CheckCircle2 size={14} color="var(--mantine-color-green-6)" />
              <Text size="xs" c="green">
                Concluído
              </Text>
            </div>
          )}
        </div>
      </Stack>
    </Card>
  );
}
