/**
 * OutputConsole — Terminal-style console for Skulpt stdout/stderr.
 *
 * Displays execution output with a dark background and monospace font,
 * mimicking a terminal experience.
 */
import { Text } from "@mantine/core";
import classes from "./OutputConsole.module.css";

interface OutputConsoleProps {
  /** Console output text (stdout + stderr). */
  output: string;
  /** Optional title label. */
  title?: string;
}

export function OutputConsole({
  output,
  title = "Console",
}: OutputConsoleProps) {
  return (
    <div className={classes.root}>
      {title && (
        <div className={classes.header}>
          <Text size="xs" fw={600} c="dimmed">
            {title}
          </Text>
        </div>
      )}
      <pre className={classes.content}>
        {output || "Nenhuma saída ainda. Execute seu código para ver o resultado."}
      </pre>
    </div>
  );
}
