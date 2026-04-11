/**
 * ExercisePage — LeetCode-style student exercise page using Mantine.
 *
 * Vertical student exercise workspace:
 * - Exercise statement
 * - Code editor
 * - Console/results panel
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Alert,
  Badge,
  Breadcrumbs,
  Anchor,
  Button,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
  Card,
  Box,
  ActionIcon,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  Play,
  Send,
  Trash2,
  ArrowLeft,
  FileText,
  AlertCircle,
  Lightbulb,
  Terminal,
  ClipboardCheck,
  Code2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";

import { useStudentExerciseDetail } from "@/domains/student/hooks/useStudentExercise";
import { useCodeExecution } from "@/domains/student/hooks/useCodeExecution";
import { useSubmission } from "@/domains/student/hooks/useSubmission";
import { CodeEditor } from "@/domains/student/ui/CodeEditor";
import { OutputConsole } from "@/domains/student/ui/OutputConsole";
import { ResultPanel } from "@/domains/student/ui/ResultPanel";
import { ExercisePageSkeleton } from "@/domains/student/ui/ExercisePageSkeleton";
import { MarkdownContent } from "@/domains/student/ui/MarkdownContent";
import { ConfirmModal } from "@/shared/ui/components";
import classes from "./ExercisePage.module.css";

const DEFAULT_CODE = "# Escreva seu código Python aqui\n\n";

export default function ExercisePage() {
  const { moduleId, lessonId, exerciseId } = useParams<{
    moduleId: string;
    lessonId: string;
    exerciseId: string;
  }>();
  const navigate = useNavigate();

  // ─── Data ───────────────────────────────────────────────────────────────
  const { data: exercise, isLoading, isError } = useStudentExerciseDetail(
    moduleId!,
    lessonId!,
    exerciseId!
  );

  // ─── Derived ─────────────────────────────────────────────────────────────
  const isCompleted = exercise?.progress?.progress_status === "COMPLETED";
  const hasLastSubmission = !!exercise?.last_submission;

  // ─── State ──────────────────────────────────────────────────────────────
  const [code, setCode] = useState(DEFAULT_CODE);
  const [activeTab, setActiveTab] = useState<string>("results");
  const [isBottomOpen, setIsBottomOpen] = useState(true);
  const [showSupport, setShowSupport] = useState(false);
  const [clearOpened, { open: openClear, close: closeClear }] = useDisclosure(false);

  // Pre-populate editor with last approved submission code
  useEffect(() => {
    if (exercise?.last_submission?.source_code) {
      setCode(exercise.last_submission.source_code);
    }
  }, [exercise?.last_submission?.source_code]);

  const toggleBottomPanel = (tab: string) => {
    if (activeTab === tab && isBottomOpen) {
      setIsBottomOpen(false);
    } else {
      setActiveTab(tab);
      setIsBottomOpen(true);
    }
  };

  // ─── Hooks ──────────────────────────────────────────────────────────────
  const { execute, state: execState, result: execResult, error: execError, reset: resetExec } = useCodeExecution();
  const { submit, state: subState, error: subError } = useSubmission();

  const hiddenMap = useMemo(() => {
    if (!exercise) return {};
    const map: Record<string, boolean> = {};
    for (const tc of exercise.test_cases) {
      map[tc.id] = tc.is_hidden;
    }
    return map;
  }, [exercise]);

  const consoleOutput = useMemo(() => {
    if (execError) return `❌ Erro: ${execError}`;
    if (execResult) {
      const lines: string[] = [];
      for (const tc of execResult.results) {
        const name = tc.testCaseName || `Teste ${execResult.results.indexOf(tc) + 1}`;
        const icon = tc.verdict === "PASSED" ? "✅" : tc.verdict === "FAILED" ? "❌" : "⚠️";
        lines.push(`${icon} ${name}: ${tc.verdict}`);
        if (tc.actualOutput && !hiddenMap[tc.testCaseId]) {
          lines.push(`   Saída: ${tc.actualOutput}`);
        }
      }
      return lines.join("\n");
    }
    return "";
  }, [execResult, execError, hiddenMap]);

  // ─── Handlers ───────────────────────────────────────────────────────────
  const handleExecute = useCallback(async () => {
    if (!exercise) return;
    await execute(code, exercise.test_cases);
    setActiveTab("results");
    setIsBottomOpen(true);
    setTimeout(() => {
      document.getElementById("results-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
  }, [code, exercise, execute]);

  const handleSubmit = useCallback(async () => {
    if (!exercise) return;
    await execute(code, exercise.test_cases);
  }, [code, exercise, execute]);

  const handleSubmitAfterExec = useCallback(async () => {
    if (!exercise || !execResult) return;
    const response = await submit(exercise.id, code, execResult);
    if (response) {
      notifications.show({
        title: "Submissão enviada!",
        message: `Sua nota: ${Math.round(execResult.scorePercentage)}%`,
        color: execResult.scorePercentage === 100 ? "teal" : "yellow",
      });
    }
    setActiveTab("results");
    setIsBottomOpen(true);
  }, [exercise, execResult, code, submit]);

  const handleClear = useCallback(() => {
    setCode(DEFAULT_CODE);
    resetExec();
    closeClear();
  }, [resetExec, closeClear]);

  // ─── Render states ──────────────────────────────────────────────────────
  if (isLoading) return <ExercisePageSkeleton />;
  if (isError || !exercise) {
    return (
      <Alert color="red" title="Erro ao carregar exercício" icon={<AlertCircle size={16} />}>
        Não foi possivel carregar o exercício. Verifique sua conexão e tente novamente.
      </Alert>
    );
  }

  const isBusy = execState === "running" || subState === "submitting";
  const isEditorReadOnly = isBusy || (isCompleted && hasLastSubmission && !execResult);

  return (
    <Stack gap="lg" className={classes.page}>

      {/* ─── Header ─── */}
      <Group justify="space-between" align="center" className={classes.header}>
        <Breadcrumbs className={classes.breadcrumbs}>
          <Anchor component={Link} to="/student" size="sm">Dashboard</Anchor>
          <Anchor component={Link} to={`/student/modules/${moduleId}`} size="sm">Módulo</Anchor>
          <Anchor component={Link} to={`/student/modules/${moduleId}/lessons/${lessonId}`} size="sm">Aula</Anchor>
          <Text size="sm" c="dimmed">{exercise.title}</Text>
        </Breadcrumbs>
        <Button variant="subtle" size="compact-sm" leftSection={<ArrowLeft size={14} />} onClick={() => navigate(`/student/modules/${moduleId}/lessons/${lessonId}`)}>
          Voltar à aula
        </Button>
      </Group>

      {/* ─── Vertical Workspace ─── */}
      <div className={classes.workspace}>

        {/* Statement */}
        <Card withBorder padding={0} radius="md" className={classes.statementCard}>

          <Box className={classes.statementHeader}>
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Group gap="sm" wrap="nowrap" className={classes.statementTitle}>
                <FileText size={20} style={{ color: "var(--mantine-color-brand-6)" }} />
                <Title order={4}>{exercise.title}</Title>
              </Group>
              {exercise.progress && (
                <Badge variant="light" color={exercise.progress.progress_status === "COMPLETED" ? "teal" : "blue"}>
                  {exercise.progress.progress_status === "COMPLETED" ? "Concluído" : `${exercise.progress.attempts_count} tentativa(s)`}
                </Badge>
              )}
            </Group>
          </Box>

          <Stack gap="lg" className={classes.statementBody}>
            <MarkdownContent content={exercise.statement} label={null} collapsible={false} />

            {/* Test Cases Examples */}
            {exercise.test_cases.filter((tc) => !tc.is_hidden).length > 0 && (
              <Stack gap="sm" mt="xs">
                <Text size="sm" fw={700} c="var(--mantine-color-text)">
                  Exemplos:
                </Text>
                {exercise.test_cases
                  .filter((tc) => !tc.is_hidden)
                  .map((tc, index) => (
                    <Box
                      key={tc.id}
                      p="sm"
                      style={{
                        backgroundColor: "var(--mantine-color-default-hover)",
                        borderRadius: "var(--mantine-radius-md)",
                        borderLeft: "4px solid var(--mantine-color-brand-filled)",
                      }}
                    >
                      <Text size="xs" fw={700} c="dimmed" mb={6}>
                        Exemplo {index + 1}
                      </Text>

                      {tc.input_data && (
                        <Group gap={8} mb={6} align="flex-start" wrap="nowrap">
                          <Text size="sm" fw={600} style={{ minWidth: 60 }}>
                            Entrada:
                          </Text>
                          <Text size="sm" ff="monospace" style={{ whiteSpace: "pre-wrap" }}>
                            {tc.input_data}
                          </Text>
                        </Group>
                      )}

                      <Group gap={8} align="flex-start" wrap="nowrap">
                        <Text size="sm" fw={600} style={{ minWidth: 60 }}>
                          Saída:
                        </Text>
                        <Text size="sm" ff="monospace" style={{ whiteSpace: "pre-wrap" }}>
                          {tc.expected_output}
                        </Text>
                      </Group>
                    </Box>
                  ))}
              </Stack>
            )}

            {exercise.support_message && (
              <Box className={classes.supportBlock}>
                <Button variant="light" color="yellow" size="sm" leftSection={<Lightbulb size={14} />} onClick={() => setShowSupport(!showSupport)}>
                  {showSupport ? "Ocultar dica" : "Ver dica"}
                </Button>
                {showSupport && (
                  <Alert color="yellow" variant="light" title="Dica" className={classes.supportAlert}>
                    <MarkdownContent content={exercise.support_message} label={null} collapsible={false} />
                  </Alert>
                )}
              </Box>
            )}
          </Stack>
        </Card>

        {/* Completed banner */}
        {isCompleted && hasLastSubmission && (
          <Alert
            variant="light"
            color="teal"
            icon={<CheckCircle2 size={20} />}
            title="Exercício concluído"
            radius="md"
            className={classes.completedBanner}
          >
            <Text size="sm">
              Você completou este exercício com nota{" "}
              <Text span fw={700} c="teal.4">
                {Math.round(Number(exercise.last_submission!.score_percentage))}%
              </Text>
              {" "}em{" "}
              {new Date(exercise.last_submission!.submitted_at).toLocaleDateString(
                "pt-BR",
                { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
              )}
              . O código abaixo é a sua solução aprovada. Você ainda pode executar e testar novamente.
            </Text>
          </Alert>
        )}

        {/* Editor */}
        <Card withBorder padding={0} radius="md" className={classes.editorCard}>
          <Group justify="space-between" className={classes.editorToolbar}>
            <Group gap="xs">
              <Code2 size={16} color="var(--mantine-color-dimmed)" />
              <Text size="sm" fw={600} c="gray.4">
                {isEditorReadOnly ? "Python (somente leitura)" : "Python"}
              </Text>
            </Group>

            <Group gap="sm" className={classes.editorActions}>
              {subError && <Text size="xs" c="red.4" className={classes.errorText}>{subError}</Text>}
              <Tooltip label="Executar e testar localmente">
                <Button className={classes.actionButton} leftSection={<Play size={14} />} onClick={handleExecute} loading={execState === "running"} disabled={isBusy || !code.trim()} color="brand" size="sm">
                  Executar
                </Button>
              </Tooltip>
              {!isCompleted && (
                <Tooltip label="Submeter resposta">
                  <Button className={classes.actionButton} leftSection={<Send size={14} />} onClick={async () => { await handleSubmit(); setTimeout(() => handleSubmitAfterExec(), 100); }} loading={subState === "submitting"} disabled={isBusy || !code.trim()} color="teal" size="sm">
                    Submeter
                  </Button>
                </Tooltip>
              )}
              <Tooltip label="Restaurar código padrão">
                <ActionIcon variant="subtle" color="red" size="lg" onClick={openClear} disabled={isBusy} aria-label="Restaurar código padrão">
                  <Trash2 size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          <Box className={classes.editorShell}>
            <div className={classes.editorFill}>
              <CodeEditor value={code} onChange={setCode} readOnly={isEditorReadOnly} height="100%" />
            </div>
          </Box>
        </Card>

        {/* Results */}
        <Card id="results-panel" withBorder padding={0} radius="md" className={`${classes.resultsCard} ${isBottomOpen ? classes.resultsCardOpen : ""}`}>

          <Group gap={0} className={classes.resultsHeader} style={{ borderBottom: isBottomOpen ? "1px solid var(--mantine-color-default-border)" : "none" }}>
            <Button
              variant="subtle"
              onClick={() => toggleBottomPanel("console")}
              size="sm"
              radius={0}
              style={{ borderBottom: activeTab === "console" && isBottomOpen ? "2px solid var(--mantine-color-brand-6)" : "2px solid transparent" }}
              leftSection={<Terminal size={14} />}
              color={activeTab === "console" && isBottomOpen ? "brand" : "gray"}
            >
              Console
            </Button>
            <Button
              variant="subtle"
              onClick={() => toggleBottomPanel("results")}
              size="sm"
              radius={0}
              style={{ borderBottom: activeTab === "results" && isBottomOpen ? "2px solid var(--mantine-color-brand-6)" : "2px solid transparent" }}
              leftSection={<ClipboardCheck size={14} />}
              color={activeTab === "results" && isBottomOpen ? "brand" : "gray"}
            >
              Resultado
              {activeTab !== "results" && execResult && (
                <Badge size="xs" circle color={execResult.scorePercentage === 100 ? "teal" : "red"} ml={4}>!</Badge>
              )}
            </Button>
            <div style={{ flex: 1 }} />
            <ActionIcon onClick={() => setIsBottomOpen(!isBottomOpen)} variant="subtle" color="gray" mr="sm">
              {isBottomOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </ActionIcon>
          </Group>

          {isBottomOpen && (
            <ScrollArea className={classes.resultsScroll} p="lg" scrollbarSize={6}>
              {activeTab === "console" && (
                <OutputConsole output={consoleOutput} title="" />
              )}
              {activeTab === "results" && (
                <>
                  {execResult ? (
                    <ResultPanel result={execResult} hiddenMap={hiddenMap} />
                  ) : isCompleted && hasLastSubmission ? (
                    <Stack align="center" gap="sm" py="xl">
                      <CheckCircle2 size={32} color="var(--mantine-color-teal-6)" />
                      <Text size="sm" c="teal.5" fw={600}>Exercício já concluído com sucesso!</Text>
                      <Text size="xs" c="dimmed">Clique em "Executar" para testar o código novamente.</Text>
                    </Stack>
                  ) : (
                    <Text size="sm" c="dimmed" ta="center" py="xl">Execute seu código para ver os resultados.</Text>
                  )}
                </>
              )}
            </ScrollArea>
          )}

        </Card>
      </div>

      {/* Clear Modal */}
      <ConfirmModal
        opened={clearOpened}
        onClose={closeClear}
        onConfirm={handleClear}
        title="Limpar editor"
        message="Tem certeza que deseja limpar todo o código? Esta ação não pode ser desfeita."
        confirmLabel="Limpar"
        confirmColor="red"
      />
    </Stack>
  );
}
