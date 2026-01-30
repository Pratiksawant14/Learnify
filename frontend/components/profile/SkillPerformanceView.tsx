'use client';

import { useState, useMemo } from 'react';
import { useSkillSystem } from '@/hooks/useSkillSystem';
import { Zap, TrendingUp } from 'lucide-react';

// Mock data generator for the graph
const generateGraphData = (seed: number) => {
    // Generate 10 points
    // Randomish upward trend
    let data = [];
    let current = 10;
    for (let i = 0; i < 12; i++) {
        const jump = Math.floor(Math.random() * (seed % 10 + 5)); // variation
        current += jump;
        // make sure it doesn't go down
        if (Math.random() > 0.8) current -= 2;
        data.push(current);
    }
    return data;
};

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
    const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

    // Default to first skill if loaded
    const activeSkillId = selectedSkillId || (skills[0]?.id);

    const activeSkill = useMemo(() => {
        return skills.find(s => s.id === activeSkillId) || skills[0];
    }, [skills, activeSkillId]);

    // Generate graph points based on active skill ID (stable mock data)
    const graphData = useMemo(() => {
        if (!activeSkill) return [];
        // Use char code sum as seed
        const seed = activeSkill.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return generateGraphData(seed);
    }, [activeSkill]);

    // SVG Graph Helpers
    const width = 600;
    const height = 200;
    const padding = 20;

    // Normalize data to fit SVG
    const maxVal = Math.max(...graphData, 100);
    const minVal = Math.min(...graphData, 0);

    const points = graphData.map((val, idx) => {
        const x = (idx / (graphData.length - 1)) * (width - 2 * padding) + padding;
        const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
        return `${x},${y}`;
    }).join(' ');

    // Fill area points
    const areaPoints = `${padding},${height - padding} ` + points + ` ${width - padding},${height - padding}`;

    if (!isLoaded) return <div className="h-64 animate-pulse bg-slate-900 rounded-xl"></div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Skill List */}
            <div className="lg:col-span-1 space-y-3">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Skill Levels</h3>
                </div>

                {skills.map((skill) => {
                    const isActive = skill.id === activeSkillId;
                    return (
                        <button
                            key={skill.id}
                            onClick={() => setSelectedSkillId(skill.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left group ${isActive
                                    ? 'bg-slate-800 border-blue-500/50 shadow-lg shadow-blue-500/10'
                                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                                }`}
                        >
                            <div>
                                <div className={`font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                    {skill.name}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">Lv. {skill.level} • {skill.xp} XP</div>
                            </div>
                            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getLevelBadgeStyles(skill.level)}`}>
                                {getLevelLabel(skill.level)}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Right: Dynamic Graph */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <TrendingUp className="w-48 h-48 text-white" />
                </div>

                {/* Graph Header */}
                <div className="relative z-10 mb-8 flex justify-between items-end">
                    <div>
                        <div className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">Growth Analytics</div>
                        <h2 className="text-3xl font-bold text-white font-mono">{activeSkill?.name}</h2>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold text-blue-500 drop-shadow-sm">
                            +{Math.floor(Math.random() * 20 + 10)}%
                        </div>
                        <div className="text-xs text-slate-500">vs last month</div>
                    </div>
                </div>

                {/* The Chart */}
                <div className="relative w-full h-64 z-10">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                        {/* Gradient Defs */}
                        <defs>
                            <linearGradient id="gradientLine" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Grid Lines (simplified) */}
                        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
                        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="1" />

                        {/* Area Fill */}
                        <path
                            d={areaPoints}
                            fill="url(#gradientLine)"
                            className="bg-blend-overlay transition-all duration-500 ease-out"
                        />

                        {/* Stroke Line */}
                        <path
                            d={`M ${points}`}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500 ease-out"
                        />

                        {/* Data Points */}
                        {graphData.map((val, idx) => {
                            const x = (idx / (graphData.length - 1)) * (width - 2 * padding) + padding;
                            const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
                            return (
                                <circle
                                    key={idx}
                                    cx={x}
                                    cy={y}
                                    r="4"
                                    className="fill-slate-900 stroke-blue-400 stroke-2 hover:r-6 hover:fill-blue-400 transition-all cursor-crosshair"
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* X-Axis Labels Mock */}
                <div className="flex justify-between px-2 mt-2 text-xs text-slate-600 font-mono">
                    <span>Oct 1</span>
                    <span>Oct 15</span>
                    <span>Nov 1</span>
                    <span>Nov 15</span>
                    <span>Dec 1</span>
                    <span>Today</span>
                </div>
            </div>
        </div>
    );
}
