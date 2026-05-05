/*
  # B2B Contacts and Email Campaigns

  1. New Tables
    - `b2b_contacts` — юридические лица (название, ИНН, email, телефон, город, категория)
    - `b2b_campaigns` — рассылки (тема, текст, статус, статистика)
    - `b2b_campaign_sends` — отправки по контактам (статус каждой отправки)
  2. Security
    - RLS включён на всех таблицах
    - Политика: только авторизованные пользователи могут управлять контактами и рассылками
*/

CREATE TABLE IF NOT EXISTS b2b_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  inn text DEFAULT '',
  email text NOT NULL,
  phone text DEFAULT '',
  city text NOT NULL DEFAULT 'Миасс',
  category text DEFAULT '',
  contact_person text DEFAULT '',
  notes text DEFAULT '',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE b2b_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage b2b contacts"
  ON b2b_contacts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS b2b_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  body text NOT NULL,
  city_filter text DEFAULT '',
  category_filter text DEFAULT '',
  status text DEFAULT 'draft',
  total_sent integer DEFAULT 0,
  total_opened integer DEFAULT 0,
  total_clicked integer DEFAULT 0,
  total_bounced integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz
);

ALTER TABLE b2b_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage b2b campaigns"
  ON b2b_campaigns FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS b2b_campaign_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES b2b_campaigns(id),
  contact_id uuid NOT NULL REFERENCES b2b_contacts(id),
  status text DEFAULT 'pending',
  opened boolean DEFAULT false,
  clicked boolean DEFAULT false,
  sent_at timestamptz
);

ALTER TABLE b2b_campaign_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage campaign sends"
  ON b2b_campaign_sends FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_b2b_contacts_city ON b2b_contacts(city);
CREATE INDEX IF NOT EXISTS idx_b2b_contacts_category ON b2b_contacts(category);
CREATE INDEX IF NOT EXISTS idx_b2b_contacts_email ON b2b_contacts(email);
CREATE INDEX IF NOT EXISTS idx_b2b_campaign_sends_campaign ON b2b_campaign_sends(campaign_id);
