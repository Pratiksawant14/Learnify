import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def check_courses():
    try:
        print(f"Fetching courses from {BASE_URL}/courses/ ...")
        res = requests.get(f"{BASE_URL}/courses/", timeout=30)
        if res.status_code != 200:
            print(f"Error fetching courses: {res.status_code} - {res.text}")
            return
            
        courses = res.json()
        print(f"Found {len(courses)} courses.")
        
        for i, c in enumerate(courses):
            print(f"\n[{i+1}] {c['title']} (ID: {c['id']})")
            roadmap = c.get('roadmap_json')
            if not roadmap:
                print("   WARNING: No roadmap_json found!")
            else:
                modules = roadmap.get('modules', [])
                print(f"   Modules: {len(modules)}")
                for m_idx, m in enumerate(modules):
                    lessons = m.get('lessons', [])
                    print(f"     Module {m_idx}: {len(lessons)} lessons")
                    for l_idx, l in enumerate(lessons):
                        vid = l.get('video_id') or l.get('videoId')
                        print(f"       Lesson {l_idx}: {l.get('title')} | VideoID: {vid}")
                
        # Check specific course if provided
        if len(sys.argv) > 1:
            cid = sys.argv[1]
            print(f"\nChecking details for {cid}...")
            res = requests.get(f"{BASE_URL}/courses/{cid}", timeout=5)
            print(res.text[:500])
            
    except Exception as e:
        print(f"Fatal error: {e}")

if __name__ == "__main__":
    check_courses()
