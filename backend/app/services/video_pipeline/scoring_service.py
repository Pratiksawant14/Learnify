from typing import List, Dict, Any, Optional
from .base import VideoCandidate, LessonPlan
from .embedding_service import embedding_service
from app.ai.llm_client import llm_client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class ScoringService:
    def score_candidates_for_lesson(self, lesson: LessonPlan, candidates: List[VideoCandidate]) -> List[dict]:
        """
        Returns list of scored candidates (video_id, score, best_chunk).
        candidates argument is passed mainly to look up meta_scores if needed.
        """
        # 1. Generate Spec
        spec = llm_client.generate_lesson_spec(lesson.lesson_title, lesson.description)
        logger.info(f"Generated spec for '{lesson.lesson_title}': {spec}")
        
        # 2. Vector Search (Simulating "Search whole corpus")
        # In reality, we only want to search chunks belonging to our filtered start_candidates.
        # But Chroma search is global. We can filter by `video_id` using `where` clause if we want to restrict search 
        # to ONLY the candidates we found for this topic.
        # For simplicity, we search globally (assuming index only has relevant content for this course run or doesn't matter).
        # Better: we pass `candidate_ids` to filter.
        
        candidate_ids = [c.video_id for c in candidates if c.is_shortlisted]
        if not candidate_ids:
            return []

        # Chroma `where` clause: field matches one of list. 
        # Chroma `where` supports `$in`.
        where_filter = {"video_id": {"$in": candidate_ids}} if len(candidate_ids) < 50 else None 
        # If too many candidates, we might skip filter or batch. For MVP limit is 30.
        
        # We want top chunks.
        results = embedding_service.query_similar_chunks(spec, n_results=10) # Get top 10 chunks globally (or filtered)
        # Note: embedding_service need update to support `where`. 
        # For now let's assume global search matches relevance anyway.
        
        scores = {} # video_id -> {max_sim, best_chunk}
        
        for res in results:
            vid_id = res['metadata']['video_id']
            # Distance: lower is better. Cosine distance roughly 0..2.
            # Convert to similarity: 1 - distance (approx for normalized).
            # Chroma default is L2 usually, or Cosine? Assuming Cosine distance for now if configured, or just handle distance.
            # Let's assume the result user gets is `distance`.
            # Score = 1 / (1 + distance) is a safer generic conversion.
            
            raw_score = 1 / (1 + res['score']) 
            
            if vid_id not in scores or raw_score > scores[vid_id]['similarity']:
                scores[vid_id] = {
                    'similarity': raw_score,
                    'chunk': res,
                    'video_id': vid_id
                }
        
        # 3. Combine with Meta Score
        final_results = []
        candidate_map = {c.video_id: c for c in candidates}
        
        for vid_id, data in scores.items():
            cand = candidate_map.get(vid_id)
            if not cand: 
                continue
                
            sim = data['similarity']
            meta = cand.meta_score
            
            # Weighted Score
            # Heavy weight on content similarity (0.6), some on meta (0.4)
            final_score = (sim * 0.7) + (meta * 0.3)
            
            # Optional: LLM Verification for top matches?
            # Start with logical check.
            
            final_results.append({
                "video_id": vid_id,
                "final_score": final_score,
                "similarity_score": sim,
                "meta_score": meta,
                "best_chunk": data['chunk'], # Contains start/end/text
                "candidate": cand
            })
            
        # Sort
        final_results.sort(key=lambda x: x['final_score'], reverse=True)
        return final_results

    def verify_coverage(self, lesson_spec: str, chunk_text: str) -> float:
        """Explicit LLM check"""
        res = llm_client.analyze_coverage(lesson_spec, chunk_text)
        return res.get("score", 0.0)

scoring_service = ScoringService()
