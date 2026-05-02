-- Create tickets storage bucket for scanned travel documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('tickets', 'tickets', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access (unauthenticated download links work)
CREATE POLICY "tickets_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'tickets');

-- Authenticated write access
CREATE POLICY "tickets_auth_write"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tickets');
