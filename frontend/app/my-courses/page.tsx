'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import CosmicBackground from '@/components/home/CosmicBackground';
import CourseCard from '@/components/home/CourseCard';
import { mockUserCourses } from '@/lib/mock-data/courses';

export default function MyCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        // Start with mock courses
        let allCourses = [...mockUserCourses];

        // Fetch user-created courses from localStorage
        if (typeof window !== 'undefined') {
            const storedCourses = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('course-')) {
                    try {
                        const courseStr = localStorage.getItem(key);
                        if (courseStr) {
                            const courseData = JSON.parse(courseStr);
                            storedCourses.push(courseData);
                        }
                    } catch (e) {
                        console.error('Failed to parse stored course:', e);
                    }
                }
            }
            // Add stored courses to the beginning
            const storedIds = new Set(storedCourses.map(c => c.id));
            const distinctMockCourses = mockUserCourses.filter(c => !storedIds.has(c.id));

            allCourses = [...storedCourses.reverse(), ...distinctMockCourses];
        }

        setCourses(allCourses);
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Cosmic Background */}
            <CosmicBackground />

            {/* Main Content */}
            <main className="relative z-10 pt-20 pb-16 px-8">
                {/* Branding / Header */}
                <div className="mb-12 flex items-center gap-3">
                    <div className="w-10 h-10 relative">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <path
                                d="M 20 50 C 20 35, 30 35, 40 50 C 50 65, 60 65, 60 50 C 60 35, 70 35, 80 50 C 90 65, 70 65, 60 50 C 50 35, 40 35, 40 50 C 40 65, 30 65, 20 50 Z"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                opacity="0.9"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-wide">LEARNIFY</h1>
                </div>

                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-semibold text-white mb-8">My Courses</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <Link href={`/course/${course.id}`} key={course.id} className="block group">
                                    <CourseCard
                                        title={course.title}
                                        type={course.type}
                                        duration={course.duration}
                                        channels={course.channels}
                                        coverGradient={course.coverGradient}
                                    />
                                </Link>
                            ))
                        ) : (
                            <p className="text-white/60 col-span-full text-lg">
                                You haven&apos;t started any courses yet. Go to <a href="/" className="text-blue-400 hover:underline">Home</a> to create one!
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
