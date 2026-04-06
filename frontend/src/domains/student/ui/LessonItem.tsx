/**
 * LessonItem — Item de aula na lista do detalhe do módulo.
 *
 * Exibe número da sequência, título, badge de status, indicadores
 * de vídeo e exercícios, com hover effect para navegação.
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
  BookOpen,
  CheckCircle2,
  Circle,
  FileCode2,
  PlayCircle,
  Video,
} from "lucide-react";
import type { ProgressStatus, StudentLesson } from "../types";
import { getProgressStatusLabel } from "../model";
import classes from "./LessonItem.module.css";

interface LessonItemProps {
  lesson: StudentLesson;
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

export function LessonItem({ lesson, index, onClick }: LessonItemProps) {
  const status: ProgressStatus =
    lesson.progress?.progress_status ?? "NOT_STARTED";

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
              Aula {index}
            </Text>
            <Badge
              size="xs"
              variant="light"
              color={STATUS_COLORS[status]}
            >
              {getProgressStatusLabel(status)}
            </Badge>
          </Group>
          <Text fw={600} size="sm" lineClamp={1}>
            {lesson.title}
          </Text>
        </Stack>

        {/* Metadata */}
        <Group gap="md" wrap="nowrap" className={classes.meta}>
          {lesson.has_video && (
            <Group gap={4} wrap="nowrap">
              <Video size={14} color="var(--color-text-muted)" />
              <Text size="xs" c="dimmed">
                Vídeo
              </Text>
            </Group>
          )}
          {lesson.exercise_count > 0 && (
            <Group gap={4} wrap="nowrap">
              <FileCode2 size={14} color="var(--color-text-muted)" />
              <Text size="xs" c="dimmed">
                {lesson.exercise_count}{" "}
                {lesson.exercise_count === 1 ? "exercício" : "exercícios"}
              </Text>
            </Group>
          )}
          {lesson.exercise_count === 0 && !lesson.has_video && (
            <Group gap={4} wrap="nowrap">
              <BookOpen size={14} color="var(--color-text-muted)" />
              <Text size="xs" c="dimmed">
                Leitura
              </Text>
            </Group>
          )}
        </Group>
      </Group>
    </UnstyledButton>
  );
}
