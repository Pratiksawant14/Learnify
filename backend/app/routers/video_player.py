from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class VideoRequest(BaseModel):
    videoId: str

@router.get("/ai/ping")
async def ping():
    return {"status": "video_player_active_no_ai"}

@router.post("/ai/summary")
async def generate_summary_stub(req: VideoRequest):
    # STUB: Returns empty summary to satisfy frontend without using AI.
    return {
        "summary": ["Summary disabled in Strict Video Mode."],
        "key_concepts": ["Video Only"]
    }

@router.get("/transcripts/{video_id}")
async def get_transcript_stub(video_id: str):
    # STUB: Returns mock transcript to satisfy frontend
    return {
        "transcript": "Transcripts are disabled in Strict Video Mode. Please watch the video.",
        "source": "disabled",
        "videoId": video_id
    }
