'use client';

import { useRouter } from 'next/navigation';
import { LucideIcon, Map, BookOpen, Video, TrendingUp, FileText, ArrowLeft } from 'lucide-react';

interface Tab {
    id: string;
    label: string;
    icon: LucideIcon;
    enabled: boolean;
    hasDropdown?: boolean;
}

const tabs: Tab[] = [
    { id: 'roadmap', label: 'Roadmap', icon: Map, enabled: true },
    { id: 'content', label: 'Content', icon: BookOpen, enabled: true },
    { id: 'videos', label: 'Videos', icon: Video, enabled: true },
    { id: 'notes', label: 'Notes', icon: FileText, enabled: false },
    { id: 'progress', label: 'Progress', icon: TrendingUp, enabled: true },
];

interface SidebarProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    courseTitle?: string;
}

export default function Sidebar({
    activeTab,
    onTabChange,
    courseTitle = 'JavaScript'
}: SidebarProps) {
    const router = useRouter();

    return (
        <div className="w-60 h-screen fixed left-0 top-0 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 pt-6">
            {/* Back Button */}
            <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Back to Home</span>
            </button>

            {/* Course Title */}
            <div className="mb-6 pb-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">{courseTitle}</h2>
            </div>

            {/* Tabs */}
            <nav className="space-y-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => tab.enabled && onTabChange(tab.id)}
                            disabled={!tab.enabled}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-blue-500/20 text-blue-300 border-l-2 border-blue-400'
                                : tab.enabled
                                    ? 'text-white/60 hover:text-white/80 hover:bg-white/5'
                                    : 'text-white/30 cursor-not-allowed'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{tab.label}</span>
                            {!tab.enabled && (
                                <span className="ml-auto text-xs text-white/30">Coming Soon</span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
