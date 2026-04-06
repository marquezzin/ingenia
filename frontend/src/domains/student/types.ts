/**
 * Student Domain — TypeScript Types
 *
 * Types for the Skulpt-based code evaluation engine, test case comparison,
 * and the React hook that drives the execution lifecycle.
 */

// ─── Test Case (input for evaluation) ───────────────────────────────────────

/** A single test case as received from the API (ExerciseTestCase subset). */
export interface TestCase {
  id: string;
  name: string;
  input_data: string | null;
  expected_output: string;
  sequence_order: number;
  is_hidden: boolean;
}

// ─── Code Execution (Skulpt runner output) ──────────────────────────────────

/** Low-level result from running code through Skulpt. */
export interface CodeExecutionResult {
  /** Captured stdout (concatenation of all `print()` calls). */
  stdout: string;
  /** Error message, if any (syntax error, runtime error, etc). */
  stderr: string;
  /** True if the execution timed out before completing. */
  timedOut: boolean;
}

// ─── Test Case Result (per-test evaluation) ─────────────────────────────────

export type TestCaseVerdict = "PASSED" | "FAILED" | "ERROR";

/** Result of evaluating a single test case. */
export interface TestCaseResult {
  /** ID of the test case that was evaluated. */
  testCaseId: string;
  /** Human-readable name of the test case. */
  testCaseName: string;
  /** The expected output (trimmed). */
  expectedOutput: string;
  /** The actual output produced by the student's code (trimmed). */
  actualOutput: string;
  /** Whether the test passed, failed, or had an error. */
  verdict: TestCaseVerdict;
  /** Error message if verdict is ERROR. */
  errorMessage: string | null;
}

// ─── Evaluation Result (consolidated) ───────────────────────────────────────

export type ResultStatus = "PASSED" | "FAILED" | "ERROR";

/** Consolidated result of evaluating all test cases for a single submission. */
export interface EvaluationResult {
  /** Individual results per test case. */
  results: TestCaseResult[];
  /** Number of test cases that passed. */
  passedCount: number;
  /** Number of test cases that failed or had errors. */
  failedCount: number;
  /** Score as percentage: (passedCount / total) * 100. */
  scorePercentage: number;
  /** Overall status: PASSED if all passed, ERROR if any had errors, FAILED otherwise. */
  resultStatus: ResultStatus;
  /** Pedagogical feedback message (BR-013: no answer exposure). */
  feedbackMessage: string;
}

// ─── Execution State (hook lifecycle) ────────────────────────────────────────

export type ExecutionState = "idle" | "running" | "complete" | "error";

// ─── Progress Status ────────────────────────────────────────────────────────

export type ProgressStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED";

// ─── Student Module (read — from curriculum API) ────────────────────────────

/** Progress data attached to a module for the current student. */
export interface StudentModuleProgress {
  progress_status: ProgressStatus;
  started_at: string | null;
  completed_at: string | null;
}

/** A published module as seen by the student. */
export interface StudentModule {
  id: string;
  title: string;
  description: string;
  sequence_order: number;
  lesson_count: number;
  progress: StudentModuleProgress | null;
}

/** Lesson progress attached to a module listing. */
export interface StudentLessonProgress {
  progress_status: ProgressStatus;
  started_at: string | null;
  completed_at: string | null;
}

/** A published lesson within a module as seen by the student. */
export interface StudentLesson {
  id: string;
  title: string;
  sequence_order: number;
  has_video: boolean;
  exercise_count: number;
  progress: StudentLessonProgress | null;
}

/** Detailed module view — includes nested published lessons with progress. */
export interface StudentModuleDetail {
  id: string;
  title: string;
  description: string;
  sequence_order: number;
  lesson_count: number;
  lessons: StudentLesson[];
  progress: StudentModuleProgress | null;
}

// ─── Progress API Types (from progress endpoints) ───────────────────────────

/** Module progress summary — from GET /api/v1/student/progress/. */
export interface ModuleProgressSummary {
  module_id: string;
  module_title: string;
  progress_status: ProgressStatus;
  started_at: string | null;
  completed_at: string | null;
  total_lessons: number;
  completed_lessons: number;
  total_exercises: number;
  completed_exercises: number;
}

// ─── Video (nested in lesson detail) ────────────────────────────────────────

/** Video data nested inside a lesson detail response. */
export interface StudentVideo {
  id: string;
  title: string;
  video_url: string;
  duration_seconds: number | null;
}

// ─── Exercise Progress ──────────────────────────────────────────────────────

/** Progress data for an exercise (from student endpoints). */
export interface StudentExerciseProgress {
  progress_status: ProgressStatus;
  attempts_count: number;
  first_attempt_at: string | null;
  completed_at: string | null;
}

/** A published exercise within a lesson as seen by the student (list view). */
export interface StudentExerciseListItem {
  id: string;
  title: string;
  sequence_order: number;
  progress: StudentExerciseProgress | null;
}

// ─── Student Lesson Detail ──────────────────────────────────────────────────

/** Detailed lesson view — includes video, written content, exercises with progress. */
export interface StudentLessonDetail {
  id: string;
  title: string;
  written_content: string;
  sequence_order: number;
  video: StudentVideo | null;
  exercises: StudentExerciseListItem[];
  progress: StudentLessonProgress | null;
}

