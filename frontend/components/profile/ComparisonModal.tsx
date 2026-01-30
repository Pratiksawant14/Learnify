'use client';

import { X, Trophy, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Friend } from '@/lib/friends-system';
import { Skill } from '@/lib/skill-system';
import { useEffect, useState } from 'react';

interface ComparisonModalProps {
    friend: Friend;
    userSkills: Skill[];
    userTotalXP: number;
    userLevel: number;
    onClose: () => void;
}

export default function ComparisonModal({ friend, userSkills, userTotalXP, userLevel, onClose }: ComparisonModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
            setIsVisible(false);
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for anim
    };

    // Helper to find best skill
    const getBestSkill = (skills: Skill[]) => {
        return skills.reduce((prev, current) => (prev.xp > current.xp) ? prev : current);
    };

    const userBest = getBestSkill(userSkills);
    const friendBest = getBestSkill(friend.skills);

    const ComparableRow = ({ label, userVal, friendVal, format = (v: any) => v }: { label: string, userVal: number, friendVal: number, format?: (v: any) => string }) => {
        const userWins = userVal >= friendVal;
        const friendWins = friendVal > userVal;

        return (
            <div className="grid grid-cols-3 py-4 border-b border-white/5 items-center">
                <div className={`text-center font-bold ${userWins ? 'text-blue-400 text-lg' : 'text-slate-400'}`}>
                    {format(userVal)}
                </div>
                <div className="text-center text-xs uppercase tracking-widest text-slate-500 font-medium">
                    {label}
                </div>
                <div className={`text-center font-bold ${friendWins ? 'text-purple-400 text-lg' : 'text-slate-400'}`}>
                    {format(friendVal)}
                </div>
            </div>
        );
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/0 pointer-events-none'}`}>
            <div
                className={`w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                {/* Header */}
                <div className="relative p-6 bg-slate-950 border-b border-white/10 text-center">
                    <button onClick={handleClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">Head to Head</h3>
                </div>

                {/* Fighters */}
                <div className="grid grid-cols-2 gap-4 p-8 bg-gradient-to-b from-slate-900 to-slate-950">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                            YOU
                        </div>
                        <div className="font-bold text-white">You</div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div className="text-2xl font-black text-slate-700 italic">VS</div>
                    </div>

                    <div className="flex flex-col items-center gap-3 -order-1 md:order-none">
                        <div className={`w-20 h-20 rounded-full ${friend.avatarColor} flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]`}>
                            {friend.avatarInitials}
                        </div>
                        <div className="font-bold text-white">{friend.name}</div>
                    </div>
                </div>

                {/* Stats Table */}
                <div className="bg-slate-900 p-6 pt-2">
                    <ComparableRow label="Overall Level" userVal={userLevel} friendVal={friend.overallLevel} />
                    <ComparableRow label="Total XP" userVal={userTotalXP} friendVal={friend.totalXP} format={(v) => v.toLocaleString()} />
                    <ComparableRow label="Course Progress" userVal={42} friendVal={friend.courseCompletion} format={(v) => v + '%'} />

                    {/* Best Skill Row (Custom) */}
                    <div className="grid grid-cols-3 py-4 items-center">
                        <div className="text-center">
                            <div className="text-sm font-bold text-blue-300">{userBest.name.split(' ')[0]}</div>
                            <div className="text-xs text-slate-500">Lv. {userBest.level}</div>
                        </div>
                        <div className="text-center text-xs uppercase tracking-widest text-slate-500 font-medium">
                            Top Skill
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-bold text-purple-300">{friendBest.name.split(' ')[0]}</div>
                            <div className="text-xs text-slate-500">Lv. {friendBest.level}</div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-950 border-t border-white/10 text-center">
                    <p className="text-xs text-slate-500">Rankings updated daily based on global XP.</p>
                </div>
            </div>
        </div>
    );
}
