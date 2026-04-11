/**
 * SubmissionHistory — Displays a student's past attempts for an exercise.
 *
 * Shows a list of recent submissions with score, status, and date.
 * Each item can be expanded to reveal the submitted source code.
 */

import { useState } from "react";
import {
  Badge,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
} from "lucide-react";

import type { SubmissionHistoryItem } from "../types";
import classes from "./SubmissionHistory.module.css";

interface SubmissionHistoryProps {
  /** List of submissions to display. */
  submissions: SubmissionHistoryItem[];
  /** Whether data is loading. */
  isLoading: boolean;
}

function getStatusIcon(status: string | undefined, size = 16) {
  switch (status) {
    case "PASSED":
      return <CheckCircle2 size={size} color="var(--mantine-color-teal-6)" />;
    case "FAILED":
      return <XCircle size={size} color="var(--mantine-color-red-6)" />;
    default:
      return <AlertTriangle size={size} color="var(--mantine-color-orange-6)" />;
  }
}

function getStatusBadge(status: string | undefined) {
  switch (status) {
    case "PASSED":
      return <Badge size="sm" variant="light" color="teal">Aprovado</Badge>;
    case "FAILED":
      return <Badge size="sm" variant="light" color="red">Reprovado</Badge>;
    default:
      return <Badge size="sm" variant="light" color="orange">Erro</Badge>;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SubmissionHistory({ submissions, isLoading }: SubmissionHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={52} radius="md" />
        ))}
      </Stack>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className={classes.empty}>
        <History size={32} color="var(--mantine-color-dimmed)" />
        <Text size="sm" c="dimmed" fw={500}>
          Nenhuma tentativa ainda
        </Text>
        <Text size="xs" c="dimmed">
          Suas submissões aparecerão aqui após enviar seu código.
        </Text>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {submissions.map((sub, index) => {
        const isExpanded = expandedId === sub.id;
        const resultStatus = sub.result?.result_status;
        const score = Math.round(Number(sub.score_percentage));

        return (
          <div key={sub.id} className={classes.item}>
            {/* Header row */}
            <div
              className={classes.itemHeader}
              onClick={() => setExpandedId(isExpanded ? null : sub.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setExpandedId(isExpanded ? null : sub.id);
                }
              }}
            >
              <div className={classes.itemMeta}>
                {getStatusIcon(resultStatus, 18)}
                <Text size="sm" fw={600} c="var(--mantine-color-text)">
                  Tentativa #{submissions.length - index}
                </Text>
                <Text size="xs" c="dimmed">
                  {formatDate(sub.submitted_at)}
                </Text>
              </div>

              <div className={classes.itemActions}>
                <Badge
                  size="lg"
                  variant="light"
                  color={score === 100 ? "teal" : score >= 50 ? "yellow" : "red"}
                  radius="md"
                >
                  {score}%
                </Badge>
                {getStatusBadge(resultStatus)}
                {isExpanded ? (
                  <ChevronDown size={16} color="var(--mantine-color-dimmed)" />
                ) : (
                  <ChevronRight size={16} color="var(--mantine-color-dimmed)" />
                )}
              </div>
            </div>

            {/* Feedback row */}
            {isExpanded && sub.result?.feedback_message && (
              <div className={classes.feedbackRow}>
                <Text size="xs" c="dimmed" fs="italic">
                  💡 {sub.result.feedback_message}
                </Text>
              </div>
            )}

            {/* Expanded code panel */}
            {isExpanded && (
              <div className={classes.codePanel}>
                <pre>{sub.source_code}</pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
