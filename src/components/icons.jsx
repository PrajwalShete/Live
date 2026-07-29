// Minimal stroke icon set — 24px grid, 1.8px stroke, round caps.

function Svg({ size = 20, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const BoltIcon = (p) => (
  <Svg {...p}>
    <path d="M13 2 3.5 14H10l-1 8 9.5-12H12l1-8z" />
  </Svg>
);

export const FolderIcon = (p) => (
  <Svg {...p}>
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.9l2 2h7.1A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9z" />
  </Svg>
);

export const CommitIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3.6" />
    <path d="M2 12h6.4M15.6 12H22" />
  </Svg>
);

export const ChartIcon = (p) => (
  <Svg {...p}>
    <path d="M5 20v-7M12 20V5M19 20v-10" />
  </Svg>
);

export const RefreshIcon = (p) => (
  <Svg {...p}>
    <path d="M20.5 11a8.5 8.5 0 1 0-.6 4.2" />
    <path d="M21 4.5V11h-6.5" />
  </Svg>
);

export const ExternalIcon = (p) => (
  <Svg {...p}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M19 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4.5" />
  </Svg>
);

export const SearchIcon = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.8-3.8" />
  </Svg>
);
