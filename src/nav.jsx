import { BoltIcon, FolderIcon, CommitIcon, ChartIcon } from './components/icons.jsx';

export const VIEWS = [
  { id: 'core', label: 'Reactor core', short: 'Core', Icon: BoltIcon },
  { id: 'explorer', label: 'File explorer', short: 'Files', Icon: FolderIcon },
  { id: 'commits', label: 'Commit feed', short: 'Commits', Icon: CommitIcon },
  { id: 'stats', label: 'Repo stats', short: 'Stats', Icon: ChartIcon },
];
