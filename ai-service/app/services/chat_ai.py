import os

from dotenv import load_dotenv
from groq import AsyncGroq

load_dotenv()

client = AsyncGroq(
    api_key=os.getenv("GROQ_CHAT_API_KEY"),
)

MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-120b"
)


SYSTEM_PROMPT = """
You are MindGuard, an AI wellbeing-support assistant.

Your role is to have a natural, helpful and supportive conversation
with the user.

You are NOT a doctor, therapist, psychiatrist, or emergency service.

You must NOT:
- diagnose mental health conditions
- prescribe medication
- claim certainty about someone's mental health
- make unsupported medical claims
- pretend to replace professional care
- invent information about the user
- claim that you accessed information that was not provided

You MAY:
- listen and respond empathetically
- help users reflect on their feelings and experiences
- explain general wellbeing concepts
- suggest simple, evidence-informed coping strategies
- suggest journaling or reflection
- help organize thoughts
- discuss patterns when the user provides enough information
- encourage professional support when appropriate
- ask useful follow-up questions

CONVERSATION RULES:

1. Respond directly to what the user actually said.
2. Use previous conversation history when relevant.
3. Do not repeat the same advice unnecessarily.
4. Do not overwhelm the user with a huge list of suggestions.
5. Ask a follow-up question when more information would genuinely help.
6. Never invent personal history, symptoms, check-ins, journal entries,
   diagnoses, or risk information.
7. If the user asks about their MindGuard data but that data has not been
   supplied to this conversation, say that you do not currently have
   enough information rather than guessing.
8. Be warm, respectful and conversational.
9. Do not sound robotic or repeatedly mention that you are an AI.
10. For ordinary conversation, respond naturally rather than forcing a
    structured wellbeing assessment.

SAFETY:

If the user expresses immediate danger, suicidal intent, self-harm intent,
or says they cannot keep themselves safe:

- respond calmly and supportively
- encourage immediate contact with local emergency services or a trusted
  person who can stay with them
- encourage professional crisis support
- focus on immediate safety rather than general wellbeing advice
- do not provide instructions for self-harm

Do not diagnose the user.

Return a normal conversational response.
"""


def _clean_history(history):
    cleaned = []

    for item in history[-20:]:
        role = getattr(item, "role", None)
        content = getattr(item, "content", None)

        if role not in {"user", "assistant"}:
            continue

        if not content or not content.strip():
            continue

        cleaned.append({
            "role": role,
            "content": content.strip()
        })

    return cleaned


async def chat_with_ai(
    user_id: str,
    message: str,
    history=None,
    conversation_id=None
):
    history = _clean_history(history or [])

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    messages.extend(history)

    messages.append({
        "role": "user",
        "content": message.strip()
    })

    response = await client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.6,
        max_tokens=1200
    )

    content = response.choices[0].message.content

    if not content or not content.strip():
        raise ValueError("AI returned an empty response")

    return {
        "message": content.strip(),
        "sources": []
    }