/**
 * ModuleCard — Card de módulo para a trilha do aluno.
 *
 * Exibe título, descrição, progresso visual (barra + %), lesson_count e status.
 */
import {
  Badge,
  Card,
  Group,
  Progress,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { BookOpen, CheckCircle2, PlayCircle } from "lucide-react";
import type { StudentModule } from "../types";
import { getProgressStatusLabel } from "../model";
import type { ProgressStatus } from "../types";
import classes from "./ModuleCard.module.css";

interface ModuleCardProps {
  module: StudentModule;
  /** Completion percent (0-100), calculated from progress API or 0 if not started. */
  completionPercent: number;
  onClick?: () => void;
}

const STATUS_COLORS: Record<ProgressStatus, string> = {
  NOT_STARTED: "gray",
  IN_PROGRESS: "brand",
  COMPLETED: "teal",
};

const STATUS_ICONS: Record<ProgressStatus, React.ReactNode> = {
  NOT_STARTED: <PlayCircle size={14} />,
  IN_PROGRESS: <PlayCircle size={14} />,
  COMPLETED: <CheckCircle2 size={14} />,
};

export function ModuleCard({
  module,
  completionPercent,
  onClick,
}: ModuleCardProps) {
  const status: ProgressStatus =
    module.progress?.progress_status ?? "NOT_STARTED";

  return (
    <UnstyledButton onClick={onClick} className={classes.root}>
      <Card padding="lg" radius="md" withBorder className={classes.card}>
        <Stack gap="sm">
          <Group justify="space-between" align="flex-start">
            <Text fw={600} size="md" lineClamp={1} className={classes.title}>
              {module.title}
            </Text>
            <Badge
              size="sm"
              variant="light"
              color={STATUS_COLORS[status]}
              leftSection={STATUS_ICONS[status]}
            >
              {getProgressStatusLabel(status)}
            </Badge>
          </Group>

          <Text size="sm" c="dimmed" lineClamp={2} className={classes.description}>
            {module.description}
          </Text>

          <Group gap="xs" align="center">
            <BookOpen size={14} color="var(--color-text-muted)" />
            <Text size="xs" c="dimmed">
              {module.lesson_count}{" "}
              {module.lesson_count === 1 ? "aula" : "aulas"}
            </Text>
          </Group>

          <div>
            <Group justify="space-between" mb={4}>
              <Text size="xs" c="dimmed">
                Progresso
              </Text>
              <Text size="xs" fw={600} c={completionPercent === 100 ? "teal" : "dimmed"}>
                {completionPercent}%
              </Text>
            </Group>
            <Progress
              value={completionPercent}
              size="sm"
              radius="xl"
              color={completionPercent === 100 ? "teal" : "brand"}
              animated={status === "IN_PROGRESS"}
            />
          </div>
        </Stack>
      </Card>
    </UnstyledButton>
  );
}
