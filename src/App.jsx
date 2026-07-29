import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';
import LiveRenderer from './features/renderer/LiveRenderer.jsx';
import FileExplorer from './features/explorer/FileExplorer.jsx';
import CommitFeed from './features/commits/CommitFeed.jsx';
import StatsPanel from './features/stats/StatsPanel.jsx';

export const VIEWS = [
  { id: 'core', label: 'Reactor core', icon: '⚛' },
  { id: 'explorer', label: 'File explorer', icon: '🗂' },
  { id: 'commits', label: 'Commit feed', icon: '⏱' },
  { id: 'stats', label: 'Repo stats', icon: '📈' },
];

export default function App() {
  const [view, setView] = useState('core');

  return (
    <div className="shell">
      <Sidebar view={view} onNavigate={setView} />
      <div className="main">
        <TopBar />
        <main className="content" key={view}>
          {view === 'core' && <LiveRenderer />}
          {view === 'explorer' && <FileExplorer />}
          {view === 'commits' && <CommitFeed />}
          {view === 'stats' && <StatsPanel />}
        </main>
      </div>
    </div>
  );
}
