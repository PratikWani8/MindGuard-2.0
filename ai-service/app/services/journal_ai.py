import json
import os

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-120b"
)


SYSTEM_PROMPT = """
You are MindGuard, a wellbeing-support journal analysis AI.

Analyze the user's journal text for emotional and wellbeing patterns.

IMPORTANT:
- Do NOT diagnose mental illnesses.
- Do NOT claim certainty about the user's mental health.
- Do NOT provide medical diagnoses.
- Use supportive, non-judgmental language.
- This is an observational wellbeing analysis only.

Return ONLY valid JSON with this exact structure:

{
  "sentiment": "positive | neutral | negative",

  "emotions": [
    {
      "name": "emotion name",
      "value": 0.0
    }
  ],

  "themes": [
    "theme1",
    "theme2"
  ],

  "triggers": [
    {
      "name": "trigger name",
      "value": 0.0
    }
  ],

  "insight": "one concise supportive observation",

  "insights": [
    "observation 1",
    "observation 2"
  ],

  "supportLevel": "stable | elevated | urgent_support"
}

Rules:

- emotions must contain 3 to 6 items.
- emotion values must be between 0 and 100.
- emotion values should approximately sum to 100.

- themes should contain 1 to 5 meaningful themes.

- triggers should contain 0 to 5 likely triggers explicitly
  suggested by the journal text.
- Trigger examples:
  academic pressure
  work deadlines
  relationship conflict
  loneliness
  financial concerns
  sleep problems
  family pressure
- Do NOT invent a trigger that is unsupported by the text.
- Trigger values must be between 0 and 100.
- Higher trigger value means stronger presence/relevance in the journal.

- Keep insight supportive and concise.

- supportLevel is an observational support indicator,
  NOT a diagnosis.

- Use urgent_support only when the text contains strong
  indications of immediate danger, self-harm, suicide,
  or inability to remain safe.
"""


async def analyze_journal(user_id: str, text: str):
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": f"""
User ID: {user_id}

Journal entry:
{text}
"""
            }
        ],
        temperature=0.2,
        response_format={
            "type": "json_object"
        }
    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"AI returned invalid JSON: {content}"
        ) from exc