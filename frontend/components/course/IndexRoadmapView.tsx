'use client';

import { Roadmap, Chapter } from '@/lib/mock-data/roadmaps';
import { useState } from 'react';
import { ChevronRight, ChevronDown, Clock, Lock, Unlock, CheckCircle, Circle } from 'lucide-react';

interface RoadmapViewProps {
    courseTitle: string;
    roadmap: Roadmap;
    onChapterClick?: (chapter: Chapter, unitTitle: string) => void;
    onLessonSelect?: (lesson: {
        lessonId: string;
        lessonTitle: string;
        chapterTitle: string;
        duration: string;
    }) => void;
    completedLessons?: string[];
    isLessonLocked?: (lessonId: string) => boolean;
}

export default function IndexRoadmapView({
    courseTitle,
    roadmap,
    onChapterClick,
    onLessonSelect,
    completedLessons = [],
    isLessonLocked = () => false
}: RoadmapViewProps) {
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

    const toggleChapter = (chapterId: string, chapter: Chapter, unitTitle: string) => {
        // If chapter has lessons, toggle expansion
        if (chapter.lessons && chapter.lessons.length > 0) {
            const newExpanded = new Set(expandedChapters);
            if (newExpanded.has(chapterId)) {
                newExpanded.delete(chapterId);
            } else {
                newExpanded.add(chapterId);
            }
            setExpandedChapters(newExpanded);
        } else {
            // If no lessons, open chapter preview panel (existing behavior)
            onChapterClick?.(chapter, unitTitle);
        }
    };

    const handleLessonClick = (lessonId: string, lessonTitle: string, chapterTitle: string, duration: string) => {
        if (isLessonLocked(lessonId)) return;

        setSelectedLesson(lessonId);
        // Call parent callback if provided
        onLessonSelect?.({
            lessonId,
            lessonTitle,
            chapterTitle,
            duration
        });
    };

    return (
        <div className="space-y-10">
            {roadmap.units.map((unit, unitIndex) => (
                <div key={unit.id} className="space-y-4">
                    {/* Unit Header - Book Chapter Style */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">{unitIndex + 1}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white">{unit.title}</h2>
                        </div>
                    </div>

                    {/* Chapters - Clean List */}
                    <div className="space-y-2">
                        {unit.chapters.map((chapter, chapterIndex) => {
                            const isExpanded = expandedChapters.has(chapter.id);
                            const hasLessons = chapter.lessons && chapter.lessons.length > 0;

                            return (
                                <div key={chapter.id} className="space-y-1">
                                    {/* Chapter Button */}
                                    <button
                                        onClick={() => toggleChapter(chapter.id, chapter, unit.title)}
                                        className="w-full flex items-center gap-4 px-5 py-4 bg-slate-800 hover:bg-slate-750 rounded border-l-4 border-transparent hover:border-blue-500 transition-all duration-150 group text-left"
                                    >
                                        {/* Chapter Number */}
                                        <span className="text-slate-500 font-medium text-sm min-w-8">
                                            {unitIndex + 1}.{chapterIndex + 1}
                                        </span>

                                        {/* Chapter Title */}
                                        <p className="text-base text-slate-300 group-hover:text-white transition-colors flex-1">
                                            {chapter.title}
                                        </p>

                                        {/* Chevron Icon (only if has lessons) */}
                                        {hasLessons && (
                                            <div className="text-slate-500 group-hover:text-slate-400 transition-colors">
                                                {isExpanded ? (
                                                    <ChevronDown className="w-5 h-5" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5" />
                                                )}
                                            </div>
                                        )}
                                    </button>

                                    {/* Lessons (shown when expanded) */}
                                    {hasLessons && isExpanded && (
                                        <div className="ml-12 space-y-1 mt-1">
                                            {chapter.lessons!.map((lesson) => {
                                                const isSelected = selectedLesson === lesson.id;
                                                const isLocked = isLessonLocked(lesson.id);
                                                const isCompleted = completedLessons.includes(lesson.id);

                                                return (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => handleLessonClick(lesson.id, lesson.title, chapter.title, lesson.duration)}
                                                        disabled={isLocked}
                                                        className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-all duration-150 text-left ${isSelected ? 'bg-blue-500/20 text-blue-300'
                                                                : isLocked ? 'text-slate-600 cursor-not-allowed opacity-50'
                                                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                                                            }`}
                                                    >
                                                        {/* Status Icon */}
                                                        <div className={`transition-colors ${isCompleted ? 'text-green-500'
                                                                : isLocked ? 'text-slate-700'
                                                                    : 'text-slate-600'
                                                            }`}>
                                                            {isCompleted ? (
                                                                <CheckCircle className="w-4 h-4" />
                                                            ) : isLocked ? (
                                                                <Lock className="w-4 h-4" />
                                                            ) : (
                                                                <Circle className="w-4 h-4" />
                                                            )}
                                                        </div>

                                                        {/* Lesson Title */}
                                                        <span className="text-sm flex-1">{lesson.title}</span>

                                                        {/* Duration */}
                                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{lesson.duration}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Divider between units */}
                    {unitIndex < roadmap.units.length - 1 && (
                        <div className="h-px bg-slate-700 mt-8" />
                    )}
                </div>
            ))}
        </div>
    );
}
