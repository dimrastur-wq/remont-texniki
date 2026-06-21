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

// ── Aggregator platform types ──

export interface City {
  id: number;
  slug: string;
  name: string;
  name_gen: string;
  name_prep: string;
  region: string;
  region_slug: string;
  lat: number | null;
  lng: number | null;
  population: number | null;
  active: boolean;
}

export interface MasterPublicProfile {
  id: string;
  slug: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  experience_years: number;
  city_id: number | null;
  service_cities: number[];
  service_types: string[];
  fixed_prices: Record<string, number>;
  phone: string | null;
  telegram: string | null;
  is_online: boolean;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  reviews_count: number;
  orders_count: number;
  subscription_status: string;
  created_at: string;
  // joined
  city?: City;
}

export interface MasterReview {
  id: string;
  master_id: string;
  author_name: string;
  author_city: string | null;
  rating: number;
  appliance: string | null;
  text: string;
  reply: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface ClientRequest {
  id: string;
  master_id: string | null;
  client_name: string;
  client_phone: string;
  city_id: number | null;
  service_slug: string;
  appliance: string | null;
  brand: string | null;
  problem: string | null;
  status: string;
  source: string;
  created_at: string;
}

// Service label map
export const SERVICE_LABELS: Record<string, string> = {
  'remont-holodilnikov':      'Холодильники',
  'remont-stiralnykh-mashin': 'Стиральные машины',
  'remont-elektropliit':      'Электроплиты',
  'remont-mikrovolnovok':     'Микроволновки',
  'remont-pylesesov':         'Пылесосы',
  'remont-kofemashiny':       'Кофемашины',
};
