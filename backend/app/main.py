from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.services.transcript_service import TranscriptService
from app.services.ai_service import AIService
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Learnify Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

transcript_service = TranscriptService()
ai_service = AIService()

class TranscriptRequest(BaseModel):
    videoId: str

class AISummaryRequest(BaseModel):
    videoId: str
    lessonTitle: str

class AIExplanationRequest(BaseModel):
    videoId: str
    mode: str # simple, example, deep

@app.get("/")
def read_root():
    return {"status": "ok", "service": "Learnify Backend"}

@app.get("/transcripts/{video_id}")
def get_transcript(video_id: str):
    result = transcript_service.get_transcript(video_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@app.post("/ai/summary")
def get_lesson_summary(req: AISummaryRequest):
    # 1. Get Transcript
    # We force refresh=False to use cache effectively
    transcript_result = transcript_service.get_transcript(req.videoId)
    
    if "error" in transcript_result:
        raise HTTPException(status_code=400, detail="Transcript unavailable, cannot generate summary.")
    
    text = transcript_result.get("transcript", "")
    
    # 2. Generate Summary
    return ai_service.get_summary_and_concepts(req.videoId, text, req.lessonTitle)

@app.post("/ai/explain")
def get_explanation(req: AIExplanationRequest):
    # 1. Get Transcript
    transcript_result = transcript_service.get_transcript(req.videoId)
    
    if "error" in transcript_result:
        raise HTTPException(status_code=400, detail="Transcript unavailable, cannot generate explanation.")
    
    text = transcript_result.get("transcript", "")
    
    # 2. Generate Explanation
    explanation = ai_service.get_explanation(req.videoId, text, req.mode)
    return {"explanation": explanation, "mode": req.mode}

class AIQuestionRequest(BaseModel):
    videoId: str
    lessonTitle: str
    question: str

@app.post("/ai/ask")
def ask_question(req: AIQuestionRequest):
    # 1. Get Transcript (optional context for real AI, skipped for mock)
    # transcript_result = transcript_service.get_transcript(req.videoId)
    
    # 2. Get Answer
    answer = ai_service.answer_question(req.videoId, req.question, req.lessonTitle)
    return {"answer": answer}
