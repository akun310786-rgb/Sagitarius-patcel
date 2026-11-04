/**
 * Unit Test: auth.ts
 * Menguji hashPassword dan verifyPassword
 */

import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../server/auth';

describe('hashPassword', () => {
  it('should return a scrypt hash string', async () => {
    const hash = await hashPassword('password123');
    expect(typeof hash).toBe('string');
    expect(hash).toStartWith('scrypt$');
  });

  it('should produce different hashes for same password (salt random)', async () => {
    const hash1 = await hashPassword('password123');
    const hash2 = await hashPassword('password123');
    expect(hash1).not.toBe(hash2);
  });
});

describe('verifyPassword', () => {
  it('should verify correct password', async () => {
    const hash = await hashPassword('password123');
    const isValid = await verifyPassword('password123', hash);
    expect(isValid).toBe(true);
  });

  it('should reject wrong password', async () => {
    const hash = await hashPassword('password123');
    const isValid = await verifyPassword('wrongpassword', hash);
    expect(isValid).toBe(false);
  });

  it('should reject invalid hash format', async () => {
    const isValid = await verifyPassword('password', 'invalid-hash-format');
    expect(isValid).toBe(false);
  });

  it('should reject empty password', async () => {
    const hash = await hashPassword('password123');
    const isValid = await verifyPassword('', hash);
    expect(isValid).toBe(false);
  });
});