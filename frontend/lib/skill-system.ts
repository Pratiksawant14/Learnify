
export interface Skill {
    id: string;
    name: string;
    description: string;
    xp: number;
    level: number;
    icon?: string;
}

export const DEFAULT_SKILLS: Skill[] = [
    {
        id: 'frontend',
        name: 'Frontend Engineering',
        description: 'Building user interfaces and interactions',
        xp: 0,
        level: 1,
        icon: 'Layout'
    },
    {
        id: 'backend',
        name: 'Backend Architecture',
        description: 'Server-side logic, databases, and APIs',
        xp: 0,
        level: 1,
        icon: 'Server'
    },
    {
        id: 'devops',
        name: 'DevOps & Systems',
        description: 'Deployment, CI/CD, and infrastructure',
        xp: 0,
        level: 1,
        icon: 'Cloud'
    },
    {
        id: 'cs_fundamentals',
        name: 'CS Fundamentals',
        description: 'Algorithms, data structures, and theory',
        xp: 0,
        level: 1,
        icon: 'Cpu'
    }
];

// Helper to get level from XP
// Formula: Level = 1 + floor(XP / 100)
export const calculateLevel = (xp: number): number => {
    return 1 + Math.floor(xp / 100);
};

// Helper to get progress to next level (0-100%)
export const calculateLevelProgress = (xp: number): number => {
    return xp % 100; // Since every 100 XP is a level
};

// Mock mapping of Lesson keywords to Skills
// In a real app, this would be in the database
export const getSkillsForLesson = (lessonTitle: string): Record<string, number> => {
    const lowerTitle = lessonTitle.toLowerCase();
    const rewards: Record<string, number> = {};

    // Default base reward
    rewards['cs_fundamentals'] = 20;

    if (lowerTitle.includes('react') || lowerTitle.includes('css') || lowerTitle.includes('html') || lowerTitle.includes('frontend') || lowerTitle.includes('ui')) {
        rewards['frontend'] = 50;
    }

    if (lowerTitle.includes('api') || lowerTitle.includes('database') || lowerTitle.includes('server') || lowerTitle.includes('backend') || lowerTitle.includes('sql')) {
        rewards['backend'] = 50;
    }

    if (lowerTitle.includes('deploy') || lowerTitle.includes('docker') || lowerTitle.includes('aws') || lowerTitle.includes('ci/cd')) {
        rewards['devops'] = 50;
    }

    if (lowerTitle.includes('algorithm') || lowerTitle.includes('structure') || lowerTitle.includes('memory') || lowerTitle.includes('system design')) {
        rewards['cs_fundamentals'] = 50; // Boost
    }

    return rewards;
};
