import { useCallback } from 'react';
import { getCommits } from '../../lib/github.js';
import { useGitHub } from '../../hooks/useGitHub.js';
import { timeAgo } from '../../lib/format.js';
import { Loader, ErrorState } from '../../components/Feedback.jsx';
import { RefreshIcon } from '../../components/icons.jsx';

export default function CommitFeed() {
  const fetchCommits = useCallback(() => getCommits(25), []);
  const { data: commits, error, loading, refetch } = useGitHub(fetchCommits);

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <section className="panel">
      <header className="panel-head">
        <div className="panel-title">
          <h1>Commit feed</h1>
          <p className="panel-sub">The repo's pulse — most recent first.</p>
        </div>
        <div className="panel-actions">
          <button className="btn primary" onClick={refetch} disabled={loading}>
            <RefreshIcon size={16} />
            Refresh
          </button>
        </div>
      </header>

      {loading && !commits ? (
        <Loader />
      ) : (
        <ol className="commit-list">
          {(commits || []).map((c) => (
            <li key={c.sha} className="commit-row">
              {c.author?.avatar_url ? (
                <img className="avatar" src={c.author.avatar_url} alt="" width="32" height="32" />
              ) : (
                <span className="avatar placeholder" aria-hidden="true" />
              )}
              <div className="commit-body">
                <p className="commit-msg">{c.commit.message.split('\n')[0]}</p>
                <p className="commit-meta">
                  {c.commit.author?.name || 'unknown'} · {timeAgo(c.commit.author?.date)}
                </p>
              </div>
              <a
                className="sha-chip"
                href={c.html_url}
                target="_blank"
                rel="noreferrer"
                title="View on GitHub"
              >
                {c.sha.slice(0, 7)}
              </a>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
