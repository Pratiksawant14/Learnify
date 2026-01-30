'use client';

import { useState, useMemo } from 'react';
import Sidebar from './Sidebar';
import RoadmapContainer from './RoadmapContainer';
import ContentView from './ContentView';
import ProgressTracker from './ProgressTracker';
import VideoTimelineView from './VideoTimelineView';
import VideoPlayerView from './VideoPlayerView';
import ProgressView from './ProgressView';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import ConceptSearch from './ConceptSearch';
import { useSkillSystem } from '@/hooks/useSkillSystem';

interface CourseLayoutProps {
    children?: React.ReactNode;
    courseTitle?: string;
    roadmap?: any;
}

export default function CourseLayout({ children, courseTitle, roadmap }: CourseLayoutProps) {
    const [activeTab, setActiveTab] = useState('roadmap');
    const [viewMode, setViewMode] = useState<'default' | 'watch'>('default');

    // Progress Hook
    const {
        progress,
        markLessonComplete,
        updateLastAccessed,
        isLessonCompleted,
        isLessonLocked,
        getCourseProgress,
        allLessonIds
    } = useCourseProgress(courseTitle || 'default-course', roadmap);

    // Skill System Hook
    const { awardXP } = useSkillSystem();

    // Wrapper to award XP when completing a lesson
    const handleLessonComplete = (lessonId: string) => {
        // Only award if not already completed? 
        // useCourseProgress checks logic, but here we might double-award if we don't check.
        // For MVP, we'll let it slide or check isLessonCompleted mock check.

        if (!isLessonCompleted(lessonId)) {
            // Find lesson title for XP context
            let lessonTitle = "Unknown Lesson";
            // Simple search
            roadmap?.units?.forEach((unit: any) => {
                unit.chapters?.forEach((chapter: any) => {
                    const l = chapter.lessons?.find((x: any) => x.id === lessonId);
                    if (l) lessonTitle = l.title;
                });
            });

            awardXP(lessonId, lessonTitle);
        }

        markLessonComplete(lessonId);
    };

    // Calculate completed indices for ProgressTracker
    const completedIndices = useMemo(() => {
        return (progress.completedLessons || [])
            .map(id => allLessonIds.indexOf(id))
            .filter(index => index !== -1);
    }, [progress.completedLessons, allLessonIds]);

    // State for selected lesson content (Content Tab)
    const [selectedLessonContent, setSelectedLessonContent] = useState<{
        lessonId: string;
        lessonTitle: string;
        chapterTitle: string;
        duration: string;
    } | null>(null);

    // State for watching lesson (Video Player View)
    const [watchingLesson, setWatchingLesson] = useState<{
        lesson: any;
        chapterTitle: string;
    } | null>(null);

    // Helper to find lesson navigation (next/prev)
    const getAdjacentLesson = (currentLessonId: string, direction: 'next' | 'prev') => {
        if (!roadmap) return null;

        // Flatten all lessons into a single array with chapter data
        const allLessons: any[] = [];
        roadmap.units.forEach((unit: any) => {
            unit.chapters.forEach((chapter: any) => {
                if (chapter.lessons) {
                    chapter.lessons.forEach((lesson: any) => {
                        allLessons.push({ ...lesson, chapterTitle: chapter.title });
                    });
                }
            });
        });

        const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
        if (currentIndex === -1) return null;

        if (direction === 'next' && currentIndex < allLessons.length - 1) {
            return allLessons[currentIndex + 1];
        }
        if (direction === 'prev' && currentIndex > 0) {
            return allLessons[currentIndex - 1];
        }
        return null;
    };

    const handleLessonSelect = (lesson: {
        lessonId: string;
        lessonTitle: string;
        chapterTitle: string;
        duration: string;
    }) => {
        if (isLessonLocked(lesson.lessonId)) return;

        setSelectedLessonContent(lesson);
        updateLastAccessed(lesson.lessonId);
    };

    const handleWatchClick = (lesson: any, chapterTitle: string) => {
        if (isLessonLocked(lesson.id)) return;

        setWatchingLesson({ lesson, chapterTitle });
        setViewMode('watch');
        updateLastAccessed(lesson.id);
    };

    const handleWatchNavigate = (direction: 'next' | 'prev') => {
        if (!watchingLesson) return;

        if (direction === 'next') {
            handleLessonComplete(watchingLesson.lesson.id);
        }

        const adj = getAdjacentLesson(watchingLesson.lesson.id, direction);
        if (adj) {
            setWatchingLesson({
                lesson: adj,
                chapterTitle: adj.chapterTitle
            });
        }
    };

    // Helper to find lesson by ID (used by search)
    const findLessonById = (targetId: string) => {
        if (!roadmap) return null;
        for (const unit of (roadmap.units || [])) {
            for (const chapter of (unit.chapters || [])) {
                const lesson = chapter.lessons?.find((l: any) => l.id === targetId);
                if (lesson) {
                    return { lesson, chapterTitle: chapter.title };
                }
            }
        }
        return null;
    };

    // Main content area check logic
    // If watching, we show VideoPlayerView which takes full width
    // If default, we show sidebar + content
    const isWatchMode = viewMode === 'watch';

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-900">
            {/* Sidebar - Hidden in watch mode to reduce distraction */}
            <div className={`${isWatchMode ? 'hidden' : 'block'}`}>
                <Sidebar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    courseTitle={courseTitle}
                />
            </div>

            {/* Main Content */}
            <main className={`${isWatchMode ? 'w-full' : 'ml-60'} relative z-10 min-h-screen transition-all duration-300`}>

                {viewMode === 'watch' && watchingLesson ? (
                    <VideoPlayerView
                        lesson={watchingLesson.lesson}
                        chapterTitle={watchingLesson.chapterTitle}
                        onBack={() => setViewMode('default')}
                        onNext={() => handleWatchNavigate('next')}
                        onPrevious={() => handleWatchNavigate('prev')}
                        hasNext={!!getAdjacentLesson(watchingLesson.lesson.id, 'next')}
                        hasPrevious={!!getAdjacentLesson(watchingLesson.lesson.id, 'prev')}
                        isCompleted={isLessonCompleted(watchingLesson.lesson.id)}
                        onComplete={() => handleLessonComplete(watchingLesson.lesson.id)}
                    />
                ) : (
                    <>
                        {/* Course Context Header */}
                        <div className="px-8 pt-8 pb-4 border-b border-white/10 flex justify-between items-end gap-8">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-white mb-1">{courseTitle}</h1>
                                <p className="text-white/60 text-sm mb-4">Your personalized learning workspace</p>

                                {/* Concept Search Integration */}
                                <div className="max-w-md">
                                    <ConceptSearch
                                        roadmap={roadmap}
                                        onLessonSelect={(lessonId) => {
                                            const result = findLessonById(lessonId);
                                            if (result) {
                                                handleWatchClick(result.lesson, result.chapterTitle);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Header Stats */}
                            <div className="text-right pb-2">
                                <div className="text-sm text-slate-400 mb-1">Course Progress</div>
                                <div className="flex items-center gap-3">
                                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-500"
                                            style={{ width: `${getCourseProgress()}%` }}
                                        />
                                    </div>
                                    <span className="font-bold text-white">{getCourseProgress()}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="pt-4">
                            {activeTab === 'roadmap' && roadmap && (
                                <>
                                    <div className="px-8 mb-4">
                                        <button
                                            onClick={() => {
                                                // Resume logic: go to last accessed or first unlocked
                                                const lastId = progress.lastAccessedLesson;
                                                const targetId = lastId || (roadmap.units?.[0]?.chapters?.[0]?.lessons?.[0]?.id);

                                                if (targetId) {
                                                    const result = findLessonById(targetId);
                                                    if (result) {
                                                        handleWatchClick(result.lesson, result.chapterTitle);
                                                    }
                                                }
                                            }}
                                            className="w-full py-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-xl text-blue-300 font-medium transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="text-xl">▶</span>
                                            {progress.lastAccessedLesson ? 'Resume Learning' : 'Start Course'}
                                        </button>
                                    </div>
                                    <RoadmapContainer
                                        courseTitle={courseTitle || ''}
                                        roadmap={roadmap}
                                        onLessonSelect={handleLessonSelect}
                                        completedLessons={progress.completedLessons}
                                        isLessonLocked={isLessonLocked}
                                    />
                                </>
                            )}
                            {activeTab === 'content' && (
                                <ContentView selectedLesson={selectedLessonContent} />
                            )}
                            {activeTab === 'videos' && roadmap && (
                                <div className="min-h-screen">
                                    <div className="pt-6">
                                        <ProgressTracker
                                            totalItems={allLessonIds.length}
                                            completedIndices={completedIndices}
                                            skippedIndices={[]}
                                        />
                                    </div>
                                    <VideoTimelineView
                                        roadmap={roadmap}
                                        onNotesClick={(lessonId: string, lessonTitle: string, chapterTitle: string, duration: string) => {
                                            handleLessonSelect({ lessonId, lessonTitle, chapterTitle, duration });
                                            setActiveTab('content');
                                        }}
                                        onWatchClick={handleWatchClick}
                                        isLessonCompleted={isLessonCompleted}
                                        isLessonLocked={isLessonLocked}
                                    />
                                </div>
                            )}
                            {activeTab === 'progress' && (
                                <ProgressView
                                    courseTitle={courseTitle || ''}
                                    progress={getCourseProgress()}
                                    completedLessonsCount={progress.completedLessons.length}
                                    totalLessonsCount={allLessonIds.length}
                                    totalTimeSpent={progress.totalTimeSpent}
                                />
                            )}
                            {activeTab !== 'roadmap' && activeTab !== 'content' && activeTab !== 'videos' && activeTab !== 'progress' && children}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
