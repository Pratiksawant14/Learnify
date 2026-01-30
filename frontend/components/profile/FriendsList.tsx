'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MOCK_FRIENDS, Friend } from '@/lib/friends-system';
import { useSkillSystem } from '@/hooks/useSkillSystem';
import { Users, Swords, UserMinus } from 'lucide-react';
import ComparisonModal from './ComparisonModal';

export default function FriendsList() {
    const { skills } = useSkillSystem();
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

    // Calculate user stats for modal props
    const userTotalXP = skills.reduce((acc, s) => acc + s.xp, 0);
    const userLevel = skills.length > 0 ? Math.max(...skills.map(s => s.level)) : 1; // Or sum/avg logic

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                        <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Friends</h3>
                </div>
                <div className="text-sm text-slate-500">
                    {MOCK_FRIENDS.length} active
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_FRIENDS.map((friend) => (
                    <div key={friend.id} className="bg-slate-950/50 border border-slate-800/50 rounded-xl p-4 flex items-center justify-between group hover:border-slate-700 transition-all">
                        <div className="flex items-center gap-3">
                            <Link href={`/profile/${friend.username.replace('@', '')}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <div className={`w-10 h-10 rounded-full ${friend.avatarColor} flex items-center justify-center text-sm font-bold text-white shadow-lg`}>
                                    {friend.avatarInitials}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-200 group-hover:text-white transition-colors">
                                        {friend.name}
                                    </div>
                                    <div className="text-xs text-slate-500 flex items-center gap-2">
                                        <span>Lv. {friend.overallLevel}</span>
                                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                        <span>{friend.totalXP} XP</span>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setSelectedFriend(friend)}
                                className="p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-colors title='Compare'"
                            >
                                <Swords className="w-4 h-4" />
                            </button>
                            {/* <button className="p-2 hover:bg-red-500/10 hover:text-red-400 text-slate-600 rounded-lg transition-colors">
                                <UserMinus className="w-4 h-4" />
                            </button> */}
                        </div>
                    </div>
                ))}
            </div>

            {selectedFriend && (
                <ComparisonModal
                    friend={selectedFriend}
                    userSkills={skills}
                    userTotalXP={userTotalXP}
                    userLevel={userLevel} // Just max level for now, simplistic
                    onClose={() => setSelectedFriend(null)}
                />
            )}
        </div>
    );
}
