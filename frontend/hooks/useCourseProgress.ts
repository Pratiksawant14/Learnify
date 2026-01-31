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
            // 1. Try Local Storage first
            const stored = localStorage.getItem(`progress-${courseId}`);
            let localData = stored ? JSON.parse(stored) : null;

            if (user) {
                // 2. If User, fetch from DB
                try {
                    // Need token
                    const { supabase } = await import('@/lib/supabaseClient');
                    const { data: { session } } = await supabase.auth.getSession();
                    const token = session?.access_token;

                    if (token) {
                        const serverCompleted = await progressService.getCompletedLessons(token);

                        // Merge logic
                        const mergedCompleted = Array.from(new Set([
                            ...(localData?.completedLessons || []),
                            ...serverCompleted
                        ]));

                        setProgress({
                            completedLessons: mergedCompleted,
                            lastAccessedLesson: localData?.lastAccessedLesson || null,
                            totalTimeSpent: localData?.totalTimeSpent || (mergedCompleted.length * 15)
                        });
                    }
                } catch (e) {
                    console.error("Sync failed", e);
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
    };

    const markLessonComplete = async (lessonId: string) => {
        if (!progress.completedLessons.includes(lessonId)) {
            const newProgress = {
                ...progress,
                completedLessons: [...progress.completedLessons, lessonId],
                totalTimeSpent: progress.totalTimeSpent + 15
            };

            setProgress(newProgress);
            // Save local
            localStorage.setItem(`progress-${courseId}`, JSON.stringify(newProgress));

            if (user) {
                const { supabase } = await import('@/lib/supabaseClient');
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;
                if (token) {
                    await progressService.markLessonComplete(token, lessonId, courseId);
                }
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
