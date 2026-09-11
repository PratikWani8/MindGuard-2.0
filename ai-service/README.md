# MindGuard AI Service 

## Overview

AI microservice for **MindGuard**, responsible for AI-powered analysis and insights.

## Tech Stack

* Python
* FastAPI
* Groq / LLM
* Pydantic
* Uvicorn

## Features

* AI-powered mental wellbeing analysis
* Text analysis and insights
* Risk assessment
* Personalized recommendations
* REST API endpoints

## Project Structure

```text
ai-service/
├── app/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── utils/
├── requirements.txt
├── .env
└── README.md
```

## Setup

```bash
cd ai-service
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Environment Variables

Create `.env`:

```env
GROQ_API_KEY=your_groq_api_key
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

Service:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

## Health Check

```http
GET /health
```

## Integration

The Node.js backend communicates with this AI service through HTTP APIs.

```text
Frontend
   ↓
Node.js / Express Backend
   ↓
MindGuard AI Service
   ↓
Groq / LLM
```
