# MindGuard Backend

AI-powered mental wellness early-warning and support REST API.

## Stack

Node.js, Express, MongoDB/Mongoose, JWT, bcrypt, Helmet, CORS, compression, Morgan, rate limiting, dotenv.

## Setup

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux:

```bash
cp .env.example .env
npm install
npm run dev
```

The API runs on `http://localhost:5000`.

## AI integration

Node delegates AI work to FastAPI.

- `POST /api/v1/analyze/journal`
- `POST /api/v1/analyze/checkin`
- `POST /api/v1/chat`

The exact response should contain either the analysis fields directly or under `data`.

No ML model or LLM credential is stored in Node.

## Safety

AI results use support levels:

- `stable`
- `needs_attention`
- `elevated`
- `urgent_support`

No clinical diagnosis field is used. Risk events are recorded for safety review, but the backend does not automatically execute harmful real-world actions based solely on an AI prediction.

## API

See `docs/API.md`.

## Example registration

```json
{
  "name": "Aarav",
  "email": "aarav@example.com",
  "password": "StrongPass123",
  "age": 21
}
```

## Example check-in

```json
{
  "mood": 6,
  "stressLevel": 7,
  "energyLevel": 5,
  "sleepHours": 6.5,
  "sleepQuality": 5,
  "focusLevel": 6,
  "journalText": "I have several assignments this week."
}
```
