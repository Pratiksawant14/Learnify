'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { profileService, UserProfile } from '@/services/profileService';
import AuthModal from '@/components/auth/AuthModal';
import EditProfileModal from '@/components/profile/EditProfileModal';

import ProfileHeader from '@/components/profile/ProfileHeader';
import InterestsSection from '@/components/profile/InterestsSection';
import ActivityHeatmap from '@/components/profile/ActivityHeatmap';
import RankingsSection from '@/components/profile/RankingsSection';
import SkillPerformanceView from '@/components/profile/SkillPerformanceView';
import FriendsList from '@/components/profile/FriendsList';
import MiniLeaderboard from '@/components/profile/MiniLeaderboard';
import SocialSignals from '@/components/profile/SocialSignals';
import CommunitySection from '@/components/community/CommunitySection';

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Fetch Profile if User
    useEffect(() => {
        fetchProfile();
    }, [user]);

    const fetchProfile = () => {
        if (user) {
            profileService.getProfile(user.id).then(data => {
                if (data) setProfile(data);
                else {
                    // Try to initialize empty profile if missing?
                    // Or let Edit Modal handle "creation" via upsert
                }
            });
        } else {
            setProfile(null);
        }
    };

    // Transform DB profile to UI format
    const userData = profile ? {
        name: profile.full_name || 'Anonymous User',
        username: profile.username || 'user',
        initials: (profile.full_name || 'U').substring(0, 2).toUpperCase(),
        bio: profile.bio || 'New to Learnify'
    } : undefined; // Fallback to default in Component

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20">
            {/* Top Navigation Bar */}
            <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="text-sm font-bold tracking-widest text-slate-500 uppercase hidden md:block">
                            My Profile
                        </div>

                        {user ? (
                            <button
                                onClick={signOut}
                                className="text-xs px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <LogOut className="w-3 h-3" /> Sign Out
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsAuthOpen(true)}
                                className="text-xs px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                            >
                                Sign In / Join
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
                {/* 1. Header Card */}
                <section className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <ProfileHeader
                        user={userData}
                        onEdit={() => user ? setIsEditProfileOpen(true) : setIsAuthOpen(true)}
                    />
                </section>

                {/* 2 & 3. Interests & Heatmap Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-8 duration-700 delay-100">
                    <InterestsSection />
                    <ActivityHeatmap />
                </section>

                {/* 4. Rankings */}
                <section className="animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Global Standings</h2>
                        <div className="h-px flex-1 bg-slate-800 ml-6"></div>
                    </div>
                    <RankingsSection />
                </section>

                {/* 5. Communities (Phase 12) */}
                <CommunitySection />

                {/* 5 & 6. Skills & Graph */}
                <section className="animate-in fade-in slide-in-from-top-8 duration-700 delay-300">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Skill Mastery</h2>
                        <div className="h-px flex-1 bg-slate-800 ml-6"></div>
                    </div>
                    <SkillPerformanceView />
                </section>

                {/* 7. Social Section (Phase 11) */}
                <section className="animate-in fade-in slide-in-from-top-8 duration-700 delay-500">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Social Circle</h2>
                        <div className="h-px flex-1 bg-slate-800 ml-6"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Friends List (Main) */}
                        <div className="lg:col-span-2">
                            <FriendsList />
                        </div>

                        {/* Leaderboard & Signals (Sidebar) */}
                        <div className="lg:col-span-1 space-y-6">
                            <MiniLeaderboard />
                            <SocialSignals />
                        </div>
                    </div>
                </section>
            </main>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                currentProfile={profile}
                onProfileUpdated={fetchProfile}
            />
        </div>
    );
}
