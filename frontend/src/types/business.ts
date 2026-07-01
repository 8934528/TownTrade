export interface Business {
  id: number;
  user_id: number;
  name: string;
  category: string;
  description?: string;
  tags?: string;
  address?: string;
  city?: string;
  phone?: string;
  whatsapp?: string;
  logo_url?: string;
  banner_url?: string;
  is_active: boolean;
  is_verified: boolean;
  is_open: boolean;
  rating?: number;
  total_reviews: number;
  created_at: string;
  updated_at?: string;
}

export interface BusinessCreate {
  name: string;
  category: string;
  description?: string;
  tags?: string;
  address?: string;
  city?: string;
  phone?: string;
  whatsapp?: string;
  logo_url?: string;
  banner_url?: string;
}

export interface BusinessUpdate extends Partial<BusinessCreate> {
  is_open?: boolean;
}
