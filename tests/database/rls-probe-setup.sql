-- IR-001 local capability canary only. This file is not a product migration,
-- target schema, or target RLS policy.
BEGIN;

CREATE SCHEMA ir001_probe;

CREATE TABLE ir001_probe.resources (
  resource_id text PRIMARY KEY,
  scope_id text NOT NULL,
  actor_id text NOT NULL
);

ALTER TABLE ir001_probe.resources ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON SCHEMA ir001_probe FROM PUBLIC;
REVOKE ALL ON ir001_probe.resources FROM PUBLIC;
GRANT USAGE ON SCHEMA ir001_probe TO authenticated;
GRANT SELECT ON ir001_probe.resources TO authenticated;

CREATE POLICY ir001_probe_current_scope_read
  ON ir001_probe.resources
  FOR SELECT
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'relationship_state') = 'active'
    AND scope_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'scope_id')
    AND actor_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
  );

INSERT INTO ir001_probe.resources (resource_id, scope_id, actor_id)
VALUES
  ('probe-resource-a', 'fixture-group-a', 'fixture-account-a'),
  ('probe-resource-b', 'fixture-group-b', 'fixture-account-b');

COMMIT;
