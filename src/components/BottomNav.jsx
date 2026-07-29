import { VIEWS } from '../nav.jsx';

export default function BottomNav({ view, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Views">
      {VIEWS.map(({ id, short, Icon }) => (
        <button
          key={id}
          className={`tab${view === id ? ' active' : ''}`}
          onClick={() => onNavigate(id)}
          aria-current={view === id ? 'page' : undefined}
          aria-label={short}
        >
          <Icon size={21} />
          <span className="tab-label">{short}</span>
        </button>
      ))}
    </nav>
  );
}
