/**
 * Unit Test: mockData.ts
 * Menguji integritas data paket, member, dan transaksi
 */

import { describe, it, expect } from 'vitest';
import {
  PACKAGES,
  AGENTS,
  INITIAL_MEMBERS,
  INITIAL_TRANSACTIONS,
  INITIAL_ADMINS,
} from '../data/mockData';

describe('PACKAGES', () => {
  it('should have at least one package', () => {
    expect(PACKAGES.length).toBeGreaterThan(0);
  });

  it('each package should have required fields', () => {
    PACKAGES.forEach((pkg) => {
      expect(pkg.id).toBeDefined();
      expect(pkg.name).toBeDefined();
      expect(pkg.category).toBeDefined();
      expect(pkg.targetPrice).toBeGreaterThan(0);
      expect(pkg.dailyPayment).toBeGreaterThan(0);
      expect(pkg.imageUrl).toBeDefined();
      expect(Array.isArray(pkg.items)).toBe(true);
    });
  });

  it('should have packages in all categories', () => {
    const categories = new Set(PACKAGES.map((p) => p.category));
    expect(categories.has('bunda')).toBe(true);
    expect(categories.has('anak')).toBe(true);
    expect(categories.has('pilihan')).toBe(true);
    expect(categories.has('uang')).toBe(true);
    expect(categories.has('satuan')).toBe(true);
  });

  it('imageUrl should not use /src/assets/ path', () => {
    PACKAGES.forEach((pkg) => {
      expect(pkg.imageUrl).not.toContain('/src/assets/');
      expect(pkg.imageUrl).toContain('/assets/');
    });
  });
});

describe('AGENTS', () => {
  it('should have at least one agent', () => {
    expect(AGENTS.length).toBeGreaterThan(0);
  });

  it('each agent should have required fields', () => {
    AGENTS.forEach((agent) => {
      expect(agent.id).toBeDefined();
      expect(agent.code).toBeDefined();
      expect(agent.name).toBeDefined();
      expect(agent.status).toBeDefined();
      expect(['Aktif', 'Non-aktif', 'Menunggu']).toContain(agent.status);
    });
  });
});

describe('INITIAL_MEMBERS', () => {
  it('should have at least one member', () => {
    expect(INITIAL_MEMBERS.length).toBeGreaterThan(0);
  });

  it('each member should have required fields', () => {
    INITIAL_MEMBERS.forEach((member) => {
      expect(member.id).toBeDefined();
      expect(member.memberCode).toBeDefined();
      expect(member.name).toBeDefined();
      expect(member.packageId).toBeDefined();
      expect(member.agentId).toBeDefined();
      expect(['Aktif', 'Lunas', 'Menunggu']).toContain(member.status);
    });
  });
});

describe('INITIAL_TRANSACTIONS', () => {
  it('should have at least one transaction', () => {
    expect(INITIAL_TRANSACTIONS.length).toBeGreaterThan(0);
  });

  it('each transaction should have required fields', () => {
    INITIAL_TRANSACTIONS.forEach((tx) => {
      expect(tx.id).toBeDefined();
      expect(tx.invoiceNo).toBeDefined();
      expect(tx.memberId).toBeDefined();
      expect(tx.amount).toBeGreaterThan(0);
      expect(tx.method).toBeDefined();
      expect(['Berhasil', 'Menunggu', 'Ditolak']).toContain(tx.status);
    });
  });
});

describe('INITIAL_ADMINS', () => {
  it('should have at least one admin', () => {
    expect(INITIAL_ADMINS.length).toBeGreaterThan(0);
  });

  it('each admin should have valid role', () => {
    INITIAL_ADMINS.forEach((admin) => {
      expect(['superadmin', 'admin', 'finance', 'staff']).toContain(admin.role);
      expect(['Aktif', 'Non-aktif']).toContain(admin.status);
    });
  });
});