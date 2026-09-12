from pydantic import BaseModel, Field
from typing import List, Optional


class JournalAnalysisRequest(BaseModel):
    userId: str
    text: str = Field(
        ...,
        min_length=1,
        max_length=20000
    )


class Emotion(BaseModel):
    name: str
    value: float


class Trigger(BaseModel):
    name: str
    value: float


class JournalAnalysisResponse(BaseModel):
    sentiment: str
    emotions: List[Emotion]
    themes: List[str]
    triggers: List[Trigger]
    insight: str
    insights: List[str]
    supportLevel: str


class CheckInData(BaseModel):
    id: str
    mood: float
    stressLevel: float
    energyLevel: float
    sleepHours: float
    sleepQuality: float
    focusLevel: float
    journalText: str = ""


class CheckInAnalysisRequest(BaseModel):
    userId: str
    checkIn: CheckInData


class AgentReasoningRequest(BaseModel):
    userId: str
    context: dict


class AgentReasoningResponse(BaseModel):
    observation: str
    reasoning: str
    action: str
    recommendation: str
    riskLevel: str
    followUpRequired: bool
    followUpQuestion: str = ""

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    userId: str
    conversationId: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=20000)
    history: List[ChatMessage] = []


class ChatResponse(BaseModel):
    message: str
    sources: List[str] = []