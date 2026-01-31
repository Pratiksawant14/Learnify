from openai import OpenAI
from app.core.config import settings

client = OpenAI(
    api_key=settings.OPENAI_API_KEY,
    base_url=settings.OPENAI_BASE_URL
)

class SummarizerService:
    @staticmethod
    def summarize_text(text: str):
        # Truncate if too long for simple MVP call
        max_len = 10000 
        truncated_text = text[:max_len]
        
        prompt = f"Summarize the following educational content into concise study notes:\n\n{truncated_text}"
        
        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful study assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500
        )
        return response.choices[0].message.content

summarizer_service = SummarizerService()
