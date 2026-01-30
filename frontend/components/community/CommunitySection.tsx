'use client';

import { useState } from 'react';
import { Globe, Plus } from 'lucide-react';
import { useSkillSystem } from '@/hooks/useSkillSystem';
import { MOCK_COMMUNITIES, getUserCommunityStats, CommunityMember, getCommunityLeaderboard } from '@/lib/community-system';
import CommunityCard from './CommunityCard';
import CommunityLeaderboardModal from './CommunityLeaderboardModal';

export default function CommunitySection() {
    const { skills } = useSkillSystem();
    const [selectedLeaderboard, setSelectedLeaderboard] = useState<{ name: string, members: CommunityMember[] } | null>(null);

    // Calculate User Real Stats
    const userTotalXP = skills.reduce((sum, s) => sum + s.xp, 0);
    const userTotalLevels = skills.reduce((sum, s) => sum + s.level, 0);
    const userStats = { totalXP: userTotalXP, totalLevels: userTotalLevels };

    const handleViewLeaderboard = (communityId: string, communityName: string) => {
        const members = getCommunityLeaderboard(communityId, userStats);
        setSelectedLeaderboard({ name: communityName, members });
    };

    return (
        <section className="animate-in fade-in slide-in-from-top-8 duration-700 delay-400">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <Globe className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Communities</h2>
                </div>
                <div className="h-px flex-1 bg-slate-800 mx-6"></div>
                <button className="text-xs flex items-center gap-1 text-slate-500 hover:text-white transition-colors">
                    <Plus className="w-3 h-3" />
                    Join New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_COMMUNITIES.map(community => {
                    const stats = getUserCommunityStats(community.id, userStats);

                    return (
                        <CommunityCard
                            key={community.id}
                            community={community}
                            userRank={stats.rank}
                            onClickLeaderboard={() => handleViewLeaderboard(community.id, community.name)}
                        />
                    );
                })}
            </div>

            {selectedLeaderboard && (
                <CommunityLeaderboardModal
                    communityName={selectedLeaderboard.name}
                    members={selectedLeaderboard.members}
                    onClose={() => setSelectedLeaderboard(null)}
                />
            )}
        </section>
    );
}
