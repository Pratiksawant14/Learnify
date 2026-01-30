'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // No left margin on course pages (sidebar is hidden)
    const isCourseRoute = pathname?.startsWith('/course/');

    return (
        <div className={isCourseRoute ? '' : 'ml-20'}>
            {children}
        </div>
    );
}
