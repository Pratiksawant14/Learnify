'use client';

import { Roadmap } from '@/lib/mock-data/roadmaps';
import VideoCard from './VideoCard';
import { FileText } from 'lucide-react';

interface VideoTimelineViewProps {
    roadmap: Roadmap;
    onNotesClick: (lessonId: string, lessonTitle: string, chapterTitle: string, duration: string) => void;
    onWatchClick: (lesson: any, chapterTitle: string) => void;
    isLessonCompleted?: (lessonId: string) => boolean;
    isLessonLocked?: (lessonId: string) => boolean;
}

export default function VideoTimelineView({
    roadmap,
    onNotesClick,
    onWatchClick,
    isLessonCompleted = () => false,
    isLessonLocked = () => false
}: VideoTimelineViewProps) {
    let videoCounter = 1;

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            {roadmap.units.map((unit, unitIndex) => (
                <div key={`unit-${unitIndex}`} className="mb-12">
                    {/* Unit Divider */}
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">
                            {unit.title}
                        </span>
                        <div className="h-px bg-slate-800 flex-1" />
                    </div>

                    <div className="space-y-12">
                        {unit.chapters.map((chapter) => {
                            // Skip chapters without lessons
                            if (!chapter.lessons || chapter.lessons.length === 0) return null;

                            return (
                                <div key={chapter.id} className="space-y-6">
                                    {/* Chapter Header */}
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-800/50">
                                        <h3 className="text-xl font-bold text-white">
                                            {chapter.title}
                                        </h3>
                                        <button
                                            onClick={() => {
                                                const firstLesson = chapter.lessons![0];
                                                onNotesClick(
                                                    firstLesson.id,
                                                    firstLesson.title,
                                                    chapter.title,
                                                    firstLesson.duration
                                                );
                                            }}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
                                        >
                                            <FileText className="w-4 h-4" />
                                            Notes
                                        </button>
                                    </div>

                                    {/* Video List */}
                                    <div className="space-y-4">
                                        {chapter.lessons.map((lesson, lessonIndex) => {
                                            const currentVideoNum = videoCounter++;

                                            // Mock data population
                                            const fallbackVideo = chapter.videos?.[lessonIndex % (chapter.videos?.length || 1)];
                                            const video = lesson.videos?.[0] || fallbackVideo;

                                            const duration = video?.duration || lesson.duration || '15:00';
                                            const views = video?.views || `${Math.floor(Math.random() * 2000) + 500}`;
                                            const rating = video?.rating || parseFloat((4.5 + Math.random() * 0.5).toFixed(1));

                                            const description = chapter.description || "Master the fundamentals with this in-depth walkthrough.";

                                            const isLocked = isLessonLocked(lesson.id);
                                            const isCompleted = isLessonCompleted(lesson.id);

                                            return (
                                                <VideoCard
                                                    key={lesson.id}
                                                    videoNumber={currentVideoNum}
                                                    title={lesson.title}
                                                    channel={video?.channel}
                                                    duration={duration}
                                                    views={views}
                                                    rating={rating}
                                                    description={description}
                                                    isLocked={isLocked}
                                                    isCompleted={isCompleted}
                                                    onWatch={() => {
                                                        if (isLocked) return;
                                                        onWatchClick({
                                                            ...lesson,
                                                            description: description,
                                                            channel: video?.channel
                                                        }, chapter.title);
                                                    }}
                                                    onNotes={() => {
                                                        if (isLocked) return;
                                                        onNotesClick(
                                                            lesson.id,
                                                            lesson.title,
                                                            chapter.title,
                                                            lesson.duration
                                                        );
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
