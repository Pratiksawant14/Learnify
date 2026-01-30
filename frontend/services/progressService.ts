
import { supabase } from '@/lib/supabaseClient';

export interface ProgressRecord {
    id?: string;
    user_id: string;
    course_id?: string; // Optional if we just query by user
    lesson_id: string;
    completed_at: string;
}

export const progressService = {
    async getCompletedLessons(userId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching progress:', error);
            return [];
        }
        return data.map(row => row.lesson_id);
    },

    async markLessonComplete(userId: string, lessonId: string, courseId?: string) {
        // Check if exists
        const { data: existing } = await supabase
            .from('user_progress')
            .select('id')
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .single();

        if (existing) return; // Already done

        const { error } = await supabase
            .from('user_progress')
            .insert({
                user_id: userId,
                lesson_id: lessonId,
                course_id: courseId || 'default-course',
                completed_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error saving progress:', error);
        }
    }
};
