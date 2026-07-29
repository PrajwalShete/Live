import { useCallback, useEffect, useRef, useState } from 'react';

// Wraps an async fetcher with loading / error / lastSync state and a refetch
// handle. `deps` re-runs the fetch; refetch() forces a fresh pull.
export function useGitHub(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const seq = useRef(0);

  const run = useCallback(async () => {
    const id = ++seq.current;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (id !== seq.current) return;
      setData(result);
      setLastSync(new Date());
    } catch (err) {
      if (id !== seq.current) return;
      setError(err);
    } finally {
      if (id === seq.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, error, loading, lastSync, refetch: run };
}

// Calls `fn` every `intervalMs` when interval > 0.
export function useAutoRefresh(fn, intervalMs) {
  useEffect(() => {
    if (!intervalMs) return;
    const id = setInterval(fn, intervalMs);
    return () => clearInterval(id);
  }, [fn, intervalMs]);
}
