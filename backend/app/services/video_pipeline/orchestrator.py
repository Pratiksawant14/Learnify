from fastapi import BackgroundTasks
from typing import Dict, Any, List
import traceback
import logging

from app.services.video_pipeline.video_shortlist_service import shortlist_service
from app.services.video_pipeline.constraints_service import constraints_service
from app.services.video_pipeline.transcript_service import transcript_service
from app.services.video_pipeline.chunking_service import chunking_service
from app.services.video_pipeline.embedding_service import embedding_service
from app.services.video_pipeline.scoring_service import scoring_service
from app.services.video_pipeline.lesson_service import lesson_service
from app.services.video_pipeline.supplement_service import supplement_service
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
                    # Even if skipping, we might want to ensure embeddings exist?
                    # For MVP, assume if video_id exists, it's done.
                    updated_lessons.append(lesson)
                    processed_count += 1
                    continue
                
                # PIPELINE STEPS
                try:
                    # A. Shortlist
                    candidates = shortlist_service.search_candidates(lesson_title + " " + course.get("title", ""))
                    if not candidates:
                         # Fallback immediately
                         raise Exception("No candidates found")
                         
                    # B. Constraints
                    candidates = constraints_service.apply_constraints(candidates)
                    
                    # C. Transcripts
                    candidates = transcript_service.fetch_for_candidates(candidates)
                    
                    # D. Chunking
                    valid_candidates = [c for c in candidates if c.transcript_available]
                    if valid_candidates:
                        # Chunk ONLY valid ones
                        chunks_map = chunking_service.chunk_candidates(valid_candidates)
                        
                        # E. Embedding (Upsert all chunks)
                        all_chunks = []
                        for chunks in chunks_map.values():
                            all_chunks.extend(chunks)
                        embedding_service.embed_and_store(all_chunks)
                        
                        # F. Scoring
                        plan = LessonPlan(
                            lesson_title=lesson_title, 
                            lesson_keywords=[], 
                            target_level=roadmap.get("level", "beginner"),
                            description=lesson.get("description", "")
                        )
                        scored = scoring_service.score_candidates_for_lesson(plan, valid_candidates)
                        
                        # G. Selection
                        final_node = lesson_service.select_best_match(plan, scored)
                    else:
                        final_node = None
                        
                    # H. Supplement Fallback
                    if not final_node:
                        job_manager.add_log(job_id, f"No video match for {lesson_title}, generating supplement.")
                        plan = LessonPlan(
                            lesson_title=lesson_title, 
                            lesson_keywords=[], 
                            target_level=roadmap.get("level", "beginner"),
                            description=lesson.get("description", "")
                        )
                        final_node = supplement_service.create_text_fallback(plan)
                    
                    # Merge back into lesson object
                    lesson.update(final_node)
                    updated_lessons.append(lesson)
                    
                except Exception as e:
                    logger.error(f"Error processing lesson {lesson_title}: {e}")
                    traceback.print_exc()
                    lesson["error"] = str(e)
                    updated_lessons.append(lesson)

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
