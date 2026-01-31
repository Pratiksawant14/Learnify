const API_URL = 'http://localhost:8000';

export interface GenerateRoadmapRequest {
    topic: string;
    level: string;
    language: string;
    time_commitment: string;
}

export const courseService = {
    async generateRoadmap(data: GenerateRoadmapRequest) {
        try {
            const response = await fetch(`${API_URL}/roadmap/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to generate roadmap');
            }

            const backendData = await response.json();
            return this.mapBackendToFrontend(backendData);
        } catch (error) {
            console.error('Error in generateRoadmap:', error);
            throw error;
        }
    },

    // Adapter to fit the existing frontend structure
    // Backend: modules -> lessons
    // Frontend: units -> chapters -> lessons
    mapBackendToFrontend(backendData: any) {
        // Create a single "Unit" containing all modules as "Chapters"
        const chapters = backendData.modules.map((module: any, mIndex: number) => ({
            id: `chapter-${mIndex}`,
            title: module.title,
            description: module.description || '',
            lessons: module.lessons.map((lesson: any, lIndex: number) => ({
                id: `lesson-${mIndex}-${lIndex}`, // Generate stable IDs
                title: lesson.title,
                description: lesson.description,
                duration: lesson.duration || '10 min',
                type: 'video', // Default
                videoUrl: lesson.video ? lesson.video.link : '',
                videoThumbnail: lesson.video ? lesson.video.thumbnail : '',
                status: 'locked' // Default
            }))
        }));

        return {
            ...backendData,
            units: [
                {
                    id: 'unit-1',
                    title: 'Core Curriculum',
                    chapters: chapters
                }
            ]
        };
    },

    async saveCourse(courseData: any) {
        // Will implement saving later when user confirms
        // For now, we rely on local storage or just passing data
        return courseData;
    }
};
