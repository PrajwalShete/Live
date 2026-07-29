import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';
import BottomNav from './components/BottomNav.jsx';
import LiveRenderer from './features/renderer/LiveRenderer.jsx';
import FileExplorer from './features/explorer/FileExplorer.jsx';
import CommitFeed from './features/commits/CommitFeed.jsx';
import StatsPanel from './features/stats/StatsPanel.jsx';

export default function App() {
  const [view, setView] = useState('core');

  return (
    <div className="app">
      <TopBar />
      <div className="body">
        <Sidebar view={view} onNavigate={setView} />
        <main className="content" key={view}>
          {view === 'core' && <LiveRenderer />}
          {view === 'explorer' && <FileExplorer />}
          {view === 'commits' && <CommitFeed />}
          {view === 'stats' && <StatsPanel />}
        </main>
      </div>
      <BottomNav view={view} onNavigate={setView} />
    </div>
  );
}
