'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { courseService } from '@/services/courseService';
import CosmicBackground from '@/components/home/CosmicBackground';
import CourseCard from '@/components/home/CourseCard';

export default function MyCoursesPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            if (user) {
                try {
                    const { supabase } = await import('@/lib/supabaseClient');
                    const { data: { session } } = await supabase.auth.getSession();
                    const token = session?.access_token;

                    if (token) {
                        const serverCourses = await courseService.getUserCourses(token);
                        // Map to UI format
                        const mapped = serverCourses.map((c: any) => ({
                            id: c.id,
                            title: c.title,
                            type: 'Course', // Default
                            duration: 'Self-paced',
                            channels: c.modules_count || 5, // Approximate or fetch
                            coverGradient: 'from-blue-500 to-indigo-600' // Default
                        }));
                        setCourses(mapped);
                    }
                } catch (e) {
                    console.error(e);
                }
            } else {
                setCourses([]);
            }
            setIsLoading(false);
        };
        fetchCourses();
    }, [user]);

    if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

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
