/**
 * Student Domain — useStudentLesson hook.
 *
 * React Query hooks for fetching lesson detail and tracking lesson progress.
 */

import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudentLessonApi,
  markLessonStartedApi,
  markLessonCompletedApi,
} from "../api/curriculum";
import { STUDENT_MODULE_KEYS } from "./useStudentModules";

export const STUDENT_LESSON_KEYS = {
  all: ["student", "lessons"] as const,
  detail: (moduleId: string, lessonId: string) =>
    [...STUDENT_LESSON_KEYS.all, "detail", moduleId, lessonId] as const,
};

/** Fetch a single lesson with video, exercises, and progress. */
export const useStudentLessonDetail = (moduleId: string, lessonId: string) =>
  useQuery({
    queryKey: STUDENT_LESSON_KEYS.detail(moduleId, lessonId),
    queryFn: () => getStudentLessonApi(moduleId, lessonId),
    enabled: !!moduleId && !!lessonId,
  });

/** Mark a lesson as started (IN_PROGRESS) — fire-and-forget on mount. */
export const useMarkLessonStarted = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) => markLessonStartedApi(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_LESSON_KEYS.all });
      queryClient.invalidateQueries({ queryKey: STUDENT_MODULE_KEYS.all });
    },
  });
};

/** Mark a lesson as completed — for lessons without exercises. */
export const useMarkLessonCompleted = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) => markLessonCompletedApi(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_LESSON_KEYS.all });
      queryClient.invalidateQueries({ queryKey: STUDENT_MODULE_KEYS.all });
    },
  });
};

/**
 * Auto-mark a lesson as started when the page loads.
 * Only fires once per lessonId to avoid repeated calls on re-renders.
 */
export const useAutoMarkStarted = (lessonId: string | undefined) => {
  const markStarted = useMarkLessonStarted();
  const markedRef = useRef<string | null>(null);

  useEffect(() => {
    if (lessonId && markedRef.current !== lessonId) {
      markedRef.current = lessonId;
      markStarted.mutate(lessonId);
    }
  }, [lessonId]); // eslint-disable-line react-hooks/exhaustive-deps
};
