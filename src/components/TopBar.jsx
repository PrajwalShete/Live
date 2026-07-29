import { BRANCH, REPO, REPO_URL, getRepo } from '../lib/github.js';
import { useGitHub } from '../hooks/useGitHub.js';
import { timeAgo } from '../lib/format.js';

export default function TopBar() {
  const { data: repo, error, loading } = useGitHub(getRepo);

  const status = error ? 'error' : loading ? 'sync' : 'online';
  const label = error ? 'Offline' : loading ? 'Syncing' : 'Live';

  return (
    <header className="topbar">
      <div className="topbar-side">
        <span className="core-dot" aria-hidden="true" />
        <span className="brand-name">Reactor&nbsp;Hub</span>
      </div>

      <a className="topbar-repo" href={REPO_URL} target="_blank" rel="noreferrer">
        <span className="repo-name">{REPO}</span>
        <span className="branch-chip">{BRANCH}</span>
      </a>

      <div className="topbar-side right">
        {repo && (
          <span className="topbar-meta">pushed {timeAgo(repo.pushed_at)}</span>
        )}
        <span className={`status-pill ${status}`}>
          <span className="pill-dot" aria-hidden="true" />
          {label}
        </span>
      </div>
    </header>
  );
}
