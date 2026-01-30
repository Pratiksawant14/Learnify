'use client';

import { useState } from 'react';
import IndexRoadmapView from './IndexRoadmapView';
import TreeRoadmapView from './TreeRoadmapView';
import ChapterPreviewPanel from './ChapterPreviewPanel';
import { Roadmap, Chapter } from '@/lib/mock-data/roadmaps';

interface RoadmapContainerProps {
    courseTitle: string;
    roadmap: Roadmap;
    onLessonSelect?: (lesson: {
        lessonId: string;
        lessonTitle: string;
        chapterTitle: string;
        duration: string;
    }) => void;
    completedLessons?: string[];
    isLessonLocked?: (lessonId: string) => boolean;
}

export default function RoadmapContainer({
    courseTitle,
    roadmap,
    onLessonSelect,
    completedLessons = [],
    isLessonLocked = () => false
}: RoadmapContainerProps) {
    const [view, setView] = useState<'index' | 'tree'>('index');
    const [selectedChapter, setSelectedChapter] = useState<{ chapter: Chapter; unitTitle: string } | null>(null);

    const handleChapterClick = (chapter: Chapter, unitTitle: string) => {
        setSelectedChapter({ chapter, unitTitle });
    };

    return (
        <div className="max-w-full relative px-8 py-4">
            {/* View Toggle Header */}
            <div className="flex justify-end mb-4">
                <div className="bg-slate-800 p-1 rounded-lg inline-flex items-center gap-1">
                    <button
                        onClick={() => setView('index')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'index' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        List View
                    </button>
                    <button
                        onClick={() => setView('tree')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'tree' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Tree View
                    </button>
                </div>
            </div>

            {/* Solid Book-Style Container */}
            <div className={`bg-slate-900 rounded-lg shadow-2xl p-8 ${selectedChapter ? 'mr-96' : ''} transition-all duration-300`}>
                <div>
                    {view === 'index' ? (
                        <IndexRoadmapView
                            courseTitle={courseTitle}
                            roadmap={roadmap}
                            onChapterClick={handleChapterClick}
                            onLessonSelect={onLessonSelect}
                            completedLessons={completedLessons}
                            isLessonLocked={isLessonLocked}
                        />
                    ) : (
                        <TreeRoadmapView
                            courseTitle={courseTitle}
                            roadmap={roadmap}
                            onChapterClick={handleChapterClick}
                            onLessonSelect={onLessonSelect}
                            completedLessons={completedLessons}
                            isLessonLocked={isLessonLocked}
                        />
                    )}
                </div>
            </div>

            {/* Chapter Preview Panel */}
            {selectedChapter && (
                <ChapterPreviewPanel
                    chapter={selectedChapter.chapter}
                    unitTitle={selectedChapter.unitTitle}
                    onClose={() => setSelectedChapter(null)}
                />
            )}
        </div>
    );
}
