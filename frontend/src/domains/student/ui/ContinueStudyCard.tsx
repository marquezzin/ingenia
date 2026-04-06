/**
 * ContinueStudyCard — Card destaque "Continuar de onde parei".
 *
 * Shows the next recommended module/action for the student.
 */
import {
  Button,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { ArrowRight, Rocket } from "lucide-react";
import type { StudentModule } from "../types";
import classes from "./ContinueStudyCard.module.css";

interface ContinueStudyCardProps {
  /** The module the student should continue. Null if nothing to continue. */
  module: StudentModule | null;
  onContinue?: () => void;
}

export function ContinueStudyCard({
  module,
  onContinue,
}: ContinueStudyCardProps) {
  if (!module) {
    return (
      <Card padding="lg" radius="md" withBorder className={classes.card}>
        <Group align="center" gap="md">
          <ThemeIcon size="xl" radius="md" variant="light" color="teal">
            <Rocket size={22} />
          </ThemeIcon>
          <Stack gap={2}>
            <Text fw={600} size="md">
              🎉 Parabéns!
            </Text>
            <Text size="sm" c="dimmed">
              Você concluiu todos os módulos disponíveis. Continue praticando!
            </Text>
          </Stack>
        </Group>
      </Card>
    );
  }

  const isNew = !module.progress || module.progress.progress_status === "NOT_STARTED";

  return (
    <Card padding="lg" radius="md" withBorder className={classes.card}>
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group align="center" gap="md" style={{ flex: 1, minWidth: 0 }}>
          <ThemeIcon size="xl" radius="md" variant="light" color="brand">
            <Rocket size={22} />
          </ThemeIcon>
          <Stack gap={2} style={{ minWidth: 0 }}>
            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
              {isNew ? "Próximo passo" : "Continuar de onde parei"}
            </Text>
            <Text fw={600} size="md" lineClamp={1}>
              {module.title}
            </Text>
            <Text size="sm" c="dimmed" lineClamp={1}>
              {module.lesson_count}{" "}
              {module.lesson_count === 1 ? "aula" : "aulas"}
            </Text>
          </Stack>
        </Group>

        <Button
          rightSection={<ArrowRight size={16} />}
          onClick={onContinue}
          variant="light"
        >
          {isNew ? "Começar" : "Continuar"}
        </Button>
      </Group>
    </Card>
  );
}
