import { VIEWS } from '../App.jsx';
import { REPO, REPO_URL } from '../lib/github.js';

export default function Sidebar({ view, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="core-dot" aria-hidden="true" />
        <div>
          <div className="brand-name">Reactor Hub</div>
          <div className="brand-sub">live repo control room</div>
        </div>
      </div>

      <nav className="nav" aria-label="Views">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            className={`nav-item${view === v.id ? ' active' : ''}`}
            onClick={() => onNavigate(v.id)}
            aria-current={view === v.id ? 'page' : undefined}
          >
            <span className="nav-icon" aria-hidden="true">{v.icon}</span>
            {v.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <a href={REPO_URL} target="_blank" rel="noreferrer" className="repo-link">
          {REPO} ↗
        </a>
        <p className="foot-note">Every view fetches GitHub live — refresh and it re-reads the repo.</p>
      </div>
    </aside>
  );
}
