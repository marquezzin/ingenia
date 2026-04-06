/**
 * ExerciseListItem — Item de exercício na lista da aula.
 *
 * Exibe número da sequência, título, badge de status com feedback
 * visual sobre progresso e tentativas.
 */
import {
  Badge,
  Group,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import {
  CheckCircle2,
  Circle,
  Code2,
  PlayCircle,
} from "lucide-react";
import type { ProgressStatus, StudentExerciseListItem as ExerciseItem } from "../types";
import { getProgressStatusLabel } from "../model";
import classes from "./ExerciseListItem.module.css";

interface ExerciseListItemProps {
  exercise: ExerciseItem;
  /** 1-based index for human-readable display. */
  index: number;
  onClick?: () => void;
}

const STATUS_COLORS: Record<ProgressStatus, string> = {
  NOT_STARTED: "gray",
  IN_PROGRESS: "brand",
  COMPLETED: "teal",
};

const STATUS_ICONS: Record<ProgressStatus, React.ReactNode> = {
  NOT_STARTED: <Circle size={16} />,
  IN_PROGRESS: <PlayCircle size={16} />,
  COMPLETED: <CheckCircle2 size={16} />,
};

export function ExerciseListItem({ exercise, index, onClick }: ExerciseListItemProps) {
  const status: ProgressStatus =
    exercise.progress?.progress_status ?? "NOT_STARTED";

  return (
    <UnstyledButton onClick={onClick} className={classes.root}>
      <Group wrap="nowrap" gap="md" align="center">
        {/* Status icon */}
        <ThemeIcon
          size="lg"
          radius="xl"
          variant={status === "COMPLETED" ? "filled" : "light"}
          color={STATUS_COLORS[status]}
          className={classes.icon}
        >
          {STATUS_ICONS[status]}
        </ThemeIcon>

        {/* Content */}
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Group gap="xs" align="center">
            <Text size="xs" c="dimmed" fw={500}>
              Exercício {index}
            </Text>
            <Badge
              size="xs"
              variant="light"
              color={STATUS_COLORS[status]}
            >
              {getProgressStatusLabel(status)}
            </Badge>
            {exercise.progress && exercise.progress.attempts_count > 0 && (
              <Badge size="xs" variant="outline" color="dimmed">
                {exercise.progress.attempts_count}{" "}
                {exercise.progress.attempts_count === 1 ? "tentativa" : "tentativas"}
              </Badge>
            )}
          </Group>
          <Text fw={600} size="sm" lineClamp={1}>
            {exercise.title}
          </Text>
        </Stack>

        {/* Code icon */}
        <Code2 size={16} color="var(--color-text-muted)" />
      </Group>
    </UnstyledButton>
  );
}
