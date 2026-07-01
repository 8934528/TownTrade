export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'business';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
}
