
import { Skill, DEFAULT_SKILLS, calculateLevel } from './skill-system';

export interface Friend {
    id: string;
    name: string;
    username: string;
    avatarInitials: string;
    avatarColor: string;
    skills: Skill[];
    totalXP: number;
    overallLevel: number;
    courseCompletion: number; // 0-100
    joinDate: string;
}

// Helpers to generate consistent mock data
const generateSkills = (seed: number): Skill[] => {
    return DEFAULT_SKILLS.map(skill => {
        // Deterministic pseudo-random based on seed + skill id length
        const baseXP = (seed * 100) + (skill.id.length * 50);
        const variation = (seed % 3) * 100;
        const finalXP = Math.max(0, baseXP + variation);

        return {
            ...skill,
            xp: finalXP,
            level: calculateLevel(finalXP)
        };
    });
};

const calculateTotalXP = (skills: Skill[]) => skills.reduce((sum, s) => sum + s.xp, 0);

export const MOCK_FRIENDS: Friend[] = [
    {
        id: 'f1',
        name: 'Sarah Chen',
        username: '@sarah_builds',
        avatarInitials: 'SC',
        avatarColor: 'bg-emerald-500',
        skills: generateSkills(4), // Seed 4
        totalXP: 0, // calc below
        overallLevel: 0, // calc below
        courseCompletion: 78,
        joinDate: 'Joined Oct 2023'
    },
    {
        id: 'f2',
        name: 'David Miller',
        username: '@dave_dev',
        avatarInitials: 'DM',
        avatarColor: 'bg-blue-500',
        skills: generateSkills(2),
        totalXP: 0,
        overallLevel: 0,
        courseCompletion: 45,
        joinDate: 'Joined Dec 2023'
    },
    {
        id: 'f3',
        name: 'Jessica Lee',
        username: '@jess_codes',
        avatarInitials: 'JL',
        avatarColor: 'bg-purple-500',
        skills: generateSkills(6), // Higher seed = usually higher stats
        totalXP: 0,
        overallLevel: 0,
        courseCompletion: 92,
        joinDate: 'Joined Sep 2023'
    },
    {
        id: 'f4',
        name: 'Alex Rivera',
        username: '@alexr',
        avatarInitials: 'AR',
        avatarColor: 'bg-amber-500',
        skills: generateSkills(3),
        totalXP: 0,
        overallLevel: 0,
        courseCompletion: 60,
        joinDate: 'Joined Jan 2024'
    }
].map(friend => {
    const totalXP = calculateTotalXP(friend.skills);
    return {
        ...friend,
        totalXP,
        overallLevel: Math.floor(totalXP / 350) + 1 // Custom overall level formula
    };
});

// Calculate rank score: XP + (Completion * 10)
export const getRankScore = (xp: number, completion: number) => xp + (completion * 10);
