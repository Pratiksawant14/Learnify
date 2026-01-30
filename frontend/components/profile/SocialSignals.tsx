'use client';

import { Bell, Zap } from 'lucide-react';
import { MOCK_FRIENDS } from '@/lib/friends-system';

export default function SocialSignals() {
    // Deterministic mock signals
    const signals = [
        `You're ahead of ${MOCK_FRIENDS[1].name} in Frontend Engineering`,
        `${MOCK_FRIENDS[2].name} just leveled up to Level ${MOCK_FRIENDS[2].overallLevel}`,
        "You gained 2 ranks this week!"
    ];

    return (
        <div className="flex flex-col gap-2">
            {signals.map((sig, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800 rounded-lg text-xs text-slate-300">
                    <div className="p-1.5 bg-blue-500/10 rounded-full text-blue-400">
                        {idx === 0 ? <Zap className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                    </div>
                    <span>{sig}</span>
                </div>
            ))}
        </div>
    );
}
