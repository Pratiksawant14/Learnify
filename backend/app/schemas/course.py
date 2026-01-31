from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class LessonBase(BaseModel):
    title: str
    description: Optional[str] = None
    duration: Optional[str] = None
    video_query: Optional[str] = None

class ModuleBase(BaseModel):
    title: str
    lessons: List[LessonBase]

class RoadmapBase(BaseModel):
    title: str
    description: str
    modules: List[ModuleBase]
    estimated_time: str
    level: str

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    roadmap: RoadmapBase

class CourseResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    owner_id: Optional[UUID]
    created_at: datetime
    roadmap_json: Optional[dict]

    class Config:
        from_attributes = True

class GenerateRoadmapRequest(BaseModel):
    topic: str
    level: str = "Beginner"
    language: str = "English"
    time_commitment: str = "4 weeks" # Default value to prevent 422 if missing
