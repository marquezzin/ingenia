/**
 * Error Handler — Skulpt error message formatting.
 *
 * Translates raw Skulpt error objects into student-friendly messages.
 * Extracts line numbers from syntax and indentation errors, simplifies
 * runtime error messages, and never exposes internal JavaScript/Skulpt
 * stack traces.
 *
 * Business Rules:
 * - Never expose internal Skulpt stack traces to the student.
 * - Syntax/indentation errors should include the line number when available.
 * - Runtime errors should be simplified to a pedagogical message.
 * - Unexpected errors should show a generic safe message.
 */

// ─── Error Categories ───────────────────────────────────────────────────────

export type SkulptErrorCategory =
  | "syntax"
  | "indentation"
  | "name"
  | "type"
  | "index"
  | "value"
  | "zero_division"
  | "recursion"
  | "attribute"
  | "key"
  | "timeout"
  | "unknown";

export interface FormattedError {
  /** Student-friendly error message in Portuguese (BR). */
  message: string;
  /** Error category for programmatic use. */
  category: SkulptErrorCategory;
  /** Line number where the error occurred (if available). */
  line: number | null;
}

// ─── Timeout ────────────────────────────────────────────────────────────────

/** Sentinel value used by skulptRunner to signal a timeout. */
export const TIMEOUT_SENTINEL = "__TIMEOUT__";

/**
 * Build a timeout error with a pedagogical message.
 */
export function formatTimeoutError(): FormattedError {
  return {
    message:
      "Seu código excedeu o tempo limite. Verifique se não há loops infinitos.",
    category: "timeout",
    line: null,
  };
}

// ─── Main formatter ─────────────────────────────────────────────────────────

/**
 * Format a raw Skulpt error into a student-friendly message.
 *
 * @param error - The raw error thrown by Skulpt (can be anything).
 * @returns A formatted error with category, message, and optional line number.
 */
export function formatSkulptError(error: unknown): FormattedError {
  if (error === null || error === undefined) {
    return {
      message: "Erro técnico na avaliação. Tente novamente.",
      category: "unknown",
      line: null,
    };
  }

  const raw = String(error);

  // ── Syntax Error ────────────────────────────────────────────────────
  if (raw.includes("SyntaxError")) {
    return parseSyntaxError(raw);
  }

  // ── Indentation Error ───────────────────────────────────────────────
  if (raw.includes("IndentationError")) {
    return parseIndentationError(raw);
  }

  // ── Name Error ──────────────────────────────────────────────────────
  if (raw.includes("NameError")) {
    const detail = extractDetail(raw, "NameError");
    return {
      message: detail
        ? `Erro de nome: ${detail}`
        : "Uma variável ou função não foi definida.",
      category: "name",
      line: extractLineNumber(raw),
    };
  }

  // ── Type Error ──────────────────────────────────────────────────────
  if (raw.includes("TypeError")) {
    const detail = extractDetail(raw, "TypeError");
    return {
      message: detail
        ? `Erro de tipo: ${detail}`
        : "Operação incompatível com o tipo de dado.",
      category: "type",
      line: extractLineNumber(raw),
    };
  }

  // ── Index Error ─────────────────────────────────────────────────────
  if (raw.includes("IndexError")) {
    const detail = extractDetail(raw, "IndexError");
    return {
      message: detail
        ? `Erro de índice: ${detail}`
        : "Acesso a um índice fora dos limites.",
      category: "index",
      line: extractLineNumber(raw),
    };
  }

  // ── Value Error ─────────────────────────────────────────────────────
  if (raw.includes("ValueError")) {
    const detail = extractDetail(raw, "ValueError");
    return {
      message: detail
        ? `Erro de valor: ${detail}`
        : "Valor inválido fornecido.",
      category: "value",
      line: extractLineNumber(raw),
    };
  }

  // ── Zero Division Error ─────────────────────────────────────────────
  if (raw.includes("ZeroDivisionError")) {
    return {
      message: "Erro: divisão por zero.",
      category: "zero_division",
      line: extractLineNumber(raw),
    };
  }

  // ── Recursion Error ─────────────────────────────────────────────────
  if (raw.includes("RecursionError") || raw.includes("RuntimeError")) {
    return {
      message:
        "Erro: profundidade máxima de recursão atingida. Verifique se sua função tem um caso base.",
      category: "recursion",
      line: extractLineNumber(raw),
    };
  }

  // ── Attribute Error ─────────────────────────────────────────────────
  if (raw.includes("AttributeError")) {
    const detail = extractDetail(raw, "AttributeError");
    return {
      message: detail
        ? `Erro de atributo: ${detail}`
        : "Atributo não encontrado no objeto.",
      category: "attribute",
      line: extractLineNumber(raw),
    };
  }

  // ── Key Error ───────────────────────────────────────────────────────
  if (raw.includes("KeyError")) {
    const detail = extractDetail(raw, "KeyError");
    return {
      message: detail
        ? `Erro de chave: ${detail}`
        : "Chave não encontrada no dicionário.",
      category: "key",
      line: extractLineNumber(raw),
    };
  }

  // ── Fallback — generic safe message ─────────────────────────────────
  return {
    message: "Erro técnico na avaliação. Tente novamente.",
    category: "unknown",
    line: null,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Parse a SyntaxError string, extracting line number and message.
 * Skulpt format: "SyntaxError: ... on line N" or includes "line N".
 */
function parseSyntaxError(raw: string): FormattedError {
  const line = extractLineNumber(raw);
  const detail = extractDetail(raw, "SyntaxError");

  let message: string;
  if (line !== null && detail) {
    message = `Erro de sintaxe na linha ${line}: ${cleanDetail(detail)}`;
  } else if (line !== null) {
    message = `Erro de sintaxe na linha ${line}.`;
  } else if (detail) {
    message = `Erro de sintaxe: ${cleanDetail(detail)}`;
  } else {
    message = "Erro de sintaxe no código.";
  }

  return { message, category: "syntax", line };
}

/**
 * Parse an IndentationError string, extracting line number.
 */
function parseIndentationError(raw: string): FormattedError {
  const line = extractLineNumber(raw);

  let message: string;
  if (line !== null) {
    message = `Erro de indentação na linha ${line}: verifique os espaços no início das linhas.`;
  } else {
    message =
      "Erro de indentação: verifique os espaços no início das linhas.";
  }

  return { message, category: "indentation", line };
}

/**
 * Extract the detail portion from an error string.
 * E.g. "NameError: name 'x' is not defined" → "name 'x' is not defined"
 */
function extractDetail(raw: string, errorType: string): string | null {
  const pattern = new RegExp(`${errorType}:\\s*(.+?)(?:\\s+on line \\d+)?$`, "m");
  const match = raw.match(pattern);
  return match ? match[1].trim() : null;
}

/**
 * Extract a line number from a Skulpt error string.
 * Skulpt includes "on line N" or "line N" in tracebacks.
 */
function extractLineNumber(raw: string): number | null {
  // Try "on line N" first (Skulpt's typical format)
  const onLineMatch = raw.match(/on line (\d+)/);
  if (onLineMatch) {
    return parseInt(onLineMatch[1], 10);
  }

  // Fallback: "line N" anywhere
  const lineMatch = raw.match(/line (\d+)/);
  if (lineMatch) {
    return parseInt(lineMatch[1], 10);
  }

  return null;
}

/**
 * Strip line references from a detail string to avoid duplication.
 * E.g. "bad input on line 5" → "bad input"
 */
function cleanDetail(detail: string): string {
  return detail.replace(/\s+on line \d+/, "").trim();
}
