import { useState } from 'react';
import { BRANCH, REPO } from '../lib/github.js';
import { useGitHub } from '../hooks/useGitHub.js';
import { getRepo } from '../lib/github.js';
import { timeAgo } from '../lib/format.js';

export default function TopBar() {
  const { data: repo, error, loading } = useGitHub(getRepo);
  const [now] = useState(() => new Date());

  const status = error ? 'error' : loading ? 'sync' : 'online';
  const label = error ? 'offline' : loading ? 'syncing' : 'online';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="crumb">{REPO}</span>
        <span className="branch-chip" title="tracked branch">{BRANCH}</span>
      </div>
      <div className="topbar-right">
        {repo && (
          <span className="topbar-meta">
            last push {timeAgo(repo.pushed_at)}
          </span>
        )}
        <span className={`status-pill ${status}`}>
          <span className="pill-dot" aria-hidden="true" />
          {label}
        </span>
      </div>
    </header>
  );
}
