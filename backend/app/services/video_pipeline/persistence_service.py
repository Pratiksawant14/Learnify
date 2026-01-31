from typing import Any, Dict
from app.core.database import supabase
import json
import logging

logger = logging.getLogger(__name__)

class PersistenceService:
    def save_course_result(self, course_id: str, backend_structure: Dict[str, Any]):
        """
        Updates course roadmap_json and inserts lessons.
        """
        try:
            # 1. Update Course JSON
            # Ideally we lock row, but MVP fine
            supabase.table("courses").update({
                "roadmap_json": backend_structure
            }).eq("id", course_id).execute()
            
            # 2. Sync Lessons Table
            # Delete existing lessons for course? Or upsert?
            # For rebuild force, delete all is safer.
            supabase.table("lessons").delete().eq("course_id", course_id).execute()
            
            lessons_payload = []
            
            # Walk structure (Modules -> Lessons)
            # Backend structure: { ..., modules: [ { lessons: [...] } ] }
            
            order_idx = 0
            for module in backend_structure.get("modules", []):
                for lesson in module.get("lessons", []):
                    # lesson node has: title, video_id, start_time, end_time, transcript_snippet, type
                    
                    row = {
                        "course_id": course_id,
                        "title": lesson.get("title"),
                        "video_id": lesson.get("video_id"),
                        "start_time": lesson.get("start_time"),
                        "end_time": lesson.get("end_time"),
                        "transcript_text": lesson.get("transcript_snippet") or lesson.get("content"), # fallback for text
                        "order_index": order_idx
                    }
                    lessons_payload.append(row)
                    order_idx += 1
            
            if lessons_payload:
                supabase.table("lessons").insert(lessons_payload).execute()
                
            logger.info(f"Persisted course {course_id} with {len(lessons_payload)} lessons.")
            
        except Exception as e:
            logger.error(f"Persistence Error: {e}")
            raise e

persistence_service = PersistenceService()
