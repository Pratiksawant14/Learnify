import subprocess
import json
import logging
import shutil

logger = logging.getLogger(__name__)

class YouTubeAPI:
    def __init__(self):
        # Check if yt-dlp is installed
        if not shutil.which("yt-dlp"):
             logger.critical("yt-dlp not found in PATH! Video generation will fail.")

    def search_videos(self, query: str, max_results: int = 20):
        """
        Search using yt-dlp CLI. Robust and quota-free.
        """
        logger.info(f"Searching via yt-dlp: {query}")
        
        # yt-dlp arguments:
        # --dump-json: output JSON
        # --flat-playlist: don't download, just list
        # --no-warnings: silent
        # ytsearchN:query : search N results
        cmd = [
            "yt-dlp",
            "--dump-json",
            "--flat-playlist",
            "--no-warnings",
            f"ytsearch{max_results}:{query}"
        ]
        
        try:
            # Run command
            # Using encoding='utf-8' to handle emoji/chars
            process = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
            
            if process.returncode != 0:
                logger.error(f"yt-dlp search failed: {process.stderr}")
                return []
                
            results = []
            
            # Output is one JSON object per line
            for line in process.stdout.strip().split('\n'):
                if not line: continue
                try:
                    data = json.loads(line)
                    
                    # Extract fields
                    # yt-dlp flat-playlist often gives: id, title, uploader, duration, view_count (sometimes)
                    
                    vid_id = data.get('id')
                    title = data.get('title')
                    
                    # Basic filters
                    if not vid_id or not title: continue
                    
                    # Duration is usually float seconds
                    duration = data.get('duration', 0)
                    if isinstance(duration, (int, float)):
                        duration_sec = int(duration)
                    else:
                        duration_sec = 0
                        
                    # View count might be missing in flat-playlist mode for some searches,
                    # but we'll take what we get.
                    view_count = data.get('view_count', 0)
                    if view_count is None: view_count = 0 
                    
                    video_obj = {
                        "id": vid_id,
                        "title": title,
                        "channel": data.get('uploader', 'Unknown'),
                        "channel_id": data.get('uploader_id', ''),
                        "duration_sec": duration_sec, # Use distinct key for clarity
                        "view_count": int(view_count),
                        "link": f"https://www.youtube.com/watch?v={vid_id}",
                        "published_at": data.get('upload_date', ''), # YYYYMMDD
                        "thumbnail": f"https://i.ytimg.com/vi/{vid_id}/hqdefault.jpg" # Construct standard thumb
                    }
                    results.append(video_obj)
                    
                except Exception as loop_e:
                    logger.warning(f"Failed to parse yt-dlp line: {loop_e}")
                    continue
            
            logger.info(f"yt-dlp found {len(results)} videos")
            return results

        except Exception as e:
            logger.error(f"yt-dlp execution error: {e}")
            return []

    def get_video_details(self, video_ids: list[str]):
        return []
            
youtube_client = YouTubeAPI()
