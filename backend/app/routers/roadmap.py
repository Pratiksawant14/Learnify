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
        return roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
