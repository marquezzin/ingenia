/**
 * Teacher Domain — TypeScript Types
 *
 * Mirrors the Django serializers for classes, enrollments, and progress
 * from the teacher's perspective.
 */

// ─── Class Status ───────────────────────────────────────────────────────────

export type ClassStatus = "ACTIVE" | "ARCHIVED";
export type EnrollmentStatus = "ACTIVE" | "REMOVED";
export type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
export type LearningStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

// ─── Class Group ────────────────────────────────────────────────────────────

export interface TeacherClassListItem {
  id: string;
  name: string;
  class_status: ClassStatus;
  teacher_name: string;
  student_count: number;
  created_at: string;
}

export interface EnrolledStudent {
  id: string;
  student_name: string;
  student_email: string;
  enrollment_status: EnrollmentStatus;
  enrolled_at: string;
}

export interface TeacherClassDetail {
  id: string;
  name: string;
  description: string | null;
  class_status: ClassStatus;
  student_count: number;
  students: EnrolledStudent[];
  created_at: string;
  updated_at: string;
}

export interface CreateClassPayload {
  name: string;
  description?: string | null;
}

export interface UpdateClassPayload {
  name: string;
  description?: string | null;
  class_status?: ClassStatus;
}

export interface EnrollStudentPayload {
  student_profile_id: string;
}

// ─── Class Progress (Collective) ────────────────────────────────────────────

export interface StudentProgressSummary {
  student_profile_id: string;
  student_name: string;
  student_email: string;
  learning_status: LearningStatus;
  modules_completed: number;
  exercises_completed: number;
}

export interface ClassProgress {
  class_group_id: string;
  class_name: string;
  total_students: number;
  students_started: number;
  students_completed: number;
  students: StudentProgressSummary[];
}

// ─── Student Detail Progress (Individual) ───────────────────────────────────

export interface TeacherExerciseProgress {
  exercise_id: string;
  exercise_title: string;
  progress_status: ProgressStatus;
  attempts_count: number;
  completed_at: string | null;
}

export interface TeacherLessonProgress {
  lesson_id: string;
  lesson_title: string;
  progress_status: ProgressStatus;
  started_at: string | null;
  completed_at: string | null;
  exercises: TeacherExerciseProgress[];
}

export interface TeacherModuleProgress {
  module_id: string;
  module_title: string;
  progress_status: ProgressStatus;
  started_at: string | null;
  completed_at: string | null;
  total_lessons: number;
  completed_lessons: number;
  total_exercises: number;
  completed_exercises: number;
  lessons: TeacherLessonProgress[];
}

export interface StudentDetailProgress {
  student_profile_id: string;
  student_name: string;
  student_email: string;
  learning_status: LearningStatus;
  modules: TeacherModuleProgress[];
}

// ─── API Params ─────────────────────────────────────────────────────────────

export interface ListClassesParams {
  search?: string;
  class_status?: ClassStatus;
  page?: number;
}
