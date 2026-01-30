'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import CourseLayout from '@/components/course/CourseLayout';
import RoadmapContainer from '@/components/course/RoadmapContainer';
import { generateMockRoadmap } from '@/lib/mock-data/roadmaps';

export default function CoursePage() {
    const params = useParams();
    const courseId = params.id as string;
    const [course, setCourse] = useState<any>(null);
    const [roadmapView, setRoadmapView] = useState<'index' | 'tree'>('index');

    useEffect(() => {
        // Always regenerate roadmap to get latest data (including videos)
        // Load course data from localStorage on client-side only
        const stored = localStorage.getItem(`course-${courseId}`);
        if (stored) {
            const parsedCourse = JSON.parse(stored);
            // Regenerate roadmap with latest mock data
            setCourse({
                ...parsedCourse,
                roadmap: generateMockRoadmap(parsedCourse.title || 'JavaScript')
            });
        } else {
            // Fallback to default course
            setCourse({
                id: courseId,
                title: 'JavaScript',
                roadmap: generateMockRoadmap('JavaScript')
            });
        }
    }, [courseId]);

    // Show loading state while course data is being fetched
    if (!course) {
        return (
            <CourseLayout courseTitle="Loading...">
                <div className="flex items-center justify-center h-screen">
                    <p className="text-white/60">Loading course...</p>
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
