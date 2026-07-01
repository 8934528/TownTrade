export interface Product {
  id: number;
  business_id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  tags?: string;
  stock: number;
  low_stock_threshold: number;
  image_url?: string;
  is_active: boolean;
  is_featured: boolean;
  is_low_stock: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ProductCreate {
  name: string;
  description?: string;
  price: number;
  category?: string;
  tags?: string;
  stock?: number;
  low_stock_threshold?: number;
  image_url?: string;
  is_featured?: boolean;
}

export interface ProductUpdate extends Partial<ProductCreate> {
  is_active?: boolean;
}
