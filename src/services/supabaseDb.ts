import { supabase } from '../lib/supabase';
import {
  mapRowToPackage,
  mapPackageToRow,
  mapRowToAgent,
  mapAgentToRow,
  mapRowToMember,
  mapMemberToRow,
  mapRowToTransaction,
  mapTransactionToRow,
  mapRowToAdmin,
  mapAdminToRow
} from '../lib/mappers';
import {
  PACKAGES,
  AGENTS,
  INITIAL_MEMBERS,
  INITIAL_TRANSACTIONS,
  INITIAL_ADMINS
} from '../data/mockData';
import { ParcelPackage, Agent, Member, Transaction, AdminAccount } from '../types/parcel';

export interface LoadedDatabasePayload {
  packages: ParcelPackage[];
  agents: Agent[];
  members: Member[];
  transactions: Transaction[];
  admins: AdminAccount[];
  fromSupabase: boolean;
}

async function seedIfEmpty(
  table: string,
  rows: any[]
): Promise<boolean> {
  try {
    const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function fetchAllFromSupabase(): Promise<LoadedDatabasePayload> {
  try {
    const [pkgRes, agtRes, mbrRes, trxRes, admRes] = await Promise.all([
      supabase.from('packages').select('*').order('target_price', { ascending: true }),
      supabase.from('agents').select('*').order('created_at', { ascending: true }),
      supabase.from('members').select('*').order('created_at', { ascending: false }),
      supabase.from('transactions').select('*').order('created_at', { ascending: false }),
      supabase.from('admins').select('*').order('created_at', { ascending: true })
    ]);

    // If any core table is missing (e.g. PGRST205 before schema.sql is run), fail gracefully
    if (pkgRes.error || agtRes.error || mbrRes.error || trxRes.error) {
      const code = pkgRes.error?.code || mbrRes.error?.code;
      console.warn('[Supabase] Schema not ready or unreachable, using fallback:', code || pkgRes.error?.message);
      return {
        packages: PACKAGES,
        agents: AGENTS,
        members: INITIAL_MEMBERS,
        transactions: INITIAL_TRANSACTIONS,
        admins: INITIAL_ADMINS,
        fromSupabase: false
      };
    }

    let packages = (pkgRes.data || []).map(mapRowToPackage);
    let agents = (agtRes.data || []).map(mapRowToAgent);
    let members = (mbrRes.data || []).map(mapRowToMember);
    let transactions = (trxRes.data || []).map(mapRowToTransaction);
    let admins = (!admRes.error && admRes.data ? admRes.data : []).map(mapRowToAdmin);

    // Auto-seed empty tables on first connect
    if (packages.length === 0) {
      const ok = await seedIfEmpty('packages', PACKAGES.map(mapPackageToRow));
      packages = PACKAGES;
      if (ok) console.info('[Supabase] Seeded initial packages catalog.');
    }
    if (agents.length === 0) {
      const ok = await seedIfEmpty('agents', AGENTS.map(mapAgentToRow));
      agents = AGENTS;
      if (ok) console.info('[Supabase] Seeded initial agents.');
    }
    if (members.length === 0) {
      const ok = await seedIfEmpty('members', INITIAL_MEMBERS.map(mapMemberToRow));
      members = INITIAL_MEMBERS;
      if (ok) console.info('[Supabase] Seeded initial members.');
    }
    if (transactions.length === 0) {
      const ok = await seedIfEmpty('transactions', INITIAL_TRANSACTIONS.map(mapTransactionToRow));
      transactions = INITIAL_TRANSACTIONS;
      if (ok) console.info('[Supabase] Seeded initial transactions.');
    }
    if (!admRes.error && admins.length === 0) {
      const ok = await seedIfEmpty('admins', INITIAL_ADMINS.map(mapAdminToRow));
      admins = INITIAL_ADMINS;
      if (ok) console.info('[Supabase] Seeded initial admin account.');
    }

    return {
      packages,
      agents,
      members,
      transactions,
      admins: admins.length > 0 ? admins : INITIAL_ADMINS,
      fromSupabase: true
    };
  } catch (err) {
    console.warn('[Supabase] Direct fetch fallback active:', err);
    return {
      packages: PACKAGES,
      agents: AGENTS,
      members: INITIAL_MEMBERS,
      transactions: INITIAL_TRANSACTIONS,
      admins: INITIAL_ADMINS,
      fromSupabase: false
    };
  }
}

export async function upsertPackageInSupabase(pkg: ParcelPackage): Promise<boolean> {
  try {
    const { error } = await supabase.from('packages').upsert(mapPackageToRow(pkg), { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function upsertMemberInSupabase(member: Member): Promise<boolean> {
  try {
    const { error } = await supabase.from('members').upsert(mapMemberToRow(member), { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function upsertAgentInSupabase(agent: Agent): Promise<boolean> {
  try {
    const { error } = await supabase.from('agents').upsert(mapAgentToRow(agent), { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function upsertTransactionInSupabase(tx: Transaction): Promise<boolean> {
  try {
    const { error } = await supabase.from('transactions').upsert(mapTransactionToRow(tx), { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function upsertAdminInSupabase(admin: AdminAccount): Promise<boolean> {
  try {
    const { error } = await supabase.from('admins').upsert(mapAdminToRow(admin), { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteAdminInSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('admins').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}
