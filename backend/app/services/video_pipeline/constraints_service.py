from typing import List
from app.core.config import settings
from .base import VideoCandidate
import logging

logger = logging.getLogger(__name__)

class ConstraintsService:
    def __init__(self):
        self.min_views = 100
        self.max_duration = 7200 # 2 hours max for a source video
        self.min_duration = 60   # 1 min min
    
    def apply_constraints(self, candidates: List[VideoCandidate]) -> List[VideoCandidate]:
        """
        Filter out candidates that don't meet hard constraints.
        Updates is_shortlisted flag and rejection_reason.
        """
        valid_candidates = []
        
        for cand in candidates:
            reason = None
            
            # 1. Duration
            if cand.duration_seconds < self.min_duration:
                reason = "Too short"
            elif cand.duration_seconds > self.max_duration:
                reason = "Too long"
                
            # 2. Views
            if not reason and cand.view_count < self.min_views:
                reason = "Too few views"
                
            # 3. Captions (Strict for pipeline, though we can auto-generate via whisper later)
            # For now, we don't strictly reject on has_captions metadata 
            # because YouTube API often reports false even if auto-caps exist.
            # We defer this to TranscriptService.
            
            if reason:
                cand.is_shortlisted = False
                cand.rejection_reason = reason
            else:
                valid_candidates.append(cand)
                
        logger.info(f"Constraints applied: {len(valid_candidates)}/{len(candidates)} passed.")
        return valid_candidates

constraints_service = ConstraintsService()
