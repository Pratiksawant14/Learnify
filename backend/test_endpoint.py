import requests

try:
    print("Requesting transcript...")
    res = requests.get("http://127.0.0.1:8000/transcripts/dQw4w9WgXcQ", timeout=10)
    print(f"Status: {res.status_code}")
    print(res.text[:200])
except Exception as e:
    print(f"Error: {e}")
