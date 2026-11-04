/**
 * Unit Test: apiClient.ts
 * Menguji safeFetchJson, safePostJson, dan safeFetchWithStatus
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  safeFetchJson,
  safePostJson,
  safeFetchWithStatus,
} from '../utils/apiClient';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('safeFetchWithStatus', () => {
  it('should return parsed JSON data on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ message: 'success' }),
    });

    const result = await safeFetchWithStatus<any>('/api/test', null);
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ message: 'success' });
    expect(result.error).toBeNull();
  });

  it('should return fallback on empty body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => '',
    });

    const fallback = { data: 'fallback' };
    const result = await safeFetchWithStatus<any>('/api/test', fallback);
    expect(result.ok).toBe(true);
    expect(result.data).toEqual(fallback);
  });

  it('should return fallback on non-JSON response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => '<html>Error</html>',
    });

    const result = await safeFetchWithStatus<any>('/api/test', null);
    expect(result.ok).toBe(false);
    expect(result.data).toBeNull();
    expect(result.error).toContain('500');
  });

  it('should handle timeout', async () => {
    mockFetch.mockImplementationOnce(() =>
      new Promise(() => setTimeout(() => {}, 10000))
    );

    const result = await safeFetchWithStatus<any>('/api/test', null, {
      timeoutMs: 100,
    });
    expect(result.ok).toBe(false);
    expect(result.status).toBe(0);
    expect(result.error).toContain('timeout');
  });
});

describe('safePostJson', () => {
  it('should POST JSON data successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      text: async () => JSON.stringify({ id: '123', success: true }),
    });

    const result = await safePostJson('/api/test', { name: 'test' });
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ id: '123', success: true });

    // Verify fetch was called with POST method and JSON body
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ name: 'test' }),
      })
    );
  });
});

describe('safeFetchJson', () => {
  it('should return data on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify([{ id: '1', name: 'Item 1' }]),
    });

    const data = await safeFetchJson<any[]>('/api/items', []);
    expect(data).toEqual([{ id: '1', name: 'Item 1' }]);
  });

  it('should return fallback on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => JSON.stringify({ error: 'Not found' }),
    });

    const fallback = [{ id: 'fallback', name: 'Fallback' }];
    const data = await safeFetchJson<any[]>('/api/items', fallback);
    expect(data).toEqual(fallback);
  });
});