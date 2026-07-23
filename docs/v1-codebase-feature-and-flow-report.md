# V1 Codebase Feature and Flow Report

> Snapshot of the current `bachelor-trip-app` codebase on branch `main`, commit
> `f4f6dc5`, reviewed on 24 July 2026.
>
> This is a factual baseline for product-planning conversations. It documents
> what the app already does, how it behaves, and what is coupled to the original
> five-person Bali trip. It intentionally does **not** propose new product
> features.

## 1. Product baseline

The current application is a mobile-first, single-page trip companion made for
one bachelor trip:

- Product name in the UI: **Bakchodi in Bali** / **Bali Bachelor**
- Trip: Bali, 22–27 May 2026 in the frontend constants
- Fixed crew: Partha, Astitva, Vaibhav, Suryansh, and Bittu
- Primary currencies: Indian rupees (INR) and Indonesian rupiah (IDR)
- Primary time zones: India Standard Time (IST) and Central Indonesian Time
  (WITA)
- Backend: one shared Supabase project and one global set of tables
- Identity: a user taps one of five personas; there is no login or authorization
- App structure: five reachable tabs—Trip, Scan, Split, FX, and Todo

The desired future conversion is therefore not a feature expansion. It is a
change from one hardcoded shared trip to a reusable application in which real
users can authenticate, create groups/trips, and use the same existing feature
set within the correct group and trip.

## 2. Current technology and delivery shape

| Area | Current implementation |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS plus global CSS variables and inline styles |
| Backend | Supabase Postgres, Storage, Realtime, and one Edge Function |
| AI parsing | Anthropic Claude through the `parse-document` Edge Function |
| External API | `open.er-api.com` for a live INR-to-IDR rate |
| Navigation | Local React state; no URL router or deep links |
| Layout | Mobile-first shell capped at 480 px wide |
| Authentication | None |
| Automated tests | None in the repository |
| Lint/check scripts | No lint script; `npm run build` runs TypeScript then Vite |
| PWA/offline | Not actually configured in `vite.config.ts`, despite stale README claims |

The package includes `vite-plugin-pwa`, but the plugin is not registered and
there is no manifest or service worker configuration. The current delivered app
is a standard Vite SPA, not an offline-capable PWA.

## 3. Current identity and app-entry flow

### 3.1 First load

1. `App` calls `useCurrentUser`.
2. The hook starts with `user = null` every time the app is mounted.
3. A full-screen persona picker blocks the app.
4. The visitor selects one of the five hardcoded people.
5. That full `User` object is stored only in React memory.
6. The app opens on the Trip tab.

There is no local storage, cookie, Supabase Auth session, PIN check, invite, or
account record lookup. Reloading the page requires selecting a persona again.
The README statement that persona selection uses `localStorage` is stale.

### 3.2 Persona switching

- All five personas appear as chips under the header.
- Tapping a chip immediately changes the active persona.
- There is no confirmation or credential check.
- Any visitor can become any member and can consequently see or mutate that
  member's data.
- The current-user button in the top-right calls `setUser` with the same user
  object; it does not open a profile or logout flow.
- The app exposes no logout action. A reload simply returns to the persona
  picker.

### 3.3 Identity object

Each hardcoded user has:

- `name`
- `emoji`
- `color`
- `vibe`
- a public Supabase Storage image URL

Most compact avatars render the first letter of the name rather than the emoji
or stored image. Hero sections use the public persona images.

## 4. Navigation and shared shell

The app has a sticky header, scrollable tab content, and sticky bottom
navigation. The active tab is React state and resets to Trip after a reload.

Reachable tabs:

1. Trip
2. Scan
3. Split
4. FX
5. Todo

An `AITab`, AI tab asset, and `ai` tab ID exist in source, but AI is not included
in the navigation and is never rendered by `App`. Its UI is only a “Coming
soon” placeholder. It is dormant code, not a current user-facing feature.

Each reachable tab starts with a large image hero. The Trip hero uses the
selected persona's image and vibe; other tabs use the selected persona image
with a tab-specific tagline.

There are no routes, browser-history states, shareable screen URLs, or
route-level access checks.

## 5. Feature inventory

| Feature | Status | Persistent data | Realtime |
|---|---|---|---|
| Persona selection/switching | Implemented, non-secure | None | No |
| Personalized itinerary | Implemented | `events` | Yes |
| Crew live-status summary | Implemented | Derived from `events` | Via event refresh plus a local 30-second clock |
| Next-flight countdown | Implemented | Derived from `events` | Via event refresh; clock ticks locally |
| Manual event add/edit/delete | Implemented | `events` | Yes |
| Google Maps link on event | Implemented | `events.gmap_url` | Yes |
| Ticket/voucher scan and parse | Implemented | `events` + `tickets` Storage | Event insertion becomes realtime |
| Scanned-document list/view/delete | Implemented with access-policy caveats | `events` + Storage | List is manually reloaded |
| Shared expenses | Implemented | `expenses` | Yes |
| Single-payer and multi-payer expenses | Implemented | `expenses.paid_by_splits` | Yes |
| Equal participant splitting | Implemented in UI | `expenses` | Yes |
| Custom/percentage/share splitting | Calculation code exists, no UI | Can be represented by schema/types | N/A |
| Balances and group totals | Implemented, calculated client-side | Derived | Yes |
| Suggested settle-up transfers | Implemented | Derived | Yes |
| Record a settlement | Implemented | `settlements` | Yes |
| INR/IDR converter | Implemented | None | No |
| Live exchange-rate refresh | Implemented | None | No |
| Bali price guide | Implemented, hardcoded | None | No |
| Personal to-do list | Implemented | `todos` | Yes |
| AI travel concierge | Not implemented/reachable | None | No |

## 6. Trip tab: complete behavior and flow

### 6.1 Data loading and visibility

`useEvents` selects every row from the global `events` table ordered by
`date_ist` ascending and subscribes to all inserts, updates, and deletes on that
table.

An event is visible to the selected persona when:

- `for_users` is `NULL`, or
- `for_users` is an empty array, or
- the selected persona's name appears in `for_users`.

There is no trip or group filter. Persona visibility is a frontend name-array
filter, not a database authorization rule.

If event loading fails, the hook silently returns an empty list. Although
`src/constants/seedData.ts` contains ten fallback events, the current hook does
not use them. Missing or invalid Supabase environment values can prevent the
client from initializing at runtime; the documented offline/fallback behavior
is not present.

### 6.2 Crew status

The top of the Trip screen displays five status tiles, one for each hardcoded
crew member. Status is derived from visible events:

- A currently active flight: **Airborne**, with route codes.
- Another currently active event: its event-type label and shortened title.
- After an inbound flight to airport code `DPS`: **In Bali**.
- After a return flight departing `DPS`: **Home**.
- Before the next flight: **Pre-trip**, with a day/hour countdown.

The logic refreshes its local time every 30 seconds. It explicitly uses the
`DPS` airport code to infer arrival in and departure from Bali.

### 6.3 Next-flight countdown

The screen finds the first visible future event whose type is `flight`.

Collapsed state:

- Shows the flight title.
- Shows its IST and WITA departure times.
- Expands on tap.
- Shows “No upcoming flight” when none exists.

Expanded state:

- Shows route codes and flight number.
- Shows a circular countdown in days, hours, minutes, and seconds.
- Updates once per second.
- Shows departure in both IST and WITA.
- Shows airline, flight number, and terminal when available.
- Can be collapsed again.

If no event is supplied, the expanded component says that no flight is
scheduled. A past flight supplied directly would render a Departed state, but
the parent normally passes only a future flight.

### 6.4 Timeline and event status

Events are chronological and have one of four display states:

- `past`: end time is before “now”; card is faded.
- `live`: now is between start and end.
- `next`: first future visible event.
- `upcoming`: any later future event.

The parent calculates “now” on render. It has no dedicated timer for refreshing
timeline status, so status transitions are guaranteed only when the parent
rerenders for another reason.

The user can switch the timeline display between:

- India time (`IST`)
- Bali time (`WITA`)

The date itself is always formatted using the India time zone; only the clock
time switches.

### 6.5 Event card

Each event displays:

- event-type icon
- title
- Next or Live badge when applicable
- date
- selected timezone's start time
- origin/location and optional destination
- emojis for everyone assigned to the event
- optional Google Maps link
- optional embedded seed-data expense summary
- Edit and Remove actions

If notes exist, tapping the card expands/collapses the notes inline.

Removing an event:

- immediately issues a delete against `events`
- has no confirmation
- shows no success or error state
- can be performed by any selected persona

The optional `event.expense` display belongs to the TypeScript seed-event shape.
Normal database event fetching does not join the `expenses` table, so persisted
expenses are not automatically displayed on their related event cards.

### 6.6 Add-event flow

The user taps **+ Add**, then provides:

- type: flight, hotel/Airbnb, ferry, activity, dining, transport, or other
- title, required
- start date/time in IST, required
- optional end date/time in IST
- optional location
- optional destination (“To”)
- optional Google Maps URL
- optional notes
- a visible-to selection from the five users

The event color is derived from the event type. `created_by` is the active
persona's name.

No dedicated flight fields are collected in this form: airline, flight number,
terminal, departure code, arrival code, booking reference, and document source
cannot be entered here. A manually added flight can therefore appear in the
countdown with missing route metadata.

An empty `for_users` array is saved as “everyone.” The picker also allows
explicit arrays of people.

### 6.7 Edit-event flow

The Edit action allows changes to:

- title
- start/end IST date and time
- location/destination
- notes
- Google Maps URL
- visible personas

It does not edit:

- event type/color
- flight metadata
- booking reference
- attached scanned document
- creator

All-five selection is normalized back to an empty array. Empty arrays and null
both mean everyone elsewhere in the app.

## 7. Scan tab: complete behavior and flow

### 7.1 Upload flow

1. The user chooses one PDF or image.
2. The user chooses whether it is visible only to the active persona or to all
   five personas.
3. The app sends multipart form data to the Supabase `parse-document` function:
   the file, `uploaded_by`, and a JSON `for_users` array.
4. The Edge Function uploads the original file to the public `tickets` bucket.
5. It sends the file to Anthropic Claude for structured extraction.
6. It inserts the extracted booking into `events`.
7. The frontend reports success, clears the file input, and reloads scanned
   documents.

Accepted client file types are `.pdf` and `image/*`. The Edge Function rejects
anything that is not a PDF or an image.

### 7.2 Parser behavior

The parser asks Claude to extract one primary booking with:

- type
- title
- IST start/end timestamps
- origin/location and destination
- notes
- flight/airport/terminal metadata
- booking reference
- assignment list

The prompt is specifically trained around:

- flights, ferries, hotels, activities, and transport
- India and Bali timezone conversion
- avoiding confusion between flight duration and departure time
- the fixed trip dates 22–27 May 2026
- forcing missing years to 2026
- extracting only the first/primary booking from a multi-page document

After parsing, the function:

- strips optional Markdown JSON fences
- parses the response as JSON
- forces the start year to 2026
- discards an end time if it is before the start or more than 48 hours later
- prefixes a warning into notes when it discards an invalid end time
- whitelists insertable fields
- overrides Claude's `for_users` with the selection sent by the frontend

It uses the service-role key inside the Edge Function and calls the fixed model
`claude-haiku-4-5-20251001`.

If upload succeeds but AI parsing or database insertion fails, the uploaded
object is not cleaned up, leaving an orphan file.

### 7.3 Previously scanned documents

The tab loads all events having a non-null `doc_storage_path`, newest first.
This list is not filtered by the active persona or event visibility.

For every scanned item, any visitor can:

- view the original through its public Storage URL
- request deletion of both the Storage object and event row

The current Storage migration grants public reads and inserts but defines no
delete policy. The client-side Storage deletion can therefore fail depending on
deployment/auth configuration. The code does not check deletion errors and
still removes the row from local UI after attempting the operations.

## 8. Split tab: complete behavior and flow

### 8.1 Shared data

The tab loads all expenses and settlements globally. Both hooks subscribe to all
changes on their respective tables and refetch the entire list after any
change. There is no trip/group filter and no persona-level expense filter.

Expense rows are shown newest first. Settlement rows are shown newest first,
with only the latest ten rendered in the log.

### 8.2 Add-expense flow

The user can enter:

- description, required
- positive amount, required
- currency: INR or IDR
- one payer, defaulting to the active persona; or split payment across several
  payers
- the people who share the cost, defaulting to all five

The UI currently always creates an equal split among selected participants. It
does not expose category, notes, linked itinerary event, custom amounts,
percentages, shares, or settled status.

For a single payer:

- `paid_by` is the selected persona.
- `paid_by_splits` is null.

For multiple payers:

- the entered contributions must add up to the total within a one-IDR rounding
  tolerance
- contributions are converted to IDR and stored as a name-to-amount JSON object
- the largest contributor is also written to required column `paid_by`

All expense accounting is normalized to `amount_idr`. `created_by` is the
active persona name and `date` is the browser's current ISO date.

### 8.3 Edit-expense flow

Every expense can be edited by every persona. The edit form supports the same
fields as creation:

- description
- amount and currency
- single or multiple payers
- equal-split participants

There is no expense delete action. Existing custom split modes would be
overwritten as `equal` when saved through this UI.

When the currency selector changes, already entered multi-payer contribution
strings are not converted; their numeric values are reinterpreted in the new
currency.

### 8.4 Expense list

Every expense card shows:

- payer avatar, or stacked avatars for multiple payers
- description
- payer wording
- split-mode label when not equal
- total in INR and IDR
- participant emojis
- an equal “per head” figure
- Edit action

The “per head” display always divides total by participant count. It would not
accurately describe a custom/percentage/share split loaded directly from the
database.

### 8.5 Balance calculation

For each expense:

1. Credit the payer or each multi-payer contributor by the IDR paid.
2. Calculate each participant's owed share.
3. Debit each participant by that share.

Then apply settlements:

- the paying user's balance increases
- the receiving user's balance decreases

Balance meaning:

- positive: the group owes that person
- negative: that person owes the group
- within one IDR of zero: treated as settled

The balance hero shows the active persona's total in INR and IDR and a
relationship-style summary for the other four fixed people.

### 8.6 Group totals

The group-totals table shows, for each fixed persona:

- amount paid
- total cost share
- net balance

It also shows total trip spending. These calculations ignore recorded
settlements because they describe spending contributions and shares, while the
balance hero includes settlements.

### 8.7 Supported split algorithms

The calculation library supports four split modes:

- `equal`
- `custom`: absolute IDR per participant
- `percent`: percentage per participant
- `shares`: weighted shares

Only `equal` is creatable or editable in the current UI. The other modes are
latent calculation capability, not user-facing features.

### 8.8 Settle-up flow

The app calculates suggested transfers using a greedy debtor/creditor matching
algorithm intended to reduce the number of transfers.

There is one trip-specific exception: it tries to avoid an
**Astitva → Partha** transfer whenever another pairing is available.

In the modal:

- all suggested transfers are visible
- only a transfer whose debtor is the active persona has a **Paid** button
- tapping Paid inserts an IDR settlement with `recorded_by` set to the active
  persona
- balances recalculate after realtime data refresh

There is no manual settlement amount, partial-payment entry, edit, delete,
reversal, confirmation, payment integration, or settlement receipt. Those are
not current features.

The `expenses.settled` column exists but is not used in calculations or UI.

## 9. FX tab: complete behavior and flow

The FX tab is client-only and has no Supabase dependency.

### 9.1 Converter

- Converts INR to IDR or IDR to INR.
- Both fields are editable; editing a field determines the current direction.
- Starts with INR text `1000`, an empty IDR field, and fallback rate
  `1 INR = 188.68 IDR`.
- Fetches `https://open.er-api.com/v6/latest/INR` on mount.
- Uses `rates.IDR` as the live rate when the request succeeds.
- Shows fetch time or “Fallback rate,” and marks an error as offline.
- Offers a manual Refresh button.
- Has an arrow button that flips the direction indicator, but it does not swap
  the physical positions or values of the input fields.

The initial successful live-rate fetch updates the rate but does not recompute
the initial `1000` INR input, so the IDR field remains empty until the user
edits a value or performs a manual refresh.

### 9.2 Quick conversions

INR quick amounts:

- ₹500
- ₹1,000
- ₹5,000
- ₹10,000
- ₹20,000

IDR quick amounts:

- Rp 100k
- Rp 500k
- Rp 1.0M
- Rp 2.5M
- Rp 5.0M

### 9.3 Bali price guide

The guide is a static list of approximate Bali prices for coffee, beer, food,
beach-club dining, scooters, airport transport, surfing, ferry travel, villa
accommodation, and massage. IDR prices are hardcoded; INR equivalents use the
current FX-tab rate. The copy recommends a 10% tip.

### 9.4 Separate accounting rate

Expense creation and all Split-tab INR displays do not use the FX tab's live
rate. They always use the compile-time fallback `188.68 IDR per INR`. The
`exchange_rates` database table exists but is unused.

The currency utility also contains static USD and AUD conversions, but those
currencies are not offered in the current UI.

## 10. Todo tab: complete behavior and flow

Every persona has a list identified only by their name.

The tab:

- fetches rows where `user_name` equals the active persona name
- subscribes to realtime changes for that name
- adds trimmed text up to 200 UI characters
- separates incomplete and completed items
- toggles completion
- deletes an individual item
- deletes all completed items
- refetches immediately after every mutation

Empty and loading states are present. Mutation errors are not surfaced.

Because identity is only a persona selection and the RLS policy allows all
operations, the list is personal by convention, not private or protected.

## 11. Dormant AI concierge

`AITab.tsx` describes a Claude-powered travel concierge briefed on the crew,
itinerary, and Bali, but:

- it is not imported or rendered by `App`
- it is not in bottom navigation
- it only displays “Coming soon”
- there is no `ai-chat` Edge Function in this repository
- there is no chat state, message persistence, prompt flow, or model call

This should be treated as non-implemented placeholder code, not a feature that
must be preserved in a strict parity conversion unless product planning
explicitly decides otherwise.

## 12. Data model and ownership semantics

### 12.1 `users`

Fields:

- UUID `id`
- unique `name`
- `emoji`
- `color`
- `vibe`
- plaintext `pin`
- `created_at`

The frontend never reads this table. It uses `src/constants/users.ts`.
Seeded PINs (`1111` through `5555`) are unused and are not authentication.
The table has no declared relationship to Supabase Auth users.

### 12.2 `events`

Important fields:

- identity: UUID `id`
- presentation: `type`, `icon`, `title`, `color`, `sort_order`
- scheduling: `date_ist`, `end_date_ist`
- location: `location`, `location_to`, `gmap_url`
- audience: `for_users` as a text array of names
- flight/booking: `dep_code`, `arr_code`, `terminal`, `flight_no`, `airline`,
  `booking_ref`
- scanning: `doc_source`, `doc_storage_path`
- audit: `created_by`, `created_at`, `updated_at`

There is no `trip_id`, `group_id`, owner ID, or membership relation.

### 12.3 `expenses`

Important fields:

- UUID `id`
- optional `event_id`
- description and optional notes/category/date
- original `amount` and `currency`
- normalized `amount_idr`
- `paid_by` as a name
- optional `paid_by_splits` JSON keyed by names
- `split_among` as a text array of names
- `split_mode`
- `custom_splits` JSON keyed by names
- `settled`
- `created_by` as a name
- timestamps

Only `event_id` is a foreign key. Person references are mutable strings, not
user or membership IDs. The UI does not link expenses to events.

### 12.4 `settlements`

Fields:

- UUID `id`
- `from_user` name
- `to_user` name
- amount/currency
- notes
- `recorded_by` name
- `created_at`

There is no trip/group scope and no foreign key to a user or membership.

### 12.5 `todos`

Fields:

- UUID `id`
- `user_name`
- text
- completed state
- `created_at`

There is no trip/group scope or authenticated-user ID.

### 12.6 `exchange_rates`

The schema supports cached currency pairs and fetch timestamps. No frontend,
hook, or Edge Function currently reads or writes this table.

## 13. Backend security and access behavior

RLS is enabled on events, expenses, settlements, exchange rates, and todos, but
the policies use unconditional `USING (true)`/`WITH CHECK (true)` and do not
scope rows by user, membership, group, or trip. Policies without a role clause
apply to `PUBLIC`, which includes the anon role.

Current policy coverage:

- Events: select, insert, update, delete
- Expenses: select, insert, update, delete
- Settlements: select and insert only
- Exchange rates: select, insert, update
- Todos: all operations

The `users` table does not have RLS enabled in the migration.

The Storage bucket:

- is public
- allows public reads
- has an insert policy named “authenticated write,” but the policy only checks
  the bucket ID and does not explicitly require an authenticated role
- has no update or delete policy in the repository

The scan Edge Function allows CORS from any origin and uses the service-role key
for Storage/database work. Document URLs are public.

In practical terms, the current security boundary is possession of the
Supabase project URL and anon key, not group membership.

## 14. Realtime and state behavior

Supabase Realtime channels:

- `events`: all event changes
- `expenses`: all expense changes
- `settlements`: all settlement changes
- `todos-{userName}`: changes filtered by persona name

On a change, hooks refetch the full applicable dataset rather than applying the
individual payload.

All create/update actions rely on realtime refetch or explicit refetch to show
new state. There is no optimistic-update layer, shared cache, retry queue, or
offline mutation support.

Most read failures become an empty state with no error message. Write errors are
shown in the main add/edit/settle modals, but delete flows and Todo mutations do
not report failures.

## 15. Exact single-trip assumptions that planning must know

These are the places where the existing behavior is bound to the original
trip. Replacing them is part of making the same features reusable, not a
request for additional features.

### 15.1 Fixed people

- Five user objects compiled into the frontend
- UI grids explicitly sized for five total people or four “other” people
- Every person reference stored as a display name
- Persona images at one hardcoded Supabase project URL
- All participant pickers iterate the fixed `USERS` list
- Balances default to the fixed `USER_NAMES`
- Crew status always renders five tiles
- Event “everyone” means those five names
- Scan “everyone” sends those five names
- Todos are keyed by those names

### 15.2 Fixed trip and destination

- Header and persona picker say 22–27 May 2026
- Product copy repeatedly says Bali
- Source seed events are all for Bali in May 2026
- Scan prompt forces year 2026 and mentions the May 2026 trip
- Scan prompt understands India/Bali timezone rules only
- Crew location state treats airport code `DPS` as the trip boundary
- Price guide is Bali-specific
- Trip title is compiled into the UI

### 15.3 Fixed currencies and time zones

- Event storage and form fields are named `date_ist`
- Event entry always appends UTC+05:30
- Timeline supports only IST and WITA
- Countdown shows only IST and WITA
- Expense normalization uses IDR
- Expense UI offers only INR and IDR
- Settlement insertion always uses IDR
- Accounting uses a fixed INR/IDR rate separate from the live FX rate

### 15.4 One global group/trip

- No groups table
- No trips table
- No memberships or invitations
- No trip creator/owner relationship
- No `group_id` or `trip_id` on feature tables
- All realtime subscriptions are global
- All queries are global except event persona filtering and Todo name filtering
- All RLS rules are global
- All scanned files share one flat public bucket namespace

### 15.5 Personal joke encoded as business logic

The settle-up algorithm tries to avoid Astitva paying Partha. That rule is in
the accounting library and would affect any dataset using those names.

## 16. Current source-of-truth inconsistencies

Planning should use the application source and migrations as the baseline, not
the older prose documents.

| Topic | Current source behavior | Stale/conflicting material |
|---|---|---|
| Trip date | Frontend and parser use May 22–27, 2026 | README and SQL seed say June 14–19, 2025 |
| Persona persistence | React memory only | README says localStorage |
| Offline fallback | No event fallback in `useEvents`; PWA not configured | README/handoff claim offline and seed fallback |
| AI concierge | Unreachable placeholder only | README lists it as a feature |
| Auth | No auth | README loosely calls persona selection auth; SQL comments say authenticated group |
| App features | Todo exists; AI is absent from nav | README omits Todo and presents AI |
| Supabase seed | Inserts 2025 events and short vibes | Frontend constants contain 2026 seed events and different vibes |

`src/constants/seedData.ts` contains ten 2026 events and embedded example
expenses, but it is not used by the current event hook or database seed.

## 17. UI and interaction contract worth preserving

Without adding features, these are the recognizable current product behaviors:

- Mobile-first, warm dark visual theme with coral accent and persona colors
- Persona-specific hero imagery and personality copy
- Fast tab switching without full navigation
- Per-person itinerary filtering
- Timeline status, expandable notes, Maps links, and dual timezone display
- At-a-glance status for all trip members
- Expandable live next-flight countdown
- Both manual and document-derived itinerary creation
- Realtime shared expense and settlement state
- Single- and multi-payer equal splitting
- INR and IDR shown together throughout accounting
- Suggested minimum-transfer settle-up flow
- Bidirectional currency conversion and destination price reference
- A personal checklist per user

## 18. Important current limitations and edge cases

These are observed constraints in the existing implementation, not requested
new features:

- No authenticated identity or permission checks
- No durable selected-user session
- No group/trip isolation
- No URL routing or deep linking
- Destructive event/document actions have no confirmation
- Scanned-document list ignores event visibility
- Storage deletes may be denied and failures are ignored
- Failed scans can leave orphaned public files
- Manual event editing cannot manage flight metadata or scan attachment
- Event-linked expenses are not surfaced on database event cards
- Expense deletion is absent
- Settlement correction/deletion is absent
- Non-equal split modes are not exposed
- `expenses.settled` is unused
- Most read/delete/Todo errors are hidden
- FX live rate and expense accounting rate can disagree
- No offline operation despite package/readme hints
- No tests or CI configuration in this repository
- Timeline status lacks its own refresh timer
- Client and SQL seed data disagree on trip year/date

## 19. File map for future coding work

### App shell and feature screens

- `src/App.tsx`: persona gate, header, tab state, bottom navigation
- `src/tabs/TripTab.tsx`: itinerary, crew state, countdown, event CRUD entry
- `src/tabs/ScanTab.tsx`: file upload, parser invocation, scanned-document list
- `src/tabs/SplitTab.tsx`: balances, totals, expenses, settlements
- `src/tabs/FXTab.tsx`: live converter and static price guide
- `src/tabs/TodoTab.tsx`: persona-keyed checklist
- `src/tabs/AITab.tsx`: unreachable placeholder

### Feature logic

- `src/hooks/useCurrentUser.ts`: in-memory persona
- `src/hooks/useEvents.ts`: global event query/realtime and visibility helper
- `src/hooks/useExpenses.ts`: global expense query/realtime
- `src/hooks/useSettlements.ts`: global settlement query/realtime
- `src/hooks/useTodos.ts`: persona-name query/realtime and Todo mutations
- `src/lib/splitting.ts`: share, balance, and settle-up algorithms
- `src/lib/currency.ts`: static accounting rates and formatting
- `src/lib/timezone.ts`: fixed IST/WITA formatting and countdown

### Fixed configuration and seed content

- `src/constants/users.ts`: five personas and image URLs
- `src/constants/seedData.ts`: unused 2026 frontend sample itinerary
- `src/constants/eventTypes.ts`: event taxonomy
- `src/constants/tabAssets.ts`: hero imagery and copy

### Backend

- `supabase/migrations/001_initial.sql`: base tables, indexes, RLS policies
- `supabase/migrations/002_tickets_bucket.sql`: public ticket bucket/policies
- `supabase/migrations/003_gmap_url.sql`: event Maps URL
- `supabase/migrations/004_paid_by_splits.sql`: multi-payer JSON
- `supabase/migrations/005_todos.sql`: personal Todo table
- `supabase/seed.sql`: stale 2025 crew/event seed
- `supabase/functions/parse-document/index.ts`: upload, Claude parse, event insert

## 20. Concise context block for ChatGPT planning

Copy the following block into a new planning chat when a shorter context is
needed:

> We have a React/Vite/TypeScript + Supabase mobile trip app originally built
> for exactly five named friends on one Bali bachelor trip. Preserve its
> existing feature set; do not invent new trip features. The current reachable
> features are: persona-filtered itinerary; five-person live crew status;
> next-flight countdown; manual event add/edit/delete with visibility, IST/WITA,
> notes and Maps link; PDF/image ticket scanning through a Claude-powered
> Supabase Edge Function that inserts an event; public scanned-document
> view/delete; shared expenses with INR/IDR, single or multiple payers, equal
> participant splits, balances, group totals, greedy settle-up suggestions and
> recorded settlements; a live INR↔IDR converter with quick values and a static
> Bali price guide; and a per-person Todo list. An AI concierge file exists only
> as an unreachable “Coming soon” placeholder.
>
> There is currently no real auth, persistent session, group, trip, membership,
> invitation, tenant isolation, or secure authorization. A visitor taps any of
> five hardcoded personas. All feature rows live in one global Supabase dataset;
> RLS policies allow unconditional access. Events, expenses, settlements and
> Todos identify people by display-name strings. Realtime subscriptions are
> global. Scanned files are in one public bucket.
>
> Generalization work must replace hardcoded users, the single trip, name-based
> references, global queries/realtime, and permissive RLS with authenticated
> users and group/trip-scoped ownership while retaining feature parity. Other
> hardcodings include May 22–27 2026, Bali/DPS, IST/WITA, INR/IDR, five-person
> layouts, a scan prompt forced to the 2026 Bali trip, and an accounting joke
> that avoids Astitva→Partha settlements. The live FX rate is currently separate
> from the static expense-accounting rate. README/SQL seed dates are stale and
> conflict with frontend source.

## 21. Verification note

The repository was inspected at the source, migration, and Edge Function level.
The worktree was clean before this report was added.

An attempted `npm run build` could not start because dependencies are not
installed in the workspace (`tsc: command not found`). No application source was
changed as part of this documentation pass.
