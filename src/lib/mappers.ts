import { ParcelPackage, Agent, Member, Transaction, AdminAccount } from '../types/parcel.js';

function normalizeImagePath(url?: string, category?: string): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    if (category === 'anak') return '/assets/images/parcel_anak_snack.jpg';
    if (category === 'pilihan') return '/assets/images/parcel_sultan_sembako.jpg';
    return '/assets/images/parcel_bunda_sembako.jpg';
  }
  const clean = url.trim();
  if (clean.startsWith('/src/assets/images/')) {
    return clean.replace('/src/assets/images/', '/assets/images/');
  }
  if (clean.startsWith('src/assets/images/')) {
    return '/' + clean.replace('src/assets/images/', 'assets/images/');
  }
  return clean;
}

export function mapRowToPackage(row: any): ParcelPackage {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    tag: row.tag,
    tier: row.tier || undefined,
    description: row.description,
    targetPrice: Number(row.target_price ?? row.targetPrice ?? 0),
    dailyPayment: Number(row.daily_payment ?? row.dailyPayment ?? 0),
    weeklyPayment: Number(row.weekly_payment ?? row.weeklyPayment ?? 0),
    durationDays: row.duration_days ?? row.durationDays ?? 325,
    thrBonus: row.thr_bonus ?? row.thrBonus ?? undefined,
    bonusGift: row.bonus_gift ?? row.bonusGift ?? undefined,
    weight: row.weight,
    imageUrl: normalizeImagePath(row.image_url ?? row.imageUrl, row.category),
    items: Array.isArray(row.items) ? row.items : []
  };
}

export function mapPackageToRow(pkg: ParcelPackage) {
  return {
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
    image_url: normalizeImagePath(pkg.imageUrl, pkg.category),
    items: Array.isArray(pkg.items) ? pkg.items : [],
    updated_at: new Date().toISOString()
  };
}

export function mapRowToAgent(row: any): Agent {
  return {
    id: String(row.id),
    code: row.code,
    name: row.name,
    storeName: row.store_name ?? row.storeName,
    ownerName: row.owner_name ?? row.ownerName,
    district: row.district,
    regency: row.regency,
    phone: row.phone,
    memberCount: Number(row.member_count ?? row.memberCount ?? 0),
    totalOmset: Number(row.total_omset ?? row.totalOmset ?? 0),
    status: (row.status === 'Non-aktif' ? 'Non-aktif' : 'Aktif')
  };
}

export function mapAgentToRow(agent: Agent) {
  return {
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
    updated_at: new Date().toISOString()
  };
}

export function mapRowToMember(row: any): Member {
  return {
    id: String(row.id),
    memberCode: row.member_code ?? row.memberCode,
    name: row.name,
    phone: row.phone,
    email: row.email ?? undefined,
    username: row.username ?? undefined,
    password: row.password ?? undefined,
    address: row.address,
    regency: row.regency,
    agentId: row.agent_id ?? row.agentId,
    agentName: row.agent_name ?? row.agentName,
    packageId: row.package_id ?? row.packageId,
    packageName: row.package_name ?? row.packageName,
    packagePrice: Number(row.package_price ?? row.packagePrice ?? 0),
    totalSaved: Number(row.total_saved ?? row.totalSaved ?? 0),
    lastDepositAmount: Number(row.last_deposit_amount ?? row.lastDepositAmount ?? 0),
    lastDepositDate: row.last_deposit_date ?? row.lastDepositDate ?? '',
    status: row.status || 'Aktif',
    joinDate: row.join_date ?? row.joinDate ?? '',
    pickupDate: row.pickup_date ?? row.pickupDate ?? '',
    qrToken: row.qr_token ?? row.qrToken ?? ''
  };
}

export function mapMemberToRow(member: Member) {
  return {
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
    updated_at: new Date().toISOString()
  };
}

export function mapRowToTransaction(row: any): Transaction {
  return {
    id: String(row.id),
    invoiceNo: row.invoice_no ?? row.invoiceNo,
    memberId: row.member_id ?? row.memberId,
    memberName: row.member_name ?? row.memberName,
    memberCode: row.member_code ?? row.memberCode,
    packageName: row.package_name ?? row.packageName,
    agentId: row.agent_id ?? row.agentId,
    agentName: row.agent_name ?? row.agentName,
    amount: Number(row.amount ?? 0),
    method: row.method,
    date: row.date,
    status: row.status || 'Menunggu',
    notes: row.notes ?? undefined,
    proofUrl: row.proof_url ?? row.proofUrl ?? undefined
  };
}

export function mapTransactionToRow(tx: Transaction) {
  return {
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
    updated_at: new Date().toISOString()
  };
}

export function mapRowToAdmin(row: any): AdminAccount {
  return {
    id: String(row.id),
    name: row.name,
    username: row.username,
    email: row.email,
    password: row.password ?? undefined,
    role: row.role || 'staff',
    roleLabel: row.role_label ?? row.roleLabel ?? 'Staff Admin',
    phone: row.phone ?? undefined,
    createdAt: row.created_at ?? row.createdAt ?? '',
    status: (row.status === 'Non-aktif' ? 'Non-aktif' : 'Aktif')
  };
}

export function mapAdminToRow(admin: AdminAccount) {
  return {
    id: admin.id,
    name: admin.name,
    username: admin.username,
    email: admin.email,
    password: admin.password ?? null,
    role: admin.role || 'staff',
    role_label: admin.roleLabel || 'Staff Admin',
    phone: admin.phone ?? null,
    created_at: admin.createdAt || new Date().toISOString().slice(0, 10),
    status: admin.status || 'Aktif',
    updated_at: new Date().toISOString()
  };
}
