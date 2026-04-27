# OpenClaw — Claude Instructions

## Design & Frontend Work

For ALL UI, design, frontend, component, page, dashboard, landing page, branding, or visual work in this repo, always follow the **Elite Design & Build Pipeline** (`/elite-design-pipeline`):

1. **Stitch** — UI/UX mockup and layout generation (glassmorphism, modern SaaS aesthetics)
2. **v0.dev** — Frontend refinement (Next.js, TailwindCSS, shadcn/ui)
3. **Claude Code** — Logic, architecture, API wiring, state management
4. **Nano Banana / Google Antigravity** — Creative enhancements and visual polish

### Design Standards
- Premium SaaS / glassmorphism aesthetic
- Dark/light mode capable
- Mobile responsive
- No duplicate components, no inconsistent spacing, no generic AI templates
- "Built by a top Silicon Valley product team" quality bar

### Default Stack
- React / Next.js + TypeScript
- TailwindCSS + shadcn/ui
- Framer Motion for animations
- Firebase for auth/backend (already scaffolded)
- API base: `http://187.124.66.30:18789`

## Project Context
- **App:** OpenClaw Command Center — glassmorphism SaaS dashboard
- **VPS:** Hostinger at `187.124.66.30`, Docker deployed on port 80
- **Branch:** `claude/access-hostinger-vps-Rugpg`
- **Deploy:** `docker compose up -d --build` from `/opt/openclaw` on VPS
