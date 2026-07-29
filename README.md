# ⚛️ Reactor Hub

A frontend-only React control room for this repo. Every view fetches
**live from the GitHub API on each refresh** — no backend, no cache.

## Views

- **Reactor core** — renders `content/index.html` straight from GitHub in a
  sandboxed iframe, with manual refresh, auto-refresh (10/30/60s), and a
  source toggle. Edit the file on GitHub, push, refresh — it's there.
- **File explorer** — live repo tree with filtering; open any text file,
  render any HTML file.
- **Commit feed** — latest commits with author, relative time, and SHA links.
- **Repo stats** — stars, forks, issues, watchers, size, last push.

## Architecture

```
index.html            Vite entry
content/index.html    The live content the hub renders
src/
├── main.jsx          React bootstrap
├── App.jsx           Shell + view switching
├── lib/
│   ├── github.js     Browser → GitHub API client (cache: no-store)
│   └── format.js     timeAgo / compact numbers / file sizes
├── hooks/
│   └── useGitHub.js  Fetch state machine + auto-refresh hook
├── components/       Sidebar, TopBar, loading/error states
├── features/
│   ├── renderer/     LiveRenderer (iframe srcDoc, sandboxed)
│   ├── explorer/     FileExplorer + FileViewer
│   ├── commits/      CommitFeed
│   └── stats/        StatsPanel (stat tiles)
└── styles/global.css Dark control-room theme
```

All GitHub calls go directly from the browser to `api.github.com`
(CORS-enabled) with `cache: 'no-store'`, so a page refresh always shows the
latest commit. Unauthenticated requests are limited to 60/hr per IP — keep
auto-refresh modest.

## Run it

```
npm install
npm run dev
```

Build for production with `npm run build` (output in `dist/`).
