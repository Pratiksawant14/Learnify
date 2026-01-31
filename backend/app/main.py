from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import courses, roadmap, progress

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Learnify Engine"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(roadmap.router, prefix="/roadmap", tags=["roadmap"])
app.include_router(courses.router, prefix="/courses", tags=["courses"])
app.include_router(progress.router, prefix="/progress", tags=["progress"])
