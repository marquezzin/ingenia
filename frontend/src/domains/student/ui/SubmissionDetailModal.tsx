/**
 * SubmissionDetailModal — Modal de detalhe de uma submissão.
 *
 * Exibe score, status, feedback pedagógico e código fonte
 * com syntax highlighting monocromático.
 */

import {
  Badge,
  Code,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

import type { SubmissionHistoryItem } from "../types";

interface SubmissionDetailModalProps {
  submission: SubmissionHistoryItem | null;
  opened: boolean;
  onClose: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  PASSED: { label: "Aprovado", color: "green", icon: CheckCircle2 },
  FAILED: { label: "Reprovado", color: "red", icon: XCircle },
  ERROR: { label: "Erro", color: "orange", icon: AlertCircle },
};

export function SubmissionDetailModal({
  submission,
  opened,
  onClose,
}: SubmissionDetailModalProps) {
  if (!submission) return null;

  const statusConf = STATUS_CONFIG[submission.result?.result_status ?? ""] ?? {
    label: submission.evaluation_status,
    color: "gray",
    icon: Clock,
  };
  const StatusIcon = statusConf.icon;
  const scoreNum = parseFloat(submission.score_percentage);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color={statusConf.color}>
            <StatusIcon size={14} />
          </ThemeIcon>
          <Text fw={600} size="md">
            Detalhes da Submissão
          </Text>
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        {/* Header info */}
        <Group justify="space-between">
          <div>
            <Text size="sm" c="dimmed">
              Exercício
            </Text>
            <Text fw={500}>{submission.exercise_title}</Text>
          </div>
          <div style={{ textAlign: "right" }}>
            <Text size="sm" c="dimmed">
              Data
            </Text>
            <Text fw={500}>
              {new Date(submission.submitted_at).toLocaleString("pt-BR")}
            </Text>
          </div>
        </Group>

        {/* Score & Status */}
        <Group gap="md">
          <Badge
            size="lg"
            color={scoreNum >= 100 ? "green" : scoreNum > 0 ? "yellow" : "red"}
            variant="light"
          >
            Score: {scoreNum.toFixed(0)}%
          </Badge>
          <Badge size="lg" color={statusConf.color} variant="light">
            {statusConf.label}
          </Badge>
          {submission.result && (
            <Text size="sm" c="dimmed">
              {submission.result.passed_tests_count} aprovados /{" "}
              {submission.result.failed_tests_count} reprovados
            </Text>
          )}
        </Group>

        {/* Feedback */}
        {submission.result?.feedback_message && (
          <div>
            <Text size="sm" fw={600} mb={4}>
              💡 Feedback
            </Text>
            <Text
              size="sm"
              p="sm"
              style={{
                backgroundColor: "var(--mantine-color-blue-light)",
                borderRadius: "var(--mantine-radius-sm)",
                borderLeft: "3px solid var(--mantine-color-blue-6)",
              }}
            >
              {submission.result.feedback_message}
            </Text>
          </div>
        )}

        {/* Source code */}
        <div>
          <Text size="sm" fw={600} mb={4}>
            📝 Código Enviado
          </Text>
          <ScrollArea.Autosize mah={300}>
            <Code block style={{ fontSize: "0.85rem" }}>
              {submission.source_code}
            </Code>
          </ScrollArea.Autosize>
        </div>
      </Stack>
    </Modal>
  );
}
