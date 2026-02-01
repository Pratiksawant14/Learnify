'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Link as LinkIcon, Info, CheckCircle, Circle } from 'lucide-react';
import { api } from '@/services/api';

const transcriptCache = new Map<string, any>();

interface VideoPlayerViewProps {
    lesson: {
        id: string;
        title: string;
        duration: string;
        videoId?: string; // Add if available in data, else mock logic
        description?: string;
        channel?: string;
    } | null;
    chapterTitle: string;
    onBack: () => void;
    onNext: () => void;
    onPrevious: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
    isCompleted: boolean;
    onComplete: () => void;
}

export default function VideoPlayerView({
    lesson,
    chapterTitle,
    onBack,
    onNext,
    onPrevious,
    hasPrevious,
    hasNext,
    isCompleted,
    onComplete
}: VideoPlayerViewProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'resources' | 'transcript'>('overview');
    const [transcriptData, setTranscriptData] = useState<{ transcript: string; source: string } | null>(null);
    const [loadingTranscript, setLoadingTranscript] = useState(false);

    const [summaryData, setSummaryData] = useState<{ summary: string[]; key_concepts: string[] } | null>(null);
    const [explanationData, setExplanationData] = useState<{ explanation: string; mode: string } | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingExplanation, setLoadingExplanation] = useState(false);

    // Mock YouTube ID if not provided (using a generic coding video ID for demo)

    // DEBUG: Log the full lesson object to troubleshoot "Video Unavailable"
    console.log("VideoPlayerView: Current Lesson Object:", lesson);
    console.log("VideoPlayerView: lesson.videoId =", lesson?.videoId);
    console.log("VideoPlayerView: lesson.video_id =", (lesson as any)?.video_id);
    console.log("VideoPlayerView: lesson.video =", (lesson as any)?.video);

    // Support both camelCase (frontend convention) and snake_case (DB convention)
    const rawId = lesson?.videoId || (lesson as any)?.video_id;

    // Fallback if both are missing - SHOULD NOT BE USED
    const safeVideoId = rawId || "PjFM63f538o";

    console.log("VideoPlayerView: RAW ID FOUND:", rawId);
    console.log("VideoPlayerView: Using video ID:", safeVideoId);

    if (!rawId) {
        console.error("⚠️ WARNING: No video ID found in lesson data! Using fallback. This means the course data is malformed.");
    }

    // Fetch Transcript
    useEffect(() => {
        if (!lesson || activeTab !== 'transcript') return;

        // Check cache first
        if (transcriptCache.has(safeVideoId)) {
            setTranscriptData(transcriptCache.get(safeVideoId));
            return;
        }

        // If not in cache, fetch
        setLoadingTranscript(true);
        // Clear previous data if it is from a different video
        setTranscriptData(prev => (prev as any)?.videoId === safeVideoId ? prev : null);

        api.getTranscript(safeVideoId)
            .then(data => {
                const dataWithId = { ...data, videoId: safeVideoId };
                transcriptCache.set(safeVideoId, dataWithId);
                // Only update state if the component is still mounted and watching this video
                setTranscriptData(dataWithId);
            })
            .catch(err => {
                console.error("Transcript fetch error:", err);
                const errorData = {
                    transcript: "Transcript unavailable for this video.",
                    source: "error",
                    videoId: safeVideoId
                };
                transcriptCache.set(safeVideoId, errorData);
                setTranscriptData(errorData);
            })
            .finally(() => {
                setLoadingTranscript(false);
            });
    }, [safeVideoId, activeTab, lesson]);

    // Fetch AI Summary when Overview is active
    useEffect(() => {
        if (!lesson || activeTab !== 'overview') return;

        // Simple in-memory check if we already have data for this video
        // (A more robust solutions would use a similar cache map as transcript)
        if (summaryData && (summaryData as any).videoId === safeVideoId) return;

        setLoadingSummary(true);
        setExplanationData(null); // Reset explanation on video change/refresh logic

        setLoadingSummary(true);
        setExplanationData(null); // Reset explanation on video change/refresh logic

        api.getSummary(safeVideoId, lesson.title)
            .then(data => {
                setSummaryData({ ...data, videoId: safeVideoId });
            })
            .catch(err => console.error("Summary fetch error", err))
            .finally(() => setLoadingSummary(false));

    }, [safeVideoId, activeTab, lesson]);

    const handleExplain = (mode: 'simple' | 'example' | 'deep') => {
        setLoadingExplanation(true);
        api.explainConcept(safeVideoId, mode)
            .then(data => {
                setExplanationData(data);
            })
            .catch(err => console.error("Explanation fetch error", err))
            .finally(() => setLoadingExplanation(false));
    };

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState<string | null>(null);
    const [loadingAnswer, setLoadingAnswer] = useState(false);

    const handleAsk = (q: string) => {
        if (!q.trim()) return;
        setLoadingAnswer(true);
        setAnswer(null);
        // If clicking a preset, update the input too
        setQuestion(q);

        api.askQuestion(safeVideoId, lesson?.title || "Lesson", q)
            .then(data => {
                setAnswer(data.answer);
            })
            .catch(err => console.error("Q&A error", err))
            .finally(() => setLoadingAnswer(false));
    };

    if (!lesson) return null;

    // Duplicates removed from here


    return (
        <div className="max-w-6xl mx-auto px-6 py-8 animate-in fade-in duration-300">
            {/* Same Navigation Header */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Course</span>
            </button>

            {/* Same Video Player Container */}
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800 mb-8 relative">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${safeVideoId}?autoplay=0`}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                ></iframe>
            </div>

            {/* Same Metadata & Controls */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 text-sm text-blue-400 font-medium mb-2">
                        <span>{chapterTitle}</span>
                        <span className="w-1 h-1 bg-blue-400 rounded-full" />
                        <span>Lesson {lesson.id.split('-').pop()}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
                    <div className="flex items-center gap-4 text-slate-400 text-sm">
                        <span>{lesson.channel || "Sheriyans Coding School"}</span>
                        <span>•</span>
                        <span>{lesson.duration}</span>
                    </div>
                </div>

                {/* Actions & Nav Controls */}
                <div className="flex flex-col items-end gap-4">
                    <button
                        onClick={onComplete}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${isCompleted
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        {isCompleted ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Completed
                            </>
                        ) : (
                            <>
                                <Circle className="w-4 h-4" />
                                Mark as Complete
                            </>
                        )}
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onPrevious}
                            disabled={!hasPrevious}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        <button
                            onClick={onNext}
                            disabled={!hasNext}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs System */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {/* Tab Headers - Same */}
                <div className="flex border-b border-slate-800 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'overview'
                            ? 'border-blue-500 text-blue-400 bg-slate-800/50'
                            : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30'
                            }`}
                    >
                        <Info className="w-4 h-4" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('transcript')}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'transcript'
                            ? 'border-blue-500 text-blue-400 bg-slate-800/50'
                            : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Transcript
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'notes'
                            ? 'border-blue-500 text-blue-400 bg-slate-800/50'
                            : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Notes
                    </button>
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'resources'
                            ? 'border-blue-500 text-blue-400 bg-slate-800/50'
                            : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/30'
                            }`}
                    >
                        <LinkIcon className="w-4 h-4" />
                        Resources
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6 min-h-[300px]">
                    {activeTab === 'overview' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                            <h3 className="text-lg font-semibold text-white mb-4">Lesson Summary</h3>

                            {loadingSummary ? (
                                <div className="space-y-3 mb-6 animate-pulse">
                                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                                    <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                                    <div className="h-4 bg-slate-800 rounded w-4/6"></div>
                                </div>
                            ) : summaryData ? (
                                <div className="mb-8">
                                    <ul className="space-y-2 mb-6">
                                        {summaryData.summary.map((point, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-slate-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                                <span className="leading-relaxed">{point}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">Key Concepts</h4>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {summaryData.key_concepts.map((concept, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm font-medium">
                                                {concept}
                                            </span>
                                        ))}
                                    </div>

                                    {/* AI Explanations */}
                                    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 mb-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <h4 className="text-white font-semibold flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                                AI Explanation
                                            </h4>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleExplain('simple')}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${explanationData?.mode === 'simple' ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}
                                                >
                                                    Explain Simply
                                                </button>
                                                <button
                                                    onClick={() => handleExplain('example')}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${explanationData?.mode === 'example' ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}
                                                >
                                                    Give Example
                                                </button>
                                                <button
                                                    onClick={() => handleExplain('deep')}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${explanationData?.mode === 'deep' ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}
                                                >
                                                    Deep Dive
                                                </button>
                                            </div>
                                        </div>

                                        {loadingExplanation ? (
                                            <div className="h-20 flex items-center justify-center text-slate-500 text-sm italic">
                                                Generating explanation...
                                            </div>
                                        ) : explanationData ? (
                                            <div className="text-slate-300 leading-relaxed text-sm animate-in fade-in">
                                                {explanationData.explanation}
                                            </div>
                                        ) : (
                                            <div className="text-slate-500 text-sm italic">
                                                Select a mode above to get a tailored explanation of this lesson's concepts.
                                            </div>
                                        )}
                                    </div>

                                    {/* Lesson Q&A */}
                                    <div className="border-t border-slate-800 pt-8">
                                        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Ask about this lesson</h4>
                                        <div className="flex flex-col gap-4">
                                            {/* Presets */}
                                            <div className="flex flex-wrap gap-2">
                                                {['Explain this simply', 'Why is this important?', 'Where will I use this?', 'Common mistakes'].map((preset) => (
                                                    <button
                                                        key={preset}
                                                        onClick={() => handleAsk(preset)}
                                                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300 transition-colors"
                                                    >
                                                        {preset}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Input Area */}
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={question}
                                                    onChange={(e) => setQuestion(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAsk(question)}
                                                    placeholder="Ask specific question about this lesson..."
                                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                />
                                                <button
                                                    onClick={() => handleAsk(question)}
                                                    disabled={loadingAnswer || !question.trim()}
                                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {loadingAnswer ? '...' : 'Ask'}
                                                </button>
                                            </div>

                                            {/* Answer Area */}
                                            {answer && (
                                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-2 animate-in fade-in slide-in-from-top-1">
                                                    <p className="text-blue-100 text-sm leading-relaxed">
                                                        <span className="font-bold mr-2">AI Answer:</span>
                                                        {answer}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-400 italic mb-6">Summary unavailable for this lesson.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'transcript' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-white">Video Transcript</h3>
                                {transcriptData && (
                                    <span className="text-xs text-slate-500 uppercase tracking-wider border border-slate-700 px-2 py-1 rounded">
                                        Source: {transcriptData.source === 'youtube_captions' ? 'YouTube' : 'Generated'}
                                    </span>
                                )}
                            </div>

                            {loadingTranscript ? (
                                <div className="space-y-3 animate-pulse">
                                    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                                    <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                                </div>
                            ) : transcriptData ? (
                                <div className="bg-slate-950/50 rounded-lg p-6 border border-slate-800/50 max-h-[500px] overflow-y-auto">
                                    <p className="text-slate-300 leading-7 font-mono text-sm whitespace-pre-wrap">
                                        {transcriptData.transcript}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    <p>Transcript unavailable.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="h-full flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                            <label className="text-sm text-slate-400 mb-2 block">
                                Your personal notes for this lesson (not saved in MVP)
                            </label>
                            <textarea
                                className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
                                placeholder="Start typing your notes here..."
                            ></textarea>
                            <div className="mt-4 flex justify-end">
                                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors">
                                    Download Notes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'resources' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
                            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded text-blue-400 group-hover:text-blue-300">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">Lesson Source Code</h4>
                                        <p className="text-sm text-slate-400">GitHub Repository</p>
                                    </div>
                                </div>
                                <ArrowLeft className="w-4 h-4 text-slate-500 rotate-180 group-hover:text-white transition-colors" />
                            </div>

                            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded text-green-400 group-hover:text-green-300">
                                        <LinkIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium group-hover:text-green-400 transition-colors">Official Documentation</h4>
                                        <p className="text-sm text-slate-400">External Reference</p>
                                    </div>
                                </div>
                                <ArrowLeft className="w-4 h-4 text-slate-500 rotate-180 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
