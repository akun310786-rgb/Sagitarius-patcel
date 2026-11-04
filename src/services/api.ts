/**
 * api.ts
 * Lapisan dasar untuk pemanggilan API.
 * Menyediakan base URL, default headers, dan credential handling.
 */

import { safeFetchJson, safePostJson, SafeFetchOptions } from '../utils/apiClient';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Wrapper untuk GET request dengan safeFetchJson
 */
export const apiGet = async <T>(
  url: string,
  fallback: T,
  options?: SafeFetchOptions
): Promise<T> => {
  const fullUrl = `${API_BASE}${url}`;
  return safeFetchJson<T>(fullUrl, fallback, options);
};

/**
 * Wrapper untuk POST request dengan safePostJson
 */
export const apiPost = async <T = any>(
  url: string,
  bodyData: any,
  options?: SafeFetchOptions
): Promise<any> => {
  const fullUrl = `${API_BASE}${url}`;
  return safePostJson<T>(fullUrl, bodyData, {}, options);
};

/**
 * Helper untuk menambahkan token/credential otomatis
 * (cookie sp_session sudah di-handle oleh browser secara otomatis dengan credentials: 'include' di safeFetch)
 */
export const setApiBaseUrl = (url: string) => {
  // Digunakan jika perlu override base URL di runtime
};