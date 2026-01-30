'use client';

import { Award, Clock, BookOpen, BarChart, Zap } from 'lucide-react';
import { useSkillSystem } from '@/hooks/useSkillSystem';
import { calculateLevelProgress } from '@/lib/skill-system';

interface ProgressViewProps {
    courseTitle: string;
    progress: number;
    completedLessonsCount: number;
    totalLessonsCount: number;
    totalTimeSpent: number;
}

export default function ProgressView({
    courseTitle,
    progress,
    completedLessonsCount,
    totalLessonsCount,
    totalTimeSpent
}: ProgressViewProps) {
    const { skills, isLoaded } = useSkillSystem();

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-2">Your Progress</h2>
                <p className="text-slate-400">Keep up the momentum! You're doing great.</p>
            </div>

            {/* Main Progress Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                    <div
                        className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle
                                    className="text-slate-800"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="48"
                                    cy="48"
                                />
                                <circle
                                    className="text-blue-500 transition-all duration-1000 ease-out"
                                    strokeWidth="8"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 - (251.2 * progress) / 100}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="48"
                                    cy="48"
                                />
                            </svg>
                            <span className="absolute text-xl font-bold text-white">{progress}%</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{courseTitle}</h3>
                            <p className="text-slate-400 text-sm">Overall Completion</p>
                        </div>
                    </div>

                    <div className="text-center md:text-right">
                        <div className="inline-block px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20">
                            {progress === 100 ? 'Course Completed! 🎉' : 'In Progress'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Lessons</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {completedLessonsCount} <span className="text-slate-500 text-lg">/ {totalLessonsCount}</span>
                    </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
                            <Clock className="w-6 h-6" />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Time Spent</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {Math.floor(totalTimeSpent / 60)}h {totalTimeSpent % 60}m
                    </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                            <Award className="w-6 h-6" />
                        </div>
                        <span className="text-slate-400 text-sm font-medium">Achievements</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {progress >= 25 ? '1' : '0'} <span className="text-slate-500 text-lg">/ 4</span>
                    </p>
                </div>
            </div>

            {/* Skill Proficiency Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                        <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Skill Proficiency</h3>
                </div>

                {!isLoaded ? (
                    <div className="text-slate-500 italic">Loading skills...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {skills.map(skill => {
                            const levelProgress = calculateLevelProgress(skill.xp);
                            return (
                                <div key={skill.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">{skill.name}</h4>
                                            <p className="text-xs text-slate-400">{skill.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-400">Lv. {skill.level}</div>
                                            <div className="text-xs text-slate-500">{skill.xp} XP</div>
                                        </div>
                                    </div>

                                    {/* XP Progress Bar */}
                                    <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                                            style={{ width: `${levelProgress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1 text-[10px] text-slate-500 uppercase font-medium tracking-wider">
                                        <span>Current Level</span>
                                        <span>Next Level</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
