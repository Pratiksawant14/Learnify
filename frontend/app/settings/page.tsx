'use client';

import CosmicBackground from '@/components/home/CosmicBackground';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <CosmicBackground />

            <main className="relative z-10 pt-32 px-8 flex flex-col items-center justify-center min-h-screen">
                <div className="max-w-2xl w-full">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </Link>

                    <h1 className="text-4xl font-bold text-white mb-4">Settings</h1>
                    <p className="text-xl text-white/70 max-w-2xl text-center">
                        Settings and preferences coming soon!
                    </p>

                    <div className="mt-8 p-6 bg-slate-900/40 border border-slate-800 rounded-xl">
                        <p className="text-slate-400 text-center">
                            This page is under construction. Check back later for user preferences,
                            notification settings, and more customization options.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
