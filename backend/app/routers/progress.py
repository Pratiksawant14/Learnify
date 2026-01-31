from fastapi import APIRouter, HTTPException, Depends
from app.core.security import get_current_user
from pydantic import BaseModel
from app.services.progress_service import progress_service

router = APIRouter()

class CompleteLessonRequest(BaseModel):
    lesson_id: str
    user_id: str # Temporary until Auth middleware is strict

@router.post("/complete")
async def complete_lesson(request: CompleteLessonRequest, user_payload: dict = Depends(get_current_user)):
    user_id = user_payload.get("sub")
    try:
        result = progress_service.mark_lesson_complete(user_id, request.lesson_id)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_progress(user_payload: dict = Depends(get_current_user)):
    user_id = user_payload.get("sub")
    return progress_service.get_user_progress(user_id)

@router.get("/skills")
async def get_skills(user_payload: dict = Depends(get_current_user)):
    user_id = user_payload.get("sub")
    return progress_service.get_user_skills(user_id)
