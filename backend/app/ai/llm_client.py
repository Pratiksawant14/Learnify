import json
from app.ai.roadmap_generator import get_openai_client
from app.ai.prompts import LESSON_SPEC_PROMPT, COVERAGE_ANALYSIS_PROMPT, SUPPLEMENT_GENERATION_PROMPT
import logging

logger = logging.getLogger(__name__)

class LLMClient:
    def generate_lesson_spec(self, title: str, description: str) -> str:
        client = get_openai_client()
        content = LESSON_SPEC_PROMPT.format(title=title, description=description)
        try:
            response = client.chat.completions.create(
                model="openai/gpt-4o-mini",
                messages=[{"role": "user", "content": content}],
                max_tokens=200
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"LLM Error (Spec): {e}")
            return f"Teach: {title}" # Fallback

    def analyze_coverage(self, lesson_spec: str, transcript_text: str) -> dict:
        client = get_openai_client()
        content = COVERAGE_ANALYSIS_PROMPT.format(lesson_spec=lesson_spec, transcript_text=transcript_text[:4000]) # Truncate to avoid context limit
        try:
            response = client.chat.completions.create(
                model="openai/gpt-4o-mini",
                messages=[{"role": "user", "content": content}],
                response_format={"type": "json_object"},
                max_tokens=500
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            logger.error(f"LLM Error (Coverage): {e}")
            return {"score": 0.5, "reason": "Error in analysis", "covered_concepts": [], "missing_concepts": []}

    def generate_supplement(self, topic: str, level: str) -> str:
        client = get_openai_client()
        content = SUPPLEMENT_GENERATION_PROMPT.format(topic=topic, level=level)
        try:
            response = client.chat.completions.create(
                model="openai/gpt-4o-mini",
                messages=[{"role": "user", "content": content}],
                max_tokens=1500
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"LLM Error (Supplement): {e}")
            return "Content generation failed. Please check back later."

    def get_completion(self, messages: list, json_mode: bool = False) -> str:
        client = get_openai_client()
        kwargs = {
            "model": "openai/gpt-4o-mini",
            "messages": messages,
        }
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}
            
        try:
            response = client.chat.completions.create(**kwargs)
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"LLM Generics Error: {e}")
            raise e

llm_client = LLMClient()
