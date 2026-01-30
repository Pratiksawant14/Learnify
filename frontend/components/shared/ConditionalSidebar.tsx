'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';

export default function ConditionalSidebar() {
    const pathname = usePathname();

    // Hide sidebar on course pages
    const isCourseRoute = pathname?.startsWith('/course/');

    if (isCourseRoute) {
        return null;
    }

    return <Sidebar />;
}
