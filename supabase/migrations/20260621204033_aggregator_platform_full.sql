
-- ══════════════════════════════════════════════════════════
-- AGGREGATOR PLATFORM: полная схема
-- ══════════════════════════════════════════════════════════

-- ── 1. Справочник городов ─────────────────────────────────
CREATE TABLE IF NOT EXISTS cities (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  name_gen    TEXT NOT NULL,
  name_prep   TEXT NOT NULL,
  region      TEXT NOT NULL,
  region_slug TEXT NOT NULL,
  lat         NUMERIC(10,6),
  lng         NUMERIC(10,6),
  population  INT,
  active      BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. Публичные профили мастеров ─────────────────────────
CREATE TABLE IF NOT EXISTS master_public_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug                TEXT NOT NULL UNIQUE,
  display_name        TEXT NOT NULL,
  avatar_url          TEXT,
  bio                 TEXT,
  experience_years    INT DEFAULT 0,
  city_id             INT REFERENCES cities(id),
  service_cities      INT[] DEFAULT '{}',
  service_types       TEXT[] DEFAULT '{}',
  fixed_prices        JSONB DEFAULT '{}',
  phone               TEXT,
  telegram            TEXT,
  is_online           BOOLEAN NOT NULL DEFAULT false,
  is_verified         BOOLEAN NOT NULL DEFAULT false,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  rating              NUMERIC(3,2) DEFAULT 0,
  reviews_count       INT DEFAULT 0,
  orders_count        INT DEFAULT 0,
  subscription_status TEXT DEFAULT 'free',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 3. Отзывы на мастеров ─────────────────────────────────
CREATE TABLE IF NOT EXISTS master_reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_id   UUID NOT NULL REFERENCES master_public_profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_city TEXT,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  appliance   TEXT,
  text        TEXT NOT NULL,
  reply       TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 4. SEO-страницы городов ───────────────────────────────
CREATE TABLE IF NOT EXISTS seo_city_pages (
  id            SERIAL PRIMARY KEY,
  city_id       INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  service_slug  TEXT NOT NULL,
  h1            TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  content       TEXT,
  masters_count INT DEFAULT 0,
  is_indexed    BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(city_id, service_slug)
);

-- ── 5. Заявки от клиентов ─────────────────────────────────
CREATE TABLE IF NOT EXISTS client_requests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_id    UUID REFERENCES master_public_profiles(id),
  client_name  TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  city_id      INT REFERENCES cities(id),
  service_slug TEXT NOT NULL,
  appliance    TEXT,
  brand        TEXT,
  problem      TEXT,
  status       TEXT NOT NULL DEFAULT 'new',
  source       TEXT DEFAULT 'site',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 6. Функция обновления рейтинга ───────────────────────
CREATE OR REPLACE FUNCTION refresh_master_rating(p_master_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE master_public_profiles
  SET
    rating        = COALESCE((
      SELECT ROUND(AVG(rating::NUMERIC), 2)
      FROM master_reviews
      WHERE master_id = p_master_id AND is_approved = true
    ), 0),
    reviews_count = (
      SELECT COUNT(*)::INT
      FROM master_reviews
      WHERE master_id = p_master_id AND is_approved = true
    ),
    updated_at    = now()
  WHERE id = p_master_id;
END;
$$;

CREATE OR REPLACE FUNCTION trg_review_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  PERFORM refresh_master_rating(COALESCE(NEW.master_id, OLD.master_id));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_review_change ON master_reviews;
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON master_reviews
  FOR EACH ROW EXECUTE FUNCTION trg_review_rating();

-- ── 7. Базовые города ────────────────────────────────────
INSERT INTO cities (slug, name, name_gen, name_prep, region, region_slug, lat, lng, population, active) VALUES
  ('miass',       'Миасс',        'Миасса',        'Миассе',       'Челябинская область', 'chelyabinskaya-oblast', 55.0524, 60.1048, 148000, true),
  ('zlatoust',    'Златоуст',     'Златоуста',     'Златоусте',    'Челябинская область', 'chelyabinskaya-oblast', 55.1726, 59.6633, 160000, true),
  ('chebarkul',   'Чебаркуль',    'Чебаркуля',     'Чебаркуле',    'Челябинская область', 'chelyabinskaya-oblast', 54.9786, 60.3668,  45000, true),
  ('chelyabinsk', 'Челябинск',    'Челябинска',    'Челябинске',   'Челябинская область', 'chelyabinskaya-oblast', 55.1644, 61.4368, 1140000, false),
  ('magnitogorsk','Магнитогорск', 'Магнитогорска', 'Магнитогорске','Челябинская область', 'chelyabinskaya-oblast', 53.4108, 59.0630, 400000, false),
  ('troitsk',     'Троицк',       'Троицка',       'Троицке',      'Челябинская область', 'chelyabinskaya-oblast', 54.0942, 61.5604,  78000, false),
  ('kopeysk',     'Копейск',      'Копейска',      'Копейске',     'Челябинская область', 'chelyabinskaya-oblast', 55.1198, 61.6230,  55000, false),
  ('snezhinsk',   'Снежинск',     'Снежинска',     'Снежинске',    'Челябинская область', 'chelyabinskaya-oblast', 56.0755, 60.7392,  50000, false),
  ('ozersk',      'Озёрск',       'Озёрска',       'Озёрске',      'Челябинская область', 'chelyabinskaya-oblast', 55.7617, 60.7100,  85000, false),
  ('asha',        'Аша',          'Аши',           'Аше',          'Челябинская область', 'chelyabinskaya-oblast', 54.9925, 57.2739,  30000, false)
ON CONFLICT (slug) DO NOTHING;

-- ── 8. SEO-страницы для активных городов ─────────────────
INSERT INTO seo_city_pages (city_id, service_slug, h1, title, description)
SELECT
  c.id,
  s.slug,
  'Ремонт ' || s.gen || ' в ' || c.name_prep,
  'Ремонт ' || s.gen || ' в ' || c.name_prep || ' — выезд за 1 час | Центр восстановления техники',
  'Ремонт ' || s.gen || ' в ' || c.name_prep || '. Опытные мастера, гарантия до 12 месяцев. Звоните — выезд в течение часа!'
FROM cities c
CROSS JOIN (
  VALUES
    ('remont-holodilnikov',      'холодильников'),
    ('remont-stiralnykh-mashin', 'стиральных машин'),
    ('remont-elektropliit',      'электроплит'),
    ('remont-mikrovolnovok',     'микроволновок'),
    ('remont-pylesesov',         'пылесосов'),
    ('remont-kofemashiny',       'кофемашин')
) AS s(slug, gen)
WHERE c.active = true
ON CONFLICT (city_id, service_slug) DO NOTHING;

-- ── 9. RLS ───────────────────────────────────────────────
ALTER TABLE cities                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_public_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_reviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_city_pages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_requests        ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cities_select_public" ON cities FOR SELECT USING (true);

CREATE POLICY "master_profiles_select_public" ON master_public_profiles
  FOR SELECT USING (is_active = true);

CREATE POLICY "master_profiles_insert_own" ON master_public_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "master_profiles_update_own" ON master_public_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "master_profiles_delete_own" ON master_public_profiles
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "reviews_select_public" ON master_reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "reviews_insert_any" ON master_reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "reviews_update_master" ON master_reviews
  FOR UPDATE TO authenticated USING (
    master_id IN (SELECT id FROM master_public_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "reviews_delete_master" ON master_reviews
  FOR DELETE TO authenticated USING (
    master_id IN (SELECT id FROM master_public_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "seo_pages_select_public" ON seo_city_pages FOR SELECT USING (true);

CREATE POLICY "requests_insert_any" ON client_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "requests_select_master" ON client_requests
  FOR SELECT TO authenticated USING (
    master_id IN (SELECT id FROM master_public_profiles WHERE user_id = auth.uid())
  );

-- ── 10. Индексы ──────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_master_city    ON master_public_profiles(city_id);
CREATE INDEX IF NOT EXISTS idx_master_active  ON master_public_profiles(is_active, is_online);
CREATE INDEX IF NOT EXISTS idx_master_rating  ON master_public_profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_master ON master_reviews(master_id, is_approved);
CREATE INDEX IF NOT EXISTS idx_requests_mst   ON client_requests(master_id, status);
CREATE INDEX IF NOT EXISTS idx_seo_city_svc   ON seo_city_pages(city_id, service_slug);
