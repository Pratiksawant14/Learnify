const API_URL = 'http://localhost:8000';
import { Skill } from '@/lib/skill-system';

export const skillService = {
    async getUserSkills(token: string): Promise<Partial<Skill>[]> {
        if (!token) return [];
        try {
            const response = await fetch(`${API_URL}/progress/skills`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) return [];

            const data = await response.json();
            // Backend returns: [{ skill_name, xp, level, user_id }]
            // Frontend expects: { id, xp, level }
            return data.map((row: any) => ({
                id: row.skill_name, // Map name -> id
                xp: row.xp,
                level: row.level
            }));
        } catch (error) {
            console.error('Error fetching skills:', error);
            return [];
        }
    },

    // Sync a single skill (Not explicitly separate in Backend yet, but lets keep interface)
    // Actually Backend only supports 'markLessonComplete' which bumps skills.
    // Explicit skill sync isn't in backend /progress router yet.
    // For MVP, we trust Backend's calculation on 'markLessonComplete'.
    // If we want to support manual updates, we need endpoint.
    // Disabling client-side manual sync for now to enforce backend authority.
    async updateSkill(token: string, skill: Skill) {
        // No-op: Backend handles XP logic on lesson completion
        console.log("Skill update pushed via lesson completion");
    },

    async syncSkills(token: string, skills: Skill[]) {
        // No-op
    }
};
