'use client';

interface SegmentedControlProps {
    options: string[];
    value: string | null;
    onChange: (value: string) => void;
    label: string;
}

export default function SegmentedControl({ options, value, onChange, label }: SegmentedControlProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/90 tracking-wide uppercase">{label}</h3>
            <div className="flex flex-wrap gap-3">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        className={`relative px-6 py-3 rounded-xl border transition-all duration-300 text-sm font-medium ${value === option
                                ? 'bg-blue-500/30 border-blue-400/50 text-blue-200 shadow-lg shadow-blue-500/20'
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                            }`}
                    >
                        {option}
                        {value === option && (
                            <div className="absolute inset-0 rounded-xl bg-blue-400/20 blur-md -z-10" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
