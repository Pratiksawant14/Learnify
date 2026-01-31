from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from youtube_transcript_api import YouTubeTranscriptApi
from app.ai.llm_client import llm_client
from app.ai.prompts import PROMPT_LESSON_SUMMARY, PROMPT_EXPLAIN_CONCEPT, PROMPT_ANSWER_QUESTION

router = APIRouter()

class VideoRequest(BaseModel):
    videoId: str
    lessonTitle: Optional[str] = None
    question: Optional[str] = None
    mode: Optional[str] = "simple"

@router.get("/transcripts/{video_id}")
async def get_transcript(video_id: str):
    print(f"DEBUG: Requesting transcript for {video_id}")
    try:
        api = YouTubeTranscriptApi()
        # The instance method is .list(), not .list_transcripts() in this version
        print("DEBUG: Calling api.list()...")
        transcript_list = api.list(video_id)
        print("DEBUG: api.list() returned")
        
        # Priority: Manual English -> Generated English -> Any English
        transcript = None
        try:
             transcript = transcript_list.find_manually_created_transcript(['en'])
        except:
             try:
                 transcript = transcript_list.find_generated_transcript(['en'])
             except:
                 pass
        
        if not transcript:
             # Fallback to any transcript that can be translated
             for t in transcript_list:
                  if t.is_translatable:
                        transcript = t.translate('en')
                        break
        
        if not transcript:
             print("DEBUG: No transcript found")
             raise HTTPException(status_code=404, detail="No suitable english transcript found")
             
        # Fetch actual data
        print("DEBUG: Fetching transcript data...")
        final_data = transcript.fetch()
        print("DEBUG: Data fetched")
        
        # Format as simple text block for UI
        full_text = " ".join([item['text'] for item in final_data])
        
        return {
            "transcript": full_text,
            "source": "youtube_captions",
            "videoId": video_id
        }
    except Exception as e:
        print(f"Transcript error: {e}")
        # Return a polite error structure instead of 404 to help UI
        return {
            "transcript": "Transcript unavailable (Source restricted or unavailable).",
            "source": "error",
            "videoId": video_id
        }

@router.get("/ai/ping")
async def ping():
    return {"status": "video_player_alive"}

@router.post("/ai/summary")
async def generate_summary(req: VideoRequest):
    print(f"DEBUG: Generating summary for {req.lessonTitle}")
    # For MVP, we use the LLM to generate a summary based on Title + (mock or real) Transcript context.
    # To save tokens/latency in this specific UI call, we might rely on just the title context 
    # OR if we have the transcript stored, we use it. 
    # For now, let's generate a high-level summary based on the Lesson Title context.
    
    try:
        # Prompt construction
        prompt = f"Summarize the key concepts for a coding lesson titled '{req.lessonTitle}'. Return a JSON with 'summary' (list of 3 bullet points) and 'key_concepts' (list of 5 tags)."
        
        # Simulate structured output since we want robust JSON
        response = llm_client.get_completion(
            messages=[
                {"role": "system", "content": "You are a helpful coding tutor. Output valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            json_mode=True
        )
        # Parse JSON from response
        import json
        data = json.loads(response)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai/explain")
async def explain_concept(req: VideoRequest):
    try:
        # Prompt tailored to mode
        prompt = f"Explain the concept of '{req.videoId}' (Lesson: {req.lessonTitle}) in '{req.mode}' mode."
        if req.mode == "simple":
            prompt += " Keep it very simple, like for a 10 year old."
        elif req.mode == "example":
            prompt += " Provide a concrete real-world analogy and a code snippet."
        elif req.mode == "deep":
            prompt += " Go into technical depth, memory management, or under-the-hood details."
            
        response = llm_client.get_completion(
             messages=[
                {"role": "system", "content": "You are an expert coding instructor."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return {"explanation": response, "mode": req.mode}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai/ask")
async def ask_question(req: VideoRequest):
    try:
        response = llm_client.get_completion(
             messages=[
                {"role": "system", "content": "You are a helpful coding TA. Answer the student's question clearly."},
                {"role": "user", "content": f"Context: Lesson '{req.lessonTitle}'. Question: {req.question}"}
            ]
        )
        return {"answer": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
