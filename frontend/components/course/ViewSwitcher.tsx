'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ViewSwitcherProps {
    currentView: 'index' | 'tree';
    onViewChange: (view: 'index' | 'tree') => void;
}

export default function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const views = [
        { id: 'index' as const, label: 'Index' },
        { id: 'tree' as const, label: 'Tree' }
    ];

    const currentViewLabel = views.find(v => v.id === currentView)?.label || 'Index';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
                <span className="text-sm text-white/80">Roadmap View:</span>
                <span className="text-sm font-medium text-white">{currentViewLabel}</span>
                <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
                    {views.map((view) => (
                        <button
                            key={view.id}
                            onClick={() => {
                                onViewChange(view.id);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm transition-colors ${currentView === view.id
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : 'text-white/80 hover:bg-white/5'
                                }`}
                        >
                            {view.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
