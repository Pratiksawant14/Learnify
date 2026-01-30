'use client';

import { useState } from 'react';
import SegmentedControl from '@/components/ui/SegmentedControl';
import CreatorSelector from '@/components/ui/CreatorSelector';
import { Sparkles } from 'lucide-react';

interface UnderstandingPhaseProps {
    userPrompt: string;
    onComplete: (data: UnderstandingData) => void;
}

export interface UnderstandingData {
    depth: string | null;
    duration: string | null;
    language: string | null;
    preferredCreators: string[];
}

// Mock creator data
const mockCreators = [
    { id: '1', name: 'Traversy Media', subscribers: '2.1M', avatar: 'TM' },
    { id: '2', name: 'freeCodeCamp', subscribers: '8.5M', avatar: 'FC' },
    { id: '3', name: 'Fireship', subscribers: '3.2M', avatar: 'FS' },
    { id: '4', name: 'The Net Ninja', subscribers: '1.2M', avatar: 'NN' },
    { id: '5', name: 'Academind', subscribers: '900K', avatar: 'AC' },
    { id: '6', name: 'Web Dev Simplified', subscribers: '1.5M', avatar: 'WD' },
];

export default function UnderstandingPhase({ userPrompt, onComplete }: UnderstandingPhaseProps) {
    const [depth, setDepth] = useState<string | null>(null);
    const [duration, setDuration] = useState<string | null>(null);
    const [language, setLanguage] = useState<string | null>(null);
    const [preferredCreators, setPreferredCreators] = useState<string[]>([]);

    const isValid = depth !== null && duration !== null && language !== null;

    const handleSubmit = () => {
        if (isValid) {
            onComplete({
                depth,
                duration,
                language,
                preferredCreators,
            });
        }
    };

    return (
        <div className="w-full animate-fadeIn">
            {/* Main Container */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Header */}
                <div className="mb-8 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-semibold text-white">Let's Understand Your Goals</h2>
                    </div>
                    <p className="text-white/60 text-sm">
                        You want to learn: <span className="text-white/90 font-medium">"{userPrompt}"</span>
                    </p>
                </div>

                {/* Scrollable Content */}
                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Section 1: Depth */}
                    <SegmentedControl
                        label="Depth"
                        options={['Basic', 'Advanced', 'Professional Mastery']}
                        value={depth}
                        onChange={setDepth}
                    />

                    {/* Section 2: Duration */}
                    <SegmentedControl
                        label="Duration"
                        options={['5 Hours', '10+ Hours', '20+ Hours']}
                        value={duration}
                        onChange={setDuration}
                    />

                    {/* Section 3: Language */}
                    <SegmentedControl
                        label="Language"
                        options={['English', 'Hindi', 'Hinglish']}
                        value={language}
                        onChange={setLanguage}
                    />

                    {/* Divider */}
                    <div className="h-px bg-white/10" />

                    {/* Section 4: Preferred Creators */}
                    <CreatorSelector
                        label="Preferences"
                        creators={mockCreators}
                        selectedIds={preferredCreators}
                        onChange={setPreferredCreators}
                    />
                </div>

                {/* Footer / CTA */}
                <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                    <button
                        onClick={handleSubmit}
                        disabled={!isValid}
                        className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 ${isValid
                            ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02]'
                            : 'bg-white/5 text-white/30 cursor-not-allowed'
                            }`}
                    >
                        Create My Learning Roadmap
                    </button>
                    <p className="text-center text-white/40 text-xs">
                        You can change these later
                    </p>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/10 to-purple-500/10 opacity-50 -z-10 blur-2xl" />
            </div>
        </div>
    );
}
