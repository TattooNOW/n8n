# TattooNOW Show — Project State for New Session

**Source repo:** `TattooNOW/n8n` branch `claude/tattoonow-production-system-L2dnQ`
**Target repo:** `TattooNOW/tattoonow-show`
**Date:** 2026-02-17

---

## What This Project Is

A complete production system for the **TattooNOW Weekly Show** — a 52-week business education series for tattoo artists. It includes:

- A React marketing website (homepage, artist software page, network preview)
- A live-show slideshow system (OBS browser source + Google Slides-style presenter view)
- A run-of-show timeline page with presenter notes
- A show production backend (script generation, content calendar, episode data)
- Integration scaffolding for Supabase, HighLevel, Restream, Placid, and n8n

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19.2 + TypeScript |
| Build | Vite 7.2.4 |
| Styling | TailwindCSS 4.1 (dark theme) |
| Icons | lucide-react 0.563 |
| Routing | React Router DOM 7.13 |
| Database | Supabase (PostgreSQL) |
| Deployment | GitHub Pages via GitHub Actions |
| Base path | `/tattoonow-show/` |

---

## Directory Structure

```
├── .github/workflows/deploy.yml       # GH Pages deploy (push to main)
├── .env.example                       # Env var template
├── public/data/
│   ├── episode-1.json
│   ├── episode-2.json
│   ├── episode-2-with-script.json
│   └── episode-3-with-script.json
├── show-system/
│   ├── DEPLOYMENT.md                  # Production deployment guide
│   ├── README.md                      # Show system docs
│   ├── SYSTEM_PROMPT.md               # AI content creation guidelines
│   ├── templates/episode-script.md    # Master episode script template
│   ├── scripts/generate-script.js     # Script generator (placeholder replacement)
│   ├── sample/                        # Sample episode JSONs
│   ├── schemas/                       # Calendar + guest intake schemas
│   ├── presentations/                 # P1-P3 master presentations
│   ├── output/                        # Generated scripts & calendars
│   ├── supabase/schema.sql            # Database schema
│   └── integrations/                  # HighLevel, Placid, Restream, Shotstack
├── src/
│   ├── main.tsx                       # Entry point
│   ├── App.tsx                        # Router (/, /artist-software, /network-preview, /run-of-show, /slideshow)
│   ├── index.css                      # Global styles
│   ├── styles/brand.css               # Brand colors & typography
│   ├── lib/
│   │   ├── supabase.js                # Supabase client & helpers
│   │   └── utils.ts                   # Utility functions
│   ├── hooks/useEpisodeData.js        # Episode data loader hook
│   ├── components/
│   │   ├── Header.tsx                 # Nav header
│   │   ├── Footer.tsx                 # Footer
│   │   ├── ui/ (Button, Card, Section)
│   │   └── Slideshow/
│   │       ├── SlideController.jsx    # Master slideshow controller
│   │       ├── PresenterView.jsx      # Dual-view presenter mode
│   │       ├── LowerThird.jsx         # Lower-third overlay
│   │       ├── QRCode.jsx             # QR code overlay
│   │       ├── Timer.jsx              # Episode timer
│   │       ├── Clock.jsx
│   │       ├── PortfolioSlide.jsx
│   │       ├── EducationSlide.jsx
│   │       └── TitleCard.jsx
│   ├── slides/ScriptSlide.jsx
│   └── pages/
│       ├── Home.tsx                   # Marketing homepage
│       ├── ArtistSoftware.tsx         # Software features & pricing
│       ├── NetworkPreview.tsx         # Network preview
│       ├── Slideshow.jsx              # OBS browser source page
│       ├── RunOfShow.jsx              # Episode timeline
│       └── home/ (Hero, Audience, SocialProof, Features, Pricing, FAQ, Newsletter sections)
├── workflows/
│   ├── highlevel-guest-intake.json
│   └── rss-blog-to-segments.json
├── vite.config.ts                     # base: '/tattoonow-show/'
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
└── index.html
```

---

## Routes

| Path | Component | Purpose |
|---|---|---|
| `/` | Home.tsx | Marketing homepage |
| `/artist-software` | ArtistSoftware.tsx | Software features & pricing |
| `/network-preview` | NetworkPreview.tsx | Network preview |
| `/run-of-show` | RunOfShow.jsx | Episode timeline with presenter notes |
| `/slideshow?episode=X` | Slideshow.jsx | OBS browser source (audience view) |
| `/slideshow?episode=X&mode=presenter` | Slideshow.jsx | Presenter view (dual-pane) |

---

## Slideshow System

- **Audience view:** Clean 1920x1080 slides for OBS browser source
- **Presenter view:** Current slide + next preview + scrollable notes + toolbar (timer, clock, nav, overlay toggles)
- **Sync:** BroadcastChannel API (<100ms between windows)
- **Controls:** Arrow keys, PgUp/PgDn, Q (QR), L (lower-third), G (portfolio grid), T (timer), R (reset)
- **Stream Deck:** WebSocket on port 9000

---

## Show Format

- 40 minutes per episode
- Structure: Opening (3m) → Segment 1 (10m) → Ad Break (1m) → Segment 2 (10m) → Ad Break (1m) → Segment 3 (10m) → Closing (4m)
- 10-14 slides per episode
- 52 episodes with quarterly themes across 2026
- 13 episode categories with guest rotation

---

## Branding / Theme (Dark Mode)

- **Background:** `hsl(210 20% 6%)` dark blue-gray
- **Accent:** `hsl(195 98% 23%)` deep teal
- **Accent Light:** `hsl(197 47% 46%)` lighter teal/cyan
- **Font:** Inter (Google Fonts), weights 400-800
- **Logo:** "TattooNOW" with "NOW" in accent-light

---

## Environment Variables

See `.env.example` for full list. Key ones:
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — Supabase connection
- `HIGHLEVEL_API_KEY` / `HIGHLEVEL_LOCATION_ID` — CRM integration
- `RESTREAM_*` — Multi-platform streaming
- `PLACID_API_KEY` — Dynamic image generation
- `STREAMDECK_WEBSOCKET_PORT` — Stream Deck (default 9000)
- `VITE_USE_SUPABASE` / `VITE_USE_JSON_FALLBACK` — Feature flags

---

## GitHub Actions Deploy (.github/workflows/deploy.yml)

Triggers on push to `main`. Steps:
1. Checkout → Node 20 → npm install → npm run build → upload dist/ → deploy to GitHub Pages

---

## NPM Scripts

```
npm run dev      # Vite dev server
npm run build    # tsc -b && vite build
npm run lint     # ESLint
npm run preview  # Preview production build
```

---

## Commit History (Key Milestones)

1. **Initial site** — TattooNOW marketing pages with all sitemap routes
2. **Show production system** — 52-week content calendar, script templates, episode schemas
3. **Slideshow system** — OBS browser source with slides, overlays, keyboard control
4. **Supabase integration** — Database schema, real-time subscriptions, episode data hooks
5. **Service integrations** — HighLevel guest intake, Restream, Placid, n8n workflows
6. **Presenter mode** — Google Slides-style dual view with notes, timer, preview
7. **Presentations** — P1-P3 master slide decks (website, business ops, marketing)
8. **Run-of-show page** — Episode timeline with presenter notes
9. **GitHub Pages deploy** — Actions workflow, base path `/tattoonow-show/`

---

## Task for New Session

Push all code from `TattooNOW/n8n` branch `claude/tattoonow-production-system-L2dnQ` into `TattooNOW/tattoonow-show` repo's `main` branch and verify GitHub Pages deployment works at `https://tattoonow.github.io/tattoonow-show/`.

The base path in `vite.config.ts` is already set to `/tattoonow-show/`.
