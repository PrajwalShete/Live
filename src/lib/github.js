// Direct browser → GitHub API client. No backend: every call hits
// api.github.com with cache disabled so each refresh shows the latest commit.

export const REPO = 'PrajwalShete/Live';
export const BRANCH = 'main';
export const REPO_URL = `https://github.com/${REPO}`;

const API = 'https://api.github.com';

async function gh(path, accept = 'application/vnd.github+json') {
  const res = await fetch(`${API}${path}`, {
    cache: 'no-store',
    headers: { Accept: accept },
  });
  if (!res.ok) {
    if (res.status === 403 || res.status === 429) {
      const reset = res.headers.get('x-ratelimit-reset');
      const at = reset ? new Date(Number(reset) * 1000).toLocaleTimeString() : 'soon';
      throw new Error(`GitHub rate limit reached — resets at ${at}. Ease off auto-refresh for a bit.`);
    }
    if (res.status === 404) throw new Error('Not found on GitHub — was the file moved or deleted?');
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res;
}

export async function getRepo() {
  return (await gh(`/repos/${REPO}`)).json();
}

export async function getTree() {
  const data = await (await gh(`/repos/${REPO}/git/trees/${BRANCH}?recursive=1`)).json();
  return data.tree.filter((n) => n.type === 'blob');
}

export async function getCommits(perPage = 20) {
  return (await gh(`/repos/${REPO}/commits?sha=${BRANCH}&per_page=${perPage}`)).json();
}

export async function getFileText(path) {
  const res = await gh(
    `/repos/${REPO}/contents/${encodeURIComponent(path).replaceAll('%2F', '/')}?ref=${BRANCH}`,
    'application/vnd.github.raw+json'
  );
  return res.text();
}
