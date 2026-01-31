import uuid
from datetime import datetime
from enum import Enum
from typing import Dict, Any, Optional
import logging

class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class JobManager:
    """
    Simple in-memory job tracker for MVP.
    In production, replace with Redis or Database table.
    """
    def __init__(self):
        self._jobs: Dict[str, Dict[str, Any]] = {}

    def create_job(self, course_id: str, job_type: str = "video_assembly") -> str:
        job_id = str(uuid.uuid4())
        self._jobs[job_id] = {
            "job_id": job_id,
            "course_id": course_id,
            "type": job_type,
            "status": JobStatus.PENDING,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            "progress": {
                "current_step": "initialized",
                "percent": 0,
                "details": []
            },
            "result": None,
            "error": None
        }
        return job_id

    def update_status(self, job_id: str, status: JobStatus, progress: Optional[Dict] = None, result: Optional[Any] = None, error: Optional[str] = None):
        if job_id not in self._jobs:
            return
        
        job = self._jobs[job_id]
        job["status"] = status
        job["updated_at"] = datetime.utcnow().isoformat()
        
        if progress:
            # Merge or replace progress
            if "details" in progress and "details" in job["progress"]:
                 # Append messages if any
                 pass 
            job["progress"] = progress
            
        if result:
            job["result"] = result
            
        if error:
            job["error"] = error

    def add_log(self, job_id: str, message: str):
        if job_id in self._jobs:
            self._jobs[job_id]["progress"].setdefault("details", []).append(
                f"[{datetime.utcnow().strftime('%H:%M:%S')}] {message}"
            )

    def get_job(self, job_id: str) -> Optional[Dict]:
        return self._jobs.get(job_id)

    def get_latest_job_for_course(self, course_id: str) -> Optional[Dict]:
        # Linear search is fine for MVP in-memory
        candidates = [j for j in self._jobs.values() if j["course_id"] == course_id]
        if not candidates:
            return None
        # Sort by created_at desc
        candidates.sort(key=lambda x: x["created_at"], reverse=True)
        return candidates[0]

job_manager = JobManager()
