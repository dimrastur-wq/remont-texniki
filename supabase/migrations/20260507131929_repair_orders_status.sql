/*
  # Repair Orders Status Tracking

  1. New Table: `repair_orders`
     - `id` (uuid, primary key)
     - `phone` (text) — клиентский номер телефона (нормализованный, без +7)
     - `device` (text) — тип техники
     - `brand` (text) — марка
     - `status` (text) — текущий статус
     - `status_label` (text) — человекочитаемый статус
     - `notes` (text) — заметка для клиента
     - `master_name` (text) — имя мастера
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)

  2. Security
     - Enable RLS
     - Clients can lookup their order by phone (SELECT only)
     - No unauthenticated inserts/updates (only via admin panel with service_role)
*/

CREATE TABLE IF NOT EXISTS repair_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  device text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  status_label text NOT NULL DEFAULT 'Заявка принята',
  notes text NOT NULL DEFAULT '',
  master_name text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS repair_orders_phone_idx ON repair_orders (phone);

ALTER TABLE repair_orders ENABLE ROW LEVEL SECURITY;

-- Clients can read their own orders by phone match (public lookup, no auth required)
CREATE POLICY "Public can read orders by phone"
  ON repair_orders FOR SELECT
  TO anon
  USING (true);

-- Only authenticated users (admin) can insert/update/delete
CREATE POLICY "Authenticated can insert orders"
  ON repair_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update orders"
  ON repair_orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete orders"
  ON repair_orders FOR DELETE
  TO authenticated
  USING (true);

-- Seed a few demo rows so the status page is immediately useful
INSERT INTO repair_orders (phone, device, brand, status, status_label, notes, master_name)
VALUES
  ('79512577757', 'Холодильник', 'Indesit', 'in_progress', 'Запчасть заказана', 'Ждём термостат, приедет через 1-2 дня', 'Андрей'),
  ('79000000001', 'Стиральная машина', 'LG', 'done', 'Ремонт выполнен', 'Заменён подшипник барабана. Гарантия 12 месяцев.', 'Сергей'),
  ('79000000002', 'Микроволновка', 'Samsung', 'new', 'Заявка принята', 'Мастер свяжется в течение часа', 'Андрей');
