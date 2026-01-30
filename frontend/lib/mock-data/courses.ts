import { Course } from '@/types';

// Mock YouTube channels
const mockChannels = [
    { id: '1', name: 'Corey Schafer', thumbnail: '' },
    { id: '2', name: 'Programming with Mosh', thumbnail: '' },
    { id: '3', name: 'Traversy Media', thumbnail: '' },
    { id: '4', name: 'freeCodeCamp', thumbnail: '' },
    { id: '5', name: 'The Net Ninja', thumbnail: '' },
];

// Extended mock courses with YouTube channels
export const mockUserCourses = [
    {
        id: '1',
        title: 'Python Course',
        type: 'Programming',
        duration: '12 hours',
        channels: [mockChannels[0], mockChannels[1], mockChannels[3], mockChannels[4]],
        coverGradient: 'from-blue-600 via-blue-500 to-cyan-500',
        progress: 45,
    },
    {
        id: '2',
        title: 'JavaScript Course',
        type: 'Programming',
        duration: '15 hours',
        channels: [mockChannels[2], mockChannels[3], mockChannels[4]],
        coverGradient: 'from-yellow-500 via-orange-500 to-red-500',
        progress: 60,
    },
    {
        id: '3',
        title: 'Web Design Fundamentals',
        type: 'Design',
        duration: '8 hours',
        channels: [mockChannels[2], mockChannels[4]],
        coverGradient: 'from-purple-600 via-pink-500 to-rose-500',
        progress: 20,
    },
    {
        id: '4',
        title: 'React Advanced Patterns',
        type: 'Programming',
        duration: '10 hours',
        channels: [mockChannels[1], mockChannels[2], mockChannels[3]],
        coverGradient: 'from-cyan-500 via-blue-500 to-indigo-600',
        progress: 35,
    },
];
