# VedaAI — AI Assessment Creator

Full-stack monorepo. Teachers create assignments, an AI generates structured question papers, and the result is delivered with real-time progress + PDF export.

## Stack

**Frontend** (`@vedai/frontend`)
- Next.js 16 + TypeScript (App Router)
- Tailwind CSS v4
- Zustand (form state)
- WebSocket (real-time job updates)

**Backend** (`@vedai/backend`)
- Node.js + Express + TypeScript (ESM)
- MongoDB (Mongoose) — stores assignments and generated papers
- Redis — caching and BullMQ broker
- BullMQ — background generation worker
- WebSockets (`ws`) — real-time progress fan-out via Redis pub/sub
- **Kiro** — OpenAI-compatible chat completions (configurable base URL)
- PDFKit — server-side PDF rendering

## Architecture

```
              ┌──────────────────┐
              │  Next.js (3000)  │
              │  Form + Zustand  │
              └─────────┬────────┘
                        │  HTTP + WebSocket
                        ▼
              ┌──────────────────┐         ┌────────────┐
              │  Express API     │◄───────►│  MongoDB   │
              │  (4000)          │         └────────────┘
              │  /api/...   /ws  │
              └─────────┬────────┘
                        │ enqueue                  ┌─────────┐
                        ├──────────────► BullMQ ──►│  Redis  │
                        │                          └─────────┘
                        │ subscribe (pub/sub)              ▲
                        ▼                                   │
              ┌──────────────────┐                          │
              │  Worker process  │──────── publish progress ┘
              │  (Kiro + parser) │
              └──────────────────┘
```

**Flow:** API request → assignment saved (`status:queued`) → BullMQ job enqueued → worker pulls job → builds prompt → calls Kiro → parses + validates JSON → stores `QuestionPaper` → publishes `completed` to Redis pub/sub → API server forwards to subscribed WebSocket clients → frontend refetches the paper.

## Getting started

### 1. Configure env

```bash
cp .env.example backend/.env
cp .env.example frontend/.env.local
```

Set `KIRO_API_KEY` (and optionally `KIRO_BASE_URL`, `KIRO_MODEL`) in `backend/.env`. Leave `AI_PROVIDER=mock` to run fully offline.

### 2. Start MongoDB + Redis

```bash
npm run stack:up      # docker compose up -d
```

### 3. Install + run everything

```bash
npm install
npm run dev           # runs API + worker + Next.js in parallel
```

Or run pieces individually:
```bash
npm run dev:api       # backend API on :4000
npm run dev:worker    # generation worker
npm run dev:web       # frontend on :3000
```

### Build + typecheck

```bash
npm run typecheck     # both workspaces
npm run build         # both workspaces
```

## API

| Method | Path                              | Purpose                       |
| ------ | --------------------------------- | ----------------------------- |
| GET    | `/api/assignments`                | List assignments              |
| POST   | `/api/assignments`                | Create + enqueue generation   |
| GET    | `/api/assignments/:id`            | Fetch a single assignment     |
| DELETE | `/api/assignments/:id`            | Delete assignment + paper     |
| GET    | `/api/assignments/:id/paper`      | Get generated question paper  |
| POST   | `/api/assignments/:id/regenerate` | Re-queue generation           |
| GET    | `/api/assignments/:id/pdf`        | Stream the paper as PDF       |
| WS     | `/ws?assignmentId=<id>`           | Subscribe to progress events  |

WebSocket events:
```ts
{ type: "queued",     assignmentId }
{ type: "processing", assignmentId, progress }
{ type: "completed",  assignmentId, resultId }
{ type: "failed",     assignmentId, error }
```

## Approach

**Pixel-perfect frontend.** Built against the Figma designs with attention to typography, spacing, color tokens, and component composition.

**Don't render raw LLM output.** Worker validates the model response with Zod (`backend/src/ai/parser.ts`), extracting the JSON object and rejecting anything that doesn't match the schema. Only the parsed structure is persisted — the raw response is also stored for debugging.

**Decoupled worker.** API and worker are separate processes sharing Mongo + Redis. The worker can scale horizontally via `WORKER_CONCURRENCY`; API stays responsive.

**Realtime via Redis pub/sub.** Worker publishes progress to a single Redis channel; the API server subscribes once and fans out to connected WebSocket clients. This works across multiple API replicas.

**Caching.** GET endpoints cache to Redis with a 5 min TTL; writes invalidate cache keys.

**Mock LLM provider.** No API key needed for local dev — set `AI_PROVIDER=mock` and the worker returns a deterministic question paper. Switch to `kiro` and provide `KIRO_API_KEY` to use the real model.

## Bonus features

- **PDF export** — server-side via PDFKit (`GET /api/assignments/:id/pdf`)
- **Progressive blur fade** — at the bottom of card lists for soft visual termination
- **Real-time updates** — WebSocket pub/sub from worker to client
- **Mock LLM fallback** — pipeline keeps working offline if Kiro fails or no key is set

## Layout

```
.
├── package.json                  # workspaces root
├── docker-compose.yml            # mongo + redis
├── .env.example                  # single source of truth for env
├── backend/
│   ├── src/
│   │   ├── ai/                   # prompt, parser, provider (Kiro)
│   │   ├── config/               # env, db, redis
│   │   ├── models/               # Mongoose schemas
│   │   ├── queue/                # BullMQ queues
│   │   ├── realtime/hub.ts       # WebSocket + Redis pub/sub
│   │   ├── routes/               # Express routes
│   │   ├── schemas/              # Zod validation
│   │   ├── services/             # business logic
│   │   ├── index.ts              # API entrypoint
│   │   └── worker.ts             # Generation worker
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/                  # Next.js App Router pages
    │   ├── components/           # UI by feature
    │   ├── lib/api/              # API client + WebSocket hook
    │   ├── lib/store/            # Zustand stores
    │   └── lib/mock/             # Local fallback data
    └── package.json
```

## Notes

- The frontend falls back to local mock data when the backend is unreachable, so the UI is always demo-ready.
- A malformed LLM response causes a job retry (Zod-validated parsing), not a crash.
- Set `WORKER_CONCURRENCY=N` to scale parallel generations.
