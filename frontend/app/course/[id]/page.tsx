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
        // Load course data from localStorage
        const stored = localStorage.getItem(`course-${courseId}`);
        if (stored) {
            setCourse(JSON.parse(stored));
        } else {
            // Fallback (or redirect to error in future)
            setCourse({
                id: courseId,
                title: 'Course Not Found',
                roadmap: generateMockRoadmap('Error') // Keep fallback for now to prevent crash
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
