// Типы перенесены в src/data/masters.ts
// Этот файл оставлен для обратной совместимости импортов

export type {
  MasterPublicProfile,
  MasterReview,
  SubscriptionStatus,
} from '../data/masters';

export { SERVICE_LABELS } from '../data/masters';

// Заглушка — больше не используется
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

export interface City {
  id: number;
  slug: string;
  name: string;
  name_gen: string;
  name_prep: string;
  region: string;
  lat: number | null;
  lng: number | null;
  active: boolean;
}

export interface ClientRequest {
  id: string;
  master_id: string | null;
  client_name: string;
  client_phone: string;
  service_slug: string;
  problem: string | null;
  source: string;
  created_at: string;
}

import type { SubscriptionStatus } from '../data/masters';
