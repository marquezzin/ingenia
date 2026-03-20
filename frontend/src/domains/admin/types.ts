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
  sequence_order: number;
  publication_status: PublicationStatus;
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

// ─── API Params ─────────────────────────────────────────────────────────────

export interface ListModulesParams {
  search?: string;
  publication_status?: PublicationStatus;
  page?: number;
  ordering?: string;
}
