'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Plus, X } from 'lucide-react';
import UnderstandingPhase, { UnderstandingData } from './UnderstandingPhase';
import { generateMockRoadmap } from '@/lib/mock-data/roadmaps';

const categories = [
    'Coding',
    'Art',
    'Filmmaking',
    'Content Creation',
    'Maths',
];

export default function PromptSection({ onCourseCreated }: { onCourseCreated?: (course: any) => void }) {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showUnderstandingPhase, setShowUnderstandingPhase] = useState(false);
    const [submittedPrompt, setSubmittedPrompt] = useState('');

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            setSubmittedPrompt(prompt);
            setShowUnderstandingPhase(true);
        }
    };

    const handleCategoryClick = (category: string) => {
        // Toggle category - if same category clicked, deselect it
        if (selectedCategory === category) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(category);
        }
    };

    const handleRemoveCategory = () => {
        setSelectedCategory(null);
    };

    return (
        <div className="relative z-10 flex flex-col items-center gap-8 max-w-4xl mx-auto px-8">
            {/* Greeting */}
            <div className="text-center space-y-2">
                <h1 className="text-5xl font-serif text-white/90">
                    Hello, User!
                </h1>
                <p className="text-2xl text-white/70 font-light">
                    Learn anything, anywhere!
                </p>
            </div>

            {/* Prompt Input */}
            <form onSubmit={handleSubmit} className="w-full relative group">
                <div className="relative">
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="What would you like to learn today?"
                            rows={1}
                            className="w-full px-8 py-6 pb-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl text-white placeholder:text-white/40 text-lg focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 resize-none overflow-hidden"
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = Math.max(target.scrollHeight, 80) + 'px';
                            }}
                        />

                        {/* Plus icon at bottom left - always visible */}
                        <button
                            type="button"
                            className="absolute left-6 bottom-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white/70 transition-all duration-300"
                            onClick={() => {
                                // You can add functionality here if needed
                            }}
                        >
                            <Plus className="w-4 h-4" />
                        </button>

                        {/* Category Tag inside textarea - positioned next to + icon */}
                        {selectedCategory && (
                            <div className="absolute left-20 bottom-4 flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full">
                                <span className="text-blue-300 text-sm font-medium flex items-center gap-1.5">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    </svg>
                                    {selectedCategory}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleRemoveCategory}
                                    className="text-blue-300 hover:text-white transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Send button */}
                    <button
                        type="submit"
                        className="absolute right-4 top-6 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 hover:text-white transition-all duration-300 group-hover:scale-105"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>

                {/* Focus glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-2xl" />
            </form>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryClick(category)}
                        className={`group relative px-6 py-2.5 backdrop-blur-sm border rounded-full transition-all duration-300 text-sm font-medium ${selectedCategory === category
                            ? 'bg-blue-500/20 border-blue-400/40 text-blue-300'
                            : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20'
                            }`}
                    >
                        {category}

                        {/* Hover glow */}
                        <div className="absolute inset-0 rounded-full bg-linear-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-lg" />
                    </button>
                ))}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent mt-4" />

            {/* Understanding Phase Overlay */}
            {showUnderstandingPhase && (
                <div className="w-full max-w-5xl mt-8">
                    <UnderstandingPhase
                        userPrompt={submittedPrompt}
                        onComplete={async (data: UnderstandingData) => {
                            try {
                                // 1. Prepare Request Data
                                const requestData = {
                                    topic: submittedPrompt,
                                    level: data.depth || 'Beginner',
                                    language: data.language || 'English',
                                    time_commitment: data.duration || '4 weeks'
                                };

                                // 2. Call Backend API
                                // Import dynamically or expected to be available
                                const { courseService } = await import('@/services/courseService');
                                const generatedRoadmap = await courseService.generateRoadmap(requestData);

                                // 3. Construct Course Object
                                const courseId = `course-${Date.now()}`;
                                const newCourse = {
                                    id: courseId,
                                    title: generatedRoadmap.title || submittedPrompt,
                                    description: generatedRoadmap.description,
                                    type: 'Deep Course',
                                    duration: generatedRoadmap.estimated_time || data.duration,
                                    channels: [],
                                    coverGradient: 'from-blue-500 to-purple-500',
                                    roadmap: generatedRoadmap,
                                    understandingData: data,
                                };

                                // 4. Store locally and Navigate
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem(`course-${courseId}`, JSON.stringify(newCourse));
                                }

                                if (onCourseCreated) {
                                    onCourseCreated(newCourse);
                                }

                                router.push(`/course/${courseId}`);

                            } catch (error) {
                                console.error("Failed to generate course:", error);
                                alert("Failed to generate course. Please ensure the backend is running.");
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}
