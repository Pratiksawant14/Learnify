'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { progressService } from '@/services/progressService';

export interface CourseProgress {
    completedLessons: string[]; // Set of lesson IDs
    lastAccessedLesson: string | null;
    totalTimeSpent: number; // minutes
}

export const useCourseProgress = (courseId: string, roadmap: any) => {
    const { user } = useAuth();
    const [progress, setProgress] = useState<CourseProgress>({
        completedLessons: [],
        lastAccessedLesson: null,
        totalTimeSpent: 0
    });

    // Load State
    useEffect(() => {
        if (!courseId) return;

        const loadProgress = async () => {
            // 1. Try Local Storage first (for speed/offline/fallback)
            const stored = localStorage.getItem(`progress-${courseId}`);
            let localData = stored ? JSON.parse(stored) : null;

            if (user) {
                // 2. If User, fetch from DB and merge/override
                try {
                    const serverCompleted = await progressService.getCompletedLessons(user.id);

                    // Merge logic: simpler is union of both
                    const mergedCompleted = Array.from(new Set([
                        ...(localData?.completedLessons || []),
                        ...serverCompleted
                    ]));

                    setProgress({
                        completedLessons: mergedCompleted,
                        lastAccessedLesson: localData?.lastAccessedLesson || null, // Not syncing lastAccessed yet
                        totalTimeSpent: localData?.totalTimeSpent || (mergedCompleted.length * 15)
                    });
                } catch (e) {
                    console.error("Sync failed, utilizing local data", e);
                    if (localData) setProgress(localData);
                }
            } else {
                if (localData) setProgress(localData);
            }
        };

        loadProgress();
    }, [courseId, user]);

    // Persist State
    const saveProgress = async (newProgress: CourseProgress) => {
        // Always save local
        localStorage.setItem(`progress-${courseId}`, JSON.stringify(newProgress));

        // If user, save to DB (Fire and forget basically)
        if (user) {
            // We only sync completion additions in this simplified model
            // Find newly added lessons? Or just rely on the granular markLessonComplete calls?
            // The hooks calls 'markLessonComplete', so we should trigger DB calls there.
        }
    };

    const markLessonComplete = async (lessonId: string) => {
        if (!progress.completedLessons.includes(lessonId)) {
            const newProgress = {
                ...progress,
                completedLessons: [...progress.completedLessons, lessonId],
                totalTimeSpent: progress.totalTimeSpent + 15
            };

            setProgress(newProgress);
            saveProgress(newProgress); // Save local

            if (user) {
                await progressService.markLessonComplete(user.id, lessonId, courseId);
            }
        }
    };

    const updateLastAccessed = (lessonId: string) => {
        const newProgress = {
            ...progress,
            lastAccessedLesson: lessonId
        };
        setProgress(newProgress);
        saveProgress(newProgress);
        // Note: We aren't syncing lastAccessed to DB in Phase 14 MVP
    };

    const isLessonCompleted = (lessonId: string) => {
        return progress.completedLessons.includes(lessonId);
    };

    // Flatten roadmap to determine sequence
    const flattenedLessons = roadmap?.units.reduce((acc: any[], unit: any) => {
        unit.chapters.forEach((chapter: any) => {
            if (chapter.lessons) {
                chapter.lessons.forEach((lesson: any) => acc.push(lesson.id));
            }
        });
        return acc;
    }, []) || [];

    const isLessonLocked = (lessonId: string) => {
        const index = flattenedLessons.indexOf(lessonId);
        if (index <= 0) return false; // First lesson always unlocked

        // Previous lesson must be completed
        const prevLessonId = flattenedLessons[index - 1];
        return !isLessonCompleted(prevLessonId);
    };

    const getCourseProgress = () => {
        if (flattenedLessons.length === 0) return 0;
        return Math.round((progress.completedLessons.length / flattenedLessons.length) * 100);
    };

    return {
        progress,
        markLessonComplete,
        updateLastAccessed,
        isLessonCompleted,
        isLessonLocked,
        getCourseProgress,
        allLessonIds: flattenedLessons
    };
};
