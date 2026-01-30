'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { skillService } from '@/services/skillService';
import { Skill, DEFAULT_SKILLS, calculateLevel, getSkillsForLesson } from '@/lib/skill-system';

const STORAGE_KEY = 'user_skills_v1';

export function useSkillSystem() {
    const { user } = useAuth();
    const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Load Initial Data (Local then Server)
    useEffect(() => {
        const loadSkills = async () => {
            // A. Local State
            const stored = localStorage.getItem(STORAGE_KEY);
            let merged = [...DEFAULT_SKILLS];

            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    merged = DEFAULT_SKILLS.map(defSkill => {
                        const existing = parsed.find((s: Skill) => s.id === defSkill.id);
                        return existing || defSkill;
                    });
                } catch (e) {
                    console.error("Failed to parse skills", e);
                }
            }

            // B. Server State (if logged in)
            if (user) {
                try {
                    const serverSkills = await skillService.getUserSkills(user.id);
                    if (serverSkills.length > 0) {
                        // Merge Server > Local > Default
                        merged = merged.map(localSkill => {
                            const serverSkill = serverSkills.find(ss => ss.id === localSkill.id);
                            if (serverSkill && typeof serverSkill.xp === 'number') {
                                return {
                                    ...localSkill,
                                    xp: serverSkill.xp,
                                    level: calculateLevel(serverSkill.xp)
                                };
                            }
                            return localSkill;
                        });
                    }
                } catch (e) {
                    console.error("Failed to sync skills from server", e);
                }
            }

            setSkills(merged);
            setIsLoaded(true);
        };

        loadSkills();
    }, [user]);

    // 2. Persist to Local
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
        }
    }, [skills, isLoaded]);

    const awardXP = async (lessonId: string, lessonTitle: string) => {
        const rewards = getSkillsForLesson(lessonTitle);
        let changedSkills: Skill[] = [];

        setSkills(prevSkills => {
            const nextSkills = prevSkills.map(skill => {
                const xpGain = rewards[skill.id] || 0;
                if (xpGain === 0) return skill;

                const newXp = skill.xp + xpGain;
                const newSkill = {
                    ...skill,
                    xp: newXp,
                    level: calculateLevel(newXp)
                };
                changedSkills.push(newSkill);
                return newSkill;
            });

            // Sync to Server (Side Effect)
            if (user && changedSkills.length > 0) {
                skillService.syncSkills(user.id, changedSkills).catch(console.error);
            }

            return nextSkills;
        });
    };

    const getSkill = (id: string) => skills.find(s => s.id === id);

    return {
        skills,
        awardXP,
        getSkill,
        isLoaded
    };
}
