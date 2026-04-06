/**
 * Tests for feedbackGenerator — Pedagogical feedback message builder.
 *
 * Verifies all branches of generateFeedback produce correct, student-friendly
 * messages in Portuguese (BR) that comply with BR-013 (no answer exposure).
 */

import { describe, it, expect } from "vitest";

import { generateFeedback } from "@/domains/student/services/feedbackGenerator";

describe("generateFeedback", () => {
  // ── No test cases ───────────────────────────────────────────────────────

  it("returns appropriate message when no test cases exist", () => {
    const result = generateFeedback(0, 0, "PASSED");

    expect(result).toContain("Nenhum teste encontrado");
  });

  // ── ERROR status ────────────────────────────────────────────────────────

  it("mentions error and partial evaluation on ERROR status", () => {
    const result = generateFeedback(1, 3, "ERROR");

    expect(result).toContain("erro");
    expect(result).toContain("1 de 3");
  });

  it("handles ERROR with zero passed", () => {
    const result = generateFeedback(0, 2, "ERROR");

    expect(result).toContain("erro");
    expect(result).toContain("0 de 2");
  });

  // ── PASSED status (100%) ──────────────────────────────────────────────

  it("congratulates when all tests pass", () => {
    const result = generateFeedback(5, 5, "PASSED");

    expect(result).toContain("Parabéns");
    expect(result).toContain("5");
    expect(result).toContain("🎉");
  });

  it("includes total count in success message", () => {
    const result = generateFeedback(1, 1, "PASSED");

    expect(result).toContain("1");
    expect(result).toContain("Parabéns");
  });

  // ── FAILED status — zero passed ──────────────────────────────────────

  it("encourages revision when no tests pass", () => {
    const result = generateFeedback(0, 4, "FAILED");

    expect(result).toContain("Nenhum teste passou");
    expect(result).toContain("0 de 4");
    expect(result).toContain("Revise");
  });

  // ── FAILED status — partial pass ─────────────────────────────────────

  it("shows partial count and encourages retry", () => {
    const result = generateFeedback(2, 3, "FAILED");

    expect(result).toContain("2 de 3");
    expect(result).toContain("Revise");
  });

  it("shows 1 of 5 for minimal partial pass", () => {
    const result = generateFeedback(1, 5, "FAILED");

    expect(result).toContain("1 de 5");
  });

  // ── BR-013 compliance ────────────────────────────────────────────────

  it("never exposes expected output or answers in any message", () => {
    const messages = [
      generateFeedback(0, 0, "PASSED"),
      generateFeedback(3, 3, "PASSED"),
      generateFeedback(0, 3, "FAILED"),
      generateFeedback(1, 3, "FAILED"),
      generateFeedback(1, 3, "ERROR"),
    ];

    for (const msg of messages) {
      // Should not contain words indicating answer disclosure
      expect(msg).not.toContain("expected");
      expect(msg).not.toContain("resposta correta");
      expect(msg).not.toContain("saída esperada");
    }
  });
});
