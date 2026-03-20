/**
 * Admin Domain — TypeScript Types
 */

// ─── Publication Status ─────────────────────────────────────────────────────

export type PublicationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

// ─── Dashboard ──────────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  total_modules: number;
  total_lessons: number;
  total_exercises: number;
  total_users: number;
}

// ─── Module ─────────────────────────────────────────────────────────────────

export interface ModuleListItem {
  [key: string]: unknown;
  id: string;
  title: string;
  description: string;
  sequence_order: number;
  publication_status: PublicationStatus;
  lesson_count: number;
}

export interface ModuleDetail {
  id: string;
  title: string;
  description: string;
  sequence_order: number;
  publication_status: PublicationStatus;
  lesson_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateModulePayload {
  title: string;
  description: string;
  sequence_order: number;
}

export interface UpdateModulePayload {
  title: string;
  description: string;
  sequence_order: number;
  publication_status: PublicationStatus;
}

// ─── Lesson (list item for module detail page) ──────────────────────────────

export interface LessonListItem {
  [key: string]: unknown;
  id: string;
  title: string;
  sequence_order: number;
  publication_status: PublicationStatus;
  has_video: boolean;
}

// ─── Lesson Detail ──────────────────────────────────────────────────────────

export interface VideoLesson {
  id: string;
  title: string;
  video_url: string;
  duration_seconds: number | null;
}

export interface VideoLessonPayload {
  title: string;
  video_url: string;
  duration_seconds?: number | null;
}

export interface LessonDetail {
  id: string;
  title: string;
  written_content: string;
  sequence_order: number;
  publication_status: PublicationStatus;
  video: VideoLesson | null;
  exercise_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateLessonPayload {
  title: string;
  written_content: string;
  sequence_order: number;
  video_lesson?: VideoLessonPayload | null;
}

export interface UpdateLessonPayload {
  title: string;
  written_content: string;
  sequence_order: number;
  publication_status: PublicationStatus;
  video_lesson?: VideoLessonPayload | null;
}

// ─── Exercise ───────────────────────────────────────────────────────────────

export interface ExerciseListItem {
  [key: string]: unknown;
  id: string;
  title: string;
  sequence_order: number;
  publication_status: PublicationStatus;
  test_cases_count: number;
}

export interface ExerciseDetail {
  id: string;
  title: string;
  statement: string;
  support_message: string | null;
  sequence_order: number;
  publication_status: PublicationStatus;
  test_cases_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateExercisePayload {
  title: string;
  statement: string;
  support_message?: string | null;
  sequence_order: number;
}

export interface UpdateExercisePayload {
  title: string;
  statement: string;
  support_message?: string | null;
  sequence_order: number;
  publication_status: PublicationStatus;
}

// ─── Exercise Test Case ─────────────────────────────────────────────────────

export interface TestCaseListItem {
  [key: string]: unknown;
  id: string;
  name: string;
  sequence_order: number;
  is_hidden: boolean;
}

export interface TestCaseDetail {
  id: string;
  name: string;
  input_data: string | null;
  expected_output: string;
  sequence_order: number;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTestCasePayload {
  name: string;
  input_data?: string | null;
  expected_output: string;
  sequence_order: number;
  is_hidden?: boolean;
}

export interface UpdateTestCasePayload {
  name: string;
  input_data?: string | null;
  expected_output: string;
  sequence_order: number;
  is_hidden?: boolean;
}

// ─── API Params ─────────────────────────────────────────────────────────────

export interface ListModulesParams {
  search?: string;
  publication_status?: PublicationStatus;
  page?: number;
  ordering?: string;
}
