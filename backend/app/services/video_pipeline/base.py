from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class VideoCandidate(BaseModel):
    video_id: str
    title: str
    channel_title: str
    channel_id: str
    duration_seconds: int = 0
    view_count: int = 0
    like_count: int = 0
    published_at: str = ""
    has_captions: bool = False
    meta_score: float = 0.0
    
    # Flags
    is_shortlisted: bool = True
    rejection_reason: Optional[str] = None
    
    # Transcript status
    transcript_available: bool = False
    transcript_fetched: bool = False

class TranscriptChunk(BaseModel):
    chunk_id: str
    video_id: str
    start_time: float
    end_time: float
    text: str
    embedding_id: Optional[str] = None
    embedding: Optional[List[float]] = None # Optional, might not store in memory always

class LessonPlan(BaseModel):
    """Derived from roadmap"""
    lesson_title: str
    lesson_keywords: List[str]
    target_level: str
    description: str

class VideoPipelineException(Exception):
    pass

class TranscriptFetchError(VideoPipelineException):
    pass
