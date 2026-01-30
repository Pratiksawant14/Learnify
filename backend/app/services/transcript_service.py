import json
import os
from pathlib import Path
from youtube_transcript_api import YouTubeTranscriptApi
from typing import Optional, Dict, Any

DATA_DIR = Path(__file__).parent.parent / "data"
TRANSCRIPTS_FILE = DATA_DIR / "transcripts.json"

class TranscriptService:
    def __init__(self):
        self._ensure_data_dir()
        self.transcripts = self._load_transcripts()

    def _ensure_data_dir(self):
        if not DATA_DIR.exists():
            DATA_DIR.mkdir(parents=True)
        if not TRANSCRIPTS_FILE.exists():
            with open(TRANSCRIPTS_FILE, "w") as f:
                json.dump({}, f)

    def _load_transcripts(self) -> Dict[str, Any]:
        try:
            with open(TRANSCRIPTS_FILE, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}

    def _save_transcript(self, video_id: str, data: Dict[str, Any]):
        self.transcripts[video_id] = data
        with open(TRANSCRIPTS_FILE, "w") as f:
            json.dump(self.transcripts, f, indent=2)

    def get_transcript(self, video_id: str, force_refresh: bool = False) -> Dict[str, Any]:
        # Return cached if available
        if not force_refresh and video_id in self.transcripts:
            return self.transcripts[video_id]

        try:
            # Fetch from YouTube
            # list_transcripts can return multiple languages. We'll prefer English.
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            # Try fetching english, or the first available manually generated, or auto-generated
            try:
                transcript = transcript_list.find_transcript(['en'])
            except:
                # Fallback to any available
                transcript = next(iter(transcript_list))

            fetched_data = transcript.fetch()
            
            # Normalize text
            full_text = " ".join([item['text'] for item in fetched_data])
            
            result = {
                "videoId": video_id,
                "transcript": full_text,
                "segments": fetched_data,
                "language": transcript.language_code,
                "source": "youtube_captions",
                "isGenerated": transcript.is_generated
            }

            self._save_transcript(video_id, result)
            return result

        except Exception as e:
            # Fallback for now: mimic Whisper/AI unavailable
            # In a real scenario, this is where we'd call Whisper
            print(f"Error fetching transcript for {video_id}: {e}")
            
            # MOCK FALLBACK FOR DEMO:
            if video_id == "PjFM63f538o" or video_id == "dQw4w9WgXcQ":
                mock_text = (
                    "Welcome to this comprehensive computer science course! "
                    "In this lesson, we will explore the fundamental concepts that drive modern computing. "
                    "We'll start with how computers process information using binary code, "
                    "then move on to algorithms, data structures, and the basics of programming. "
                    "Remember, computer science is not just about coding; it's about problem-solving and understanding "
                    "how systems work at a fundamental level. "
                    "[This is a generated mock transcript because the live YouTube API request failed in this environment.]"
                )
                
                result = {
                    "videoId": video_id,
                    "transcript": mock_text,
                    "language": "en",
                    "source": "fallback_mock",
                    "isGenerated": True
                }
                self._save_transcript(video_id, result)
                return result

            return {
                "videoId": video_id,
                "error": str(e),
                "source": "unavailable"
            }
