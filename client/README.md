# MindGuard Frontend

A complete, runnable React + Vite frontend for **MindGuard**, an AI-powered mental
wellness early-warning and support platform. This is the frontend only - it talks
to the Node/Express + FastAPI backend through a configurable `VITE_API_URL`.

## Stack

React · Vite · Tailwind CSS · React Router · Axios · Framer Motion · Recharts · Lucide React

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
├── components/
│   ├── layout/       Navbar, Footer, Sidebar, Topbar, DashboardLayout, PublicLayout
│   ├── common/        Button, GlassCard, LoadingSpinner, EmptyState, ProtectedRoute…
│   ├── cards/         StatCard, RiskBadge, InsightCard
│   └── charts/        MoodTrendChart, MultiTrendChart, EmotionDonut, TriggerBarChart
├── pages/
│   ├── public/         Landing, About, HowItWorks, Privacy
│   ├── auth/            Login, Register
│   └── dashboard/     Dashboard, Checkin, Journal(+History/+Entry), Insights,
│                       Trends, WellnessPlan, Assistant, Support, Profile, Settings
├── services/          api.js + one file per domain (auth/checkin/journal/insight/wellness/support/chat)
├── context/           AuthContext (token + user state, protects /dashboard/*)
├── data/              mockData.js — single source of truth for mock content
└── utils/             small helpers (cn, etc.)
```

## Notes

- All wellbeing/risk language is intentionally framed as a **support signal, not a
  diagnosis** - see `RiskBadge` and the copy across Insights/Support pages.
- No AI provider keys or LLM calls happen in the browser - the `Assistant` page
  calls `services/chatApi.js`, which is meant to hit your backend's `/api/chat`.
- Reduced-motion is respected globally (see `index.css`).
- Every async page shows loading/empty/error states rather than blank screens.
