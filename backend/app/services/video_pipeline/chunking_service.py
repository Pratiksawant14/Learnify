from typing import List, Dict, Any
import uuid
from .base import VideoCandidate, TranscriptChunk
from app.core.config import settings

class ChunkingService:
    def __init__(self):
        self.target_word_count = 300
        self.max_duration = settings.MAX_CHUNK_DURATION_SECONDS
    
    def chunk_candidates(self, candidates: List[VideoCandidate]) -> Dict[str, List[TranscriptChunk]]:
        """
        Returns a map of video_id -> list of chunks
        """
        all_chunks = {}
        
        for cand in candidates:
            if not cand.is_shortlisted or not getattr(cand, 'raw_transcript', None):
                continue
                
            chunks = self._chunk_transcript(cand.video_id, cand.raw_transcript)
            all_chunks[cand.video_id] = chunks
            
        return all_chunks

    def _chunk_transcript(self, video_id: str, raw_transcript: List[Dict]) -> List[TranscriptChunk]:
        """
        Basic algorithm: Accumulate lines until word count > target or duration > max.
        """
        chunks = []
        current_words = []
        current_start = None
        current_end = 0
        
        for entry in raw_transcript:
            text = entry['text']
            start = entry['start']
            duration = entry['duration']
            end = start + duration
            
            if current_start is None:
                current_start = start
            
            # Check conditions to split
            # 1. Word count limit
            current_word_count = len(" ".join(current_words).split())
            # 2. Max duration limit
            current_duration = end - current_start
            
            if (current_word_count >= self.target_word_count) or (current_duration >= self.max_duration):
                # Close chunk
                chunk_text = " ".join(current_words)
                if chunk_text.strip():
                    chunks.append(TranscriptChunk(
                        chunk_id=str(uuid.uuid4()),
                        video_id=video_id,
                        start_time=current_start,
                        end_time=current_end, # End of previous segment
                        text=chunk_text
                    ))
                
                # Reset
                current_words = [text]
                current_start = start
            else:
                current_words.append(text)
            
            current_end = end
        
        # Add last chunk
        if current_words:
            chunk_text = " ".join(current_words)
            chunks.append(TranscriptChunk(
                chunk_id=str(uuid.uuid4()),
                video_id=video_id,
                start_time=current_start or 0.0,
                end_time=current_end,
                text=chunk_text
            ))
            
        return chunks

chunking_service = ChunkingService()
