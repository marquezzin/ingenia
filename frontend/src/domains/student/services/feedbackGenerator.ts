/**
 * Feedback Generator — Pedagogical feedback message builder.
 *
 * Generates student-friendly feedback messages based on evaluation results.
 *
 * Business Rules:
 * - BR-013: Feedback must guide the student without exposing the expected answer.
 */

import type { ResultStatus } from "@/domains/student/types";

/**
 * Generate a pedagogical feedback message.
 *
 * BR-013: Must guide the student without exposing the expected answer.
 *
 * @param passedCount - Number of test cases that passed.
 * @param totalCount  - Total number of test cases.
 * @param status      - Overall result status (PASSED, FAILED, ERROR).
 * @returns A student-friendly feedback message in Portuguese (BR).
 */
export function generateFeedback(
  passedCount: number,
  totalCount: number,
  status: ResultStatus,
): string {
  if (totalCount === 0) {
    return "Nenhum teste encontrado para este exercício.";
  }

  if (status === "ERROR") {
    return `Ocorreu um erro durante a execução. ${passedCount} de ${totalCount} testes puderam ser avaliados.`;
  }

  if (status === "PASSED") {
    return `Parabéns! Todos os ${totalCount} testes passaram! 🎉`;
  }

  // FAILED
  if (passedCount === 0) {
    return `Nenhum teste passou (0 de ${totalCount}). Revise seu código e tente novamente.`;
  }

  return `${passedCount} de ${totalCount} testes passaram. Revise sua lógica e tente novamente.`;
}
