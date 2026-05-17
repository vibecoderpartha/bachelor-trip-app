-- Personal to-do lists for each persona
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS todos_user_name_idx ON todos (user_name);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "todos_public" ON todos FOR ALL USING (true) WITH CHECK (true);
