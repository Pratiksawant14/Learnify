from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from app.schemas.course import CourseCreate, CourseResponse
from app.services.course_service import course_service
from app.core.security import get_current_user
from typing import List

router = APIRouter()

# In a real app, use Depends(get_current_user) to get user_id
# For MVP, we might accept user_id in header or body if auth isn't fully wired on frontend yet
# But prompt says "decode Supabase JWT".

@router.post("/", response_model=CourseResponse)
async def create_course(course: dict, background_tasks: BackgroundTasks, user_payload: dict = Depends(get_current_user)):
    user_id = user_payload.get("sub") # Supabase 'sub' claim is the user ID
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user token: missing 'sub'")
        
    result = course_service.create_course(course, user_id)
    if not result:
        raise HTTPException(status_code=400, detail="Could not create course")
    
    # Trigger RAG processing in background
    if result.get("id"):
        background_tasks.add_task(course_service.process_course_content, result["id"])
        
    return result

@router.get("/", response_model=List[CourseResponse])
async def get_courses(user_id: str = "test-user-id"):
    return course_service.get_courses_by_user(user_id)

@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: str):
    result = course_service.get_course_by_id(course_id)
    if not result:
        raise HTTPException(status_code=404, detail="Course not found")
    return result
