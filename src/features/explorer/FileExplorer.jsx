import { useCallback, useState } from 'react';
import { getTree, getFileText, REPO_URL, BRANCH } from '../../lib/github.js';
import { useGitHub } from '../../hooks/useGitHub.js';
import { fileSize } from '../../lib/format.js';
import { Loader, ErrorState } from '../../components/Feedback.jsx';
import { RefreshIcon, ExternalIcon, SearchIcon } from '../../components/icons.jsx';

const TEXT_EXT =
  /(\.(html?|css|js|jsx|ts|tsx|json|md|txt|yml|yaml|svg|py|rb|go|rs|sh|toml|xml|lock|webmanifest|env|cfg|ini)|\/?\.[a-z]+ignore|\/?\.[a-z]+rc)$/i;

function FileViewer({ path }) {
  const fetchFile = useCallback(() => getFileText(path), [path]);
  const { data, error, loading, refetch } = useGitHub(fetchFile, [path]);
  const [render, setRender] = useState(false);
  const isHtml = /\.html?$/i.test(path);

  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (loading || data == null) return <Loader label={`Opening ${path}…`} />;

  return (
    <div className="viewer">
      <div className="viewer-head">
        <code className="viewer-path">{path}</code>
        <div className="viewer-actions">
          {isHtml && (
            <button className="btn" onClick={() => setRender((r) => !r)}>
              {render ? 'Source' : 'Render'}
            </button>
          )}
          <a
            className="btn icon-btn"
            href={`${REPO_URL}/blob/${BRANCH}/${path}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Open on GitHub"
            title="Open on GitHub"
          >
            <ExternalIcon size={16} />
          </a>
        </div>
      </div>
      {render && isHtml ? (
        <iframe className="render-frame" title={path} sandbox="allow-popups" srcDoc={data} />
      ) : (
        <pre className="code-view"><code>{data}</code></pre>
      )}
    </div>
  );
}

export default function FileExplorer() {
  const { data: files, error, loading, refetch } = useGitHub(getTree);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const visible = (files || []).filter((f) =>
    f.path.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section className="panel">
      <header className="panel-head">
        <div className="panel-title">
          <h1>File explorer</h1>
          <p className="panel-sub">Live tree of the repo — tap a file to open it.</p>
        </div>
        <div className="panel-actions">
          <label className="search-box">
            <SearchIcon size={15} />
            <input
              className="search-input"
              placeholder="Filter files"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </label>
          <button className="btn primary" onClick={refetch} disabled={loading} aria-label="Refresh">
            <RefreshIcon size={16} />
          </button>
        </div>
      </header>

      <div className="explorer-grid">
        <div className="file-list" role="list">
          {loading && !files ? (
            <Loader />
          ) : (
            visible.map((f) => (
              <button
                key={f.path}
                role="listitem"
                className={`file-row${selected === f.path ? ' active' : ''}`}
                onClick={() => setSelected(f.path)}
                disabled={!TEXT_EXT.test(f.path)}
                title={TEXT_EXT.test(f.path) ? f.path : 'Binary file — view on GitHub'}
              >
                <span className="file-name">{f.path}</span>
                <span className="file-size">{fileSize(f.size)}</span>
              </button>
            ))
          )}
          {!loading && visible.length === 0 && (
            <p className="empty-note">No files match “{filter}”.</p>
          )}
        </div>
        <div className="file-pane">
          {selected ? (
            <FileViewer path={selected} />
          ) : (
            <div className="empty-pane">Select a file to inspect it.</div>
          )}
        </div>
      </div>
    </section>
  );
}
