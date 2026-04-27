-- Bali Bachelor Trip App — Initial Schema

-- Users (the 5 crew members)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  emoji TEXT,
  color TEXT,
  vibe TEXT,
  pin TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Itinerary events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  icon TEXT,
  title TEXT NOT NULL,
  date_ist TIMESTAMPTZ NOT NULL,
  end_date_ist TIMESTAMPTZ,
  location TEXT,
  location_to TEXT,
  notes TEXT,
  color TEXT,
  for_users TEXT[],
  dep_code TEXT,
  arr_code TEXT,
  terminal TEXT,
  flight_no TEXT,
  airline TEXT,
  booking_ref TEXT,
  doc_source TEXT,
  doc_storage_path TEXT,
  sort_order INT DEFAULT 0,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'IDR',
  amount_idr NUMERIC(12,2),
  paid_by TEXT NOT NULL,
  split_among TEXT[] NOT NULL,
  split_mode TEXT DEFAULT 'equal',
  custom_splits JSONB,
  category TEXT,
  date DATE,
  notes TEXT,
  settled BOOLEAN DEFAULT false,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settlements
CREATE TABLE IF NOT EXISTS settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user TEXT NOT NULL,
  to_user TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'IDR',
  notes TEXT,
  recorded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Exchange rates (cached)
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate NUMERIC(10,6) NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_ist);
CREATE INDEX IF NOT EXISTS idx_events_for_users ON events USING gin(for_users);
CREATE INDEX IF NOT EXISTS idx_expenses_event ON expenses(event_id);
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by);
CREATE INDEX IF NOT EXISTS idx_settlements_users ON settlements(from_user, to_user);

-- Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- All authenticated users read/write all data (private group app)
CREATE POLICY "group_read_events"   ON events   FOR SELECT USING (true);
CREATE POLICY "group_insert_events" ON events   FOR INSERT WITH CHECK (true);
CREATE POLICY "group_update_events" ON events   FOR UPDATE USING (true);
CREATE POLICY "group_delete_events" ON events   FOR DELETE USING (true);

CREATE POLICY "group_read_expenses"   ON expenses FOR SELECT USING (true);
CREATE POLICY "group_insert_expenses" ON expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "group_update_expenses" ON expenses FOR UPDATE USING (true);
CREATE POLICY "group_delete_expenses" ON expenses FOR DELETE USING (true);

CREATE POLICY "group_read_settlements"   ON settlements FOR SELECT USING (true);
CREATE POLICY "group_insert_settlements" ON settlements FOR INSERT WITH CHECK (true);

CREATE POLICY "group_read_rates"   ON exchange_rates FOR SELECT USING (true);
CREATE POLICY "group_insert_rates" ON exchange_rates FOR INSERT WITH CHECK (true);
CREATE POLICY "group_update_rates" ON exchange_rates FOR UPDATE USING (true);

-- Auto-update updated_at on events
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
