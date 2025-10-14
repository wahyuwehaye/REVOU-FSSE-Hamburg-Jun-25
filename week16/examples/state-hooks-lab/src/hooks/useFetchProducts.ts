import { useCallback, useEffect, useMemo, useState } from "react";

export type FetchStatus = "idle" | "loading" | "success" | "error";

export function useFetchProducts<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as T[];
      setData(json);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const state = useMemo(() => ({ data, status, error, refetch: fetchData }), [data, status, error, fetchData]);

  return state;
}
