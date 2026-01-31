
import { supabase } from '@/lib/supabaseClient';

export interface ProgressRecord {
    id?: string;
    user_id: string;
    course_id?: string; // Optional if we just query by user
    lesson_id: string;
    completed_at: string;
}

const API_URL = 'http://localhost:8000'; // Make this env var later

export const progressService = {
    async getCompletedLessons(token: string): Promise<string[]> {
        if (!token) return [];
        try {
            const response = await fetch(`${API_URL}/progress/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) return [];

            const data = await response.json();
            // Backend returns list of progress objects. Map to lesson_ids
            return data.map((p: any) => p.lesson_id);
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    async markLessonComplete(token: string, lessonId: string, courseId?: string) {
        if (!token) return;
        try {
            await fetch(`${API_URL}/progress/complete`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lesson_id: lessonId, user_id: 'ignored' })
            });
        } catch (e) {
            console.error('Error saving progress:', e);
        }
    }
};
