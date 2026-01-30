'use client';

interface ProgressTrackerProps {
    totalItems: number;
    completedIndices?: number[];
    skippedIndices?: number[];
}

export default function ProgressTracker({
    totalItems,
    completedIndices = [0, 1],
    skippedIndices = [2]
}: ProgressTrackerProps) {
    const dots = Array.from({ length: Math.min(totalItems, 10) }, (_, i) => i);

    const getDotColor = (index: number) => {
        if (completedIndices.includes(index)) return 'bg-green-500';
        if (skippedIndices.includes(index)) return 'bg-red-500';
        return 'bg-gray-300';
    };

    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
                {dots.map((index, i) => (
                    <div key={index} className="flex items-center flex-1">
                        {/* Dot */}
                        <div
                            className={`w-3 h-3 rounded-full ${getDotColor(index)} transition-colors`}
                            title={
                                completedIndices.includes(index)
                                    ? 'Completed'
                                    : skippedIndices.includes(index)
                                        ? 'Skipped'
                                        : 'Not started'
                            }
                        />
                        {/* Connecting line (except for last dot) */}
                        {i < dots.length - 1 && (
                            <div className="flex-1 h-0.5 bg-gray-200 mx-1" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
