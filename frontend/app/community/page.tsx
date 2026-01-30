'use client';

import CosmicBackground from '@/components/home/CosmicBackground';

export default function CommunityPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <CosmicBackground />

            <main className="relative z-10 pt-32 px-8 flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold text-white mb-4">Community</h1>
                <p className="text-xl text-white/70 max-w-2xl text-center">
                    Connect with fellow learners, share your progress, and join study groups.
                    Coming soon!
                </p>
            </main>
        </div>
    );
}
