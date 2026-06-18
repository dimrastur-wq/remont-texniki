
-- Master profiles
CREATE TABLE IF NOT EXISTS master_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  city TEXT DEFAULT 'Миасс',
  is_premium BOOLEAN DEFAULT false,
  premium_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE master_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "masters_select_own" ON master_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);
CREATE POLICY "masters_insert_own" ON master_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "masters_update_own" ON master_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "masters_delete_own" ON master_profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_master()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.master_profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_master_created ON auth.users;
CREATE TRIGGER on_auth_master_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_master();
