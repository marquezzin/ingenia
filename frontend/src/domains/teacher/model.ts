/**
 * Teacher Domain — Pure Business Logic
 *
 * Transformations, computations, and formatting for teacher data.
 * No side effects, no API calls.
 */
import type {
  ClassProgress,
  StudentProgressSummary,
  TeacherClassListItem,
} from "./types";

// ─── Dashboard Metrics ──────────────────────────────────────────────────────

export interface TeacherDashboardMetrics {
  totalClasses: number;
  totalStudents: number;
  studentsStarted: number;
  totalExercisesSolved: number;
}

/**
 * Computes aggregate dashboard metrics from the class list and their progress data.
 */
export const computeDashboardMetrics = (
  classes: TeacherClassListItem[],
  progressList: ClassProgress[],
): TeacherDashboardMetrics => {
  const totalClasses = classes.length;
  let totalStudents = 0;
  let studentsStarted = 0;
  let totalExercisesSolved = 0;

  for (const progress of progressList) {
    totalStudents += progress.total_students;
    studentsStarted += progress.students_started;
    totalExercisesSolved += progress.students.reduce(
      (sum, s) => sum + s.exercises_completed,
      0,
    );
  }

  return { totalClasses, totalStudents, studentsStarted, totalExercisesSolved };
};

// ─── Student Helpers ────────────────────────────────────────────────────────

/**
 * Returns the label in Portuguese for a learning status.
 */
export const getLearningStatusLabel = (status: string): string => {
  switch (status) {
    case "NOT_STARTED":
      return "Não iniciou";
    case "IN_PROGRESS":
      return "Em andamento";
    case "COMPLETED":
      return "Concluído";
    default:
      return status;
  }
};

/**
 * Returns the Mantine color for a learning status badge.
 */
export const getLearningStatusColor = (status: string): string => {
  switch (status) {
    case "NOT_STARTED":
      return "gray";
    case "IN_PROGRESS":
      return "blue";
    case "COMPLETED":
      return "green";
    default:
      return "gray";
  }
};

/**
 * Sorts students: those needing attention first (NOT_STARTED at top).
 */
export const sortStudentsByAttention = (
  students: StudentProgressSummary[],
): StudentProgressSummary[] => {
  const order: Record<string, number> = {
    NOT_STARTED: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
  };
  return [...students].sort(
    (a, b) =>
      (order[a.learning_status] ?? 3) - (order[b.learning_status] ?? 3),
  );
};
