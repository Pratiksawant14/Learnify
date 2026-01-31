'use client';

import { useSkillSystem } from '@/hooks/useSkillSystem';
import { Zap } from 'lucide-react';

// Skill Badge Colors
const getLevelBadgeStyles = (level: number) => {
    if (level >= 5) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'; // Master
    if (level >= 3) return 'bg-purple-500/10 text-purple-400 border-purple-500/20'; // Advanced
    if (level >= 2) return 'bg-blue-500/10 text-blue-400 border-blue-500/20'; // Intermediate
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'; // Basic
};

const getLevelLabel = (level: number) => {
    if (level >= 5) return 'Master';
    if (level >= 3) return 'Advanced';
    if (level >= 2) return 'Intermediate';
    return 'Basic';
};

export default function SkillPerformanceView() {
    const { skills, isLoaded } = useSkillSystem();

    if (!isLoaded) return <div className="h-64 animate-pulse bg-slate-900 rounded-xl"></div>;

    if (skills.length === 0) {
        return (
            <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl">
                <p className="text-slate-400">No skills unlocking yet. Start learning!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
                <div
                    key={skill.id}
                    className="flex flex-col p-6 rounded-xl border bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-all group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                                <Zap className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="font-bold text-white group-hover:text-blue-200 transition-colors">{skill.name}</h3>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getLevelBadgeStyles(skill.level)}`}>
                            {getLevelLabel(skill.level)}
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="flex justify-between text-xs text-slate-500 mb-2">
                            <span>Progress</span>
                            <span>{skill.xp} XP</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${Math.min(100, (skill.xp % 100))}%` }} // Simplified progress bar
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
