'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import CosmicBackground from '@/components/home/CosmicBackground';
import PromptSection from '@/components/home/PromptSection';

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cosmic Background */}
      <CosmicBackground />

      {/* Main Content */}
      <main className="relative z-10 pt-20 pb-16 px-8">
        {/* Top Branding */}
        <div className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M 20 50 C 20 35, 30 35, 40 50 C 50 65, 60 65, 60 50 C 60 35, 70 35, 80 50 C 90 65, 70 65, 60 50 C 50 35, 40 35, 40 50 C 40 65, 30 65, 20 50 Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  opacity="0.9"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wide">LEARNIFY</h1>
          </div>

          <Link href="/profile" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-colors backdrop-blur-sm group">
            <User className="w-4 h-4 text-slate-300 group-hover:text-white" />
            <span className="text-sm font-medium text-slate-300 group-hover:text-white">Profile</span>
          </Link>
        </div>

        {/* Prompt Section */}
        <div className="mb-20">
          <PromptSection />
        </div>
      </main>
    </div>
  );
}
