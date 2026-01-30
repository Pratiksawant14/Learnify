
import { supabase } from '@/lib/supabaseClient';
import { Skill } from '@/lib/skill-system';

export const skillService = {
    async getUserSkills(userId: string): Promise<Partial<Skill>[]> {
        const { data, error } = await supabase
            .from('user_skills')
            .select('skill_id, xp, level')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching skills:', error);
            return [];
        }

        return data.map(row => ({
            id: row.skill_id,
            xp: row.xp,
            level: row.level
        }));
    },

    // Upsert a single skill
    async updateSkill(userId: string, skill: Skill) {
        const { error } = await supabase
            .from('user_skills')
            .upsert({
                user_id: userId,
                skill_id: skill.id,
                xp: skill.xp,
                level: skill.level,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, skill_id' });

        if (error) {
            console.error('Error updating skill:', error);
        }
    },

    // Batch sync if necessary
    async syncSkills(userId: string, skills: Skill[]) {
        const updates = skills.map(s => ({
            user_id: userId,
            skill_id: s.id,
            xp: s.xp,
            level: s.level,
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('user_skills')
            .upsert(updates, { onConflict: 'user_id, skill_id' });

        if (error) console.error('Error syncing skills:', error);
    }
};
