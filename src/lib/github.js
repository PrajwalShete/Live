// Direct browser → GitHub API client. No backend: every call hits
// api.github.com with cache disabled so each refresh shows the latest commit.

export const REPO = 'PrajwalShete/Live';
export const BRANCH = 'main';
export const REPO_URL = `https://github.com/${REPO}`;

// API base. Defaults to GitHub direct (unauthenticated, 60/hr per visitor IP).
// In production, point VITE_API_BASE at the CloudFront distribution that
// injects the Authorization header server-side — that value is just a URL,
// not a secret, so it is safe to set as a normal build env var.
const API = import.meta.env.VITE_API_BASE || 'https://api.github.com';
const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;

// Local-dev convenience only: a token in .env.local or localStorage. Never
// set VITE_GITHUB_TOKEN in a deployed build — Vite inlines it into the
// public bundle. Production auth belongs in the CloudFront origin header.
const TOKEN =
  import.meta.env.VITE_GITHUB_TOKEN ||
  (typeof localStorage !== 'undefined' && localStorage.getItem('reactor-hub:token')) ||
  null;

async function gh(path, accept = 'application/vnd.github+json') {
  const res = await fetch(`${API}${path}`, {
    cache: 'no-store',
    headers: {
      Accept: accept,
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
  if (!res.ok) {
    if (res.status === 403 || res.status === 429) {
      const reset = res.headers.get('x-ratelimit-reset');
      const at = reset ? new Date(Number(reset) * 1000).toLocaleTimeString() : 'soon';
      const err = new Error(
        `GitHub rate limit reached — resets at ${at}. Ease off auto-refresh for a bit.`
      );
      err.rateLimited = true;
      throw err;
    }
    if (res.status === 404) throw new Error('Not found on GitHub — was the file moved or deleted?');
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res;
}

// TopBar and StatsPanel both need repo metadata — share one in-flight
// request (20s window) so a page load costs a single API call.
let repoAt = 0;
let repoPromise = null;

export function getRepo() {
  if (repoPromise && Date.now() - repoAt < 20_000) return repoPromise;
  repoAt = Date.now();
  repoPromise = gh(`/repos/${REPO}`).then((r) => r.json());
  repoPromise.catch(() => {
    repoAt = 0;
  });
  return repoPromise;
}

export async function getTree() {
  const data = await (await gh(`/repos/${REPO}/git/trees/${BRANCH}?recursive=1`)).json();
  return data.tree.filter((n) => n.type === 'blob');
}

export async function getCommits(perPage = 20) {
  return (await gh(`/repos/${REPO}/commits?sha=${BRANCH}&per_page=${perPage}`)).json();
}

export async function getFileText(path) {
  const apiPath = `/repos/${REPO}/contents/${encodeURIComponent(path).replaceAll('%2F', '/')}?ref=${BRANCH}`;
  try {
    return await (await gh(apiPath, 'application/vnd.github.raw+json')).text();
  } catch (err) {
    if (!err.rateLimited) throw err;
    // The raw CDN isn't API-rate-limited; a cache-busting query keeps it
    // fresh. Content stays live even when the API quota is spent.
    const res = await fetch(`${RAW}/${path}?t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) return res.text();
    throw err;
  }
}
