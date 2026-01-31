from openai import OpenAI
import json
from app.core.config import settings

client = OpenAI(
    api_key=settings.OPENAI_API_KEY,
    base_url=settings.OPENAI_BASE_URL
)

def generate_roadmap(topic: str, level: str, language: str = "English"):
    prompt = f"""
    Create a structured learning roadmap for "{topic}" at a "{level}" level in {language}.
    Return ONLY valid JSON with no markdown formatting.
    Structure:
    {{
        "title": "Course Title",
        "description": "Short overview",
        "estimated_time": "e.g. 4 weeks",
        "level": "{level}",
        "modules": [
            {{
                "title": "Module 1: Basics",
                "lessons": [
                    {{
                        "title": "Lesson 1 Title",
                        "description": "What will be covered",
                        "video_query": "Exact YouTube search query to find a video for this lesson"
                    }}
                ]
            }}
        ]
    }}
    """
    
    response = client.chat.completions.create(
        model="openai/gpt-4o-mini", 
        messages=[
            {"role": "system", "content": "You are an expert curriculum designer."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"},
        max_tokens=2000
    )
    
    content = response.choices[0].message.content
    return json.loads(content)
