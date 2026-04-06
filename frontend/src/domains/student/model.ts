/**
 * Student Domain — Model (pure business logic).
 *
 * Pure functions without side effects for data transformation,
 * validation, and formatting related to the student experience.
 */

import type {
  ModuleProgressSummary,
  ProgressStatus,
  StudentModule,
} from "./types";

// ─── Progress Status Labels ─────────────────────────────────────────────────

const STATUS_LABELS: Record<ProgressStatus, string> = {
  NOT_STARTED: "Não iniciado",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
};

/** Translate a progress status enum to a user-friendly PT-BR label. */
export const getProgressStatusLabel = (status: ProgressStatus): string =>
  STATUS_LABELS[status] ?? status;

// ─── "Continue where you left off" ─────────────────────────────────────────

/**
 * Determine the module the student should continue studying.
 *
 * Priority:
 * 1. The first module with IN_PROGRESS status (by sequence_order)
 * 2. The first module with NOT_STARTED status (by sequence_order)
 * 3. null if all modules are completed or no modules exist
 */
export const getLastAccessedModule = (
  modules: StudentModule[],
): StudentModule | null => {
  const sorted = [...modules].sort(
    (a, b) => a.sequence_order - b.sequence_order,
  );

  // First, look for IN_PROGRESS
  const inProgress = sorted.find(
    (m) => m.progress?.progress_status === "IN_PROGRESS",
  );
  if (inProgress) return inProgress;

  // Then, the first NOT_STARTED
  const notStarted = sorted.find(
    (m) => !m.progress || m.progress.progress_status === "NOT_STARTED",
  );
  if (notStarted) return notStarted;

  return null;
};

// ─── Overall Progress Computation ───────────────────────────────────────────

export interface OverallProgress {
  /** Total modules in the trail. */
  totalModules: number;
  /** Number of completed modules. */
  completedModules: number;
  /** Total lessons across all started modules. */
  totalLessons: number;
  /** Completed lessons across all started modules. */
  completedLessons: number;
  /** Total exercises across all started modules. */
  totalExercises: number;
  /** Completed exercises across all started modules. */
  completedExercises: number;
  /** Overall completion percentage (0-100). */
  overallPercentage: number;
}

/**
 * Compute aggregate progress metrics from the progress summary list.
 *
 * @param progressList - Progress summaries for modules the student has started.
 * @param totalModuleCount - Total number of published modules (from modules API).
 */
export const computeOverallProgress = (
  progressList: ModuleProgressSummary[],
  totalModuleCount: number,
): OverallProgress => {
  const completedModules = progressList.filter(
    (p) => p.progress_status === "COMPLETED",
  ).length;

  const totalLessons = progressList.reduce(
    (sum, p) => sum + p.total_lessons,
    0,
  );
  const completedLessons = progressList.reduce(
    (sum, p) => sum + p.completed_lessons,
    0,
  );
  const totalExercises = progressList.reduce(
    (sum, p) => sum + p.total_exercises,
    0,
  );
  const completedExercises = progressList.reduce(
    (sum, p) => sum + p.completed_exercises,
    0,
  );

  const overallPercentage =
    totalModuleCount > 0
      ? Math.round((completedModules / totalModuleCount) * 100)
      : 0;

  return {
    totalModules: totalModuleCount,
    completedModules,
    totalLessons,
    completedLessons,
    totalExercises,
    completedExercises,
    overallPercentage,
  };
};

// ─── Module Progress Helpers ────────────────────────────────────────────────

/**
 * Calculate the progress percentage for a single module.
 * Uses lesson completion as the primary metric.
 */
export const getModuleCompletionPercent = (
  progress: ModuleProgressSummary,
): number => {
  if (progress.total_lessons === 0) return 0;
  return Math.round(
    (progress.completed_lessons / progress.total_lessons) * 100,
  );
};
