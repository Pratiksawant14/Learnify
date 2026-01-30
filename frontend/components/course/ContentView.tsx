'use client';

import { getLessonContent } from '@/lib/mock-data/lesson-content';
import { Clock } from 'lucide-react';

interface ContentViewProps {
    selectedLesson: {
        lessonId: string;
        lessonTitle: string;
        chapterTitle: string;
        duration: string;
    } | null;
}

export default function ContentView({ selectedLesson }: ContentViewProps) {
    // If no lesson is selected, show empty state
    if (!selectedLesson) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                    <p className="text-slate-400 text-lg">Select a lesson from the Roadmap to view its content</p>
                    <p className="text-slate-500 text-sm">Click on any lesson in the roadmap to get started</p>
                </div>
            </div>
        );
    }

    // Get lesson content
    const lessonContent = getLessonContent(selectedLesson.lessonId);

    // If content not found, show fallback
    if (!lessonContent) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                    <p className="text-slate-400 text-lg">Content not available for this lesson</p>
                    <p className="text-slate-500 text-sm">This lesson's content is being prepared</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-3xl mx-auto py-8 px-6">
                {/* Header */}
                <div className="mb-8 pb-6 border-b border-slate-700">
                    <h1 className="text-3xl font-bold text-white mb-3">
                        {selectedLesson.lessonTitle}
                    </h1>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>{selectedLesson.chapterTitle}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{selectedLesson.duration}</span>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="space-y-6">
                    {lessonContent.sections.map((section, index) => {
                        switch (section.type) {
                            case 'heading':
                                return (
                                    <h2 key={index} className="text-2xl font-semibold text-white mt-8 mb-4">
                                        {section.content as string}
                                    </h2>
                                );

                            case 'paragraph':
                                return (
                                    <p key={index} className="text-base text-slate-300 leading-relaxed">
                                        {section.content as string}
                                    </p>
                                );

                            case 'list':
                                return (
                                    <ul key={index} className="ml-6 space-y-2">
                                        {(section.content as string[]).map((item, itemIndex) => (
                                            <li key={itemIndex} className="text-base text-slate-300 leading-relaxed">
                                                • {item}
                                            </li>
                                        ))}
                                    </ul>
                                );

                            case 'code':
                                return (
                                    <div key={index} className="relative">
                                        {section.language && (
                                            <div className="absolute top-2 right-2 text-xs text-slate-500 font-mono">
                                                {section.language}
                                            </div>
                                        )}
                                        <pre className="bg-slate-900 text-slate-100 p-4 rounded border border-slate-700 overflow-x-auto">
                                            <code className="font-mono text-sm">
                                                {section.content as string}
                                            </code>
                                        </pre>
                                    </div>
                                );

                            default:
                                return null;
                        }
                    })}
                </div>

                {/* Bottom spacing */}
                <div className="h-16" />
            </div>
        </div>
    );
}
