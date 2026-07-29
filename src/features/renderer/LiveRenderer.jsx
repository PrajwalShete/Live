import { useCallback, useState } from 'react';
import { getFileText, REPO_URL, BRANCH } from '../../lib/github.js';
import { useGitHub, useAutoRefresh } from '../../hooks/useGitHub.js';
import { timeAgo } from '../../lib/format.js';
import { Loader, ErrorState } from '../../components/Feedback.jsx';
import { RefreshIcon, ExternalIcon } from '../../components/icons.jsx';

const CONTENT_PATH = 'content/index.html';
const INTERVALS = [
  { label: 'Auto off', value: 0 },
  { label: 'Every 10s', value: 10_000 },
  { label: 'Every 30s', value: 30_000 },
  { label: 'Every 60s', value: 60_000 },
];

export default function LiveRenderer() {
  const fetchContent = useCallback(() => getFileText(CONTENT_PATH), []);
  const { data: html, error, loading, lastSync, refetch } = useGitHub(fetchContent);
  const [interval, setInterval] = useState(0);
  const [showSource, setShowSource] = useState(false);

  useAutoRefresh(refetch, interval);

  return (
    <section className="panel">
      <header className="panel-head">
        <div className="panel-title">
          <h1>Reactor core</h1>
          <p className="panel-sub">
            <code>{CONTENT_PATH}</code> rendered straight from GitHub
            {lastSync && <span className="sync-note"> · synced {timeAgo(lastSync.toISOString())}</span>}
          </p>
        </div>
        <div className="panel-actions">
          <select
            className="select"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            aria-label="Auto-refresh interval"
          >
            {INTERVALS.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
          <button className="btn" onClick={() => setShowSource((s) => !s)}>
            {showSource ? 'Rendered' : 'Source'}
          </button>
          <a
            className="btn icon-btn"
            href={`${REPO_URL}/edit/${BRANCH}/${CONTENT_PATH}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Edit on GitHub"
            title="Edit on GitHub"
          >
            <ExternalIcon size={16} />
          </a>
          <button className="btn primary" onClick={refetch} disabled={loading}>
            <RefreshIcon size={16} className={loading ? 'spin' : undefined} />
            Refresh
          </button>
        </div>
      </header>

      {error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : html == null ? (
        <Loader />
      ) : showSource ? (
        <pre className="code-view"><code>{html}</code></pre>
      ) : (
        <iframe
          className="render-frame"
          title="Live repo content"
          sandbox="allow-popups"
          srcDoc={html}
        />
      )}
    </section>
  );
}
