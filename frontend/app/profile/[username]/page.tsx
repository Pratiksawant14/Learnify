'use client';

import { use } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { MOCK_FRIENDS } from '@/lib/friends-system';
import ProfileHeader from '@/components/profile/ProfileHeader';
import InterestsSection from '@/components/profile/InterestsSection';
import ActivityHeatmap from '@/components/profile/ActivityHeatmap';
import RankingsSection from '@/components/profile/RankingsSection';
import SkillPerformanceView from '@/components/profile/SkillPerformanceView';
import CommunitySection from '@/components/community/CommunitySection';

// Reuse mock friend logic to verify "public" user
// In a real app, this would fetch from API by username
const getPublicUser = (username: string) => {
    // Check match in mock friends
    const friend = MOCK_FRIENDS.find(f => f.username.replace('@', '') === username);

    if (friend) {
        return {
            name: friend.name,
            username: friend.username,
            initials: friend.avatarInitials,
            bio: "Passionate learner on Learnify. Exploring new technologies and building cool stuff.",
            stats: friend
        };
    }

    // Fallback Mock if direct URL
    return {
        name: username.replace('_', ' ').replace(/\d+/g, '').toUpperCase(),
        username: `@${username}`,
        initials: username.substring(0, 2).toUpperCase(),
        bio: "This is a public profile view. Data is simulated for demonstration.",
        stats: null
    };
};

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);
    const user = getPublicUser(username);

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20">
            {/* Top Navigation Bar */}
            <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/profile" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to My Profile</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-bold tracking-widest text-slate-500 uppercase hidden md:block">
                            Public Profile
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white" title="Share Profile">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
                {/* 1. Identity */}
                <section className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <ProfileHeader user={user} isPublic={true} />
                </section>

                {/* 2. Public Sections */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-8 duration-700 delay-100">
                    <InterestsSection /> <ActivityHeatmap />
                </section>

                <section className="animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Global Standings</h2>
                        <div className="h-px flex-1 bg-slate-800 ml-6"></div>
                    </div>
                    <RankingsSection />
                </section>

                <section className="animate-in fade-in slide-in-from-top-8 duration-700 delay-300">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Skill Mastery</h2>
                        <div className="h-px flex-1 bg-slate-800 ml-6"></div>
                    </div>
                    {/* Note: In a real app we'd pass 'user.stats.skills' to this view */}
                    <SkillPerformanceView />
                </section>

                {/* Communities - Read Only View */}
                <CommunitySection />
            </main>
        </div>
    );
}
