'use client';

import { X, Trophy, Shield } from 'lucide-react';
import { CommunityMember } from '@/lib/community-system';
import { useEffect } from 'react';

interface LeaderboardModalProps {
    communityName: string;
    members: CommunityMember[];
    onClose: () => void;
}

export default function CommunityLeaderboardModal({ communityName, members, onClose }: LeaderboardModalProps) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-0.5">{communityName}</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Top Contributors</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* List Header */}
                <div className="grid grid-cols-12 px-6 py-3 bg-slate-900/50 border-b border-white/5 text-xs font-mono text-slate-500 uppercase tracking-wider">
                    <div className="col-span-2 text-center">Rank</div>
                    <div className="col-span-6">Member</div>
                    <div className="col-span-2 text-center">Level</div>
                    <div className="col-span-2 text-right">Score</div>
                </div>

                {/* Scrollable List */}
                <div className="overflow-y-auto p-2 space-y-1">
                    {members.map((member) => (
                        <div
                            key={member.userId}
                            className={`grid grid-cols-12 items-center px-4 py-3 rounded-lg border transition-all ${member.isUser
                                    ? 'bg-blue-500/10 border-blue-500/30'
                                    : 'border-transparent hover:bg-slate-800/50 hover:border-slate-800'
                                }`}
                        >
                            {/* Rank */}
                            <div className="col-span-2 flex justify-center">
                                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${member.rank <= 3
                                        ? 'bg-yellow-500 text-black'
                                        : 'bg-slate-800 text-slate-400'
                                    }`}>
                                    #{member.rank}
                                </span>
                            </div>

                            {/* Member Info */}
                            <div className="col-span-6 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${member.avatarColor} flex items-center justify-center text-sm font-bold text-white shadow-sm`}>
                                    {member.avatarInitials}
                                </div>
                                <div className="min-w-0">
                                    <div className={`font-bold truncate ${member.isUser ? 'text-blue-400' : 'text-slate-200'}`}>
                                        {member.username} {member.isUser && '(You)'}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate">
                                        {member.totalXP.toLocaleString()} XP
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="col-span-2 text-center">
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                                    <Shield className="w-3 h-3" />
                                    <span>{member.totalLevels}</span>
                                </div>
                            </div>

                            <div className="col-span-2 text-right text-sm font-mono font-bold text-slate-400">
                                {member.score.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-950 border-t border-white/10 text-center">
                    <p className="text-xs text-slate-500">
                        Rankings calculate XP + (Total Skill Levels × 100). Keep learning to climb!
                    </p>
                </div>
            </div>
        </div>
    );
}
