import { VIEWS } from '../nav.jsx';

export default function Sidebar({ view, onNavigate }) {
  return (
    <aside className="sidebar">
      <nav className="nav" aria-label="Views">
        {VIEWS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-item${view === id ? ' active' : ''}`}
            onClick={() => onNavigate(id)}
            aria-current={view === id ? 'page' : undefined}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <p className="sidebar-note">
        Every view reads GitHub live — refresh re-reads the repo.
      </p>
    </aside>
  );
}
