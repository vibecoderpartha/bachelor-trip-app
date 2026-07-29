# Codebase Inspection Record

## Inspection scope

Read-only inspection at commit `765e4ed3e1c177b6fdea42d8ae34de6f5e9f57d6`. This record describes current repository facts, not target behavior.

## Framework and runtime

| Area | Current inspection result |
|---|---|
| Framework | React `18.3.1` rendered from `src/main.tsx` through Vite `5.4.11` |
| Package manager | npm: `package-lock.json` is present and the current commands use `npm run` |
| Language | TypeScript `5.6.3`, strict/noEmit, bundler resolution in `tsconfig.json` |
| Styling | Tailwind `3.4.15` plus `src/styles/fonts.css` and `src/styles/global.css` |
| Runtime | Browser SPA; Vite dev server is configured at host `0.0.0.0`, port `3000`, strict port |
| Routing | No router, `app/`, `pages/`, Next.js configuration, or route directory found |
| Supabase client | `src/lib/supabase.ts` uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |
| Edge Function | `supabase/functions/parse-document/index.ts` imports Supabase JS from esm.sh and uses service-role environment variable |

## Confirmed source structure

| Path | Current purpose |
|---|---|
| `src/App.tsx` | Fixed five-tab shell, local active tab, local persona handoff, 480px layout |
| `src/tabs/` | `TripTab.tsx`, `ScanTab.tsx`, `SplitTab.tsx`, `FXTab.tsx`, `TodoTab.tsx`; dormant `AITab.tsx` exists but is not in active nav |
| `src/components/` | Event/expense/settlement modals and presentational cards/heroes |
| `src/components/ui/` | Shared modal, input, button, avatar, chip, border, text, and scanline primitives |
| `src/hooks/` | Local persona and direct Supabase query/subscription hooks |
| `src/lib/` | Supabase client, currency, splitting, and timezone helpers |
| `src/constants/` | Fixed personas, seeded events, asset/tab data |
| `supabase/migrations/` | Five legacy sequential SQL migrations |
| `supabase/functions/parse-document/index.ts` | Legacy privileged scan/parse/upload/Event insertion path |

## Current data and authority model

- `supabase/migrations/001_initial.sql` uses name/text fields for Event audiences, expense payer/splits, settlement participants, and recorder identity.
- `004_paid_by_splits.sql` adds JSONB name-to-amount values; `005_todos.sql` creates name-scoped Todos.
- `src/hooks/useCurrentUser.ts` stores a `User` only in React state. `src/components/PersonaPicker.tsx` selects one fixed persona from `src/constants/users.ts`.
- There is no Supabase Auth session helper, Profile lifecycle, Group, membership, Invitation, Participant claim, Active Group, generated database type file, or target state-management library.
- `useEvents`, `useExpenses`, and `useSettlements` query global tables and subscribe to global channels. `useTodos` filters and subscribes by persona name.
- Tabs and modals make direct browser-client mutations. There is no dedicated service, repository, or mutation layer.

## Current feature boundaries

| Feature | Current behavior / path |
|---|---|
| Trip | `src/tabs/TripTab.tsx` reads global Events, filters `for_users` client-side by name, and directly deletes Events |
| Scan | `src/tabs/ScanTab.tsx` submits file plus `uploaded_by` and `for_users`; uses public ticket URLs and deletes object then Event |
| Split | `src/tabs/SplitTab.tsx`, `AddExpenseModal.tsx`, `SettleUpModal.tsx` use direct global expense/settlement data and mutations |
| FX | `src/tabs/FXTab.tsx`, `src/lib/currency.ts` use static rate constants; `RATES.INR` is `188.68` |
| Todo | `src/tabs/TodoTab.tsx` and `useTodos.ts` use persona-name keys |
| Documents | Public `tickets` bucket from `002_tickets_bucket.sql`; Edge Function service role, parser provider call, and Event insertion |
| Realtime | Global Postgres-change channels in hooks; no Group switch/authorization cleanup boundary |

## Build, quality, deployment, and environments

| Concern | Inspection result |
|---|---|
| Build | `npm run build` runs `tsc && vite build` |
| Development | `npm run dev` or `npm run start` runs Vite |
| Lint/type check | No standalone lint or type-check script is configured; build invokes TypeScript |
| Tests | No test script, test directory, Vitest/Jest/Playwright configuration, or test runner dependency found |
| CI | No `.github/`, GitLab, or other CI configuration found |
| Deployment | Not established by current repository inspection |
| Generated types | Not established by current repository inspection |
| Environment variables | `.env.example` names browser-safe Vite Supabase URL/anon key and warns that Anthropic key belongs in Edge Function secrets |
| Server-only secrets | Edge Function reads `SUPABASE_SERVICE_ROLE_KEY` and `ANTHROPIC_API_KEY`; values were not inspected or recorded |

## Migration-relevant technical debt

- Legacy RLS is permissive: `USING (true)`/`WITH CHECK (true)` policies in `001_initial.sql`; `tickets` is public; Todos are open to all.
- Client code treats persona names and client-selected document audience/uploader fields as authority.
- Legacy financial representation is name-keyed and includes custom/percent/shares calculation branches; UI authoring is equal-only.
- Public document removal is two unguarded operations and deletes the associated Event.
- Edge Function creates a broad service-role boundary, external provider call, random object path, and partial-failure risk.
- Direct global queries/subscriptions create cross-Group and stale-data risks.

## Change classification

| Classification | Confirmed paths |
|---|---|
| Likely replacement/major conversion | `src/App.tsx`, `src/hooks/useCurrentUser.ts`, `src/hooks/useEvents.ts`, `src/hooks/useExpenses.ts`, `src/hooks/useSettlements.ts`, `src/hooks/useTodos.ts`, `src/tabs/ScanTab.tsx`, `supabase/functions/parse-document/index.ts` |
| Likely extension/conversion | Tab files, event/expense/settlement modals, `src/lib/currency.ts`, `src/lib/splitting.ts`, `src/lib/timezone.ts`, UI primitives |
| Preserve until owning later packet | Accepted architecture/UI docs and assets; legacy migrations/seed as source evidence; locked design tokens/Screen IDs/Component IDs |

No production implementation has started. Exact future feature-directory, routing, test-tool, CI, generated-type, deployment, and migration filenames are **Not established by current repository inspection**.

## Path classification used by this review

Every repository path named above is classified below so that a planning
document cannot accidentally turn a conventional target path into a repository
fact.

| Classification | Paths / interpretation |
|---|---|
| Confirmed existing | `src/main.tsx`, `src/App.tsx`, every listed `src/tabs/`, `src/components/`, `src/components/ui/`, `src/hooks/`, `src/lib/`, `src/constants/`, `src/styles/`, `supabase/migrations/`, `supabase/seed.sql`, `supabase/functions/parse-document/index.ts`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.ts`, `.env.example` |
| Proposed | Any later feature directory, test directory, CI workflow, transform script, evidence directory, or new migration filename. These do not exist unless a packet explicitly labels them **Proposed path — verify at packet start**. |
| Generated | No generated database type file is present. A future generated type file is a generated output only after its source schema and generation provenance are approved. |
| Not established | Deployment configuration, CI configuration, browser-test tooling, database/RLS-test harness, test environment, rehearsal environment, production project configuration, target routing model, target state-management library, and target data-fetching library. |

`src/lib/supabase.ts` is the one confirmed shared browser Supabase client. It
uses only the browser-visible Vite variables. The legacy Edge Function is a
separate confirmed server boundary; it reads environment values at runtime, but
the repository does not establish any deployed secret, project identifier, or
environment state.
