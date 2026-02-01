import subprocess
import json
from youtube_transcript_api import YouTubeTranscriptApi
from typing import Optional

class VideoService:
    @staticmethod
    def search_video(query: str, limit: int = 1):
        """Search for videos using yt-dlp"""
        try:
            # Use yt-dlp to search YouTube
            cmd = [
                'yt-dlp',
                f'ytsearch{limit}:{query}',
                '--dump-json',
                '--no-warnings',
                '--skip-download'
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            
            if result.returncode != 0:
                print(f"yt-dlp search failed: {result.stderr}")
                return None
            
            videos = []
            # yt-dlp outputs one JSON object per line for multiple results
            for line in result.stdout.strip().split('\n'):
                if not line:
                    continue
                try:
                    video_data = json.loads(line)
                    videos.append({
                        "video_id": video_data.get('id'),
                        "title": video_data.get('title'),
                        "link": f"https://www.youtube.com/watch?v={video_data.get('id')}",
                        "thumbnail": video_data.get('thumbnail'),
                        "channel": video_data.get('uploader') or video_data.get('channel'),
                        "duration": str(video_data.get('duration', 0)) + 's' if video_data.get('duration') else 'Unknown'
                    })
                except json.JSONDecodeError as e:
                    print(f"Failed to parse yt-dlp JSON: {e}")
                    continue
            
            return videos if videos else None
            
        except subprocess.TimeoutExpired:
            print(f"Video search timed out for query: {query}")
            return None
        except Exception as e:
            print(f"Error in video search: {e}")
            return None

    @staticmethod
    def get_transcript(video_id: str):
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            # Combine for full text
            full_text = " ".join([entry['text'] for entry in transcript])
            return {"transcript": transcript, "full_text": full_text}
        except Exception as e:
            print(f"Error fetching transcript for {video_id}: {e}")
            return None

video_service = VideoService()
