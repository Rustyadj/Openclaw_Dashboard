# OpenClaw Command Center

Glassmorphism React/Vite dashboard shell for OpenClaw.

## Current launch status

| # | Area | Status | Notes |
|---|------|--------|-------|
| 1 | Replace mock datasets with real gateway/domain data | In progress | Zustand stores and typed API clients are wired for agents, chat, memory, workflows, documents, org, metrics, terminal, and settings. Local fallback data remains for offline/demo mode until the VPS wrapper routes are restarted and verified. |
| 2 | Finalize authentication policy | Done for current deployment | `VITE_AUTH_MODE=openclaw` is the default hosted policy. Firebase remains available for standalone deployments; `demo` is local-preview only. |
| 3 | Add loading, empty, and error states | In progress | Shared `useAsync`, `LoadingSpinner`, and `ErrorMessage` exist and are used by core async panels. Continue expanding empty states as each backend route moves from fallback to live data. |
| 4 | Profile performance with realistic payload sizes | Baseline complete | Routes are lazy-loaded with `React.lazy`/`Suspense`; latest production build splits pages into separate chunks and keeps the entry bundle under ~90 kB gzip. Full runtime profiling still needs real gateway payloads. |
| 5 | Refine mobile layouts for individual pages | In progress | Shell-level mobile navigation is in place. Dense desktop pages still need per-panel responsive tuning after live data shapes stabilize. |

## What changed before shipping

- Added a real gateway API integration point (`VITE_API_BASE_URL`) with live status polling.
- Added a top-level React error boundary so one bad component does not nuke the whole app.
- Added auth modes for OpenClaw-served UI, Firebase standalone auth, and local demo previews.
- Added a demo-auth escape hatch for local previews only (`VITE_AUTH_MODE=demo`).
- Added mobile nav handling so the shell is usable on smaller screens instead of instantly breaking.
- Fixed package compatibility by pinning React 18 so installs/builds work with the current dependency tree.
- Added Zustand-backed domain stores for agents, workflows, memory, org, settings, documents, and chat.
- Added typed API wrappers in `src/lib/api.ts` for the backend route contract.
- Added reusable async UI primitives: `useAsync`, `LoadingSpinner`, and `ErrorMessage`.
- Added route-level code splitting via `React.lazy` and `Suspense`.

## Open PR note

There is one old PR branch, but it is **not** a package-lock-only change. It includes Docker/VPS access files, CLAUDE.md, a design pipeline page, dark-theme redesigns, and broad UI edits. Do not merge it blindly into `main`; cherry-pick intentionally if any piece is still wanted.

## Setup

```bash
cp .env.example .env
npm install
npm run build
npm run dev
```

## Environment

See `.env.example`.

Minimum for a real standalone deployment:

```bash
VITE_API_BASE_URL=https://your-gateway.example.com
VITE_AUTH_MODE=firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
```

For OpenClaw-hosted deployment:

```bash
VITE_API_BASE_URL=
VITE_AUTH_MODE=openclaw
```

For local-only demo mode:

```bash
VITE_AUTH_MODE=demo
```

## Notes

- The dashboard tries `/health` and `/status` on the configured gateway base URL.
- In OpenClaw-hosted mode, the API client uses same-origin requests.
- The frontend API contract lives in `src/lib/api.ts`; backend routes should match those shapes instead of changing the client casually.
- When served by OpenClaw, auth mode should be `openclaw` so the app does not block behind a second auth wall.
