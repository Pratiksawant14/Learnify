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

        api.getCourse(courseId)
            .then((data: any) => {
                // Backend returns { ...course_fields, roadmap_json: { modules: ... } }
                // Frontend components expect { ...course_fields, roadmap: { units: [ { chapters: [ { lessons: ... } ] } ] } }

                const rawRoadmap = data.roadmap_json || {};
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
                                    lessons: (m.lessons || []).map((l: any, lIdx: number) => ({
                                        id: l.id || `lesson-${l.title}-${idx}-${lIdx}`, // Ensure ID
                                        title: l.title,
                                        duration: l.duration || "10m",
                                        type: "video",
                                        videoId: l.video_id || l.videoId,
                                    }))
                                }))
                            }
                        ]
                    };
                }

                const adaptedCourse = {
                    ...data,
                    roadmap: adaptedRoadmap
                };
                setCourse(adaptedCourse);
            })
            .catch((err: any) => {
                console.error("Failed to fetch course", err);
                // Keep fallback in case of error? Or show error state?
                setCourse({
                    id: courseId,
                    title: 'Course Not Found',
                    roadmap: generateMockRoadmap('Error loading course')
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

    return (
        <CourseLayout
            courseTitle={course.title}
            roadmap={course.roadmap}
        />
    );
}
