import axios from 'axios';

import { supabase } from '@/lib/supabaseClient';

// Get API URL from env or default to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
console.log("API Service Initialized with URL:", API_URL);

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor for auth
apiClient.interceptors.request.use(async (config) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api = {
    // Courses
    getCourses: async () => {
        const response = await apiClient.get('/courses/');
        return response.data;
    },

    getCourse: async (courseId: string) => {
        const response = await apiClient.get(`/courses/${courseId}`);
        return response.data;
    },

    createCourse: async (prompt: { topic: string, level?: string, time_commitment?: string, language?: string }) => {
        // MVP: This calls the generation endpoint
        const response = await apiClient.post('/roadmap/generate', prompt);
        return response.data;
    },

    // Transcripts
    getTranscript: async (videoId: string) => {
        const response = await apiClient.get(`/transcripts/${videoId}`);
        return response.data;
    },

    // AI Helpers (Summary, Q&A)
    getSummary: async (videoId: string, lessonTitle: string) => {
        const response = await apiClient.post('/ai/summary', { videoId, lessonTitle });
        return response.data;
    },

    askQuestion: async (videoId: string, lessonTitle: string, question: string) => {
        const response = await apiClient.post('/ai/ask', { videoId, lessonTitle, question });
        return response.data;
    },

    explainConcept: async (videoId: string, mode: string) => {
        const response = await apiClient.post('/ai/explain', { videoId, mode });
        return response.data;
    }
};

export default api;
