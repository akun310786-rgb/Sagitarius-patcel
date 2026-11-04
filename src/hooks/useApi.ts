/**
 * useApi.ts
 * Custom hook untuk pemanggilan API dengan loading state dan error handling.
 * Cocok digunakan di komponen yang perlu fetch data secara mandiri.
 */

import { useState, useCallback } from 'react';
import { safeFetchJson, safePostJson, SafeFetchOptions } from '../utils/apiClient';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchData = useCallback(
    async (url: string, fallback: T, options?: SafeFetchOptions): Promise<T> => {
      setState({ data: null, isLoading: true, error: null });
      try {
        const result = await safeFetchJson<T>(url, fallback, options);
        setState({ data: result, isLoading: false, error: null });
        return result;
      } catch (err: any) {
        const errorMsg = err?.message || 'Gagal memuat data.';
        setState({ data: fallback, isLoading: false, error: errorMsg });
        return fallback;
      }
    },
    []
  );

  const postData = useCallback(
    async <B = any>(
      url: string,
      body: B,
      options?: SafeFetchOptions
    ): Promise<{ ok: boolean; data: any; error: string | null }> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const result = await safePostJson(url, body, {}, options);
        setState({ data: null, isLoading: false, error: null });
        return { ok: result.ok, data: result.data, error: result.error || null };
      } catch (err: any) {
        const errorMsg = err?.message || 'Gagal mengirim data.';
        setState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
        return { ok: false, data: null, error: errorMsg };
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    fetchData,
    postData,
    reset,
  };
}