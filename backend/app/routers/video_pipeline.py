from fastapi import APIRouter, BackgroundTasks, HTTPException, Query
from typing import Dict, Any, List
from pydantic import BaseModel
import traceback

from app.services.video_pipeline.orchestrator import run_assembly_pipeline
from app.utils.job_queue import job_manager, JobStatus
from app.core.database import supabase
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class AssembleRequest(BaseModel):
    force_rebuild: bool = False

@router.post("/{course_id}/assemble_videos")
async def trigger_assembly(course_id: str, background_tasks: BackgroundTasks, body: AssembleRequest):
    # Create job
    job_id = job_manager.create_job(course_id, "assemble_videos")
    
    # Start background task
    background_tasks.add_task(run_assembly_pipeline, course_id, job_id, body.force_rebuild)
    
    return {"job_id": job_id, "status": "pending"}

@router.get("/{course_id}/assemble_status")
async def get_assembly_status(course_id: str):
    # Find latest job for course
    job = job_manager.get_latest_job_for_course(course_id)
    if not job:
        return {"status": "none", "message": "No jobs found for this course"}
    return job

@router.get("/{course_id}/final")
async def get_final_course(course_id: str):
    res = supabase.table("courses").select("roadmap_json").eq("id", course_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Course not found")
        
    return res.data[0].get("roadmap_json")
