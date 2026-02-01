from fastapi import BackgroundTasks
from typing import Dict, Any, List
import traceback
import logging

from app.services.video_pipeline.video_shortlist_service import shortlist_service
# All transcript/AI services removed for STRICT VIDEO MODE
from app.services.video_pipeline.persistence_service import persistence_service
from app.services.video_pipeline.base import LessonPlan
from app.utils.job_queue import job_manager, JobStatus
from app.core.database import supabase

logger = logging.getLogger(__name__)

import asyncio

# Synchronous worker function
def run_assembly_pipeline_sync(course_id: str, job_id: str, force_rebuild: bool):
    try:
        job_manager.update_status(job_id, JobStatus.RUNNING)
        job_manager.add_log(job_id, "Starting assembly pipeline...")
        
        # 1. Fetch Course Roadmap
        res = supabase.table("courses").select("roadmap_json, title, description").eq("id", course_id).execute()
        if not res.data:
            raise ValueError("Course not found")
            
        course = res.data[0]
        roadmap = course.get("roadmap_json") or {}
        
        # 🚨 QUOTA OPTIMIZATION: Search ONCE per Course
        course_title = course.get("title", "Course")
        # Broad search to gather a pool of candidates
        pool_query = f"{course_title} full course tutorial education"
        job_manager.add_log(job_id, f"Searching video pool: {pool_query}")
        
        try:
            # Fetch 25 candidates once
            video_pool = shortlist_service.search_candidates(pool_query, max_results=25)
            job_manager.add_log(job_id, f"Video pool size: {len(video_pool)}")
        except Exception as e:
            logger.error(f"Pool search failed: {e}")
            video_pool = []
        
        # Structure: modules -> lessons
        modules = roadmap.get("modules", [])
        total_lessons = sum(len(m.get("lessons", [])) for m in modules)
        processed_count = 0
        
        updated_modules = []
        
        for m_idx, module in enumerate(modules):
            updated_lessons = []
            for l_idx, lesson in enumerate(module.get("lessons", [])):
                lesson_title = lesson.get("title")
                job_manager.add_log(job_id, f"Processing lesson: {lesson_title}")
                
                # Check if already has video (unless force_rebuild)
                if not force_rebuild and lesson.get("video_id"):
                    updated_lessons.append(lesson)
                    processed_count += 1
                    continue
                
                # STRICT VIDEO-ONLY PIPELINE
                try:
                    # A. Select from POOL
                    if video_pool:
                        candidates = shortlist_service.select_best_from_pool(video_pool, lesson_title)
                    else:
                        candidates = []

                    if not candidates:
                         # STRICT VIDEO MODE: if no video, SKIP lesson
                         job_manager.add_log(job_id, f"⚠️ STRICT MODE: Skipping lesson '{lesson_title}' - No video candidates.")
                         continue
                    
                    # B. Pick best video (already sorted by relevance)
                    best = candidates[0]
                    
                    # C. Create minimal lesson node
                    final_node = {
                        "video_id": best.video_id,
                        "videoId": best.video_id, # Frontend Compat: camelCase
                        "title": best.title,
                        "description": best.description or "",
                        "duration": best.duration_seconds,
                        "channel": best.channel_title,
                    }
                    job_manager.add_log(job_id, f"✅ Selected video '{best.title}' for lesson.")
                    
                    # D. Merge back into lesson object
                    lesson.update(final_node)
                    updated_lessons.append(lesson)
                    
                except Exception as e:
                    logger.error(f"Error processing lesson {lesson_title}: {e}")
                    traceback.print_exc()
                    # Do not append lesson on error in strict mode
                    continue

                processed_count += 1
                progress_pct = int((processed_count / total_lessons) * 100) if total_lessons > 0 else 100
                job_manager.update_status(job_id, JobStatus.RUNNING, progress={"percent": progress_pct})

            # Update module
            module["lessons"] = updated_lessons
            updated_modules.append(module)
            
        # I. Persist
        roadmap["modules"] = updated_modules
        persistence_service.save_course_result(course_id, roadmap)
        
        job_manager.update_status(job_id, JobStatus.COMPLETED, result={"course_id": course_id})
        job_manager.add_log(job_id, "Assembly complete.")
        
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        traceback.print_exc()
        job_manager.update_status(job_id, JobStatus.FAILED, error=str(e))

# Async Wrapper
async def run_assembly_pipeline(course_id: str, job_id: str, force_rebuild: bool):
    await asyncio.to_thread(run_assembly_pipeline_sync, course_id, job_id, force_rebuild)
