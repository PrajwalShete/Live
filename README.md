# ⚛️ Reactor Hub

A frontend-only React **PWA** that is a live control room for this repo.
Every view fetches **straight from the GitHub API on each refresh** — no
backend, no cache, no build-time data.

## Views

- **Reactor core** — renders `content/index.html` from GitHub in a sandboxed
  iframe, with manual refresh, auto-refresh (10/30/60s), and a source toggle.
  Edit the file on GitHub, push, refresh — it's there.
- **File explorer** — live repo tree with filtering; open any text file,
  render any HTML file.
- **Commit feed** — latest commits with author, relative time, and SHA links.
- **Repo stats** — stars, forks, issues, watchers, size, last push.

## Design

Premium-minimal dark control room. Mobile-first and fully responsive:

- **Mobile** — sticky blurred top bar + bottom tab bar (safe-area aware).
- **Desktop (≥880px)** — persistent sidebar navigation.
- Inline SVG stroke icons, validated dark-surface color tokens, reduced-motion
  support, focus-visible rings, 38px+ touch targets.

## PWA

Installable to the home screen (`manifest.webmanifest`, SVG + PNG icons,
maskable). A service worker (`public/sw.js`) caches the app shell and hashed
assets — **GitHub API calls are never cached**, so data stays live; the shell
still opens offline. The worker registers in production builds only.

## Architecture

```
index.html              Vite entry + PWA meta
content/index.html      The live content the hub renders
public/
├── manifest.webmanifest
├── sw.js               App-shell service worker
└── icons/              SVG + PNG app icons
src/
├── main.jsx            React bootstrap + SW registration
├── App.jsx             Shell + view switching
├── nav.jsx             View registry (id, label, icon)
├── lib/
│   ├── github.js       Browser → GitHub API client (cache: no-store)
│   └── format.js       timeAgo / compact numbers / file sizes
├── hooks/useGitHub.js  Fetch state machine + auto-refresh hook
├── components/         TopBar, Sidebar, BottomNav, icons, feedback states
├── features/
│   ├── renderer/       LiveRenderer (iframe srcDoc, sandboxed)
│   ├── explorer/       FileExplorer + FileViewer
│   ├── commits/        CommitFeed
│   └── stats/          StatsPanel (stat tiles)
└── styles/global.css   Design system + responsive layout
```

All GitHub calls go directly from the browser to `api.github.com`
(CORS-enabled) with `cache: 'no-store'`. Unauthenticated requests are limited
to **60/hr per IP** — the app surfaces the reset time when you hit it, and:

- Repo metadata is fetched once per page load (shared between views).
- If the API quota is spent, file content falls back to
  `raw.githubusercontent.com` with a cache-buster — the Reactor core keeps
  rendering live content even while rate-limited.
- Optional: put `VITE_GITHUB_TOKEN=<token>` in `.env.local` (gitignored) for
  5000/hr during local dev. **Never build/deploy with a token set** — Vite
  inlines it into the public bundle.

## Run it

```
npm install
npm run dev
```

Production build: `npm run build` → `dist/` (service worker active).
