export interface SeedEvent {
  type: string
  title: string
  date_ist: string
  end_date_ist?: string
  location: string
  location_to?: string
  notes?: string
  for_users: string[] | null
  dep_code?: string
  arr_code?: string
  flight_no?: string
  airline?: string
  terminal?: string
  color: string
  expense?: {
    amount: number
    currency: string
    paid_by: string
    split_among: string[] | null
  }
}

export const SEED_EVENTS: SeedEvent[] = [
  {
    type: 'flight',
    title: 'IndiGo 6E-1234 · DEL → DPS',
    date_ist: '2025-06-14T02:30:00+05:30',
    end_date_ist: '2025-06-14T11:00:00+05:30',
    location: 'T2, IGI Airport, Delhi',
    location_to: 'Ngurah Rai Airport, Denpasar',
    notes: 'Check-in 01:00 IST · Seats 18A/B/C',
    for_users: ['Partha', 'Astitva', 'Vaibhav'],
    dep_code: 'DEL',
    arr_code: 'DPS',
    flight_no: '6E-1234',
    airline: 'IndiGo',
    terminal: 'T2',
    color: '#BF5FFF',
  },
  {
    type: 'flight',
    title: 'Air India AI-381 · BOM → DPS',
    date_ist: '2025-06-14T06:15:00+05:30',
    end_date_ist: '2025-06-14T14:00:00+05:30',
    location: 'T2, CSIA Airport, Mumbai',
    location_to: 'Ngurah Rai Airport, Denpasar',
    notes: 'Check-in 04:15 IST · Seat 22F',
    for_users: ['Suryansh'],
    dep_code: 'BOM',
    arr_code: 'DPS',
    flight_no: 'AI-381',
    airline: 'Air India',
    terminal: 'T2',
    color: '#BF5FFF',
  },
  {
    type: 'flight',
    title: 'SpiceJet SG-88 · BLR → DPS',
    date_ist: '2025-06-14T08:45:00+05:30',
    end_date_ist: '2025-06-14T16:30:00+05:30',
    location: 'T1, Kempegowda Airport, Bengaluru',
    location_to: 'Ngurah Rai Airport, Denpasar',
    notes: 'Check-in 06:45 IST · Seat 14D',
    for_users: ['Bittu'],
    dep_code: 'BLR',
    arr_code: 'DPS',
    flight_no: 'SG-88',
    airline: 'SpiceJet',
    terminal: 'T1',
    color: '#BF5FFF',
  },
  {
    type: 'hotel',
    title: 'The Layar Villa · Seminyak',
    date_ist: '2025-06-14T20:00:00+05:30',
    end_date_ist: '2025-06-19T10:00:00+05:30',
    location: 'Jl. Kayu Aya No.7, Seminyak, Bali',
    notes: 'Pool Villa · 5 nights · Bkfst · #BLI-9823',
    for_users: null,
    color: '#FF2D78',
    expense: { amount: 18500000, currency: 'IDR', paid_by: 'Partha', split_among: null },
  },
  {
    type: 'activity',
    title: 'Surf Lesson · Kuta Beach',
    date_ist: '2025-06-15T06:00:00+05:30',
    end_date_ist: '2025-06-15T08:00:00+05:30',
    location: 'Kuta Beach Surf Camp, Bali',
    notes: 'Board & rash guard · Private instructor',
    for_users: null,
    color: '#00FFD1',
    expense: { amount: 2800000, currency: 'IDR', paid_by: 'Astitva', split_among: null },
  },
  {
    type: 'ferry',
    title: 'Ferry · Sanur → Nusa Penida',
    date_ist: '2025-06-16T06:30:00+05:30',
    end_date_ist: '2025-06-16T07:15:00+05:30',
    location: 'Sanur Harbour, Pier 12',
    notes: 'Mola Mola Fast Boat · Return 17:00 WITA',
    for_users: null,
    color: '#FFD600',
    expense: { amount: 900000, currency: 'IDR', paid_by: 'Vaibhav', split_among: null },
  },
  {
    type: 'activity',
    title: 'Snorkeling · Crystal Bay',
    date_ist: '2025-06-16T09:00:00+05:30',
    end_date_ist: '2025-06-16T12:00:00+05:30',
    location: 'Crystal Bay, Nusa Penida',
    notes: 'Manta rays · Full gear + guide',
    for_users: null,
    color: '#00FFD1',
    expense: { amount: 1200000, currency: 'IDR', paid_by: 'Suryansh', split_among: null },
  },
  {
    type: 'hotel',
    title: 'Alam Batu Bungalow · Amed',
    date_ist: '2025-06-17T18:30:00+05:30',
    end_date_ist: '2025-06-18T10:00:00+05:30',
    location: 'Amed, Karangasem, Bali',
    notes: 'Beachfront · 1 night · #AMD-4421',
    for_users: null,
    color: '#FF2D78',
    expense: { amount: 3200000, currency: 'IDR', paid_by: 'Bittu', split_among: null },
  },
  {
    type: 'activity',
    title: 'Mt. Batur Sunrise Trek',
    date_ist: '2025-06-18T01:30:00+05:30',
    end_date_ist: '2025-06-18T08:00:00+05:30',
    location: 'Mount Batur, Kintamani, Bali',
    notes: '1717m · Guide + summit bfast · Bring torch & jacket',
    for_users: null,
    color: '#FF6B00',
    expense: { amount: 1600000, currency: 'IDR', paid_by: 'Partha', split_among: null },
  },
  {
    type: 'flight',
    title: 'AirAsia AK-257 · DPS → DEL',
    date_ist: '2025-06-19T08:00:00+05:30',
    end_date_ist: '2025-06-19T17:30:00+05:30',
    location: 'Intl Terminal, Ngurah Rai Airport',
    notes: 'Check-in 06:00 WITA · Max 15kg cabin',
    for_users: null,
    dep_code: 'DPS',
    arr_code: 'DEL',
    flight_no: 'AK-257',
    airline: 'AirAsia',
    color: '#BF5FFF',
  },
]
