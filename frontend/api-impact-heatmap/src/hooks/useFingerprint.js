import { useEffect, useRef, useState } from "react";
import { fetchFingerprint } from "../api";
export function useFingerprint(apiId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  useEffect(() => {
    if (!apiId) return;
    setLoading(true);
    setError(null);
    controllerRef.current?.abort();
    const c = new AbortController();
    controllerRef.current = c;
    fetchFingerprint(apiId, c.signal)
      .then((fp) => setData(fp))
      .catch((e) => setError(e?.message || "Failed to load"))
      .finally(() => setLoading(false));
    return () => c.abort();
  }, [apiId]);
  return { data, loading, error };
}
