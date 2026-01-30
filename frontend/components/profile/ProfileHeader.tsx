'use client';

import { Edit3, MapPin, Link as LinkIcon } from 'lucide-react';

interface ProfileHeaderProps {
    user?: {
        name: string;
        username: string;
        initials: string;
        bio: string;
    };
    isPublic?: boolean;
    onEdit?: () => void;
}

export default function ProfileHeader({ user, isPublic = false, onEdit }: ProfileHeaderProps) {
    const userData = user || {
        name: "Hrushikesh Jadhav",
        username: "@rushi__jadhav0",
        initials: "HJ",
        bio: "Full-stack developer & AI enthusiast. Building the future of education with Learnify. Obsessed with clean UI and scalable backend systems."
    };

    return (
        <div className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Profile Image */}
            <div className="relative group">
                <div className="w-32 h-32 rounded-full p-1 bg-linear-to-tr from-blue-500 to-purple-500 relative z-10">
                    <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden relative">
                        {/* Placeholder for user image - using a gradient/initials fallback if no image */}
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-4xl font-bold text-slate-500">
                            {userData.initials}
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left pt-2 z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">{userData.name}</h1>
                        <p className="text-blue-400 font-medium mb-3">{userData.username}</p>
                    </div>

                    {!isPublic ? (
                        <button
                            onClick={onEdit}
                            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-white font-medium transition-all flex items-center gap-2 mx-auto md:mx-0"
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </button>
                    ) : (
                        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                            Public Profile
                        </div>
                    )}
                </div>

                {/* Bio & Details */}
                <p className="text-slate-300 max-w-2xl text-sm leading-relaxed mb-4">
                    {userData.bio}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 uppercase tracking-wide font-medium">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        <span>Pune, India</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer transition-colors">
                        <LinkIcon className="w-3 h-3" />
                        <span>github.com/rushi</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
