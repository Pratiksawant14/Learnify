
import { Skill } from './skill-system';

// --- Data Models ---

export interface Community {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    membersCount: number;
    bannerColor: string;
    icon: string;
}

export interface CommunityMember {
    userId: string;
    username: string;
    avatarInitials: string;
    avatarColor: string;
    joinedAt: string;
    totalXP: number;
    totalLevels: number; // Sum of all skill levels
    score: number;       // Calculated
    rank: number;        // Calculated
    isUser: boolean;
}

// --- Mock Data ---

export const MOCK_COMMUNITIES: Community[] = [
    {
        id: 'c1',
        name: 'AI Founders',
        description: 'Builders and researchers in Artificial Intelligence.',
        createdAt: '2023-01-15',
        membersCount: 1420,
        bannerColor: 'bg-purple-600',
        icon: 'Bot'
    },
    {
        id: 'c2',
        name: 'FullStack Pros',
        description: 'Mastering the art of end-to-end development.',
        createdAt: '2023-03-10',
        membersCount: 850,
        bannerColor: 'bg-blue-600',
        icon: 'Layers'
    },
    {
        id: 'c3',
        name: 'System Architects',
        description: 'Scalability, distributed systems, and cloud design.',
        createdAt: '2022-11-05',
        membersCount: 530,
        bannerColor: 'bg-emerald-600',
        icon: 'Server'
    }
];

// Pool of mock members to populate leaderboards
const MOCK_MEMBER_POOL = [
    { username: "Sarah Chen", initials: "SC", color: "bg-emerald-500" },
    { username: "David Miller", initials: "DM", color: "bg-blue-500" },
    { username: "Jessica Lee", initials: "JL", color: "bg-purple-500" },
    { username: "Alex Rivera", initials: "AR", color: "bg-amber-500" },
    { username: "Mike Ross", initials: "MR", color: "bg-red-500" },
    { username: "Rachel Zane", initials: "RZ", color: "bg-pink-500" },
    { username: "Harvey Specter", initials: "HS", color: "bg-slate-700" },
    { username: "Donna Paulsen", initials: "DP", color: "bg-orange-500" },
];

// --- Logic (Pure Functions) ---

// Score Formula: Total XP + (Sum of Levels * 100)
// Weighting levels higher gives value to depth of knowledge
export const calculateMemberScore = (totalXP: number, totalLevels: number): number => {
    return totalXP + (totalLevels * 100);
};

// Generates a consistent leaderboard for a community, injecting the dynamic user
export const getCommunityLeaderboard = (
    communityId: string,
    userStats: { totalXP: number, totalLevels: number }
): CommunityMember[] => {
    // Generate deterministic mock members based on community ID
    const seed = communityId.charCodeAt(1) || 10; // '1' from 'c1', '2' from 'c2'

    const mockMembers: CommunityMember[] = MOCK_MEMBER_POOL.map((p, idx) => {
        // Random-ish stats based on seed + idx
        const baseXP = (seed * 500) + (idx * 200);
        const randomVar = (idx % 3 === 0) ? 1000 : -200;
        const xp = Math.max(100, baseXP + randomVar);
        const levels = Math.floor(xp / 250) + 1; // Approx logic

        return {
            userId: `mock-${idx}`,
            username: p.username,
            avatarInitials: p.initials,
            avatarColor: p.color,
            joinedAt: '2023-05-20',
            totalXP: xp,
            totalLevels: levels,
            score: calculateMemberScore(xp, levels),
            rank: 0, // Assigned later
            isUser: false
        };
    });

    // Create User Entry
    const userEntry: CommunityMember = {
        userId: 'current-user',
        username: 'You',
        avatarInitials: 'ME',
        avatarColor: 'bg-blue-600', // Matches profile
        joinedAt: '2023-09-01',
        totalXP: userStats.totalXP,
        totalLevels: userStats.totalLevels,
        score: calculateMemberScore(userStats.totalXP, userStats.totalLevels),
        rank: 0,
        isUser: true
    };

    // Combine and Sort
    const allMembers = [...mockMembers, userEntry].sort((a, b) => b.score - a.score);

    // Assign Ranks
    return allMembers.map((m, idx) => ({
        ...m,
        rank: idx + 1
    }));
};

export const getUserCommunityStats = (communityId: string, userStats: { totalXP: number, totalLevels: number }) => {
    const leaderboard = getCommunityLeaderboard(communityId, userStats);
    const userRank = leaderboard.find(m => m.isUser);

    // Find community details
    const commDetails = MOCK_COMMUNITIES.find(c => c.id === communityId);

    return {
        community: commDetails,
        rank: userRank?.rank || 999,
        totalMembers: leaderboard.length // In real app, this is huge, but mock is small
    };
};
