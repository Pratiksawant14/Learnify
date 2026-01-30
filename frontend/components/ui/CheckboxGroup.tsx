'use client';

import { Check } from 'lucide-react';

interface CheckboxGroupProps {
    options: string[];
    values: string[];
    onChange: (values: string[]) => void;
    label: string;
}

export default function CheckboxGroup({ options, values, onChange, label }: CheckboxGroupProps) {
    const handleToggle = (option: string) => {
        if (values.includes(option)) {
            onChange(values.filter(v => v !== option));
        } else {
            onChange([...values, option]);
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/90 tracking-wide uppercase">{label}</h3>
            <div className="space-y-2">
                {options.map((option) => {
                    const isSelected = values.includes(option);
                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleToggle(option)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 text-sm ${isSelected
                                    ? 'bg-purple-500/20 border-purple-400/40 text-purple-200'
                                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                                    ? 'bg-purple-500/40 border-purple-400'
                                    : 'border-white/30'
                                }`}>
                                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>
                            <span className="flex-1 text-left">{option}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
