<pre>
███╗   ███╗██╗███╗   ██╗██████╗  ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗
████╗ ████║██║████╗  ██║██╔══██╗██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗
██╔████╔██║██║██╔██╗ ██║██║  ██║██║  ███╗██║   ██║███████║██████╔╝██║  ██║
██║╚██╔╝██║██║██║╚██╗██║██║  ██║██║   ██║╚██╗ ██╔╝██╔══██║██╔══██╗██║  ██║
██║ ╚═╝ ██║██║██║ ╚████║██████╔╝╚██████╔╝ ╚████╔╝ ██║  ██║██║  ██║██████╔╝
╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝
</pre>

# 🧠 MindGuard 2.0

**MindGuard 2.0** is an AI-powered mental health and wellbeing platform designed to help users understand, monitor, and improve their emotional wellbeing through intelligent assessments, personalized insights, journaling, and continuous wellbeing tracking.

The platform combines a modern React interface, a secure Node.js backend, a MongoDB database, and a dedicated Python-based AI service to provide intelligent and personalized mental health support.

> **MindGuard is designed as a wellbeing and early-awareness platform and is not a replacement for professional medical or emergency care.**

---

## ✨ Key Features

### 📝 Mental Wellbeing Check-ins

- Daily wellbeing check-ins
- Mood and emotional state tracking
- Structured mental health assessments
- AI-powered analysis of check-in responses
- Personalized feedback based on user responses

### 🤖 AI-Powered Insights

- AI analysis of wellbeing data
- Natural-language emotional insights
- Personalized recommendations
- Context-aware responses
- Intelligent interpretation of journal entries and check-ins
- Risk-level assessment and awareness

### 📔 AI-Assisted Journaling

- Personal journal entries
- AI analysis of journal content
- Emotional pattern identification
- Supportive recommendations
- Historical journal tracking

### 📊 Wellbeing Dashboard

- Overall wellbeing overview
- Mood trends and analytics
- Historical check-in data
- Interactive charts
- Personalized insights
- Progress tracking

### 🔥 Daily Streak System

- Real-time wellbeing activity streak
- Streak increases when the user maintains daily activity
- Streak updates when the user opens and uses the platform
- Streak-break detection
- Helps encourage consistent wellbeing tracking

---

# 🛠️ Tech Stack

## Frontend

- **React**
- **Vite**
- **Tailwind CSS**
- **Axios**
- **Framer Motion**
- **Recharts**
- **Lucide React**

## Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT Authentication**
- **REST APIs**
- **Axios**

## AI Service

- **Python**
- **FastAPI**
- **Pydantic**
- **Groq / Large Language Model**
- AI-based wellbeing analysis

---

# 🏗️ System Architecture

MindGuard 2.0 follows a **three-tier architecture with a dedicated AI microservice**.

```text
                         ┌─────────────────────┐
                         │      User           │
                         │  Web / Mobile UI    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    React Client     │
                         │       Vite          │
                         │   Tailwind CSS      │
                         └──────────┬──────────┘
                                    │
                              REST API
                                    │
                                    ▼
                    ┌────────────────────────────┐
                    │     Node.js / Express      │
                    │         Backend            │
                    │                            │
                    │ Authentication             │
                    │ User Management            │
                    │ Check-ins                  │
                    │ Journaling                 │
                    │ Streak Management          │
                    │ Support Resources          │
                    │ API Management             │
                    └─────────────┬──────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
          ┌─────────────────┐        ┌──────────────────┐
          │    MongoDB      │        │   AI Service     │
          │    Database     │        │     FastAPI      │
          │                 │        │                  │
          │ Users           │        │ Check-in         │
          │ Check-ins       │        │ Analysis         │
          │ Journals        │        │                  │
          │ Streaks         │        │ Journal          │
          │ Resources       │        │ Analysis         │
          └─────────────────┘        │                  │
                                     │ Risk Assessment  │
                                     │ AI Insights      │
                                     └────────┬─────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │    Groq / LLM   │
                                     │   AI Inference  │
                                     └─────────────────┘
```

---
## ⭐ Support
If you found this project helpful, consider giving it a star ⭐ on GitHub!
