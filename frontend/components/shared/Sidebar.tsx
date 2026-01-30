'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, User, Settings, Users, BookOpen } from 'lucide-react';

const navItems = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'My Courses', href: '/my-courses', icon: BookOpen },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-8 z-50">
            {/* Navigation Items */}
            <nav className="flex-1 flex flex-col gap-6 mt-8">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group relative flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                ? 'text-white bg-white/10'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs font-medium">{item.name}</span>

                            {/* Hover glow effect */}
                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`} />
                        </Link>
                    );
                })}
            </nav>

            {/* Settings at bottom */}
            <Link
                href="/settings"
                className="group relative flex flex-col items-center gap-2 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
                <Settings className="w-6 h-6" />
                <span className="text-xs font-medium">Settings</span>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
            </Link>
        </aside>
    );
}
