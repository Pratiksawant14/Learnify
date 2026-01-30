'use client';

import { Chapter } from '@/lib/mock-data/roadmaps';
import { X, Clock, BookOpen } from 'lucide-react';

interface ChapterPreviewPanelProps {
    chapter: Chapter;
    unitTitle: string;
    onClose: () => void;
}

export default function ChapterPreviewPanel({ chapter, unitTitle, onClose }: ChapterPreviewPanelProps) {
    return (
        <div className="w-96 h-full fixed right-0 top-0 bg-black/60 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    <p className="text-xs text-blue-400 mb-1">{unitTitle}</p>
                    <h2 className="text-xl font-bold text-white leading-tight">{chapter.title}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="ml-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5 text-white/60" />
                </button>
            </div>

            {/* Estimated Time */}
            {chapter.estimatedTime && (
                <div className="flex items-center gap-2 mb-6 px-4 py-3 bg-purple-500/10 border border-purple-400/20 rounded-lg">
                    <Clock className="w-4 h-4 text-purple-300" />
                    <span className="text-sm text-purple-200">{chapter.estimatedTime}</span>
                </div>
            )}

            {/* Description */}
            {chapter.description && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        About this chapter
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">{chapter.description}</p>
                </div>
            )}

            {/* Learning Points */}
            {chapter.learningPoints && chapter.learningPoints.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white/80 mb-3">What you'll learn</h3>
                    <ul className="space-y-2">
                        {chapter.learningPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                                <span className="text-sm text-white/70 leading-relaxed">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Videos Section */}
            {chapter.videos && chapter.videos.length > 0 && (
                <div className="mb-6">
                    <div className="h-px bg-white/10 mb-4" />
                    <h3 className="text-sm font-semibold text-white/80 mb-3">Videos in this chapter ({chapter.videos.length})</h3>
                    <div className="space-y-2">
                        {chapter.videos.map((video) => (
                            <button
                                key={video.id}
                                className="w-full text-left px-3 py-3 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-start gap-2 mb-1">
                                    <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-white/80 group-hover:text-white leading-snug flex-1">
                                        {video.title}
                                    </p>
                                </div>
                                <div className="ml-7 flex items-center gap-2 text-xs text-white/50">
                                    <span>{video.channel}</span>
                                    <span>•</span>
                                    <span>{video.duration}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Preview Note */}
            <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-white/40 text-center">
                    Click on a chapter to preview its content
                </p>
            </div>
        </div>
    );
}
