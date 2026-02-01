from typing import List
import math
import re
from datetime import datetime
from app.utils.yt_api import youtube_client
from app.core.config import settings
from .base import VideoCandidate
import logging

logger = logging.getLogger(__name__)

def parse_duration(duration_iso: str) -> int:
    """Parses ISO 8601 duration (PT1H2M10S) to seconds."""
    match = re.match(
        r'PT((?P<hours>\d+)H)?((?P<minutes>\d+)M)?((?P<seconds>\d+)S)?',
        duration_iso
    )
    if not match:
        return 0
    
    hours = int(match.group('hours') or 0)
    minutes = int(match.group('minutes') or 0)
    seconds = int(match.group('seconds') or 0)
    return hours * 3600 + minutes * 60 + seconds

class VideoShortlistService:
    def search_candidates(self, topic: str, max_results: int = 30) -> List[VideoCandidate]:
        """
        Uses scraper (yt-dlp) to find videos.
        """
        query = topic 
        logger.info(f"Searching YouTube (yt-dlp) for: {query}")
        
        try:
            items = youtube_client.search_videos(query, max_results=max_results)
            if not items:
                return []
            
            candidates = []
            
            # Map scraper items to candidate objects
            for item in items:
                # yt-dlp gives "duration_sec" directly (int)
                duration_sec = item.get('duration_sec', 0)
                
                # Check strict filter early
                if duration_sec < 300: # 5 mins
                    continue
                    
                view_count = item.get('view_count', 0)
                if view_count < 1000:
                    continue
                    
                candidate = VideoCandidate(
                    video_id=item['id'],
                    title=item['title'],
                    channel_title=item['channel'],
                    channel_id=item['channel_id'],
                    published_at=item['published_at'],
                    duration_seconds=duration_sec,
                    view_count=view_count,
                    like_count=0,
                    has_captions=True # Assumed
                )
                
                # Compute Meta Score
                candidate.meta_score = self._compute_meta_score(candidate)
                candidates.append(candidate)
                
            # Sort by meta score descending
            candidates.sort(key=lambda x: x.meta_score, reverse=True)
            
            # Limit candidates
            return candidates[:max_results]

        except Exception as e:
            logger.error(f"Error in search_candidates: {e}")
            return []

    def _compute_meta_score(self, cand: VideoCandidate) -> float:
        # 1. View Score (Log scale)
        # Max reasonable views ~1M for ed content?
        # log10(1) = 0, log10(1M) = 6. 
        view_score = min(math.log10(cand.view_count + 1) / 6.0, 1.0)
        
        # 2. Like Ratio
        # Ideal 0.05 (5%)? 
        ratio = cand.like_count / (cand.view_count + 1)
        like_score = min(ratio * 20, 1.0) # if ratio > 5%, score is 1
        
        # 3. Duration Score
        # Prefer 5-20 mins (300 - 1200s)
        dur = cand.duration_seconds
        if 300 <= dur <= 1200:
            dur_score = 1.0
        elif 120 <= dur < 300:
            dur_score = 0.7
        elif 1200 < dur <= 3600: # up to 1h
            dur_score = 0.6
        else:
            dur_score = 0.3
            
        # 4. Recency (Optional, maybe less important for core concepts)
        recency_score = 0.5 
        
        # Weights
        final = (view_score * 0.4) + (like_score * 0.3) + (dur_score * 0.3)
        return final

    def select_best_from_pool(self, pool: List[VideoCandidate], lesson_title: str) -> List[VideoCandidate]:
        """
        Re-ranks the global video pool for a specific lesson title.
        Uses simple keyword overlap or string probability.
        """
        if not pool:
            return []
            
        def score_relevance(cand, query):
            # Simple keyword matching
            q_words = set(query.lower().split())
            title_words = set(cand.title.lower().split())
            desc_words = set((cand.description or "").lower().split())
            
            overlap = len(q_words.intersection(title_words))
            desc_overlap = len(q_words.intersection(desc_words))
            
            # Weighted score: Title overlap * 2 + Meta Score
            return (overlap * 2.0) + (desc_overlap * 0.5) + (cand.meta_score * 0.5)
            
        # Sort pool by relevance to THIS lesson
        # We process ALL of them, but return sorted list
        ranked = sorted(pool, key=lambda c: score_relevance(c, lesson_title), reverse=True)
        
        # Return top 3 for transcript processing
        MAX_TRANSCRIPT_CANDIDATES = 3
        
        # 🚨 Caption Filter Check again just in case
        ranked = [c for c in ranked if c.has_captions]
        
        return ranked[:MAX_TRANSCRIPT_CANDIDATES]

shortlist_service = VideoShortlistService()
