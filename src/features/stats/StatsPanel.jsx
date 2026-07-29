import { getRepo } from '../../lib/github.js';
import { useGitHub } from '../../hooks/useGitHub.js';
import { compact, timeAgo, fileSize } from '../../lib/format.js';
import { Loader, ErrorState } from '../../components/Feedback.jsx';
import { RefreshIcon } from '../../components/icons.jsx';

function StatTile({ label, value, sub }) {
  return (
    <div className="stat-tile">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export default function StatsPanel() {
  const { data: repo, error, loading, refetch } = useGitHub(getRepo);

  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (loading || !repo) return <Loader />;

  return (
    <section className="panel">
      <header className="panel-head">
        <div className="panel-title">
          <h1>Repo stats</h1>
          <p className="panel-sub">Vitals for {repo.full_name}, read live.</p>
        </div>
        <div className="panel-actions">
          <button className="btn primary" onClick={refetch}>
            <RefreshIcon size={16} />
            Refresh
          </button>
        </div>
      </header>

      <div className="stat-grid">
        <StatTile label="Stars" value={compact(repo.stargazers_count)} />
        <StatTile label="Forks" value={compact(repo.forks_count)} />
        <StatTile label="Open issues" value={compact(repo.open_issues_count)} />
        <StatTile label="Watchers" value={compact(repo.subscribers_count ?? repo.watchers_count)} />
        <StatTile label="Repo size" value={fileSize(repo.size * 1024)} />
        <StatTile label="Last push" value={timeAgo(repo.pushed_at)} sub={new Date(repo.pushed_at).toLocaleString()} />
      </div>

      <dl className="meta-list">
        <div><dt>Visibility</dt><dd>{repo.private ? 'private' : 'public'}</dd></div>
        <div><dt>Default branch</dt><dd>{repo.default_branch}</dd></div>
        <div><dt>Created</dt><dd>{new Date(repo.created_at).toLocaleDateString()}</dd></div>
        <div><dt>Language</dt><dd>{repo.language || '—'}</dd></div>
      </dl>
    </section>
  );
}
