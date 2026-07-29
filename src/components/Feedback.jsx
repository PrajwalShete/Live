export function Loader({ label = 'Fetching from GitHub…' }) {
  return (
    <div className="feedback" role="status">
      <span className="spinner" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="feedback error" role="alert">
      <p>{error?.message || 'Something went wrong.'}</p>
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
