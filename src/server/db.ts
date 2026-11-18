import { PACKAGES, AGENTS, INITIAL_MEMBERS, INITIAL_TRANSACTIONS, INITIAL_ADMINS } from '../data/mockData.js';
import { supabaseAdmin, isSupabaseConfigured } from './supabaseAdmin.js';

let lastError: string | null = null;
let isConnected = false;

// In-memory fallback cache (development only, when Supabase not configured)
let memPackages = [...PACKAGES];
let memAgents = [...AGENTS];
let memMembers = [...INITIAL_MEMBERS];
let memTransactions = [...INITIAL_TRANSACTIONS];
let memAdmins = [...INITIAL_ADMINS];

const TABLES = ['packages', 'agents', 'members', 'transactions', 'admins', 'auth_users', 'auth_sessions', 'rate_limits'] as const;

export async function getDb(): Promise<{ connected: boolean; error: string | null }> {
  if (!isSupabaseConfigured()) {
    lastError = 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set in environment';
    isConnected = false;
    return { connected: false, error: lastError };
  }
  try {
    const { error } = await supabaseAdmin.from('packages').select('count', { head: true });
    if (error && (error as any).code !== 'PGRST205') throw error;
    isConnected = true;
    lastError = null;
    console.log('[Supabase] Connected');
    return { connected: true, error: null };
  } catch (err: any) {
    isConnected = false;
    lastError = err?.message || String(err);
    return { connected: false, error: lastError };
  }
}

// ============================================================
// PACKAGES
// ============================================================
export async function getAllPackages(): Promise<any[]> {
  if (!isSupabaseConfigured()) return memPackages;
  try {
    const { data, error } = await supabaseAdmin.from('packages').select('*').order('target_price', { ascending: true });
    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      tag: row.tag,
      tier: row.tier,
      description: row.description,
      targetPrice: Number(row.target_price || 0),
      dailyPayment: Number(row.daily_payment || 0),
      weeklyPayment: Number(row.weekly_payment || 0),
      durationDays: row.duration_days,
      thrBonus: row.thr_bonus,
      bonusGift: row.bonus_gift,
      weight: row.weight,
      imageUrl: row.image_url,
      items: Array.isArray(row.items) ? row.items : [],
    }));
  } catch (e) {
    console.debug('[Supabase] Error getting packages:', e);
    return memPackages;
  }
}

export async function savePackage(pkg: any): Promise<any> {
  if (!isSupabaseConfigured()) {
    const idx = memPackages.findIndex((p) => p.id === pkg.id);
    if (idx >= 0) memPackages[idx] = pkg; else memPackages.push(pkg);
    return pkg;
  }
  try {
    const row = {
      id: pkg.id,
      name: pkg.name,
      category: pkg.category,
      tag: pkg.tag,
      tier: pkg.tier ?? null,
      description: pkg.description,
      target_price: Number(pkg.targetPrice || 0),
      daily_payment: Number(pkg.dailyPayment || 0),
      weekly_payment: Number(pkg.weeklyPayment || 0),
      duration_days: pkg.durationDays ?? 325,
      thr_bonus: pkg.thrBonus ?? null,
      bonus_gift: pkg.bonusGift ?? null,
      weight: pkg.weight,
      image_url: pkg.imageUrl,
      items: Array.isArray(pkg.items) ? pkg.items : [],
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabaseAdmin.from('packages').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return { ...pkg, id: pkg.id };
  } catch (e) {
    console.debug('[Supabase] Error saving package:', e);
    throw e;
  }
}

export async function deletePackage(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    memPackages = memPackages.filter((p) => p.id !== id);
    return true;
  }
  try {
    const { error } = await supabaseAdmin.from('packages').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.debug('[Supabase] Error deleting package:', e);
    return false;
  }
}

// ============================================================
// MEMBERS
// ============================================================
export async function getAllMembers(agentId?: string): Promise<any[]> {
  if (!isSupabaseConfigured()) {
    return agentId ? memMembers.filter((m) => m.agentId === agentId) : memMembers;
  }
  try {
    let query = supabaseAdmin.from('members').select('*').order('created_at', { ascending: false });
    if (agentId) query = query.eq('agent_id', agentId);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: row.id,
      memberCode: row.member_code,
      name: row.name,
      phone: row.phone,
      email: row.email,
      username: row.username,
      address: row.address,
      regency: row.regency,
      agentId: row.agent_id,
      agentName: row.agent_name,
      packageId: row.package_id,
      packageName: row.package_name,
      packagePrice: Number(row.package_price || 0),
      totalSaved: Number(row.total_saved || 0),
      lastDepositAmount: Number(row.last_deposit_amount || 0),
      lastDepositDate: row.last_deposit_date,
      status: row.status,
      joinDate: row.join_date,
      pickupDate: row.pickup_date,
      qrToken: row.qr_token,
    }));
  } catch (e) {
    console.debug('[Supabase] Error getting members:', e);
    return agentId ? memMembers.filter((m) => m.agentId === agentId) : memMembers;
  }
}

export async function saveMember(member: any): Promise<any> {
  if (!isSupabaseConfigured()) {
    const idx = memMembers.findIndex((m) => m.id === member.id);
    if (idx >= 0) memMembers[idx] = member; else memMembers.push(member);
    return member;
  }
  try {
    const row = {
      id: member.id,
      member_code: member.memberCode,
      name: member.name,
      phone: member.phone,
      email: member.email ?? null,
      username: member.username ?? null,
      password: member.password ?? null,
      address: member.address,
      regency: member.regency,
      agent_id: member.agentId,
      agent_name: member.agentName,
      package_id: member.packageId,
      package_name: member.packageName,
      package_price: Number(member.packagePrice || 0),
      total_saved: Number(member.totalSaved || 0),
      last_deposit_amount: Number(member.lastDepositAmount || 0),
      last_deposit_date: member.lastDepositDate || '',
      status: member.status || 'Aktif',
      join_date: member.joinDate || '',
      pickup_date: member.pickupDate || '',
      qr_token: member.qrToken || '',
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabaseAdmin.from('members').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return { ...member, id: member.id };
  } catch (e) {
    console.debug('[Supabase] Error saving member:', e);
    throw e;
  }
}

export async function updateMember(id: string, updates: Partial<any>): Promise<any> {
  if (!isSupabaseConfigured()) {
    const idx = memMembers.findIndex((m) => m.id === id);
    if (idx >= 0) {
      memMembers[idx] = { ...memMembers[idx], ...updates };
      return memMembers[idx];
    }
    throw new Error('Member not found');
  }
  try {
    const row: any = { ...updates, updated_at: new Date().toISOString() };
    if (updates.memberCode) row.member_code = updates.memberCode;
    if (updates.memberName) row.member_name = updates.memberName;
    if (updates.packageId) row.package_id = updates.packageId;
    if (updates.packageName) row.package_name = updates.packageName;
    if (updates.packagePrice) row.package_price = updates.packagePrice;
    if (updates.totalSaved !== undefined) row.total_saved = updates.totalSaved;
    if (updates.lastDepositAmount !== undefined) row.last_deposit_amount = updates.lastDepositAmount;
    if (updates.lastDepositDate) row.last_deposit_date = updates.lastDepositDate;
    if (updates.status) row.status = updates.status;
    if (updates.joinDate) row.join_date = updates.joinDate;
    if (updates.pickupDate) row.pickup_date = updates.pickupDate;
    if (updates.qrToken) row.qr_token = updates.qrToken;

    const { data, error } = await supabaseAdmin.from('members').update(row).eq('id', id).select().single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.debug('[Supabase] Error updating member:', e);
    throw e;
  }
}

// ============================================================
// AGENTS
// ============================================================
export async function getAllAgents(): Promise<any[]> {
  if (!isSupabaseConfigured()) return memAgents;
  try {
    const { data, error } = await supabaseAdmin.from('agents').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      storeName: row.store_name,
      ownerName: row.owner_name,
      district: row.district,
      regency: row.regency,
      phone: row.phone,
      memberCount: Number(row.member_count || 0),
      totalOmset: Number(row.total_omset || 0),
      status: row.status,
    }));
  } catch (e) {
    console.debug('[Supabase] Error getting agents:', e);
    return memAgents;
  }
}

export async function saveAgent(agent: any): Promise<any> {
  if (!isSupabaseConfigured()) {
    const idx = memAgents.findIndex((a) => a.id === agent.id);
    if (idx >= 0) memAgents[idx] = agent; else memAgents.push(agent);
    return agent;
  }
  try {
    const row = {
      id: agent.id,
      code: agent.code,
      name: agent.name,
      store_name: agent.storeName,
      owner_name: agent.ownerName,
      district: agent.district,
      regency: agent.regency,
      phone: agent.phone,
      member_count: Number(agent.memberCount || 0),
      total_omset: Number(agent.totalOmset || 0),
      status: agent.status || 'Aktif',
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabaseAdmin.from('agents').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return { ...agent, id: agent.id };
  } catch (e) {
    console.debug('[Supabase] Error saving agent:', e);
    throw e;
  }
}

export async function deleteAgent(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    memAgents = memAgents.filter((a) => a.id !== id);
    return true;
  }
  try {
    const { error } = await supabaseAdmin.from('agents').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.debug('[Supabase] Error deleting agent:', e);
    return false;
  }
}

// ============================================================
// TRANSACTIONS
// ============================================================
export async function getAllTransactions(filters?: { memberId?: string; agentId?: string; status?: string }): Promise<any[]> {
  if (!isSupabaseConfigured()) {
    let result = memTransactions;
    if (filters?.memberId) result = result.filter((t) => t.memberId === filters.memberId);
    if (filters?.agentId) result = result.filter((t) => t.agentId === filters.agentId);
    if (filters?.status) result = result.filter((t) => t.status === filters.status);
    return result;
  }
  try {
    let query = supabaseAdmin.from('transactions').select('*').order('created_at', { ascending: false });
    if (filters?.memberId) query = query.eq('member_id', filters.memberId);
    if (filters?.agentId) query = query.eq('agent_id', filters.agentId);
    if (filters?.status) query = query.eq('status', filters.status);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: row.id,
      invoiceNo: row.invoice_no,
      memberId: row.member_id,
      memberName: row.member_name,
      memberCode: row.member_code,
      packageName: row.package_name,
      agentId: row.agent_id,
      agentName: row.agent_name,
      amount: Number(row.amount || 0),
      method: row.method,
      date: row.date,
      status: row.status,
      notes: row.notes,
      proofUrl: row.proof_url,
    }));
  } catch (e) {
    console.debug('[Supabase] Error getting transactions:', e);
    return [];
  }
}

export async function saveTransaction(tx: any): Promise<any> {
  if (!isSupabaseConfigured()) {
    memTransactions.push(tx);
    return tx;
  }
  try {
    const row = {
      id: tx.id,
      invoice_no: tx.invoiceNo,
      member_id: tx.memberId,
      member_name: tx.memberName,
      member_code: tx.memberCode,
      package_name: tx.packageName,
      agent_id: tx.agentId,
      agent_name: tx.agentName,
      amount: Number(tx.amount || 0),
      method: tx.method,
      date: tx.date,
      status: tx.status || 'Menunggu',
      notes: tx.notes ?? null,
      proof_url: tx.proofUrl ?? null,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabaseAdmin.from('transactions').insert(row).select().single();
    if (error) throw error;
    return { ...tx, id: data.id };
  } catch (e) {
    console.debug('[Supabase] Error saving transaction:', e);
    throw e;
  }
}

export async function approveTransaction(id: string, notes?: string): Promise<any> {
  if (!isSupabaseConfigured()) {
    const tx = memTransactions.find((t) => t.id === id);
    if (!tx) throw new Error('Transaction not found');
    tx.status = 'Berhasil';
    if (notes) tx.notes = notes;
    return tx;
  }
  try {
    const { data: txData, error: txError } = await supabaseAdmin.from('transactions')
      .update({ status: 'Berhasil', notes: notes ?? null, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (txError) throw txError;

    // Update member's totalSaved
    if (txData) {
      const { data: memberData, error: memberError } = await supabaseAdmin.from('members').select('*').eq('id', txData.member_id).maybeSingle();
      if (!memberError && memberData) {
        const newTotalSaved = Number(memberData.total_saved || 0) + Number(txData.amount || 0);
        const newStatus = newTotalSaved >= Number(memberData.package_price || 0) ? 'Lunas' : 'Aktif';
        await supabaseAdmin.from('members').update({
          total_saved: newTotalSaved,
          last_deposit_amount: Number(txData.amount || 0),
          last_deposit_date: txData.date,
          status: newStatus,
          updated_at: new Date().toISOString(),
        }).eq('id', txData.member_id);
      }
    }

    return txData;
  } catch (e) {
    console.debug('[Supabase] Error approving transaction:', e);
    throw e;
  }
}

export async function rejectTransaction(id: string): Promise<any> {
  if (!isSupabaseConfigured()) {
    const tx = memTransactions.find((t) => t.id === id);
    if (!tx) throw new Error('Transaction not found');
    tx.status = 'Ditolak';
    return tx;
  }
  try {
    const { data, error } = await supabaseAdmin.from('transactions')
      .update({ status: 'Ditolak', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.debug('[Supabase] Error rejecting transaction:', e);
    throw e;
  }
}

// ============================================================
// ADMINS
// ============================================================
export async function getAllAdmins(): Promise<any[]> {
  if (!isSupabaseConfigured()) return memAdmins;
  try {
    const { data, error } = await supabaseAdmin.from('admins').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      role: row.role,
      roleLabel: row.role_label,
      phone: row.phone,
      createdAt: row.created_at,
      status: row.status,
    }));
  } catch (e) {
    console.debug('[Supabase] Error getting admins:', e);
    return memAdmins;
  }
}

export async function saveAdmin(admin: any): Promise<any> {
  if (!isSupabaseConfigured()) {
    const idx = memAdmins.findIndex((a) => a.id === admin.id);
    if (idx >= 0) memAdmins[idx] = admin; else memAdmins.push(admin);
    return admin;
  }
  try {
    const row = {
      id: admin.id,
      name: admin.name,
      username: admin.username,
      email: admin.email,
      password: admin.password ?? null,
      role: admin.role || 'staff',
      role_label: admin.roleLabel,
      phone: admin.phone ?? null,
      created_at: admin.createdAt,
      status: admin.status || 'Aktif',
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabaseAdmin.from('admins').upsert(row, { onConflict: 'id' }).select().single();
    if (error) throw error;
    return { ...admin, id: data.id };
  } catch (e) {
    console.debug('[Supabase] Error saving admin:', e);
    throw e;
  }
}

export async function deleteAdmin(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    memAdmins = memAdmins.filter((a) => a.id !== id);
    return true;
  }
  try {
    const { error } = await supabaseAdmin.from('admins').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.debug('[Supabase] Error deleting admin:', e);
    return false;
  }
}

export async function toggleAdminStatus(id: string, status: 'Aktif' | 'Non-aktif'): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const idx = memAdmins.findIndex((a) => a.id === id);
    if (idx >= 0) memAdmins[idx].status = status;
    return true;
  }
  try {
    const { error } = await supabaseAdmin.from('admins')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (e) {
    console.debug('[Supabase] Error toggling admin status:', e);
    return false;
  }
}

export async function getDbStatus(): Promise<any> {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      database: 'sagitarius_parcel (fallback)',
      maskedUri: 'supabase-not-configured',
      collections: TABLES.map((t) => ({ name: t, count: 0 })),
      error: lastError,
      needsIpWhitelist: false,
    };
  }
  try {
    const collections: { name: string; count: number }[] = [];
    for (const table of TABLES) {
      try {
        const { count, error } = await supabaseAdmin.from(table).select('*', { head: true, count: 'exact' });
        if (!error) {
          collections.push({ name: table, count: count || 0 });
        }
      } catch {}
    }
    return {
      connected: true,
      database: 'sagitarius_parcel',
      maskedUri: 'supabase-connected',
      collections,
      error: null,
      needsIpWhitelist: false,
    };
  } catch (e: any) {
    return { connected: false, database: 'sagitarius_parcel', maskedUri: '', collections: [], error: e?.message, needsIpWhitelist: false };
  }
}

export async function forceSeed(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, message: 'Supabase belum dikonfigurasi.' };
  }
  try {
    await supabaseAdmin.from('packages').insert(PACKAGES.map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      tag: p.tag,
      tier: p.tier,
      description: p.description,
      target_price: p.targetPrice,
      daily_payment: p.dailyPayment,
      weekly_payment: p.weeklyPayment,
      duration_days: p.durationDays,
      thr_bonus: p.thrBonus,
      bonus_gift: p.bonusGift,
      weight: p.weight,
      image_url: p.imageUrl,
      items: p.items,
    })));
    await supabaseAdmin.from('agents').insert(AGENTS.map((a: any) => ({
      id: a.id,
      code: a.code,
      name: a.name,
      store_name: a.storeName,
      owner_name: a.ownerName,
      district: a.district,
      regency: a.regency,
      phone: a.phone,
      member_count: a.memberCount,
      total_omset: a.totalOmset,
      status: a.status,
    })));
    await supabaseAdmin.from('members').insert(INITIAL_MEMBERS.map((m: any) => ({
      id: m.id,
      member_code: m.memberCode,
      name: m.name,
      phone: m.phone,
      email: m.email,
      username: m.username,
      address: m.address,
      regency: m.regency,
      agent_id: m.agentId,
      agent_name: m.agentName,
      package_id: m.packageId,
      package_name: m.packageName,
      package_price: m.packagePrice,
      total_saved: m.totalSaved,
      last_deposit_amount: m.lastDepositAmount,
      last_deposit_date: m.lastDepositDate,
      status: m.status,
      join_date: m.joinDate,
      pickup_date: m.pickupDate,
      qr_token: m.qrToken,
    })));
    await supabaseAdmin.from('transactions').insert(INITIAL_TRANSACTIONS.map((t: any) => ({
      id: t.id,
      invoice_no: t.invoiceNo,
      member_id: t.memberId,
      member_name: t.memberName,
      member_code: t.memberCode,
      package_name: t.packageName,
      agent_id: t.agentId,
      agent_name: t.agentName,
      amount: t.amount,
      method: t.method,
      date: t.date,
      status: t.status,
      notes: t.notes,
      proof_url: t.proofUrl,
    })));
    await supabaseAdmin.from('admins').insert(INITIAL_ADMINS.map((a: any) => ({
      id: a.id,
      name: a.name,
      username: a.username,
      email: a.email,
      password: a.password,
      role: a.role,
      role_label: a.roleLabel,
      phone: a.phone,
      created_at: a.createdAt,
      status: a.status,
    })));

    return { success: true, message: 'Berhasil melakukan seed ke Supabase!' };
  } catch (e: any) {
    return { success: false, message: 'Gagal seed ke Supabase: ' + e?.message };
  }
}
