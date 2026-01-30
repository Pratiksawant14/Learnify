'use client';

import { Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ActivityHeatmap() {
    const [data, setData] = useState<number[] | null>(null);

    useEffect(() => {
        // Generate mock activity data on client side only to avoid hydration mismatch
        const days = 60;
        const mockData = Array.from({ length: days }).map((_, i) => {
            // More recent activity (higher index) slightly higher chance
            const baseChance = Math.random() > 0.4;
            if (!baseChance) return 0;
            return Math.floor(Math.random() * 5);
        });
        setData(mockData);
    }, []);

    const getColor = (level: number) => {
        switch (level) {
            case 0: return 'bg-slate-800/50';
            case 1: return 'bg-emerald-900/40';
            case 2: return 'bg-emerald-700/60';
            case 3: return 'bg-emerald-500';
            case 4: return 'bg-emerald-400 border border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]';
            default: return 'bg-slate-800';
        }
    };

    if (!data) {
        return (
            <div className="w-full bg-slate-900/30 border border-slate-800/60 rounded-xl p-6 flex flex-col items-start gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-400">
                        <Activity className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Learning Activity</h3>
                </div>
                <div className="w-full h-16 bg-slate-800/20 animate-pulse rounded-lg" />
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-900/30 border border-slate-800/60 rounded-xl p-6 flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-400">
                    <Activity className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Learning Activity</h3>
            </div>

            {/* Heatmap Grid - Responsive */}
            <div className="w-full overflow-hidden">
                <div className="flex flex-wrap gap-1.5">
                    {data.map((level, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm ${getColor(level)} transition-all duration-300 hover:scale-125`}
                            title={`Activity Level: ${level}`}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full flex justify-between items-center text-xs text-slate-500 font-mono mt-1">
                <span>Last 60 days</span>
                <div className="flex items-center gap-2">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-sm bg-slate-800/50" />
                        <div className="w-2 h-2 rounded-sm bg-emerald-900/40" />
                        <div className="w-2 h-2 rounded-sm bg-emerald-500" />
                        <div className="w-2 h-2 rounded-sm bg-emerald-400" />
                    </div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
}
