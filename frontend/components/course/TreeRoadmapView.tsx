'use client';

import { Roadmap, Chapter } from '@/lib/mock-data/roadmaps';
import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Lock, Unlock, Clock } from 'lucide-react';

interface TreeRoadmapViewProps {
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

export default function TreeRoadmapView({
    courseTitle,
    roadmap,
    onChapterClick,
    onLessonSelect,
    completedLessons = [],
    isLessonLocked = () => false
}: TreeRoadmapViewProps) {
    const [zoom, setZoom] = useState(1);
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Zoom limits
    const minZoom = 0.5;
    const maxZoom = 2;
    const zoomStep = 0.1;

    // Handle zoom in
    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + zoomStep, maxZoom));
    };

    // Handle zoom out
    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - zoomStep, minZoom));
    };

    // Handle mouse wheel zoom
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
                setZoom(prev => Math.max(minZoom, Math.min(maxZoom, prev + delta)));
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    const toggleChapter = (chapterId: string, chapter: Chapter, unitTitle: string) => {
        if (chapter.lessons && chapter.lessons.length > 0) {
            const newExpanded = new Set(expandedChapters);
            if (newExpanded.has(chapterId)) {
                newExpanded.delete(chapterId);
            } else {
                newExpanded.add(chapterId);
            }
            setExpandedChapters(newExpanded);
        } else {
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

    // Calculate layout dimensions
    const unitWidth = 200;
    const unitHeight = 60;
    const chapterWidth = 200;
    const chapterHeight = 45;
    const lessonWidth = 180;
    const lessonHeight = 35;
    const horizontalGap = 100;
    const verticalGap = 80;
    const chapterVerticalGap = 15;
    const lessonVerticalGap = 10;

    // Calculate total width needed
    const totalWidth = roadmap.units.length * (unitWidth + horizontalGap) - horizontalGap + 200;

    // Calculate max height needed (considering expanded lessons)
    let maxHeight = 0;
    roadmap.units.forEach(unit => {
        let unitHeight = 0;
        unit.chapters.forEach(chapter => {
            unitHeight += chapterHeight + chapterVerticalGap;
            if (expandedChapters.has(chapter.id) && chapter.lessons) {
                unitHeight += chapter.lessons.length * (lessonHeight + lessonVerticalGap);
            }
        });
        maxHeight = Math.max(maxHeight, unitHeight);
    });
    const totalHeight = 200 + verticalGap + unitHeight + verticalGap + maxHeight + 100;

    return (
        <div className="relative w-full h-full">
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    disabled={zoom >= maxZoom}
                    className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-slate-600 transition-colors"
                    title="Zoom In (Ctrl + Scroll)"
                >
                    <ZoomIn className="w-5 h-5 text-white" />
                </button>
                <button
                    onClick={handleZoomOut}
                    disabled={zoom <= minZoom}
                    className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-slate-600 transition-colors"
                    title="Zoom Out (Ctrl + Scroll)"
                >
                    <ZoomOut className="w-5 h-5 text-white" />
                </button>
                <div className="px-2 py-1 bg-slate-800 rounded border border-slate-600 text-xs text-white text-center">
                    {Math.round(zoom * 100)}%
                </div>
            </div>

            {/* Scrollable Container */}
            <div ref={containerRef} className="w-full overflow-auto p-6">
                <svg
                    width={totalWidth}
                    height={totalHeight}
                    className="mx-auto"
                    style={{
                        minWidth: '100%',
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top center',
                        transition: 'transform 0.2s ease-out'
                    }}
                >
                    {/* Root Node */}
                    <g>
                        <rect
                            x={totalWidth / 2 - 150}
                            y={20}
                            width={300}
                            height={80}
                            rx={8}
                            className="fill-blue-600 stroke-blue-500"
                            strokeWidth={2}
                        />
                        <text
                            x={totalWidth / 2}
                            y={65}
                            textAnchor="middle"
                            className="fill-white text-lg font-bold"
                        >
                            {courseTitle}
                        </text>
                    </g>

                    {/* Units and Chapters */}
                    {roadmap.units.map((unit, unitIndex) => {
                        const unitX = 100 + unitIndex * (unitWidth + horizontalGap);
                        const unitY = 200;
                        const rootCenterX = totalWidth / 2;
                        const rootCenterY = 100;

                        // Calculate current Y position for chapters (accounting for expanded lessons)
                        let currentChapterY = unitY + unitHeight + verticalGap;

                        return (
                            <g key={unit.id}>
                                {/* Line from root to unit */}
                                <path
                                    d={`M ${rootCenterX} ${rootCenterY} Q ${rootCenterX} ${(rootCenterY + unitY) / 2}, ${unitX + unitWidth / 2} ${unitY}`}
                                    className="stroke-slate-600"
                                    strokeWidth={2}
                                    fill="none"
                                />

                                {/* Unit Node */}
                                <rect
                                    x={unitX}
                                    y={unitY}
                                    width={unitWidth}
                                    height={unitHeight}
                                    rx={6}
                                    className="fill-slate-700 stroke-slate-600"
                                    strokeWidth={2}
                                />
                                <text
                                    x={unitX + unitWidth / 2}
                                    y={unitY + unitHeight / 2 + 5}
                                    textAnchor="middle"
                                    className="fill-white text-sm font-semibold"
                                >
                                    {unit.title}
                                </text>

                                {/* Chapters */}
                                {unit.chapters.map((chapter, chapterIndex) => {
                                    const chapterX = unitX + (unitWidth - chapterWidth) / 2;
                                    const chapterY = currentChapterY;
                                    const unitCenterX = unitX + unitWidth / 2;
                                    const chapterCenterX = chapterX + chapterWidth / 2;
                                    const chapterCenterY = chapterY + chapterHeight / 2;
                                    const isExpanded = expandedChapters.has(chapter.id);
                                    const hasLessons = chapter.lessons && chapter.lessons.length > 0;

                                    // Render chapter
                                    const chapterNode = (
                                        <g key={chapter.id}>
                                            {/* Line from unit to chapter */}
                                            <line
                                                x1={unitCenterX}
                                                y1={unitY + unitHeight}
                                                x2={chapterCenterX}
                                                y2={chapterY}
                                                className="stroke-slate-600"
                                                strokeWidth={1.5}
                                            />

                                            {/* Chapter Node */}
                                            <rect
                                                x={chapterX}
                                                y={chapterY}
                                                width={chapterWidth}
                                                height={chapterHeight}
                                                rx={4}
                                                className="fill-slate-800 stroke-slate-600 hover:fill-slate-750 hover:stroke-blue-500 transition-all cursor-pointer"
                                                strokeWidth={1.5}
                                                onClick={() => toggleChapter(chapter.id, chapter, unit.title)}
                                            />
                                            <text
                                                x={chapterX + chapterWidth / 2}
                                                y={chapterY + chapterHeight / 2 + 4}
                                                textAnchor="middle"
                                                className="fill-slate-300 text-xs pointer-events-none"
                                            >
                                                {chapter.title.length > 30 ? chapter.title.substring(0, 30) + '...' : chapter.title}
                                            </text>

                                            {/* Expand indicator */}
                                            {hasLessons && (
                                                <text
                                                    x={chapterX + chapterWidth - 10}
                                                    y={chapterY + chapterHeight / 2 + 4}
                                                    textAnchor="middle"
                                                    className="fill-slate-400 text-xs pointer-events-none"
                                                >
                                                    {isExpanded ? '▼' : '▶'}
                                                </text>
                                            )}
                                        </g>
                                    );

                                    // Update Y position for next chapter
                                    currentChapterY += chapterHeight + chapterVerticalGap;

                                    // Render lessons if expanded
                                    let lessonNodes = null;
                                    if (isExpanded && chapter.lessons) {
                                        lessonNodes = chapter.lessons.map((lesson, lessonIndex) => {
                                            const lessonX = chapterX + (chapterWidth - lessonWidth) / 2;
                                            const lessonY = currentChapterY;
                                            const lessonCenterX = lessonX + lessonWidth / 2;

                                            const isSelected = selectedLesson === lesson.id;
                                            const isLocked = isLessonLocked(lesson.id);
                                            const isCompleted = completedLessons.includes(lesson.id);

                                            const node = (
                                                <g key={lesson.id}>
                                                    {/* Line from chapter to lesson */}
                                                    <line
                                                        x1={chapterCenterX}
                                                        y1={chapterY + chapterHeight}
                                                        x2={lessonCenterX}
                                                        y2={lessonY}
                                                        className="stroke-slate-700"
                                                        strokeWidth={1}
                                                    />

                                                    {/* Lesson Node */}
                                                    <rect
                                                        x={lessonX}
                                                        y={lessonY}
                                                        width={lessonWidth}
                                                        height={lessonHeight}
                                                        rx={3}
                                                        className={`transition-all ${isLocked
                                                                ? 'fill-slate-900 stroke-slate-800 cursor-not-allowed opacity-60'
                                                                : isSelected
                                                                    ? 'fill-blue-500/20 stroke-blue-400 cursor-pointer'
                                                                    : 'fill-slate-850 stroke-slate-700 hover:fill-slate-800 hover:stroke-slate-600 cursor-pointer'
                                                            }`}
                                                        strokeWidth={1}
                                                        onClick={() => handleLessonClick(lesson.id, lesson.title, chapter.title, lesson.duration)}
                                                    />

                                                    {/* Lesson Title */}
                                                    <text
                                                        x={lessonX + 8}
                                                        y={lessonY + lessonHeight / 2 - 2}
                                                        className={`text-xs pointer-events-none ${isLocked ? 'fill-slate-600' : isSelected ? 'fill-blue-300' : 'fill-slate-400'
                                                            }`}
                                                    >
                                                        {lesson.title.length > 22 ? lesson.title.substring(0, 22) + '...' : lesson.title}
                                                    </text>

                                                    {/* Duration and Status Icon */}
                                                    <text
                                                        x={lessonX + 8}
                                                        y={lessonY + lessonHeight / 2 + 10}
                                                        className="fill-slate-500 text-xs pointer-events-none"
                                                    >
                                                        ⏱ {lesson.duration}
                                                    </text>
                                                    <text
                                                        x={lessonX + lessonWidth - 15}
                                                        y={lessonY + lessonHeight / 2 + 4}
                                                        className={`text-xs pointer-events-none ${isCompleted ? 'fill-green-500' : 'fill-slate-500'
                                                            }`}
                                                    >
                                                        {isCompleted ? '✓' : isLocked ? '🔒' : '○'}
                                                    </text>
                                                </g>
                                            );

                                            currentChapterY += lessonHeight + lessonVerticalGap;
                                            return node;
                                        });
                                    }

                                    return (
                                        <g key={`chapter-group-${chapter.id}`}>
                                            {chapterNode}
                                            {lessonNodes}
                                        </g>
                                    );
                                })}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
