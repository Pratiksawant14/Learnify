// Core Types for Learnify MVP

export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  level: number;
  interests: string[];
  communitiesJoined: string[];
  createdAt: string;
}

export interface Video {
  id: string;
  videoId: string; // YouTube video ID
  title: string;
  channelName: string;
  duration: number; // in seconds
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  videos: Video[];
  completed: boolean;
  order: number;
}

export interface Quiz {
  id: string;
  moduleId: string;
  questions: QuizQuestion[];
  passingScore: number;
  userScore?: number;
  completed: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  quiz: Quiz;
  order: number;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // e.g., "4 weeks", "20 hours"
  language: string;
  topic: string;
  modules: Module[];
  progress: number; // 0-100
  createdAt: string;
  isPublic: boolean; // for Explore page
  tags: string[];
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  completedModules: string[];
  completedQuizzes: string[];
  overallProgress: number; // 0-100
  lastAccessedAt: string;
  courseLevel: number; // user's level in this specific course
}

export interface CourseGenerationRequest {
  goal: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment?: string;
  language?: string;
}
