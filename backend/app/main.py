from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import courses, roadmap, progress

app = FastAPI(title=settings.PROJECT_NAME)

# CORS middleware - must be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Learnify Engine", "cors_origins": settings.CORS_ORIGINS}

@app.get("/health")
def health_check():
    return {"status": "ok", "port": "Railway managed"}

app.include_router(roadmap.router, prefix="/roadmap", tags=["roadmap"])
app.include_router(courses.router, prefix="/courses", tags=["courses"])
app.include_router(progress.router, prefix="/progress", tags=["progress"])
