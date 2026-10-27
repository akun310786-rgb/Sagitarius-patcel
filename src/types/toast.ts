export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  timestamp: string;
  invoiceNo?: string;
  amount?: number;
  targetRole?: 'all' | 'member' | 'agent' | 'korwil' | 'admin';
}
