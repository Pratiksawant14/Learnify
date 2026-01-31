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
        1. Search YouTube for topic
        2. Fetch details
        3. Convert to candidates with meta_score
        """
        query = f"{topic} tutorial education"
        
        logger.info(f"Searching YouTube for: {query}")
        
        # 1. Search
        try:
            items = youtube_client.search_videos(query, max_results=max_results)
            if not items:
                return []
                
            video_ids = [item['id']['videoId'] for item in items]
            
            # 2. Get Details
            details_list = youtube_client.get_video_details(video_ids)
            
            candidates = []
            
            # Map details to candidate objects
            for vid_detail in details_list:
                snippet = vid_detail['snippet']
                stats = vid_detail['statistics']
                content = vid_detail['contentDetails']
                
                vid_id = vid_detail['id']
                duration = parse_duration(content.get('duration', 'PT0S'))
                views = int(stats.get('viewCount', 0))
                likes = int(stats.get('likeCount', 0)) # Note: likeCount might be hidden
                
                # Caption check: 'caption' is 'true' or 'false' in contentDetails (deprecated but sometimes present)
                # Or we rely on transcript service later.
                # contentDetails.caption seems reliable-ish for "has manual captions"
                has_captions = content.get('caption', 'false') == 'true'
                
                candidate = VideoCandidate(
                    video_id=vid_id,
                    title=snippet['title'],
                    channel_title=snippet['channelTitle'],
                    channel_id=snippet['channelId'],
                    published_at=snippet['publishedAt'],
                    duration_seconds=duration,
                    view_count=views,
                    like_count=likes,
                    has_captions=has_captions
                )
                
                # Compute Meta Score
                candidate.meta_score = self._compute_meta_score(candidate)
                candidates.append(candidate)
                
            # Sort by meta score descending
            candidates.sort(key=lambda x: x.meta_score, reverse=True)
            
            return candidates

        except Exception as e:
            logger.error(f"Error in search_candidates: {e}")
            # Return empty allows pipeline to fail gracefully or try next step
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

shortlist_service = VideoShortlistService()
