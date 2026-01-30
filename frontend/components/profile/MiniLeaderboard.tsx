'use client';

import { MOCK_FRIENDS, getRankScore } from '@/lib/friends-system';
import { useSkillSystem } from '@/hooks/useSkillSystem';
import { useMemo } from 'react';
import { Trophy } from 'lucide-react';

export default function MiniLeaderboard() {
    const { skills } = useSkillSystem();

    // Calculate User Stats
    const userTotalXP = skills.reduce((acc, s) => acc + s.xp, 0);
    // Mock user completion for now (or pass it in props if needed exact)
    const userCompletion = 42;

    const leaderboard = useMemo(() => {
        // Create user entry
        const userEntry = {
            id: 'user',
            name: 'You',
            isUser: true,
            score: getRankScore(userTotalXP, userCompletion),
            avatarColor: 'bg-blue-600',
            avatarInitials: 'ME'
        };

        // Create friend entries
        const friendEntries = MOCK_FRIENDS.map(f => ({
            id: f.id,
            name: f.name,
            isUser: false,
            score: getRankScore(f.totalXP, f.courseCompletion),
            avatarColor: f.avatarColor,
            avatarInitials: f.avatarInitials
        }));

        // Combine and Sort
        return [...friendEntries, userEntry]
            .sort((a, b) => b.score - a.score)
            .map((entry, idx) => ({ ...entry, rank: idx + 1 }))
            .slice(0, 5); // Top 5

    }, [userTotalXP]);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 w-full">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Friend Ranking</h3>
            </div>

            <div className="space-y-3">
                {leaderboard.map((player) => (
                    <div
                        key={player.id}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${player.isUser ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-slate-800'}`}
                    >
                        <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded ${player.rank === 1 ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                            {player.rank}
                        </div>

                        <div className={`w-8 h-8 rounded-full ${player.avatarColor} flex items-center justify-center text-[10px] font-bold text-white`}>
                            {player.avatarInitials}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${player.isUser ? 'text-blue-400' : 'text-slate-200'}`}>
                                {player.name}
                            </div>
                        </div>

                        <div className="text-xs font-mono text-slate-500">
                            {Math.floor(player.score)} pts
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-center">
                <button className="text-xs text-slate-500 hover:text-white transition-colors">View All Rankings</button>
            </div>
        </div>
    );
}
