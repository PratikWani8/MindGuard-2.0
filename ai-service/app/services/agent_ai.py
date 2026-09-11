import os
import json
from groq import AsyncGroq

client = AsyncGroq(
    api_key=os.getenv("GROQ_Agent_API_KEY")
)

SYSTEM_PROMPT = """
You are the MindGuard AI Wellbeing Agent.

Your job is to analyze wellbeing signals and choose
an appropriate, safe and supportive next action.

You are a wellbeing support system, NOT a doctor.

You must NOT:
- diagnose mental health conditions
- prescribe medication
- make clinical diagnoses
- make unsupported medical claims
- pretend to replace a mental health professional

You MAY:
- identify wellbeing patterns
- summarize trends
- suggest general healthy coping activities
- suggest journaling
- create simple wellness goals
- recommend appropriate human/professional support
- ask supportive follow-up questions

AVAILABLE ACTIONS:

NO_ACTION
WELLNESS_ACTIVITY
JOURNAL_PROMPT
WELLNESS_PLAN
SUPPORT_RECOMMENDATION
FOLLOW_UP

RISK LEVELS:

stable
needs_attention
elevated
urgent_support

IMPORTANT:

Use the provided risk level and signals.
Do not invent information that is not present.

If risk is urgent_support, prioritize supportive
human/professional help and a follow-up.

Return ONLY valid JSON.

Required format:

{
    "observation": "What you noticed",
    "reasoning": "Why this pattern matters",
    "action": "One allowed action",
    "recommendation": "Supportive next step",
    "riskLevel": "stable",
    "followUpRequired": true,
    "followUpQuestion": "A short supportive question"
}
"""

async def reason_about_wellbeing(
    user_id: str,
    context: dict
):

    prompt = f"""
Analyze the following MindGuard user wellbeing context.

USER ID:
{user_id}

USER CONTEXT:
{json.dumps(context, indent=2, default=str)}

Analyze:

1. Recent wellbeing state
2. Mood trend
3. Stress trend
4. Sleep trend
5. Energy trend
6. Existing AI analysis
7. Existing risk level
8. Previous agent decisions

Determine the most appropriate next action.

Do not overreact to a single normal fluctuation.
Look for meaningful patterns.

Avoid unnecessarily repeating previous recommendations.

Return ONLY valid JSON.
"""

    response = await client.chat.completions.create(
        model="openai/gpt-oss-120b",

        temperature=0.2,

        response_format={
            "type": "json_object"
        },

        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response.choices[0].message.content

    result = json.loads(content)

    return result