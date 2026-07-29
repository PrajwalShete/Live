import { useCallback, useState } from 'react';
import { getFileText, REPO_URL, BRANCH } from '../../lib/github.js';
import { useGitHub, useAutoRefresh } from '../../hooks/useGitHub.js';
import { timeAgo } from '../../lib/format.js';
import { Loader, ErrorState } from '../../components/Feedback.jsx';

const CONTENT_PATH = 'content/index.html';
const INTERVALS = [
  { label: 'Auto-refresh off', value: 0 },
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
        <div>
          <h1>Reactor core</h1>
          <p className="panel-sub">
            Rendering <code>{CONTENT_PATH}</code> straight from GitHub — edit it,{' '}
            push, refresh.
          </p>
        </div>
        <div className="panel-actions">
          <span className="sync-note">{lastSync ? `synced ${timeAgo(lastSync.toISOString())}` : ''}</span>
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
          <button className="btn ghost" onClick={() => setShowSource((s) => !s)}>
            {showSource ? 'Rendered' : 'Source'}
          </button>
          <a
            className="btn ghost"
            href={`${REPO_URL}/edit/${BRANCH}/${CONTENT_PATH}`}
            target="_blank"
            rel="noreferrer"
          >
            Edit on GitHub ↗
          </a>
          <button className="btn primary" onClick={refetch} disabled={loading}>
            {loading ? 'Syncing…' : '⟳ Refresh'}
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
        <div className="render-frame-wrap">
          <iframe
            className="render-frame"
            title="Live repo content"
            sandbox="allow-popups"
            srcDoc={html}
          />
        </div>
      )}
    </section>
  );
}
