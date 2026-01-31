import sys
import logging
from app.services.video_pipeline.transcript_service import transcript_service
from app.services.video_pipeline.base import VideoCandidate

# Setup logging
logging.basicConfig(level=logging.INFO)

def test_ytdlp_fallback(video_id):
    print(f"Testing Transcript Fetch for: {video_id}")
    
    # Create a mock candidate
    cand = VideoCandidate(
        video_id=video_id,
        title="Test Video",
        channel_title="Test Channel",
        channel_id="UC_Test", # Missing required field
        published_at="2023-01-01", # Wrong field name in test
        duration_seconds=300, # Int required
        view_count=1000,
        is_shortlisted=True
    )
    
    # Run fetcher
    result = transcript_service.fetch_for_candidates([cand])
    
    if result[0].transcript_fetched:
        print("\nSUCCESS! Transcript fetched.")
        print(f"Sample: {result[0].raw_transcript[:2]}")
        print(f"Total entries: {len(result[0].raw_transcript)}")
    else:
        print(f"\nFAILURE. Reason: {result[0].rejection_reason}")

if __name__ == "__main__":
    # Test with a known video (use one that might have auto-caps)
    # This ID 'jNQXAC9IVRw' is 'Me at the zoo', usually has subs
    # Use Rick Roll 'dQw4w9WgXcQ' as it definitely has subs
    test_ytdlp_fallback("dQw4w9WgXcQ") 
