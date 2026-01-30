'use client';

import { Hash, Users } from 'lucide-react';

export default function InterestsSection() {
    const interests = ["Python", "React", "Next.js", "System Design", "AI Agents", "Filmmaking"];
    const communities = [
        { name: "AI Founders", role: "Member", since: "Jan 2024" },
        { name: "VIIT Pune", role: "Alumni", since: "Aug 2021" },
        { name: "Tech Aspirants", role: "Contributor", since: "Dec 2023" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interests / Fields */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Hash className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Fields Pursued</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {interests.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-full hover:bg-slate-700/80 hover:border-slate-600 transition-colors cursor-default">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Communities */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Communities</h3>
                </div>
                <div className="space-y-3">
                    {communities.map((comm) => (
                        <div key={comm.name} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-[10px] font-bold text-white border border-slate-700">
                                    {comm.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                                        {comm.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                                        {comm.role}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-slate-600 font-mono">
                                {comm.since}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
