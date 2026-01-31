from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from typing import List, Optional, Dict
from .base import VideoCandidate, TranscriptFetchError
import logging
import time
import random
import yt_dlp
import json

logger = logging.getLogger(__name__)

class TranscriptService:
    def fetch_with_ytdlp(self, video_id: str):
        """
        Attempts to fetch automatic or manual subtitles using yt-dlp.
        This is robust against API soft-bans.
        """
        try:
            ydl_opts = {
                'skip_download': True,
                'writesubtitles': True,   
                'writeautomaticsub': True,
                'subtitleslangs': ['en'],
                'quiet': True,
                'no_warnings': True,
                # NETWORK TWEAKS
                'source_address': '0.0.0.0', # Force IPv4
                'nocheckcertificate': True,
                'user_agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
                'referer': 'https://www.youtube.com/',
                'extractor_args': {'youtube': {'player_client': ['android', 'web']}},
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(video_id, download=False)
                
                # Check for subtitles
                subtitles = info.get('subtitles') or {}
                # Check for automatic_captions
                auto_captions = info.get('automatic_captions') or {}
                
                # Priority: Manual English -> Auto English
                selected_subs = None
                
                # Try manual 'en'
                if 'en' in subtitles:
                    selected_subs = subtitles['en']
                
                # Try auto 'en' if manual missing
                if not selected_subs and 'en' in auto_captions:
                    selected_subs = auto_captions['en']
                
                if not selected_subs:
                    return None

                
                # The 'selected_subs' is a list of formats (vtt, srv3, json3). 
                # We need to *download* or *read* the content.
                # yt-dlp `extract_info` with `download=False` effectively gets metadata.
                # To actually GET the text without downloading a file is tricky.
                # We usually have to let it download to a temp file or use the JSON3 format URL.
                
                # SIMPLIFICATION for MVP:
                # Actually, `youtube-transcript-api` IS the best scraper. 
                # If that fails, `yt-dlp` mostly finds the same streams.
                # But sometimes `yt-dlp` handles IP rotation better if configured (which we aren't yet).
                # However, let's try the `get_transcript` method from `youtube_transcript_api` AGAIN but maybe with a proxy if available?
                # No, the user wants `yt-dlp`. 
                
                # Let's try to fetch the JSON3 url if available.
                json3_format = next((x for x in selected_subs if x['ext'] == 'json3'), None)
                if json3_format:
                     import requests
                     r = requests.get(json3_format['url'])
                     r.raise_for_status()
                     data = r.json()
                     
                     # Parse JSON3 to our format
                     transcript = []
                     if 'events' in data:
                        for event in data['events']:
                            if 'segs' in event and event['segs']:
                                text = "".join([s['utf8'] for s in event['segs'] if 'utf8' in s])
                                start = event.get('tStartMs', 0) / 1000.0
                                duration = event.get('dDurationMs', 0) / 1000.0
                                if text.strip():
                                    transcript.append({"text": text, "start": start, "duration": duration})
                     return transcript
                     
                return None
        except Exception as e:
            print(f"CRITICAL DEBUG: yt-dlp exception: {e}")
            import traceback
            traceback.print_exc()
            logger.error(f"yt-dlp fetch failed for {video_id}: {e}")
            return None

    def fetch_for_candidates(self, candidates: List[VideoCandidate], languages: List[str] = ['en']) -> List[VideoCandidate]:
        for cand in candidates:
            if not cand.is_shortlisted:
                continue
            
            # Rate Limit Defense: Add jitter
            time.sleep(random.uniform(1.0, 3.0))
            
            # Method 1: youtube-transcript-api
            try:
                # This returns Objects -> Convert to Dicts
                api = YouTubeTranscriptApi()
                try:
                    transcript_objects = api.list_transcripts(cand.video_id).find_transcript(['en']).fetch()
                except:
                     try:
                         transcript_objects = api.list_transcripts(cand.video_id).find_generated_transcript(['en']).fetch()
                     except:
                          # Fallback to old fetch method which auto-selects
                          try:
                              transcript_objects = api.fetch(cand.video_id) # Using fetch instance method from previous fix context
                          except AttributeError:
                               # If library version is mixed up, try static
                               transcript_objects = YouTubeTranscriptApi.get_transcript(cand.video_id)

                # Convert to dicts
                transcript_data = [
                    {"text": item['text'], "start": item['start'], "duration": item['duration']} 
                    if isinstance(item, dict) else 
                    {"text": item.text, "start": item.start, "duration": item.duration}
                    for item in transcript_objects
                ]
                
                cand.raw_transcript = transcript_data
                cand.transcript_available = True
                cand.transcript_fetched = True
                continue # Success!
                
            except Exception as e:
                logger.warning(f"Primary API failed for {cand.video_id}: {e}. Trying fallback... {type(e)}")
            
            # Method 2: yt-dlp Fallback
            fallback_data = self.fetch_with_ytdlp(cand.video_id)
            if fallback_data:
                logger.info(f"yt-dlp RESCUED {cand.video_id}")
                cand.raw_transcript = fallback_data
                cand.transcript_available = True
                cand.transcript_fetched = True
            else:
                logger.error(f"All transcript methods failed for {cand.video_id}")
                cand.transcript_available = False
                cand.is_shortlisted = False
                cand.rejection_reason = "No transcript (API+Backup failed)"
                
        return candidates

transcript_service = TranscriptService()
