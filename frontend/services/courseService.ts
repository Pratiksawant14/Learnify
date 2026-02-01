const API_URL = '/api/py'; // Standardize on Proxy, ignoring env for consistency with api.ts changes

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
                // CRITICAL: Backend returns video.video_id (snake_case)
                videoId: lesson.video?.video_id || lesson.video_id,
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

    async saveCourse(courseData: any, token: string) {
        try {
            // We need to send the ORIGINAL backend structure if possible, or mapping it back.
            // Since we stored the mapped structure in the frontend, pass it as is (the backend create_course expects 'roadmap_json' which is flexible).
            // Ideally, we passed 'roadmap_json' in the `roadmap` body. 

            // However, our backend create_course expects {title, description..., modules: []}
            // The frontend course object is complex. 
            // We should strip the frontend-specific wrappers if we want to be clean, 
            // OR just save the whole blob and let the backend extract what it needs.

            // Let's rely on the fact that `courseData.roadmap` likely contains the backend structure if we kept it,
            // OR we just send the `courseData` as the JSON.
            // But wait, the backend `CourseService.create_course` iterates `course_data.get("modules")`. 

            // Re-construct the backend expected format from Frontend data if needed.
            // Currently `courseData.roadmap` is the object returned by `mapBackendToFrontend`.
            // `mapBackendToFrontend` returns `{ ...backendData, units: [...] }`.
            // So `backendData.modules` is still there!

            const payload = {
                title: courseData.title,
                description: courseData.description,
                modules: courseData.roadmap.modules // Use the original modules for backend processing
            };

            const response = await fetch(`${API_URL}/courses/`, { // Added trailing slash back
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to save course');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in saveCourse:', error);
            throw error;
        }
    },

    async getUserCourses(token: string) {
        try {
            const response = await fetch(`${API_URL}/courses/`, { // Added trailing slash back
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    }
};
