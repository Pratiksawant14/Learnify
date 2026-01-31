'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';

export default function ExplorePage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getCourses()
            .then(data => setCourses(data))
            .catch(err => console.error("Failed to load courses", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Explore Courses</h1>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-slate-900 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <p className="text-xl">No courses found yet.</p>
                        <Link href="/" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
                            Create your first course
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <Link key={course.id} href={`/course/${course.id}`}>
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            📚
                                        </div>
                                        <span className="text-xs text-slate-500 border border-slate-700 px-2 py-1 rounded-full">
                                            {course.roadmap_json?.level || "Beginner"}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                                        {course.description || "No description available."}
                                    </p>
                                    <div className="flex items-center text-xs text-slate-500 gap-4">
                                        <span>⏳ {course.roadmap_json?.estimated_time || "Self-paced"}</span>
                                        <span>📅 {new Date(course.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
