
CREATE TABLE IF NOT EXISTS master_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_id UUID NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_city TEXT DEFAULT 'Миасс',
  appliance_type TEXT NOT NULL,
  appliance_brand TEXT,
  appliance_model TEXT,
  fault_description TEXT NOT NULL,
  work_done TEXT,
  parts_cost NUMERIC(10,2) DEFAULT 0,
  labor_cost NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'new',
  received_at DATE DEFAULT CURRENT_DATE,
  completed_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
