from typing import List, Optional, Dict
from .base import LessonPlan
from app.core.config import settings

class LessonService:
    def select_best_match(self, lesson_plan: LessonPlan, scored_candidates: List[dict]) -> Optional[Dict]:
        """
        Decides the canonical video/segment for the lesson.
        Returns a dict structure for the lesson node (video_id, start, end, etc.)
        or None if no candidate meets criteria.
        """
        if not scored_candidates:
            return None
        
        # 1. Try Single Canonical (High Confidence)
        top = scored_candidates[0]
        if top['final_score'] >= settings.MIN_COVERAGE_SCORE:
            best_chunk = top['best_chunk']
            meta = best_chunk['metadata']
            cand = top['candidate']
            
            return {
                "title": lesson_plan.lesson_title,
                "description": lesson_plan.description,
                "video_id": top['video_id'],
                "video_title": cand.title,
                "channel_name": cand.channel_title,
                "start_time": meta['start_time'],
                "end_time": meta['end_time'],
                "transcript_snippet": best_chunk['text'][:200] + "...",
                "score": top['final_score'],
                "type": "video"
            }
            
        # 2. Relaxed / Multi-chunk?
        # For MVP, let's just take the best one if it's at least 0.5, else None
        if top['final_score'] >= 0.5:
             best_chunk = top['best_chunk']
             meta = best_chunk['metadata']
             cand = top['candidate']
             return {
                "title": lesson_plan.lesson_title,
                "description": lesson_plan.description,
                "video_id": top['video_id'],
                "video_title": cand.title,
                "channel_name": cand.channel_title,
                "start_time": meta['start_time'],
                "end_time": meta['end_time'],
                "transcript_snippet": best_chunk['text'][:200] + "...",
                "score": top['final_score'],
                "type": "video",
                "note": "Low confidence match"
            }
            
        return None

lesson_service = LessonService()
