export interface OrderItem {
  id: number;
  product_id?: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  customer_id?: number;
  business_id?: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  delivery_type: 'delivery' | 'pickup';
  total_amount: number;
  delivery_address?: string;
  delivery_notes?: string;
  tracking_code?: string;
  is_paid: boolean;
  created_at: string;
  updated_at?: string;
  delivered_at?: string;
  items?: OrderItem[];
}

export interface OrderCreate {
  business_id: number;
  items: {
    product_id: number;
    quantity: number;
  }[];
  delivery_type: 'delivery' | 'pickup';
  delivery_address?: string;
  delivery_notes?: string;
}

export interface TrackingInfo {
  tracking_code: string;
  status: string;
  business_name?: string;
  delivery_type: string;
  delivery_address?: string;
  created_at: string;
  updated_at?: string;
}
