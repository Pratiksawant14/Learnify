'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import CourseLayout from '@/components/course/CourseLayout';
import RoadmapContainer from '@/components/course/RoadmapContainer';
import { generateMockRoadmap } from '@/lib/mock-data/roadmaps';
import { api } from '@/services/api';

export default function CoursePage() {
    const params = useParams();
    const courseId = params.id as string;
    const [course, setCourse] = useState<any>(null);
    const [roadmapView, setRoadmapView] = useState<'index' | 'tree'>('index');

    useEffect(() => {
        if (!courseId) return;

        // Helper to adapt data (fix video IDs and duration)
        const adaptCourseData = (data: any) => {
            const rawRoadmap = data.roadmap_json || data.roadmap || {};
            let adaptedRoadmap = rawRoadmap;

            // Check if we need to adapt 'modules' -> 'units'
            if (rawRoadmap.modules && !rawRoadmap.units) {
                adaptedRoadmap = {
                    ...rawRoadmap,
                    units: [
                        {
                            id: 'unit-1',
                            title: 'Course Content',
                            chapters: rawRoadmap.modules.map((m: any, idx: number) => ({
                                id: `chapter-${idx}`,
                                title: m.title || `Module ${idx + 1}`,
                                description: m.description,
                                lessons: (m.lessons || []).map((l: any, lIdx: number) => {
                                    // FORMAT DURATION
                                    let dur = "10 min";
                                    if (l.duration) {
                                        if (typeof l.duration === 'number') {
                                            dur = `${Math.ceil(l.duration / 60)} min`;
                                        } else {
                                            dur = l.duration;
                                        }
                                    }

                                    return {
                                        id: l.id || `lesson-${idx}-${lIdx}`,
                                        title: l.title,
                                        duration: dur,
                                        type: "video",
                                        // ESSENTIAL: Map video_id (DB) to videoId (Frontend)
                                        videoId: l.video_id || l.videoId,
                                        video_id: l.video_id, // Keep snake_case too
                                        description: l.description,
                                        channel: l.channel
                                    };
                                })
                            }))
                        }
                    ]
                };
            }
            return { ...data, roadmap: adaptedRoadmap };
        };

        // 1. Try Local Storage first (Restored)
        const localKey = `course-${courseId}`;
        const localCourseJson = localStorage.getItem(localKey);

        console.log(`DEBUG: CourseID: ${courseId}`);
        console.log(`DEBUG: Looking for LocalKey: ${localKey}`);
        console.log(`DEBUG: Found Local Data? ${!!localCourseJson}`);

        if (!localCourseJson) {
            console.log("DEBUG: All Local Keys:", Object.keys(localStorage));
        }

        if (localCourseJson) {
            try {
                const localCourse = JSON.parse(localCourseJson);
                console.log("Loaded course from LocalStorage:", localCourse);
                setCourse(adaptCourseData(localCourse));
            } catch (e) {
                console.error("Failed to parse local course", e);
            }
        }

        // 2. Fetch from API (Always try to refresh/fetch real data)
        api.getCourse(courseId)
            .then((data: any) => {
                console.log("Loaded course from API (Fresh):", data);
                setCourse(adaptCourseData(data));
            })
            .catch((err: any) => {
                console.error("Failed to fetch course:", err);

                // If we already have local data, don't show error!
                // This is crucial for temporary courses that don't exist in DB yet (404s).
                if (localCourseJson) {
                    console.log("Ignoring API error because LocalStorage data is present.");
                    return;
                }

                // FINAL SAFETY CHECK: Try reading local storage ONE MORE TIME
                // In case of race conditions or state updates
                const retryLocal = localStorage.getItem(localKey);
                if (retryLocal) {
                    console.log("Recovering from API error using LocalStorage");
                    try {
                        setCourse(adaptCourseData(JSON.parse(retryLocal)));
                        return; // Successfully recovered
                    } catch (e) { }
                }

                setCourse({
                    id: courseId,
                    title: `Error: ${err.message || "Failed to load"}`,
                    error: true,
                    roadmap: null
                });
            });
    }, [courseId]);

    // Show loading state while course data is being fetched
    if (!course) {
        return (
            <CourseLayout courseTitle="Loading...">
                <div className="flex items-center justify-center h-screen">
                    <p className="text-white/60 animate-pulse">Loading your course...</p>
                </div>
            </CourseLayout>
        );
    }

    // Error State
    if (course && course.error) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Course Load Failed</h1>
                <p className="text-xl mb-6">{course.title}</p>
                <div className="bg-slate-800 p-4 rounded text-mono text-sm">
                    Check backend console for 404/500 errors.
                </div>
                <div className="flex gap-4 mt-6">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-500 font-medium transition-colors"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-2 bg-slate-700 rounded hover:bg-slate-600 font-medium transition-colors border border-slate-600"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <CourseLayout
            courseTitle={course.title}
            roadmap={course.roadmap}
        />
    );
}
