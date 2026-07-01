export * from './user';
export * from './business';
export * from './product';
export * from './order';

export interface Payment {
  id: number;
  order_id: number;
  payer_id?: number;
  amount: number;
  currency: string;
  method: 'card' | 'mobile_money' | 'cash' | 'eft';
  status: 'pending' | 'processing' | 'success' | 'failed' | 'refunded';
  reference?: string;
  created_at: string;
  updated_at?: string;
}

export interface PaymentCreate {
  order_id: number;
  method: 'card' | 'mobile_money' | 'cash' | 'eft';
  amount: number;
  currency?: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_business_id: number;
  subject?: string;
  content: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export interface MessageCreate {
  receiver_business_id: number;
  subject?: string;
  content: string;
}
