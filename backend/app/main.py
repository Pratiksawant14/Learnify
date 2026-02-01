from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import courses, roadmap, progress
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.PROJECT_NAME)

@app.on_event("startup")
async def startup_event():
    """Log startup information"""
    logger.info("=" * 50)
    logger.info("Learnify Backend Starting Up")
    logger.info(f"CORS Origins: {settings.CORS_ORIGINS}")
    logger.info(f"Supabase URL configured: {bool(settings.SUPABASE_URL)}")
    logger.info(f"OpenAI API configured: {bool(settings.OPENAI_API_KEY)}")
    logger.info("=" * 50)

# CORS middleware - must be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # DEBUG: Allow ALL origins to fix Network Error
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Learnify Engine", 
        "cors_origins": settings.CORS_ORIGINS,
        "env_check": {
            "supabase_configured": bool(settings.SUPABASE_URL),
            "openai_configured": bool(settings.OPENAI_API_KEY)
        }
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "port": "Railway managed"}

app.include_router(roadmap.router, prefix="/roadmap", tags=["roadmap"])
app.include_router(courses.router, prefix="/courses", tags=["courses"])
app.include_router(progress.router, prefix="/progress", tags=["progress"])
from app.routers import video_pipeline
app.include_router(video_pipeline.router, prefix="/api/courses", tags=["video-pipeline"])

from app.routers import video_player
# Note: Frontend hits http://localhost:8000/transcripts directly, so no prefix for now or we match frontend expectation
# Frontend expects: /transcripts/{id}, /ai/summary, etc.
app.include_router(video_player.router, tags=["video-player"])
