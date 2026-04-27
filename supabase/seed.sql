-- Bali Bachelor Trip App — Seed Data
-- Idempotent: safe to run multiple times

-- Users
INSERT INTO users (name, emoji, color, vibe, pin) VALUES
  ('Partha',   '🦁', '#FF2D78', 'The Alpha',      '1111'),
  ('Astitva',  '🐯', '#00FFD1', 'The Hype Man',   '2222'),
  ('Vaibhav',  '🦊', '#FFD600', 'The Smooth One', '3333'),
  ('Suryansh', '🐺', '#BF5FFF', 'The Wild Card',  '4444'),
  ('Bittu',    '🦅', '#FF6B00', 'The Legend',     '5555')
ON CONFLICT (name) DO NOTHING;

-- Events
INSERT INTO events (type, title, date_ist, end_date_ist, location, location_to, notes, for_users, dep_code, arr_code, flight_no, airline, terminal, color) VALUES
  ('flight', 'IndiGo 6E-1234 · DEL → DPS', '2025-06-14T02:30:00+05:30', '2025-06-14T11:00:00+05:30',
   'T2, IGI Airport, Delhi', 'Ngurah Rai Airport, Denpasar', 'Check-in 01:00 IST · Seats 18A/B/C',
   ARRAY['Partha','Astitva','Vaibhav'], 'DEL', 'DPS', '6E-1234', 'IndiGo', 'T2', '#BF5FFF'),

  ('flight', 'Air India AI-381 · BOM → DPS', '2025-06-14T06:15:00+05:30', '2025-06-14T14:00:00+05:30',
   'T2, CSIA Airport, Mumbai', 'Ngurah Rai Airport, Denpasar', 'Check-in 04:15 IST · Seat 22F',
   ARRAY['Suryansh'], 'BOM', 'DPS', 'AI-381', 'Air India', 'T2', '#BF5FFF'),

  ('flight', 'SpiceJet SG-88 · BLR → DPS', '2025-06-14T08:45:00+05:30', '2025-06-14T16:30:00+05:30',
   'T1, Kempegowda Airport, Bengaluru', 'Ngurah Rai Airport, Denpasar', 'Check-in 06:45 IST · Seat 14D',
   ARRAY['Bittu'], 'BLR', 'DPS', 'SG-88', 'SpiceJet', 'T1', '#BF5FFF'),

  ('hotel', 'The Layar Villa · Seminyak', '2025-06-14T20:00:00+05:30', '2025-06-19T10:00:00+05:30',
   'Jl. Kayu Aya No.7, Seminyak, Bali', NULL, 'Pool Villa · 5 nights · Bkfst · #BLI-9823',
   NULL, NULL, NULL, NULL, NULL, NULL, '#FF2D78'),

  ('activity', 'Surf Lesson · Kuta Beach', '2025-06-15T06:00:00+05:30', '2025-06-15T08:00:00+05:30',
   'Kuta Beach Surf Camp, Bali', NULL, 'Board & rash guard · Private instructor',
   NULL, NULL, NULL, NULL, NULL, NULL, '#00FFD1'),

  ('ferry', 'Ferry · Sanur → Nusa Penida', '2025-06-16T06:30:00+05:30', '2025-06-16T07:15:00+05:30',
   'Sanur Harbour, Pier 12', NULL, 'Mola Mola Fast Boat · Return 17:00 WITA',
   NULL, NULL, NULL, NULL, NULL, NULL, '#FFD600'),

  ('activity', 'Snorkeling · Crystal Bay', '2025-06-16T09:00:00+05:30', '2025-06-16T12:00:00+05:30',
   'Crystal Bay, Nusa Penida', NULL, 'Manta rays · Full gear + guide',
   NULL, NULL, NULL, NULL, NULL, NULL, '#00FFD1'),

  ('hotel', 'Alam Batu Bungalow · Amed', '2025-06-17T18:30:00+05:30', '2025-06-18T10:00:00+05:30',
   'Amed, Karangasem, Bali', NULL, 'Beachfront · 1 night · #AMD-4421',
   NULL, NULL, NULL, NULL, NULL, NULL, '#FF2D78'),

  ('activity', 'Mt. Batur Sunrise Trek', '2025-06-18T01:30:00+05:30', '2025-06-18T08:00:00+05:30',
   'Mount Batur, Kintamani, Bali', NULL, '1717m · Guide + summit bfast · Bring torch & jacket',
   NULL, NULL, NULL, NULL, NULL, NULL, '#FF6B00'),

  ('flight', 'AirAsia AK-257 · DPS → DEL', '2025-06-19T08:00:00+05:30', '2025-06-19T17:30:00+05:30',
   'Intl Terminal, Ngurah Rai Airport', NULL, 'Check-in 06:00 WITA · Max 15kg cabin',
   NULL, 'DPS', 'DEL', 'AK-257', 'AirAsia', NULL, '#BF5FFF');

-- Expenses linked to hotel/activity events (optional post-insert step)
-- Run after events are seeded and you have their IDs from a query.
-- Example (replace event_id with actual UUIDs from SELECT id FROM events WHERE title LIKE '...'):
-- INSERT INTO expenses (event_id, description, amount, currency, amount_idr, paid_by, split_among)
-- VALUES ('<villa-event-id>', 'The Layar Villa · 5 nights', 18500000, 'IDR', 18500000, 'Partha', ARRAY['Partha','Astitva','Vaibhav','Suryansh','Bittu']);
