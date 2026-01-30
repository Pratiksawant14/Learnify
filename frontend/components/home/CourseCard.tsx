'use client';

import Image from 'next/image';

interface YouTubeChannel {
    id: string;
    name: string;
    thumbnail: string;
}

interface CourseCardProps {
    title: string;
    type: string;
    duration: string;
    channels: YouTubeChannel[];
    coverGradient: string;
}

export default function CourseCard({ title, type, duration, channels, coverGradient }: CourseCardProps) {
    const displayChannels = channels.slice(0, 3);
    const remainingCount = channels.length - 3;

    return (
        <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10">
            {/* Cover Image Area - Pure Transparent Glass */}
            <div className="h-20 relative overflow-hidden backdrop-blur-md bg-white/5 border-b border-white/10">
                {/* Glass effect layer */}
                <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent" />

                {/* Subtle pattern overlay */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
                {/* Course Title */}
                <h3 className="text-sm font-semibold text-white group-hover:text-white/90 transition-colors line-clamp-2">
                    {title}
                </h3>

                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                        <span className="font-medium text-white/80">Type:</span>
                        <span>{type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Duration:</span>
                        <span>{duration}</span>
                    </div>
                </div>

                {/* YouTube Channels */}
                <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] text-white/50 mb-1.5 font-medium">YouTube Channels:</p>
                    <div className="flex items-center">
                        {displayChannels.map((channel, index) => (
                            <div
                                key={channel.id}
                                className="relative -ml-1.5 first:ml-0 transition-transform duration-300 hover:scale-110 hover:z-10"
                                style={{
                                    opacity: 1 - (index * 0.15),
                                    zIndex: displayChannels.length - index,
                                }}
                            >
                                <div className="w-5 h-5 rounded-full bg-linear-to-br from-blue-500 to-purple-500 p-0.5">
                                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-white text-[8px] font-semibold">
                                        {channel.name.substring(0, 2).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {remainingCount > 0 && (
                            <div
                                className="relative -ml-1.5 w-5 h-5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 text-[8px] font-semibold"
                                style={{ zIndex: 0 }}
                            >
                                +{remainingCount}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
        </div>
    );
}
