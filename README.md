# 🌴 BALI BACHELOR TRIP APP

> Private group travel PWA for 5 friends on a bachelor trip to Bali — Jun 14–19, 2025.

**Neon nightclub aesthetic. Mobile-first. Works offline. Per-persona filtered.**

---

## The Crew

| | Name | Vibe |
|---|---|---|
| 🦁 | Partha | The Alpha |
| 🐯 | Astitva | The Hype Man |
| 🦊 | Vaibhav | The Smooth One |
| 🐺 | Suryansh | The Wild Card |
| 🦅 | Bittu | The Legend |

---

## Features

- **🗓 TRIP** — Per-persona itinerary timeline with flights, hotels, ferries, activities. Live countdown clock to your next flight (IST + WITA dual timezone).
- **📎 SCAN** — Upload a PDF or photo of any ticket/voucher. Claude AI parses it and maps it to the itinerary automatically.
- **💸 SPLIT** — Splitwise-style expense splitting. Equal / custom / percentage / shares modes. Greedy settle-up algorithm. Realtime balance sync across all 5 phones.
- **💱 FX** — IDR ↔ INR bidirectional converter with quick-convert buttons and a Bali price guide.
- **🌴 AI** — Claude-powered travel advisor, pre-briefed on the trip. Knows the crew, the itinerary, and speaks in Bali specifics.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres, free tier) |
| Auth | Tap-to-select persona (localStorage) |
| File Storage | Supabase Storage |
| Backend | Supabase Edge Functions (Deno) |
| AI | Anthropic Claude API (via Edge Function) |
| Hosting | Vercel |

---

## Getting Started

```bash
# Install dependencies
npm install

# Copy env template and fill in your Supabase credentials
cp .env.example .env

# Start dev server
npm run dev
```

### Environment Variables

```bash
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# ANTHROPIC_API_KEY goes in Supabase Edge Function secrets only — never here
```

### Supabase Setup

1. Create a free Supabase project
2. Run `supabase/migrations/001_initial.sql` in the SQL editor
3. Run `supabase/seed.sql` to populate users and itinerary events
4. Create a `tickets` storage bucket (public read, authenticated write)
5. Deploy edge functions with `ANTHROPIC_API_KEY` set as a secret

---

## Project Structure

```
src/
├── App.tsx                  # App shell, persona switching, tab routing
├── components/
│   ├── PersonaPicker.tsx    # First-load avatar selector
│   └── ui/                  # NeonText, NeonBorder, VIPBadge, NeonBtn, NeonInput, UserChips, Scanlines
├── constants/
│   ├── users.ts             # The 5 crew members + colors
│   ├── eventTypes.ts        # Flight, hotel, ferry, activity, food, transport
│   └── seedData.ts          # Pre-populated itinerary events
├── hooks/
│   └── useCurrentUser.ts    # Persona session (localStorage)
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── timezone.ts          # IST ↔ WITA helpers
│   └── currency.ts          # IDR / INR conversion
├── tabs/                    # TripTab, ScanTab, SplitTab, FXTab, AITab
└── styles/
    ├── global.css           # CSS variables, keyframes, scanline overlay
    └── fonts.css            # Black Ops One, Barlow Condensed, Share Tech Mono
supabase/
├── migrations/001_initial.sql
├── seed.sql
└── functions/
    ├── parse-document/      # Claude AI ticket parser
    └── ai-chat/             # Claude travel advisor proxy
```

---

## Design System

Dark base `#050308` with neon accents per persona:

```
Partha   #FF2D78  hot pink
Astitva  #00FFD1  cyan
Vaibhav  #FFD600  gold
Suryansh #BF5FFF  purple
Bittu    #FF6B00  orange
```

Fonts: **Black Ops One** (headers) · **Barlow Condensed** (UI) · **Share Tech Mono** (data)

---

*Built with [Claude Code](https://claude.ai/code)*
