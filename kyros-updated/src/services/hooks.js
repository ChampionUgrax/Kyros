import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
export function useFetch(path) {
  const [s, set] = useState({ data: null, loading: true, error: null });
  const load = useCallback(() => {
    if (!path) return;
    set((p) => ({ ...p, loading: true, error: null }));
    api.get(path).then((data) => set({ data, loading: false, error: null })).catch((e) => set({ data: null, loading: false, error: e.message }));
  }, [path]);
  useEffect(load, [load]);
  return { ...s, reload: load };
}
