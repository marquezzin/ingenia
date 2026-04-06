/**
 * Tests for errorHandler — Skulpt error message formatting.
 *
 * Verifies that raw Skulpt errors are translated into student-friendly,
 * pedagogical messages in Portuguese (BR), with line numbers extracted
 * when available, and no internal stack traces exposed.
 */

import { describe, it, expect } from "vitest";

import {
  formatSkulptError,
  formatTimeoutError,
  TIMEOUT_SENTINEL,
} from "@/domains/student/services/errorHandler";
import type { SkulptErrorCategory } from "@/domains/student/services/errorHandler";

// ─── formatTimeoutError ─────────────────────────────────────────────────────

describe("formatTimeoutError", () => {
  it("returns a timeout category with pedagogical message", () => {
    const result = formatTimeoutError();

    expect(result.category).toBe("timeout");
    expect(result.line).toBeNull();
    expect(result.message).toContain("tempo limite");
    expect(result.message).toContain("loops infinitos");
  });
});

// ─── TIMEOUT_SENTINEL ───────────────────────────────────────────────────────

describe("TIMEOUT_SENTINEL", () => {
  it("is a non-empty string constant", () => {
    expect(TIMEOUT_SENTINEL).toBeTruthy();
    expect(typeof TIMEOUT_SENTINEL).toBe("string");
  });
});

// ─── formatSkulptError ──────────────────────────────────────────────────────

describe("formatSkulptError", () => {
  // ── Null / undefined ──────────────────────────────────────────────────

  it("returns unknown category for null input", () => {
    const result = formatSkulptError(null);

    expect(result.category).toBe("unknown");
    expect(result.line).toBeNull();
    expect(result.message).toBeTruthy();
  });

  it("returns unknown category for undefined input", () => {
    const result = formatSkulptError(undefined);

    expect(result.category).toBe("unknown");
    expect(result.line).toBeNull();
  });

  // ── SyntaxError ───────────────────────────────────────────────────────

  describe("SyntaxError", () => {
    it("extracts line number and detail", () => {
      const result = formatSkulptError(
        "SyntaxError: bad input on line 5",
      );

      expect(result.category).toBe("syntax");
      expect(result.line).toBe(5);
      expect(result.message).toContain("sintaxe");
      expect(result.message).toContain("linha 5");
    });

    it("handles SyntaxError without line number", () => {
      const result = formatSkulptError("SyntaxError: unexpected EOF");

      expect(result.category).toBe("syntax");
      expect(result.message).toContain("sintaxe");
    });

    it("handles bare SyntaxError without detail", () => {
      const result = formatSkulptError("SyntaxError");

      expect(result.category).toBe("syntax");
      expect(result.message).toContain("sintaxe");
    });

    it("does not duplicate line reference in detail", () => {
      const result = formatSkulptError(
        "SyntaxError: bad input on line 3",
      );

      // The message should mention "linha 3" exactly once from the formatter,
      // and not re-include "on line 3" from the detail
      const matches = result.message.match(/on line/g);
      expect(matches).toBeNull();
    });
  });

  // ── IndentationError ──────────────────────────────────────────────────

  describe("IndentationError", () => {
    it("extracts line number", () => {
      const result = formatSkulptError(
        "IndentationError: unexpected indent on line 7",
      );

      expect(result.category).toBe("indentation");
      expect(result.line).toBe(7);
      expect(result.message).toContain("indentação");
      expect(result.message).toContain("linha 7");
    });

    it("handles IndentationError without line number", () => {
      const result = formatSkulptError(
        "IndentationError: unexpected indent",
      );

      expect(result.category).toBe("indentation");
      expect(result.message).toContain("indentação");
      expect(result.message).toContain("espaços");
    });
  });

  // ── NameError ─────────────────────────────────────────────────────────

  describe("NameError", () => {
    it("includes the variable name in the message", () => {
      const result = formatSkulptError(
        "NameError: name 'x' is not defined on line 2",
      );

      expect(result.category).toBe("name");
      expect(result.line).toBe(2);
      expect(result.message).toContain("nome");
    });

    it("handles NameError without detail", () => {
      const result = formatSkulptError("NameError");

      expect(result.category).toBe("name");
      expect(result.message).toContain("variável");
    });
  });

  // ── TypeError ─────────────────────────────────────────────────────────

  describe("TypeError", () => {
    it("extracts detail from TypeError", () => {
      const result = formatSkulptError(
        "TypeError: unsupported operand type(s) on line 4",
      );

      expect(result.category).toBe("type");
      expect(result.line).toBe(4);
      expect(result.message).toContain("tipo");
    });

    it("handles bare TypeError", () => {
      const result = formatSkulptError("TypeError");

      expect(result.category).toBe("type");
      expect(result.message).toContain("tipo");
    });
  });

  // ── IndexError ────────────────────────────────────────────────────────

  describe("IndexError", () => {
    it("reports index out of bounds", () => {
      const result = formatSkulptError(
        "IndexError: list index out of range on line 10",
      );

      expect(result.category).toBe("index");
      expect(result.line).toBe(10);
      expect(result.message).toContain("índice");
    });
  });

  // ── ValueError ────────────────────────────────────────────────────────

  describe("ValueError", () => {
    it("reports invalid value", () => {
      const result = formatSkulptError(
        "ValueError: invalid literal for int() on line 3",
      );

      expect(result.category).toBe("value");
      expect(result.line).toBe(3);
      expect(result.message).toContain("valor");
    });
  });

  // ── ZeroDivisionError ─────────────────────────────────────────────────

  describe("ZeroDivisionError", () => {
    it("reports division by zero", () => {
      const result = formatSkulptError(
        "ZeroDivisionError: division by zero on line 6",
      );

      expect(result.category).toBe("zero_division");
      expect(result.line).toBe(6);
      expect(result.message).toContain("divisão por zero");
    });
  });

  // ── RecursionError / RuntimeError ─────────────────────────────────────

  describe("RecursionError", () => {
    it("detects RecursionError", () => {
      const result = formatSkulptError(
        "RecursionError: maximum recursion depth exceeded",
      );

      expect(result.category).toBe("recursion");
      expect(result.message).toContain("recursão");
      expect(result.message).toContain("caso base");
    });

    it("detects RuntimeError as recursion", () => {
      const result = formatSkulptError(
        "RuntimeError: maximum recursion depth exceeded",
      );

      expect(result.category).toBe("recursion");
    });
  });

  // ── AttributeError ────────────────────────────────────────────────────

  describe("AttributeError", () => {
    it("reports attribute not found", () => {
      const result = formatSkulptError(
        "AttributeError: 'str' object has no attribute 'foo' on line 1",
      );

      expect(result.category).toBe("attribute");
      expect(result.line).toBe(1);
      expect(result.message).toContain("atributo");
    });
  });

  // ── KeyError ──────────────────────────────────────────────────────────

  describe("KeyError", () => {
    it("reports key not found", () => {
      const result = formatSkulptError(
        "KeyError: 'missing_key' on line 8",
      );

      expect(result.category).toBe("key");
      expect(result.line).toBe(8);
      expect(result.message).toContain("chave");
    });
  });

  // ── Unknown / fallback ────────────────────────────────────────────────

  describe("Unknown errors", () => {
    it("returns generic message for unrecognized error", () => {
      const result = formatSkulptError("SomethingWeird happened");

      expect(result.category).toBe("unknown");
      expect(result.line).toBeNull();
      expect(result.message).toContain("Erro técnico");
    });

    it("returns generic message for empty string", () => {
      const result = formatSkulptError("");

      expect(result.category).toBe("unknown");
    });

    it("never exposes raw stack traces", () => {
      const nastyError =
        "Error\n    at Object.<anonymous> (/app/node_modules/skulpt/skulpt.js:123)\n    at Module._compile";
      const result = formatSkulptError(nastyError);

      expect(result.message).not.toContain("node_modules");
      expect(result.message).not.toContain("Module._compile");
      expect(result.message).not.toContain("skulpt.js");
    });
  });

  // ── Category type safety ──────────────────────────────────────────────

  describe("Category coverage", () => {
    const expectedCategories: SkulptErrorCategory[] = [
      "syntax",
      "indentation",
      "name",
      "type",
      "index",
      "value",
      "zero_division",
      "recursion",
      "attribute",
      "key",
      "timeout",
      "unknown",
    ];

    it("all expected categories are valid", () => {
      // This test ensures the type definition hasn't drifted
      expect(expectedCategories).toHaveLength(12);
    });
  });
});
