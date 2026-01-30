'use client';

import { Play, FileText, Clock, Eye, Star, Lock, CheckCircle } from 'lucide-react';

interface VideoCardProps {
    videoNumber: number;
    title?: string;
    channel?: string;
    thumbnail?: string;
    duration: string;
    views?: string;
    rating?: number;
    description?: string;
    onWatch?: () => void;
    onNotes?: () => void;
    isLocked?: boolean;
    isCompleted?: boolean;
}

export default function VideoCard({
    videoNumber,
    title,
    channel = 'Sheriyans Coding School',
    thumbnail,
    duration,
    views = '1.2K',
    rating = 4.8,
    description = 'Learn the core concepts effectively with this comprehensive video guide.',
    onWatch,
    onNotes,
    isLocked = false,
    isCompleted = false
}: VideoCardProps) {
    return (
        <div className={`flex flex-col md:flex-row gap-6 border p-4 rounded-xl transition-all group relative ${isLocked
                ? 'bg-slate-900/50 border-slate-800/50 opacity-75'
                : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
            }`}>
            {/* Thumbnail Section - Left */}
            <div
                className={`relative shrink-0 w-full md:w-80 aspect-video rounded-lg overflow-hidden bg-slate-800 transition-all ${!isLocked && 'cursor-pointer group-hover:ring-2 ring-blue-500/50'
                    }`}
                onClick={!isLocked ? onWatch : undefined}
            >
                {/* Locked Overlay */}
                {isLocked && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-[1px]">
                        <Lock className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Locked</span>
                    </div>
                )}

                {/* Completed Badge */}
                {isCompleted && !isLocked && (
                    <div className="absolute top-2 left-2 z-20 bg-green-500/90 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm shadow-lg">
                        <CheckCircle className="w-3 h-3" />
                        COMPLETED
                    </div>
                )}

                {thumbnail ? (
                    <img src={thumbnail} alt={title || `Video ${videoNumber}`} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-slate-800 to-slate-900">
                        <Play className={`w-12 h-12 transition-all ${isLocked ? 'text-slate-700' : 'text-slate-600 fill-slate-600/20 group-hover:text-blue-500 group-hover:fill-blue-500/20'
                            }`} />
                        <span className="text-slate-500 text-sm mt-2 font-medium">Video {videoNumber}</span>
                    </div>
                )}
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-1.5 py-0.5 rounded">
                    {duration}
                </div>
            </div>

            {/* Content Section - Right */}
            <div className="flex-1 flex flex-col justify-start min-w-0 py-1">
                {/* Title & Channel */}
                <div className="mb-2">
                    <h3
                        className={`text-xl font-bold mb-1 line-clamp-2 leading-tight transition-colors ${isLocked ? 'text-slate-500' : 'text-white cursor-pointer group-hover:text-blue-400'
                            }`}
                        onClick={!isLocked ? onWatch : undefined}
                    >
                        {title || `Lesson ${videoNumber}`}
                    </h3>
                    <p className="text-slate-400 text-sm w-fit">
                        {channel}
                    </p>
                </div>

                {/* Metadata Row */}
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {views} views
                    </span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {duration}
                    </span>
                    {rating && (
                        <>
                            <span className="w-1 h-1 bg-slate-600 rounded-full" />
                            <span className="flex items-center gap-1 text-yellow-500/80">
                                <Star className="w-3.5 h-3.5 fill-current" /> {rating}
                            </span>
                        </>
                    )}
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {description}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-auto">
                    <button
                        onClick={onWatch}
                        disabled={isLocked}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isLocked
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                    >
                        {isLocked ? <Lock className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                        {isLocked ? 'Locked' : 'Watch'}
                    </button>
                    <button
                        onClick={onNotes}
                        disabled={isLocked}
                        className={`flex items-center gap-2 px-4 py-2 border text-sm font-medium rounded-lg transition-colors ${isLocked
                                ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Notes
                    </button>
                </div>
            </div>
        </div>
    );
}
