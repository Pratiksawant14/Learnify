'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface Creator {
    id: string;
    name: string;
    subscribers: string;
    avatar: string;
}

interface CreatorSelectorProps {
    creators: Creator[];
    selectedIds: string[];
    onChange: (selectedIds: string[]) => void;
    label: string;
}

export default function CreatorSelector({ creators, selectedIds, onChange, label }: CreatorSelectorProps) {
    const handleToggle = (creatorId: string) => {
        if (selectedIds.includes(creatorId)) {
            onChange(selectedIds.filter(id => id !== creatorId));
        } else {
            onChange([...selectedIds, creatorId]);
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/90 tracking-wide uppercase">{label}</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {creators.map((creator) => {
                    const isSelected = selectedIds.includes(creator.id);
                    return (
                        <button
                            key={creator.id}
                            type="button"
                            onClick={() => handleToggle(creator.id)}
                            className="flex flex-col items-center gap-2 transition-all duration-300 group"
                        >
                            {/* Avatar with checkmark overlay */}
                            <div className="relative">
                                <div className={`w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-500 p-0.5 transition-all duration-300 ${isSelected ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent' : ''
                                    }`}>
                                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-white text-lg font-bold">
                                        {creator.avatar}
                                    </div>
                                </div>

                                {/* Checkmark overlay on avatar */}
                                {isSelected && (
                                    <div className="absolute inset-0 rounded-full bg-purple-500/80 backdrop-blur-sm flex items-center justify-center">
                                        <Check className="w-8 h-8 text-white" strokeWidth={3} />
                                    </div>
                                )}
                            </div>

                            {/* Creator info */}
                            <div className="text-center">
                                <p className={`text-sm font-medium transition-colors ${isSelected ? 'text-purple-300' : 'text-white/80 group-hover:text-white'
                                    }`}>
                                    {creator.name}
                                </p>
                                <p className="text-xs text-white/50 mt-0.5">
                                    {creator.subscribers}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
