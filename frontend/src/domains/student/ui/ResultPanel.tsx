import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Group,
  Stack,
  Text,
  Title,
  Button,
  ScrollArea,
} from "@mantine/core";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import type { EvaluationResult } from "../types";
import classes from "./ResultPanel.module.css";

interface ResultPanelProps {
  /** Consolidated evaluation result from the evaluator. */
  result: EvaluationResult;
  /** Test case hidden flags — map of testCaseId to is_hidden. */
  hiddenMap: Record<string, boolean>;
}

export function ResultPanel({ result, hiddenMap }: ResultPanelProps) {
  // Select the first failing test case by default, or the first test case if all passed
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (result.results && result.results.length > 0) {
      const firstFailed = result.results.find((tc) => tc.verdict !== "PASSED");
      if (firstFailed) {
        setActiveTab(firstFailed.testCaseId);
      } else {
        setActiveTab(result.results[0].testCaseId);
      }
    }
  }, [result]);

  const activeTc = result.results.find((tc) => tc.testCaseId === activeTab);

  const getVerdictIcon = (verdict: string, size: number = 16) => {
    switch (verdict) {
      case "PASSED":
        return <CheckCircle2 size={size} color="var(--mantine-color-teal-6)" />;
      case "FAILED":
        return <XCircle size={size} color="var(--mantine-color-red-6)" />;
      default:
        return <AlertTriangle size={size} color="var(--mantine-color-orange-6)" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PASSED": return "teal";
      case "FAILED": return "red";
      default: return "orange";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PASSED": return "Aceito";
      case "FAILED": return "Resposta Incorreta";
      default: return "Erro";
    }
  };

  const statusColor = getStatusColor(result.resultStatus);
  const statusText = getStatusText(result.resultStatus);

  return (
    <Box className={classes.root} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* ── Header with Status ─────────────────────────────────────── */}
      <Group justify="space-between" align="center" mb="md" style={{ flexShrink: 0 }}>
        <Group gap="xs">
          <Title order={4} c={`${statusColor}.6`}>
            {statusText}
          </Title>
        </Group>
      </Group>

      {/* ── Test Case Pills Row ────────────────────────────────────────── */}
      <ScrollArea w="100%" type="scroll" scrollbarSize={6} mb="lg" style={{ flexShrink: 0 }}>
        <Group gap="sm" wrap="nowrap" pb="xs">
          {result.results.map((tc, index) => {
            const name = tc.testCaseName || `Caso ${index + 1}`;
            const isActive = tc.testCaseId === activeTab;
            
            return (
              <Button
                key={tc.testCaseId}
                variant={isActive ? "filled" : "light"}
                color={isActive ? "gray" : "gray.2"}
                c={isActive ? "white" : "dimmed"}
                size="sm"
                radius="md"
                onClick={() => setActiveTab(tc.testCaseId)}
                leftSection={getVerdictIcon(tc.verdict, 14)}
                styles={{
                  root: {
                    backgroundColor: isActive 
                      ? "var(--mantine-color-dark-6)" 
                      : "transparent",
                    color: isActive 
                      ? "var(--mantine-color-gray-1)" 
                      : "var(--mantine-color-text)",
                  }
                }}
              >
                {name}
              </Button>
            );
          })}
        </Group>
      </ScrollArea>

      {/* ── Active Test Case View ──────────────────────────────────────── */}
      {activeTc && (
        <Box style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {hiddenMap[activeTc.testCaseId] ? (
            <Text c="dimmed" size="sm" ta="center" py="xl">
              Este é um teste oculto. Detalhes de entrada e saída não são exibidos.
            </Text>
          ) : (
            <Stack gap="lg">
              {/* LeetCode style variable blocks */}
              <Box>
                <Text size="sm" fw={600} c="dimmed" mb={8}>
                  Esperado =
                </Text>
                <Box
                  p="sm"
                  style={{
                    backgroundColor: "var(--mantine-color-default-hover)",
                    borderRadius: "var(--mantine-radius-md)",
                  }}
                >
                  <Text size="sm" ff="monospace" c="var(--mantine-color-text)">
                    {activeTc.expectedOutput || " "}
                  </Text>
                </Box>
              </Box>
              
              <Box>
                <Text size="sm" fw={600} c="dimmed" mb={8}>
                  Recebido =
                </Text>
                <Box
                  p="sm"
                  style={{
                    backgroundColor: "var(--mantine-color-default-hover)",
                    borderRadius: "var(--mantine-radius-md)",
                  }}
                >
                  <Text size="sm" ff="monospace" c={activeTc.verdict === "PASSED" ? "var(--mantine-color-text)" : "red.5"}>
                    {activeTc.actualOutput || " "}
                  </Text>
                </Box>
              </Box>

              {activeTc.errorMessage && (
                <Box>
                  <Text size="sm" fw={600} c="red.6" mb={8}>
                    Erro =
                  </Text>
                  <Box
                    p="sm"
                    style={{
                      backgroundColor: "var(--mantine-color-red-light)",
                      borderRadius: "var(--mantine-radius-md)",
                    }}
                  >
                    <Text size="sm" ff="monospace" c="red.8">
                      {activeTc.errorMessage}
                    </Text>
                  </Box>
                </Box>
              )}
            </Stack>
          )}

          {/* Feedback message (if any globally applied to result) */}
          {result.feedbackMessage && (
            <Alert color="brand" variant="light" mt="xl" title="Feedback">
              {result.feedbackMessage}
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
}
