# MindGuard API Contract

Base URL: `http://localhost:5000`

All JSON responses use:

```json
{ "success": true, "data": {}, "message": "..." }
```

Errors:

```json
{ "success": false, "message": "...", "errors": [] }
```

Protected routes require `Authorization: Bearer <JWT>`.

## Authentication

### POST `/api/auth/register`
Body:
```json
{"name":"Aarav","email":"aarav@example.com","password":"StrongPass123","age":21}
```

### POST `/api/auth/login`
Body:
```json
{"email":"aarav@example.com","password":"StrongPass123"}
```

### POST `/api/auth/logout`
Protected. Stateless logout response; client removes token.

### GET `/api/auth/me`
Protected.

## Check-ins

### POST `/api/checkins`
Body:
```json
{
  "mood": 7,
  "stressLevel": 5,
  "energyLevel": 6,
  "sleepHours": 7,
  "sleepQuality": 7,
  "focusLevel": 6,
  "journalText": "Busy day but manageable."
}
```

### GET `/api/checkins`
Optional `?limit=30`.

### GET `/api/checkins/:id`

### GET `/api/checkins/today`

### GET `/api/checkins/trends`
Optional `?limit=30`.

## Journals

- POST `/api/journals`
- GET `/api/journals`
- GET `/api/journals/:id`
- PUT `/api/journals/:id`
- DELETE `/api/journals/:id`

POST/PUT body:
```json
{"content":"Today felt productive, but I was stressed about exams."}
```

Creating a journal forwards its text to FastAPI and stores the returned AI analysis.

## Dashboard

### GET `/api/dashboard`

Returns the latest check-in, summary averages, mood/stress/sleep series, and recent AI insights.

## Insights

- GET `/api/insights/trends`
- GET `/api/insights/emotions`
- GET `/api/insights/recent`

## Wellness

- GET `/api/wellness`
- POST `/api/wellness`
- PUT `/api/wellness/:id`
- POST `/api/wellness/:id/progress`

Example:
```json
{
  "goals":["Improve sleep"],
  "recommendations":["Keep a consistent sleep schedule"],
  "activities":[
    {"title":"10-minute walk","description":"Walk outside","completed":false}
  ],
  "progress":20
}
```

## Support resources

### GET `/api/support/resources`
Optional `?category=sleep`.

## Chat

### POST `/api/chat`

Body:
```json
{
  "message":"I am feeling overwhelmed by my workload.",
  "conversationId":"optional-existing-conversation-id"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "message":"...",
    "sources":[],
    "conversationId":"..."
  },
  "message":"Chat response generated"
}
```

## Conversations

- GET `/api/conversations`
- GET `/api/conversations/:id`

## Risk events

### GET `/api/risk-events`

Returns the authenticated user's safety/escalation events.

## FastAPI contract expected by Node

### POST `/api/v1/analyze/journal`

Request:
```json
{"userId":"...","text":"..."}
```

Suggested response:
```json
{
  "sentiment":"negative",
  "emotions":{"anxiety":0.81,"stress":0.87,"sadness":0.34},
  "stressIndicators":["academic pressure"],
  "detectedTopics":["academic pressure","sleep"],
  "trendScore":0.42,
  "supportLevel":"elevated",
  "insights":["Recent language suggests increased stress."],
  "recommendations":["Consider a short break and reaching out to a trusted person."],
  "modelVersion":"mindguard-1.0"
}
```

### POST `/api/v1/analyze/checkin`

Request:
```json
{
  "userId":"...",
  "checkIn":{
    "id":"...",
    "mood":6,
    "stressLevel":7,
    "energyLevel":5,
    "sleepHours":6.5,
    "sleepQuality":5,
    "focusLevel":6,
    "journalText":"..."
  }
}
```

### POST `/api/v1/chat`

Request:
```json
{
  "userId":"...",
  "conversationId":"...",
  "message":"...",
  "history":[
    {"role":"user","content":"..."}
  ]
}
```

Response:
```json
{"message":"...","sources":[]}
```

## Ownership and privacy

All user-owned resources are queried using both resource ID and authenticated `userId`. This prevents one user from accessing another user's private check-ins, journals, conversations, wellness plans, or risk events.
