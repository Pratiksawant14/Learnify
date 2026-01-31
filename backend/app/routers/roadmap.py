from fastapi import APIRouter, HTTPException
from app.schemas.course import GenerateRoadmapRequest
from app.services.roadmap_service import roadmap_service

router = APIRouter()

@router.post("/generate")
async def generate_roadmap_endpoint(request: GenerateRoadmapRequest):
    try:
        roadmap = roadmap_service.create_structured_roadmap(
            request.topic, 
            request.level,
            request.language
        )
        
        # MVP: Auto-save using a persistent dummy user ID if none provided
        # Ideally, this comes from Depends(get_current_user)
        # For now, we search for the first user in profiles or use a hardcoded fallback
        # To make it safer, we just return the full roadmap. 
        # But per plan, we want persistence.
        
        # TODO: Get real User ID from token. Using a placeholder or the first available user for MVP testing.
        # user_id = "00000000-0000-0000-0000-000000000000" 
        
        # We will expose a separate /save endpoint or handle it here if we had auth.
        # For this step, simply returning the roadmap is fine as long as we add the /save endpoint next.
        
        return roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save")
async def save_generated_course(course_data: dict):
    # Temporary open endpoint to testing saving
    # Find a default user for MVP
    try:
        from app.services.course_service import course_service
        # Use specific user ID from auth or hardcoded for MVP demo
        # Replacing with a valid UUID from your DB is best.
        # Let's assume the frontend sends user_id or we pick one.
        
        # For now, let's create a "Guest" profile if needed or just use one if known.
        # Skipping exact ID knowledge: The frontend should ideally be authenticated.
        
        # Let's make the frontend call this with the roadmap it got.
        pass 
        return {"status": "implemented in next step"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
