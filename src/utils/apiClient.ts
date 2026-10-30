/**
 * Safe API Client & Fetch Utility for Sagitarius Parcel
 * 
 * Provides robust error handling, request timeouts, and safe JSON parsing
 * to completely eliminate "Unexpected end of JSON input" errors and gracefully
 * fall back to mock/local data when the database or API is unreachable.
 */

export interface SafeFetchOptions extends RequestInit {
  timeoutMs?: number;
}

export interface SafeFetchResult<T> {
  data: T;
  ok: boolean;
  status: number;
  error: string | null;
}

/**
 * Fetch with detailed status, response text inspection, and timeout.
 * Guaranteed to NEVER throw SyntaxError: Unexpected end of JSON input.
 */
export async function safeFetchWithStatus<T>(
  url: string,
  fallback: T,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult<T>> {
  const { timeoutMs = 8000, headers, ...restOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...restOptions,
      signal: restOptions.signal || controller.signal,
      headers: {
        Accept: 'application/json, text/plain, */*',
        ...(headers || {})
      }
    });

    clearTimeout(timer);

    // Read response as text first to safely inspect content before parsing
    const rawText = await res.text();
    const trimmed = rawText.trim();

    // Check for empty body
    if (!trimmed) {
      return {
        data: fallback,
        ok: res.ok,
        status: res.status,
        error: res.ok ? null : `Server mengembalikan respon kosong (HTTP ${res.status})`
      };
    }

    // Safely parse JSON
    try {
      const parsed = JSON.parse(trimmed);
      if (!res.ok) {
        const errorMsg =
          typeof parsed === 'object' && parsed !== null && 'error' in parsed
            ? String((parsed as any).error)
            : `Permintaan gagal dengan status ${res.status}`;
        return {
          data: fallback,
          ok: false,
          status: res.status,
          error: errorMsg
        };
      }

      return {
        data: parsed as T,
        ok: true,
        status: res.status,
        error: null
      };
    } catch {
      // Body is not valid JSON (e.g. HTML error page or truncated data)
      console.warn(`[SafeFetch] Respon bukan JSON valid dari ${url} (${res.status}):`, trimmed.slice(0, 100));
      return {
        data: fallback,
        ok: false,
        status: res.status,
        error: `Respon server tidak valid atau terputus (HTTP ${res.status})`
      };
    }
  } catch (err: any) {
    clearTimeout(timer);
    const isTimeout = err?.name === 'AbortError';
    const errorMsg = isTimeout
      ? `Koneksi timeout setelah ${Math.round(timeoutMs / 1000)} detik`
      : (err?.message || 'Gagal menghubungi server backend');

    console.warn(`[SafeFetch] Network exception pada ${url}:`, errorMsg);
    return {
      data: fallback,
      ok: false,
      status: 0,
      error: errorMsg
    };
  }
}

/**
 * Fetch and return typed data directly, returning fallback on any error.
 * Ideal for initial data loading in useEffect.
 */
export async function safeFetchJson<T>(
  url: string,
  fallback: T,
  options?: SafeFetchOptions
): Promise<T> {
  const result = await safeFetchWithStatus<T>(url, fallback, options);
  return result.ok && result.data !== undefined && result.data !== null ? result.data : fallback;
}

/**
 * Safe POST request helper for JSON payloads with fallback.
 */
export async function safePostJson<T = any>(
  url: string,
  bodyData: any,
  fallback: T = {} as T,
  options?: SafeFetchOptions
): Promise<SafeFetchResult<T>> {
  return safeFetchWithStatus<T>(url, fallback, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    body: typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData),
    ...options
  });
}
