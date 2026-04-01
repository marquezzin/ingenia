/**
 * Skulpt Runner — Low-level Python code execution via Skulpt.
 *
 * Executes arbitrary Python source code in the browser using the Skulpt
 * interpreter. Provides stdin injection, stdout capture, timeout support,
 * and simplified error reporting.
 */

import Sk from "skulpt";

import type { CodeExecutionResult } from "@/domains/student/types";

/** Default execution timeout in milliseconds. */
const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Execute Python code using Skulpt and capture its output.
 *
 * @param sourceCode  - The Python source code to execute.
 * @param stdinLines  - Lines to feed to `input()` calls, consumed in FIFO order.
 * @param timeoutMs   - Maximum time allowed for execution (default: 10s).
 * @returns A promise that resolves to the execution result.
 */
export async function runCode(
  sourceCode: string,
  stdinLines: string[] = [],
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<CodeExecutionResult> {
  // ── Accumulators ──────────────────────────────────────────────────────
  const stdoutParts: string[] = [];
  let stdinIndex = 0;

  // ── Configure Skulpt ──────────────────────────────────────────────────
  Sk.configure({
    // Capture print() output
    output: (text: string) => {
      stdoutParts.push(text);
    },

    // Feed stdin lines in FIFO order
    inputfun: () => {
      if (stdinIndex < stdinLines.length) {
        return stdinLines[stdinIndex++];
      }
      // If the code asks for more input than provided, return empty string
      return "";
    },

    // Read built-in library files
    read: (filename: string) => {
      if (
        Sk.builtinFiles === undefined ||
        Sk.builtinFiles.files[filename] === undefined
      ) {
        throw new Error(`File not found: '${filename}'`);
      }
      return Sk.builtinFiles.files[filename];
    },

    // Use Python 3 syntax
    __future__: Sk.python3,
  });

  // ── Build execution promise ───────────────────────────────────────────
  const executionPromise = Sk.misceval.asyncToPromise(() =>
    Sk.importMainWithBody("<stdin>", false, sourceCode, true),
  );

  // ── Build timeout promise ─────────────────────────────────────────────
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("__TIMEOUT__"));
    }, timeoutMs);
  });

  try {
    // Race execution against timeout
    await Promise.race([executionPromise, timeoutPromise]);

    return {
      stdout: stdoutParts.join(""),
      stderr: "",
      timedOut: false,
    };
  } catch (error: unknown) {
    // ── Timeout ───────────────────────────────────────────────────────
    if (error instanceof Error && error.message === "__TIMEOUT__") {
      return {
        stdout: stdoutParts.join(""),
        stderr: "O código excedeu o tempo limite de execução.",
        timedOut: true,
      };
    }

    // ── Skulpt error (syntax, runtime, etc.) ─────────────────────────
    const errorMessage = simplifyError(error);
    return {
      stdout: stdoutParts.join(""),
      stderr: errorMessage,
      timedOut: false,
    };
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Simplify a Skulpt error message into a student-friendly string.
 *
 * Strips internal Skulpt details and presents the core error in a
 * readable format.
 */
function simplifyError(error: unknown): string {
  if (error === null || error === undefined) {
    return "Erro desconhecido durante a execução.";
  }

  // Skulpt errors typically have a .toString() that includes the traceback
  const raw = String(error);

  // Check for common error types and simplify
  if (raw.includes("SyntaxError")) {
    const match = raw.match(/SyntaxError:\s*(.+)/);
    return match
      ? `Erro de sintaxe: ${match[1]}`
      : "Erro de sintaxe no código.";
  }

  if (raw.includes("NameError")) {
    const match = raw.match(/NameError:\s*(.+)/);
    return match
      ? `Erro de nome: ${match[1]}`
      : "Uma variável ou função não foi definida.";
  }

  if (raw.includes("TypeError")) {
    const match = raw.match(/TypeError:\s*(.+)/);
    return match
      ? `Erro de tipo: ${match[1]}`
      : "Operação incompatível com o tipo de dado.";
  }

  if (raw.includes("IndexError")) {
    const match = raw.match(/IndexError:\s*(.+)/);
    return match
      ? `Erro de índice: ${match[1]}`
      : "Acesso a um índice fora dos limites.";
  }

  if (raw.includes("ValueError")) {
    const match = raw.match(/ValueError:\s*(.+)/);
    return match
      ? `Erro de valor: ${match[1]}`
      : "Valor inválido fornecido.";
  }

  if (raw.includes("ZeroDivisionError")) {
    return "Erro: divisão por zero.";
  }

  if (raw.includes("IndentationError")) {
    return "Erro de indentação: verifique os espaços no início das linhas.";
  }

  // Fallback: return a truncated version of the error
  const truncated = raw.length > 200 ? raw.slice(0, 200) + "…" : raw;
  return `Erro durante a execução: ${truncated}`;
}
