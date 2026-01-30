'use client';

import { Users, ChevronRight, Trophy } from 'lucide-react';
import { Community } from '@/lib/community-system';

interface CommunityCardProps {
    community: Community;
    userRank: number;
    onClickLeaderboard: () => void;
}

export default function CommunityCard({ community, userRank, onClickLeaderboard }: CommunityCardProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all group relative overflow-hidden">
            {/* Banner Line */}
            <div className={`absolute top-0 left-0 w-1 h-full ${community.bannerColor}`} />

            <div className="flex justify-between items-start mb-4 pl-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white text-lg">{community.name}</h3>
                        {userRank <= 10 && (
                            <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase rounded border border-yellow-500/20">
                                Top 10
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{community.description}</p>
                </div>
                <div className={`p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-white transition-colors`}>
                    <Users className="w-5 h-5" />
                </div>
            </div>

            <div className="flex items-end justify-between pl-2">
                <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Your Rank</div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-normal text-slate-400">#</span>
                        <span className="text-2xl font-bold text-white">{userRank}</span>
                    </div>
                </div>

                <button
                    onClick={onClickLeaderboard}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <span>Leaderboard</span>
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
