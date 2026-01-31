from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.progress_service import progress_service

router = APIRouter()

class CompleteLessonRequest(BaseModel):
    lesson_id: str
    user_id: str # Temporary until Auth middleware is strict

@router.post("/complete")
async def complete_lesson(request: CompleteLessonRequest):
    try:
        result = progress_service.mark_lesson_complete(request.user_id, request.lesson_id)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_progress(user_id: str):
    return progress_service.get_user_progress(user_id)

@router.get("/skills")
async def get_skills(user_id: str):
    return progress_service.get_user_skills(user_id)
