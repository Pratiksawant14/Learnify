'use client';

import { Trophy, Globe, Users } from 'lucide-react';

export default function RankingsSection() {
    const ranks = [
        { title: "Global Rank", rank: "#4,821", icon: Globe, color: "text-blue-400", bg: "bg-blue-500/10" },
        { title: "AI Founders", rank: "#12", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
        { title: "VIIT Pune", rank: "#84", icon: Users, color: "text-amber-400", bg: "bg-amber-500/10" },
        { title: "Tech Aspirants", rank: "#7", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ranks.map((item, idx) => {
                const Icon = item.icon;
                return (
                    <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all rounded-xl p-5 flex flex-col items-center justify-center gap-3 group hover:-translate-y-1 shadow-lg">
                        <div className={`p-3 rounded-full ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white tracking-tight mb-1">{item.rank}</div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.title}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
