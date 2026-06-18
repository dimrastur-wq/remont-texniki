import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type SubscriptionStatus = 'free' | 'active' | 'expired';

export interface MasterProfile {
  id: string;
  user_id: string;
  name: string | null;
  city: string;
  phone: string | null;
  subscription_status: SubscriptionStatus;
  subscription_expires_at: string | null;
  created_at: string;
}

export interface MasterOrder {
  id: string;
  user_id: string;
  client_name: string;
  client_phone: string | null;
  appliance_type: string | null;
  brand_model: string | null;
  fault_description: string | null;
  work_done: string | null;
  parts_cost: number;
  labor_cost: number;
  status: 'in_progress' | 'completed' | 'cancelled';
  warranty_period: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
