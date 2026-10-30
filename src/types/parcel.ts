export type UserRole = 'public' | 'member' | 'agent' | 'korwil' | 'admin';

export interface ParcelPackage {
  id: string;
  name: string;
  category: 'bunda' | 'anak' | 'pilihan' | 'uang' | 'satuan';
  tag: string;
  tier?: string;
  description: string;
  targetPrice: number;
  dailyPayment: number;
  weeklyPayment: number;
  durationDays?: number;
  thrBonus?: string;
  bonusGift?: string;
  weight: string;
  imageUrl: string;
  items: string[];
}

export interface Agent {
  id: string;
  code: string;
  name: string;
  storeName: string;
  ownerName: string;
  district: string;
  regency: string;
  phone: string;
  memberCount: number;
  totalOmset: number;
  status: 'Aktif' | 'Non-aktif';
}

export interface Member {
  id: string;
  memberCode: string;
  name: string;
  phone: string;
  email?: string;
  username?: string;
  password?: string;
  address: string;
  regency: string;
  agentId: string;
  agentName: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  totalSaved: number;
  lastDepositAmount: number;
  lastDepositDate: string;
  status: 'Aktif' | 'Lunas' | 'Menunggu';
  joinDate: string;
  pickupDate: string;
  qrToken: string;
}

export interface Transaction {
  id: string;
  invoiceNo: string;
  memberId: string;
  memberName: string;
  memberCode: string;
  packageName: string;
  agentId: string;
  agentName: string;
  amount: number;
  method: 'Transfer Bank BRI' | 'Transfer Bank BCA' | 'QRIS Instant' | 'Tunai Agen';
  date: string;
  status: 'Berhasil' | 'Menunggu' | 'Ditolak';
  notes?: string;
  proofUrl?: string;
}

export interface KorwilRegion {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
}

export interface AdminAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: 'superadmin' | 'admin' | 'finance' | 'staff';
  roleLabel: string;
  phone?: string;
  createdAt: string;
  status: 'Aktif' | 'Non-aktif';
}
