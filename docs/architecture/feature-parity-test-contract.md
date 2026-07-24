# Feature Parity Test Contract

| Field | Value |
|---|---|
| Status | Accepted |
| Document type | Feature-parity, intentional-change, exclusion, and acceptance contract |
| Scope | Verifiable preservation of the frozen v1 Bali product while conforming to the Accepted multi-tenant architecture |
| Current-state baseline | [V1 Codebase Feature and Flow Report](../v1-codebase-feature-and-flow-report.md) |
| Related documents | [Multi-Tenant Target Architecture](multi-tenant-target-architecture.md); [Domain and Data Model](domain-and-data-model.md); [Authentication, Group, and Invitation Flows](auth-groups-and-invitations.md); [Security Model](security-model.md); [V1 Migration Plan](v1-migration-plan.md); [Deferred-Scope Register](../product/deferred-scope-register.md) |
| Related ADRs | [ADR-0001](decisions/ADR-0001-group-is-trip-tenant.md), [ADR-0002](decisions/ADR-0002-supabase-auth-is-authoritative.md), [ADR-0003](decisions/ADR-0003-commercial-membership-deferred.md), [ADR-0004](decisions/ADR-0004-group-member-id-is-participant-identity.md), [ADR-0005](decisions/ADR-0005-normalized-finance-payers-and-shares.md), [ADR-0006](decisions/ADR-0006-group-configuration.md), [ADR-0007](decisions/ADR-0007-single-use-atomic-invitation-acceptance.md), and [ADR-0008](decisions/ADR-0008-group-scoped-authorization-with-rls-and-trusted-operations.md) are Accepted |
| Last reviewed | 2026-07-24 |

> This Accepted Phase 6 contract is a locked Phase 7 implementation and test
> input. Its acceptance does not mean that implementation tests, migration
> rehearsals, security tests, or deployed verification have already passed.

## 1. Purpose, authority, and boundary

This contract defines verifiable preservation, intentional change, exclusion,
and acceptance criteria against the frozen v1 report. It distinguishes:

- verified v1 user-visible behaviour;
- verified persisted-data behaviour;
- verified derived calculations;
- known bugs and limitations;
- latent or unreachable code;
- stale documentation or seed claims;
- Accepted target-architecture changes;
- intentional parity exceptions;
- Deferred features; and
- target-only conformance requirements with no v1 equivalent.

The contract specifies fixtures, assertions, evidence, traceability, and release
gates. It does not implement tests, choose a test framework, or prescribe
physical schemas, APIs, policies, or deployment mechanisms.

## 2. Parity classification

| Classification | Exact meaning |
|---|---|
| Preserve | User-visible or data behaviour remains materially equivalent. |
| Preserve with target-safe adaptation | Behaviour remains, but identity, Tenant, security, configuration, or data representation changes to conform to Accepted architecture. |
| Intentional parity exception | Verified v1 behaviour is deliberately changed and requires an explicit reason, approval, test, and acceptance evidence. |
| Data-preservation only | Stored or historical values are retained even though equivalent creation or editing UI is not required. |
| Not a v1 parity feature | Dormant, unreachable, unused, stale, or falsely documented behaviour creates no parity requirement. |
| Deferred | The deferred-scope register explicitly excludes the behaviour. |
| Target-only conformance | Accepted architecture requires the behaviour without a secure v1 equivalent. |

No verified behaviour may be omitted because migration or testing is difficult.
When one feature contains more than one classification, the primary matrix
states the controlling classification and identifies the separately asserted
data or intentional-exception case.

## 3. Fixtures and test contexts

The implementation test inventory must provide:

- one migrated Bali Group and one unrelated non-Bali Group, with operational
  rows and private documents in both Tenants;
- active Owners, active ordinary Members, authenticated non-members, inactive
  Members, unclaimed Legacy Participants, and atomically claimed-and-activated
  ordinary migrated Members;
- duplicate, variant, empty, and unknown legacy names;
- claim/activation evidence sets with all required Auth, adjudication,
  independent-corroboration, and approval categories, plus insufficient and
  conflicting variants;
- active and archived Groups;
- valid, invalid, revoked, expired, and used Invitations;
- Events with null, empty, single-Participant, and multi-Participant audiences;
- manual and scan-derived Events, including flight and non-flight cases;
- valid and malformed documents, orphan objects, and orphan metadata;
- INR and IDR Expenses, single and multiple payers, equal and actually stored
  non-equal splits, and deterministic rounding edges;
- valid Settlements and malformed party/recorder/amount cases;
- Todos for multiple Participants and multiple Groups;
- successful live FX, failed/offline FX, and fallback-rate responses;
- Bali configuration with IDR accounting and non-Bali Group configuration with
  a different accounting currency; and
- stale sessions, object-ID substitutions, interrupted migration stages, and
  concurrent bootstrap, claim/activation, and other trusted-operation attempts.

Fixtures use synthetic or safely transformed data. They contain no real
credentials, plaintext PINs, actual Invitation secrets, or unnecessary
production document contents.

## 4. Complete v1 feature-parity matrix

Each frozen-report feature-inventory row appears exactly once as `FP-001`
through `FP-020`. An Accepted contract decision fixes the required outcome;
Phase 7 implementation and execution evidence remains pending and is not a
passing result.

| Parity ID | V1 feature/behaviour | Frozen-report evidence | Classification | Target behaviour | Actor and Group context | Data fixture | Test level | Positive assertion | Negative/security assertion | Intentional difference | Migration dependency | Acceptance result | Linked exception |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FP-001 | Persona selection/switching | [Identity and app entry](../v1-codebase-feature-and-flow-report.md#3-current-identity-and-app-entry-flow) | Intentional parity exception | Supabase Auth, current Group membership, stable Participant identity, and Active Group navigation replace impersonable personas | Authenticated Member in Bali and unrelated Group; non-member | Claimed/unclaimed Participants and two Groups | E2E, Auth, security | User reaches only own current Participant context and can select an authorized Group | Name/persona/PIN/Profile changes cannot impersonate or grant access | Insecure persona switching is removed; recognizable personalization may remain | M01, M02, M16, M18 | Accepted contract decision — Phase 7 implementation and execution evidence pending | IPE-AUTH-001 |
| FP-002 | Personalized itinerary | [Trip visibility](../v1-codebase-feature-and-flow-report.md#61-data-loading-and-visibility) | Preserve with target-safe adaptation | Audience relationships filter presentation for the current Participant inside an authorized Group | Active Bali Member, other Member, non-member, inactive Member | Null/empty/single/multi audiences | Integration, E2E, security | Current Participant sees assigned/everyone itinerary in chronological order | Other Group denied; audience does not hide database rows from active co-members | Names become stable relationships; presentation is not confidentiality | M03–M05, M16, M18 | Accepted contract decision — Phase 7 implementation and execution evidence pending | IPE-EVENT-001 |
| FP-003 | Crew live-status summary | [Crew status](../v1-codebase-feature-and-flow-report.md#62-crew-status) | Preserve with target-safe adaptation | Status derives from current Group Participants, Events, time, and reviewed destination configuration | Active Group Member | Pre-trip, airborne, active event, in-destination, home | Deterministic calculation, E2E | Labels and transitions match configured Bali fixture | Unrelated Group data and hardcoded five-person assumptions do not leak | DPS semantics move to migrated Bali configuration | M03, M05, M18 | Accepted contract decision — Phase 7 implementation and execution evidence pending | None |
| FP-004 | Next-flight countdown | [Next-flight countdown](../v1-codebase-feature-and-flow-report.md#63-next-flight-countdown) | Preserve with target-safe adaptation | First future visible flight expands/collapses and counts down using Group time context | Active Member | No flight, future flight, past flight, missing optional metadata | Calculation, E2E | Title, dual-time display, metadata, countdown, and no-flight state are recognizable | Cross-Group or unauthorized flight never appears | IANA configuration replaces global IST/WITA constants | M03, M05, M18 | Accepted contract decision — Phase 7 implementation and execution evidence pending | None |
| FP-005 | Manual Event add/edit/delete | [Add Event](../v1-codebase-feature-and-flow-report.md#66-add-event-flow); [Event delete](../v1-codebase-feature-and-flow-report.md#65-event-card); [Edit Event](../v1-codebase-feature-and-flow-report.md#67-edit-event-flow) | Preserve with target-safe adaptation | Authorized Members create/edit/delete Group Events with stable actor/audience relationships and safe failures | Active Member/Owner; inactive/non-member | Manual Events with optional fields | E2E, integration, security | Required/optional fields, edit boundaries, and removal behaviour work in Group | Forged actor/Group/audience or cross-Group ID denied; failure is not hidden | Session actor replaces `created_by` name; safe target errors supersede silent failures | M03–M05, M16, M18 | Accepted contract decision — Phase 7 implementation and execution evidence pending | IPE-ERR-001 |
| FP-006 | Google Maps link | [Event card](../v1-codebase-feature-and-flow-report.md#65-event-card) | Preserve | Retained valid Maps link is displayed and opens as a link | Authorized Event viewer | Event with/without valid link | E2E | Link presence and absence match data | Unauthorized Event cannot disclose link | None | M03 | Accepted contract decision — Phase 7 implementation and execution evidence pending | None |
| FP-007 | Document scan and parsing | [Scan upload and parser](../v1-codebase-feature-and-flow-report.md#7-scan-tab-complete-behavior-and-flow) | Preserve with target-safe adaptation | Authorized Member uploads PDF/image; primary booking is validated into Group Event and private document metadata | Active Member; inactive/non-member | Valid PDF/image, invalid type, parse failure, invalid end time | E2E, Storage, trusted rollback | Valid primary booking creates associated Event/document with client audience semantics | Invalid/cross-Group/inactive path fails without public or orphan authority | Provider/model identity is not parity; private atomic/reconciled handling replaces public partial flow | M03–M06, M16–M18 | Accepted contract decision — Phase 7 implementation and execution evidence pending | IPE-SCAN-001 |
| FP-008 | Scanned-document list/view/delete | [Previously scanned documents](../v1-codebase-feature-and-flow-report.md#73-previously-scanned-documents) | Preserve with target-safe adaptation | Authorized Members list, privately view/download, and safely remove/reconcile Group documents | Active Member; inactive/non-member; archived Group | Valid mapping, orphan object/metadata, malformed metadata | E2E, Storage, security | List/view/removal produce consistent private outcomes | Public URL, guessed path, cross-Group ID, inactive Member, archived mutation denied | Public access and hidden deletion failure are removed | M06, M16, M17 | Accepted contract decision — Phase 7 implementation and execution evidence pending | IPE-STORAGE-001 |
| FP-009 | Shared Expenses | [Split shared data](../v1-codebase-feature-and-flow-report.md#81-shared-data) | Preserve with target-safe adaptation | Current Members share Group-scoped normalized Expense history and realtime updates | Active Group Members | Bali INR/IDR Expenses and unrelated-Group configured accounting values | E2E, database, realtime, security | Group Expense list and changes remain collaborative | Non-member/inactive/cross-Group read/write/subscription denied | Global access becomes Group-authorized access | M07–M13, M16 | Accepted contract decision — Phase 7 implementation and execution evidence pending | None |
| FP-010 | Single- and multi-payer Expenses | [Add-expense flow](../v1-codebase-feature-and-flow-report.md#82-add-expense-flow) | Preserve with target-safe adaptation | One or many stable same-Group payer contributions reconcile exactly | Active Member | Single/multiple payers, contribution mismatch | Calculation, database, E2E | Valid exact contributions create complete Expense | Unknown/cross-Group payer, mismatch, partial child write denied | Name-keyed scalar/JSON becomes normalized contributions | M07, M08, M11 | Accepted contract decision — Phase 7 implementation and execution evidence pending | None |
| FP-011 | Equal splitting | [Supported split algorithms](../v1-codebase-feature-and-flow-report.md#87-supported-split-algorithms) | Preserve with target-safe adaptation | Equal final shares use smallest accounting-currency units; remainder units go in ascending immutable stable Participant identity order | Active Member | Divisible and 100-unit/three-Participant remainder fixtures | Calculation, database | Shares sum exactly; `P-01`, `P-02`, `P-03` receive 34, 33, 33 from 100 units | Empty/duplicate/cross-Group Participants and partial share updates denied; names/Profile/client order cannot affect remainder | Exact normalized shares replace client-only/name arrays | M09, M11 | Accepted contract decision — Phase 7 implementation and execution evidence pending | None |
| FP-012 | Latent custom/percentage/share splitting | [Latent split algorithms](../v1-codebase-feature-and-flow-report.md#87-supported-split-algorithms); [misleading equal per-head display](../v1-codebase-feature-and-flow-report.md#84-expense-list); [equal edit overwrite](../v1-codebase-feature-and-flow-report.md#83-edit-expense-flow) | Data-preservation only | Valid stored non-equal history is migrated, reconciled, calculated, and presented through exact final shares; lack of non-equal authoring remains data-preservation-only | Authorized viewer; migration actor | Valid and malformed stored custom/percent/share data | Migration transform, calculation, E2E | Retained valid history presents each exact final share rather than an equal per-head value | Equal edit cannot silently overwrite non-equal history; malformed data blocks | IPE-SPLIT-001 corrects misleading presentation and unsafe overwrite, not the absence of authoring UI | M09–M11 | Accepted contract decision — Phase 7 implementation and execution evidence pending | IPE-SPLIT-001 |
| FP-013 | Balances and group totals | [Balance calculation](../v1-codebase-feature-and-flow-report.md#85-balance-calculation); [group totals](../v1-codebase-feature-and-flow-report.md#86-group-totals) | Preserve with target-safe adaptation | Exact normalized contributions, shares, and configured-currency Settlements derive Participant balances and spending totals | Active Member | Multiple Expenses/Settlements; Bali within-one-IDR edge; non-Bali configured-currency case | Calculation, E2E | Per-Participant balance, paid/share totals, total spend match reproducible formulas and currency scope | Other Group data or Bali tolerance cannot affect unrelated Group results | Stable identities, exact decimals, and Group accounting configuration replace names/binary arithmetic | M07–M14 | Accepted contract decision — Phase 7 implementation and execution evidence pending | None |
| FP-014 | Suggested settle-up transfers | [Settle-up flow](../v1-codebase-feature-and-flow-report.md#88-settle-up-flow) | Intentional parity exception | Debtors and creditors sort by descending absolute balance with ascending stable-identity ties; general deterministic matching has no name-based exception | Active Member | Exact `P-01`–`P-04` tie fixture and former hardcoded pairing | Calculation, E2E | Suggestions are exactly `P-01→P-03:50`, `P-01→P-04:10`, `P-02→P-04:40` accounting units | Cross-Group Participants, mutable ordering inputs, and payment claims denied | Astitva→Partha avoidance is removed as a general rule | M14, M18 | Accepted contract decision — Phase 7 implementation and execution evidence pending | IPE-SET-001 |
| FP-015 | Recording a Settlement | [Settle-up flow](../v1-codebase-feature-and-flow-report.md#88-settle-up-flow) | Preserve with target-safe adaptation | Authorized debtor records a ledger Settlement in the Group’s configured accounting currency with trusted recorder provenance | Debtor Member; other Member; non-member | Bali IDR and non-Bali different-accounting-currency Settlements plus malformed cases | Database, E2E, realtime, security | Valid record uses that Group’s accounting currency and updates balances after authorized realtime | Forged recorder/party, wrong currency, edit/delete, cross-Group, or payment interpretation denied | IDR and below-one-IDR tolerance are migrated Bali parity only; session-derived recorder replaces active persona name | M14, M16, M18 | Accepted contract decision — Phase 7 implementation and execution evidence pending | None |
| FP-016 | INR/IDR converter | [FX converter](../v1-codebase-feature-and-flow-report.md#91-converter) | Preserve | Bidirectional editable reference conversion, fallback, direction control, and quick values remain | Authorized app user where product permits | INR/IDR values and rounding edges | Calculation, E2E | Both directions use selected reference rate reproducibly | Converter cannot rewrite ledger history or grant authority | IPE-FX-001 recomputes after initial live refresh and makes direction flip recompute the target value | M12, M18 | Accepted contract decision — Phase 7 implementation and execution evidence pending | IPE-FX-001 |
| FP-017 | Live exchange-rate refresh | [FX converter](../v1-codebase-feature-and-flow-report.md#91-converter) | Preserve with target-safe adaptation | Successful refresh updates reference rate; failure shows fallback/offline state; manual refresh works | Authorized app user | Success, failure, stale, fallback responses | Integration, E2E | Status/time and recalculation follow documented target decision | Untrusted response cannot become historical accounting evidence | Provider endpoint is implementation detail; accounting/live separation is mandatory | M12, M13 | Accepted contract decision — Phase 7 implementation and execution evidence pending | IPE-FX-001 |
| FP-018 | Bali price guide | [Bali price guide](../v1-codebase-feature-and-flow-report.md#93-bali-price-guide) | Preserve with target-safe adaptation | Retained static Bali content appears only in migrated Bali Group with current reference conversion | Bali Member; unrelated Group Member | Bali and non-Bali configuration | E2E, configuration | Bali fixture shows reviewed items and conversions | Unrelated Group shows no Bali guide or global/generated substitute | Content is Group-confined, not worldwide | M18 | Accepted contract decision — Phase 7 implementation and execution evidence pending | None |
| FP-019 | Personal Todo list | [Todo tab](../v1-codebase-feature-and-flow-report.md#10-todo-tab-complete-behavior-and-flow) | Preserve with target-safe adaptation | Current Participant owns Group-scoped Todos with realtime updates and safe errors | Active Member, inactive Member, unclaimed Participant | Multiple Participants/Groups, completed/incomplete | E2E, database, realtime, security | Trim/add/group/toggle/delete/delete-completed remain recognizable | Cross-Group, inactive, unclaimed, or forged owner access denied | Stable Participant/session replaces persona-name convention | M15, M16 | Accepted contract decision — Phase 7 implementation and execution evidence pending | IPE-ERR-001 |
| FP-020 | Dormant AI concierge | [Dormant AI concierge](../v1-codebase-feature-and-flow-report.md#11-dormant-ai-concierge) | Not a v1 parity feature | No concierge is required or represented as delivered | Any | Unreachable source path | Static traceability | Navigation and feature inventory do not claim a delivered concierge | No hidden provider/content feature is introduced | Dormant placeholder is explicitly excluded | None | Accepted contract decision — Phase 7 implementation and execution evidence pending | None |

## 5. UI and interaction contract

The frozen report groups recognizable behaviour into 14 bullets. The following
14 rows preserve that grouping while tracing every characteristic requested for
Phase 6.

| UI ID | Recognizable behaviour and design intent | Disposition | Evidence | Implementable case and expected outcome | Release-blocking | Exception |
|---|---|---|---|---|---|---|
| UI-01 | Mobile-first warm dark presentation, coral accent, Participant colors | Preserve | [UI contract](../v1-codebase-feature-and-flow-report.md#17-ui-and-interaction-contract-worth-preserving) | Representative narrow viewport retains warm dark/coral hierarchy and readable Participant cues; visual review is behavioural, not pixel-perfect | Yes for unusable primary flows | None |
| UI-02 | Participant-specific hero imagery and personality copy where applicable | Preserve with target-safe adaptation | [Shared shell](../v1-codebase-feature-and-flow-report.md#4-navigation-and-shared-shell) | Claimed current Participant receives appropriate hero treatment; another identity cannot be selected to impersonate | Yes | IPE-AUTH-001 |
| UI-03 | Fast primary-section switching without full navigation | Preserve | [Shared shell](../v1-codebase-feature-and-flow-report.md#4-navigation-and-shared-shell) | Trip, Scan, Split, FX, and Todo switch without a full-page reload and retain safe Group context | Yes | None |
| UI-04 | Per-person itinerary presentation filtering | Preserve with target-safe adaptation | [Trip visibility](../v1-codebase-feature-and-flow-report.md#61-data-loading-and-visibility) | Stable audience relationships derive the current Participant view; active co-members retain database read authority | Yes | IPE-EVENT-001 |
| UI-05 | Timeline status, expandable notes, Maps links, dual-timezone display | Preserve with target-safe adaptation | [Timeline and Event card](../v1-codebase-feature-and-flow-report.md#64-timeline-and-event-status) | Boundary-time fixtures produce past/live/next/upcoming, notes toggle, valid link renders, and configured zones display | Yes | IPE-TIME-001 if a verified defect is corrected |
| UI-06 | At-a-glance crew status | Preserve with target-safe adaptation | [Crew status](../v1-codebase-feature-and-flow-report.md#62-crew-status) | Status covers current Participants and configured destination semantics without five-person global assumptions | Yes | None |
| UI-07 | Expandable live next-flight countdown | Preserve with target-safe adaptation | [Countdown](../v1-codebase-feature-and-flow-report.md#63-next-flight-countdown) | Collapse/expand, one-second countdown, flight metadata, dual-zone display, and no-flight state pass | Yes | None |
| UI-08 | Manual and scan-derived itinerary creation | Preserve with target-safe adaptation | [Trip and Scan](../v1-codebase-feature-and-flow-report.md#6-trip-tab-complete-behavior-and-flow) | Both authorized paths create Group Events with distinct provenance and safe failure outcomes | Yes | IPE-SCAN-001 |
| UI-09 | Realtime shared Expense and Settlement state | Preserve with target-safe adaptation | [Realtime](../v1-codebase-feature-and-flow-report.md#14-realtime-and-state-behavior) | Authorized same-Group clients refresh on changes; unrelated and removed clients receive nothing | Yes | None |
| UI-10 | Single/multi-payer equal splitting | Preserve with target-safe adaptation | [Add Expense](../v1-codebase-feature-and-flow-report.md#82-add-expense-flow) | Valid contributions and equal exact shares reconcile; invalid totals do not commit | Yes | None |
| UI-11 | INR and IDR accounting presentation | Preserve | [Expense list](../v1-codebase-feature-and-flow-report.md#84-expense-list) | Original/accounting displays match immutable evidence and documented rounding | Yes | None |
| UI-12 | Suggested minimum-transfer settle-up flow | Intentional parity exception | [Settle-up](../v1-codebase-feature-and-flow-report.md#88-settle-up-flow) | General deterministic suggestions settle balances; no name-based exception applies | Yes | IPE-SET-001 |
| UI-13 | Bidirectional FX conversion and destination price reference | Preserve with target-safe adaptation | [FX tab](../v1-codebase-feature-and-flow-report.md#9-fx-tab-complete-behavior-and-flow) | Both directions, fallback/live states, quick values, and Bali-only guide behave as classified | Yes | IPE-FX-001 |
| UI-14 | Personal Participant Todo behaviour | Preserve with target-safe adaptation | [Todo tab](../v1-codebase-feature-and-flow-report.md#10-todo-tab-complete-behavior-and-flow) | Current Participant list supports loading/empty/grouped mutations and authorized realtime | Yes | IPE-ERR-001 |

Pixel-perfect preservation of the insecure persona picker is not required.
Recognizable product behaviour, hierarchy, interaction, and configured
personalization are required.

## 6. Required Phase 6 parity resolutions

### 6.1 Authentication and persona behaviour

Persona selection and switching are not preserved as Authentication. Validated
Supabase Auth, current Group membership, stable Participant identity, and Active
Group navigation replace them. No user can impersonate another Participant by
selecting a name. `IPE-AUTH-001` records removal of the verified insecure
impersonation behaviour while preserving safe personalization.

### 6.2 Event audience behaviour

Null/empty “everyone” and explicit v1 assignment presentation are preserved
through stable same-Group audience relationships. Audience is presentation, not
confidentiality. Every current active Group Member retains Event database-read
authorization under the Accepted Security Model. No private or secret Event
feature is introduced. `IPE-EVENT-001` records the change from client name
filtering to stable presentation relationships.

### 6.3 Latent split modes

Custom, percentage, and weighted-share branches are not required as new
creation/edit UI because v1 exposes none. Actually persisted valid non-equal
data is inventoried, migrated, reconciled, calculated, and presented accurately.
The absence of non-equal authoring UI remains Data-preservation only and is not
itself changed behaviour. `IPE-SPLIT-001` is the genuine intentional correction:
valid non-equal history is presented through exact final shares rather than the
misleading equal per-head value, and equal editing cannot overwrite that history
silently. Future non-equal authoring UI requires separate approval.

### 6.4 Settlement hardcoding

The Astitva→Partha avoidance rule is trip-specific hardcoding, not a general
accounting invariant. `IPE-SET-001` removes it from target suggestions,
including the migrated Group, in favour of one general deterministic
debtor/creditor algorithm. Tests compare both the expected general result and
the documented v1 difference. No name-based rule applies to any Group.

### 6.5 FX behaviour

The interactive INR/IDR converter, live refresh, fallback state, manual refresh,
direction editing, and quick values are preserved. Historical Expenses retain
their recorded accounting values and reproducible static-rate evidence; the
live converter rate never substitutes for ledger evidence. `IPE-FX-001`
corrects the initial successful-fetch non-recomputation. A direction flip makes
the previously calculated side the source, makes the other side the target,
and immediately recomputes the target from the unchanged source value; labels
and focus must make that direction observable.

### 6.6 Bali guide

Reviewed Bali-specific price content is preserved only for the migrated Bali
Group. It is absent from unrelated Groups and is not generalized into worldwide
or automatically generated content.

### 6.7 AI and false/offline claims

Dormant/unreachable concierge code is not parity. Offline/PWA, seed fallback,
persona persistence, and other behaviours absent from the verified runtime are
not parity. Stale README, handoff, and seed dates have no parity authority.

### 6.8 Security adaptations

Public Storage, permissive RLS, client persona filtering, global queries, and
global realtime are not preserved as weaknesses. Private Group-owned Storage,
deny-by-default RLS, stable presentation filtering, Group-scoped queries, and
authorized realtime are Preserve with target-safe adaptation outcomes, not
regressions.

### 6.9 Intentional parity exception register

Every exception is an Accepted Phase 6 decision and remains release-blocking
until Phase 7 supplies and passes the linked evidence.

| Exception ID | Verified v1 behaviour changed | Target decision and reason | Required Phase 7 evidence | Decision and release status |
|---|---|---|---|---|
| IPE-AUTH-001 | Any visitor can select or switch to any persona | Remove impersonation; validated Auth and current membership are mandatory | Auth/persona positive and denial cases; product/security approval | Accepted Phase 6 decision — release-blocking until Phase 7 evidence passes |
| IPE-EVENT-001 | Name-array client filtering appears to control Event visibility | Preserve assignment presentation with stable relationships; do not claim confidentiality | Audience presentation plus active-co-member read and cross-Group denial | Accepted Phase 6 decision — release-blocking until Phase 7 evidence passes |
| IPE-ERR-001 | Several destructive/mutation failures are hidden and actions may lack confirmation | Surface safe success/failure and require an explicit destructive-action confirmation or equivalent deliberate action | Event/document/Todo failure and cancellation evidence; product approval | Accepted Phase 6 decision — release-blocking until Phase 7 evidence passes |
| IPE-SCAN-001 | Upload may leave a public orphan after parse/database failure | Reconcile or quarantine partial output privately because orphan authority is unsafe | Injected failure and zero-public-orphan evidence | Accepted Phase 6 decision — release-blocking until Phase 7 evidence passes |
| IPE-STORAGE-001 | Scanned documents use public URLs and deletion can appear successful after failure | Require private authorization and one reconciled removal outcome | Storage positive/denial and partial-removal evidence | Accepted Phase 6 decision — release-blocking until Phase 7 evidence passes |
| IPE-SPLIT-001 | Valid stored non-equal data can be displayed as a misleading equal per-head value and overwritten as equal during edit | Present exact final shares and prevent silent equal overwrite; absence of non-equal authoring remains Data-preservation only | Inventory, exact-share presentation, guarded editing, and malformed-data evidence | Accepted Phase 6 decision — release-blocking until Phase 7 evidence passes |
| IPE-SET-001 | Suggestions avoid Astitva→Partha when alternatives exist | Remove name-based logic and use one deterministic general algorithm | Fixture comparison, deterministic output, full settlement evidence | Accepted Phase 6 decision — release-blocking until Phase 7 evidence passes |
| IPE-FX-001 | Live fetch leaves initial output empty and direction flip changes only an indicator | Recompute on successful refresh and make direction flip recalculate an observable target | Success/failure/manual/flip calculations and interaction review | Accepted Phase 6 decision — release-blocking until Phase 7 evidence passes |
| IPE-FIN-001 | Changing Expense currency can reinterpret entered payer strings without conversion | Reject or deliberately convert incompatible contributions; never silently reinterpret them | Currency-change input/output, validation, and reconciliation evidence | Accepted Phase 6 decision — release-blocking until Phase 7 evidence passes |
| IPE-TIME-001 | Timeline status has no dedicated time refresh and date display is IST-bound | Use Group configuration and time-driven refresh so boundary transitions and configured dates are correct | IANA instant/boundary cases and visual transition evidence | Accepted Phase 6 decision — release-blocking until Phase 7 evidence passes |

## 7. Trip and Event cases

| Case group | Inputs and context | Required positive outcome | Required negative or edge outcome |
|---|---|---|---|
| TE-01 Ordering and audience | Same-time and ordered Events; null/empty/single/multi audience; duplicate display labels | Deterministic chronological presentation; everyone and current-Participant filtering follow stable relationships | Duplicate names do not merge; active co-members can read underlying Event; non-member/cross-Group denied |
| TE-02 Crew and destination status | Pre-trip, active flight, active non-flight, inbound/outbound DPS fixture, non-Bali airport configuration | Migrated Bali preserves Pre-trip/Airborne/activity/In Bali/Home meaning; new Group uses its configuration | Global DPS or five-person constant does not affect unrelated Group |
| TE-03 Countdown and boundaries | No flight, future flights, start/end instants, missing metadata, local clock progression | First visible future flight, collapse/expand, one-second countdown, and boundary states are reproducible | Past/unauthorized flight is not selected; generic no-flight state is safe |
| TE-04 Time display and refresh | IST-observed source instants, WITA IANA mapping, date boundary, parent rerender/no rerender | Configured zones display expected instants; refresh behaviour is explicit | IPE-TIME-001 is required if dedicated status refresh corrects the v1 limitation |
| TE-05 Event presentation | Notes, Maps link, route/location, audience avatars, optional fields | Notes expand, links and metadata render when present, status badges match | Malformed link is safe; seed-only embedded Expense is not falsely required |
| TE-06 Manual lifecycle | Required/optional form fields, create/edit/delete, mutation failure | Authorized create/edit/delete respects documented editable fields and reports safe outcome | Forged creator/Group/Participant, inactive/archived/cross-Group mutation denied |
| TE-07 Scan-derived lifecycle | Parsed primary booking, invalid end time, client audience, flight metadata | Validated scan creates Event with scan provenance and client audience override | Provider output cannot override Group/actor/audience authority; partial failure reconciles |
| TE-08 Archived and realtime | Active then archived Group, subscription before/after change | Active authorized changes arrive; archive-aware reads follow contract | Archived mutation and ordinary realtime fail; unrelated Group never receives payload |

Event audience remains assignment/presentation semantics. These cases do not
create private Events.

## 8. Scan and document cases

| Case ID | Required input and assertion |
|---|---|
| SD-01 | Valid PDF and supported image each pass file validation; unsupported type fails before creating authority. |
| SD-02 | A multi-booking document produces the validated primary booking behaviour; no specific AI provider or model identifier is required. |
| SD-03 | Date/time interpretation uses reviewed Group context; end-before-start or excessive end duration follows explicit validation and warning behaviour. |
| SD-04 | Extracted fields are whitelisted/validated conceptually; the client audience choice overrides extracted assignment but cannot override Group ownership. |
| SD-05 | Current session derives uploader provenance; unknown migrated uploader remains historical evidence, not a fabricated actor. |
| SD-06 | Event, metadata, object, and Group references agree; cross-Group substitution fails. |
| SD-07 | Authorized Members privately list/view/download; public URL/path knowledge grants nothing. |
| SD-08 | Removal reaches a consistent Event/metadata/object outcome or an auditable reconciliation state. |
| SD-09 | Parse failure after upload and database failure after upload create no authorized orphan; partial artifacts are quarantined/reconciled. |
| SD-10 | Pre-existing orphan object and orphan metadata cases retain explicit disposition and integrity evidence. |
| SD-11 | Inactive Member and non-member read/mutation fail; archived Group mutation fails. |
| SD-12 | Guessed object ID/path and unrelated-Group metadata substitution disclose no object or ownership detail. |

## 9. Finance cases

### 9.1 Reproducible formulas

For exact-decimal accounting amount `A`, payer contributions `P_i`, final
shares `S_i`, and Settlements from payer to receiver:

- `sum(P_i) = A`;
- `sum(S_i) = A`;
- pre-Settlement Participant balance is total contributions minus total shares;
- recording a Settlement increases the payer’s balance and decreases the
  receiver’s balance by the exact accounting amount;
- group total spending is the sum of Expense accounting amounts and excludes
  Settlements;
- the migrated Bali fixture alone preserves the verified v1 interpretation
  that an absolute balance below one IDR is settled; and
- other Groups use exact zero after smallest-unit accounting and inherit no IDR
  currency or tolerance.

The deterministic ordering attribute is the immutable stable Participant
identity Accepted by ADR-0004. Compare its canonical normalized identity value
in ascending, locale-independent order. Display names, Profile values, persona
order, client arrays, and mutable presentation data never participate; equal
identity values are invalid.

For an equal split among `n` Participants, express `A` in exact smallest
accounting-currency units, give every Participant the integer quotient, and give
one remaining unit to each Participant in ascending stable-identity order until
the remainder is exhausted.

For suggestions, normalize exact zero and the Bali-only below-one-IDR parity
tolerance first. Order debtors by descending absolute debt and creditors by
descending credit; break equal amounts by ascending stable Participant identity.
Transfer the smaller of the first debtor’s debt and first creditor’s credit.
Remove a satisfied entry; keep a partially satisfied entry first; repeat until
both sides are empty.

For canonical fixture order `P-01 < P-02 < P-03 < P-04`, an equal split of 100
IDR among `P-01`, `P-02`, and `P-03` is exactly 34, 33, and 33 IDR. Balances
`P-01 = -60`, `P-02 = -40`, `P-03 = +50`, and `P-04 = +50` IDR yield exactly:

1. `P-01 → P-03: 50 IDR`;
2. `P-01 → P-04: 10 IDR`; and
3. `P-02 → P-04: 40 IDR`.

A non-Bali Group configured for USD with balances of -1234 and +1234 smallest
units yields one 12.34 USD Settlement. It uses its own accounting currency,
requires exact zero after smallest-unit accounting, and applies neither IDR nor
the Bali below-one-IDR tolerance. The INR/IDR converter has no ledger authority
in either fixture.

### 9.2 Required cases

| Case group | Coverage and expected outcome |
|---|---|
| FN-01 Expense lifecycle | Authorized creation/correction supports INR/IDR, original/accounting preservation, single/multiple payers, equal share selection, and complete atomic result; generic deletion is absent. |
| FN-02 Contributions | Each payer is same-Group; exact contributions equal `A`; mismatch, duplicate, unknown, cross-Group, or partial child mutation fails. |
| FN-03 Shares | Equal remainder uses ascending immutable stable Participant identity: 100 units across `P-01`–`P-03` yields 34/33/33. Stored non-equal exact shares sum to `A`, display individually, and cannot be silently overwritten as equal; malformed history enters exception. |
| FN-04 Historical FX | Static 188.68 evidence reproduces affected legacy accounting; converter live rate never recalculates migrated history. |
| FN-05 Balances/totals | Per-Participant balances, paid/share totals, total spending, and group totals match exact formulas before/after Settlements; equal-share remainder evidence uses ascending stable identity, Bali alone uses below-one-IDR normalization, and the non-Bali fixture requires exact configured-currency zero. |
| FN-06 Settlements | Valid debtor record uses the Group’s configured accounting currency and trusted recorder provenance. Bali uses IDR; the non-Bali fixture records 12.34 USD from -1234/+1234 smallest-unit balances. No generic edit/delete, payment processing, fabricated recorder, converter authority, or inherited IDR rule exists. |
| FN-07 Suggested transfers | Debtors/creditors sort by descending absolute balance with ascending stable-identity tie breaks. The exact fixture yields `P-01→P-03:50`, `P-01→P-04:10`, `P-02→P-04:40`; Astitva→Partha avoidance is absent under IPE-SET-001. |
| FN-08 Known fields/bugs | Unused `settled` field grants no behaviour; IPE-FIN-001 prevents a currency selector change from silently reinterpreting existing payer contribution strings by requiring deliberate conversion or validation failure. |
| FN-09 Realtime and rollback | Authorized clients refresh after complete mutations; injected failure leaves prior complete finance state; unrelated Group receives nothing. |
| FN-10 Migration exceptions | Malformed amount/currency/payer/share/Settlement records receive stable blocking exceptions; no rounding repair, recorder fabrication, or silent deletion occurs. |

## 10. FX and destination-content cases

| Case ID | Expected behaviour |
|---|---|
| FX-01 | INR→IDR and IDR→INR use the selected reference rate and documented rounding. |
| FX-02 | Editing either field determines direction; direction flip follows the approved target interaction and does not silently inherit the v1 indicator/value discrepancy. |
| FX-03 | Initial fallback is 188.68 IDR/INR; successful live fetch changes reference evidence and recomputes under IPE-FX-001. |
| FX-04 | Failed/offline fetch retains an explicit fallback/offline state; manual refresh can recover. |
| FX-05 | Quick INR and IDR values produce reproducible results for the active reference rate. |
| FX-06 | Reference conversion remains separate from immutable Expense accounting rate/evidence. |
| FX-07 | Reviewed Bali guide items and converted references appear in the migrated Bali Group. |
| FX-08 | Unrelated/non-Bali Groups receive no Bali guide or automatic worldwide replacement. |

## 11. Todo cases

| Case ID | Expected behaviour |
|---|---|
| TD-01 | Loading and empty states are distinguishable and safe for the current Participant. |
| TD-02 | Added content is trimmed and enforced against the verified 200-character UI limit or an explicitly accepted safe equivalent. |
| TD-03 | Incomplete and completed items group correctly; toggle preserves owner and Group. |
| TD-04 | Individual delete and delete-completed affect only the current Participant’s authorized Todos. |
| TD-05 | Realtime changes reach authorized current Participant sessions and not another Group. |
| TD-06 | Mutation failures are surfaced safely under IPE-ERR-001 rather than appearing successful. |
| TD-07 | Inactive/removed Members and unclaimed Participants gain no Todo authority from historical ownership. |
| TD-08 | Archived Group follows documented read/mutation/realtime behaviour; cross-Group IDs are denied. |

## 12. Source inconsistencies and limitations

### 12.1 Current source-of-truth inconsistencies

| ID | Frozen inconsistency | Decision | Controlling evidence | Test or migration case | Release-blocking | Required exception |
|---|---|---|---|---|---|---|
| SRC-01 | 2026 frontend/parser Trip dates versus 2025 README/SQL seed | Correct through deployed inventory and reviewed configuration; stale prose/seed excluded | [Source inconsistencies](../v1-codebase-feature-and-flow-report.md#16-current-source-of-truth-inconsistencies) | M18, TE-04 | Yes if unresolved | IPE-TIME-001 only for intentional visible change |
| SRC-02 | React-memory persona versus claimed localStorage | Verified runtime preserved only as evidence; target Auth replaces both | Same | FP-001, TC-001 | Yes | IPE-AUTH-001 |
| SRC-03 | No offline/PWA/fallback versus claims | Excluded as Not a v1 parity feature | Same | SC-001 | No, unless falsely claimed | None |
| SRC-04 | Unreachable concierge versus feature claim | Excluded as Not a v1 parity feature | Same | FP-020 | Yes if presented as delivered | None |
| SRC-05 | No Auth versus prose/SQL wording | Corrected by Target-only conformance, never treated as v1 behaviour | Same | TC-001 | Yes | None |
| SRC-06 | Todo exists; AI absent from nav versus README | Preserve Todo; exclude AI | Same | FP-019, FP-020 | Yes | None |
| SRC-07 | SQL seed 2025/short vibes versus unused frontend 2026 seed | Inventory deployed state; neither unused seed proves production data | Same | S01, M18 | Yes if used without evidence | None |

Section 5 is the decision table for every item in the frozen UI/interaction
preservation section.

### 12.2 Static scope cases

| Case ID | Evidence and assertion | Release result |
|---|---|---|
| SC-001 | [Technology/delivery evidence](../v1-codebase-feature-and-flow-report.md#2-current-technology-and-delivery-shape) and [Trip loading evidence](../v1-codebase-feature-and-flow-report.md#61-data-loading-and-visibility) show no configured PWA/offline runtime and no Event seed fallback. Static documentation, navigation, build-configuration, and runtime-scope review must not claim or implement offline operation, PWA delivery, or Event seed fallback as v1 parity. | Any such parity claim or implementation fails scope review. |

### 12.3 Important limitations and edge cases

| ID | Frozen limitation | Disposition | Controlling evidence | Test/migration case | Release-blocking | Exception |
|---|---|---|---|---|---|---|
| LIM-01 | No authenticated identity/permission | Correct with target conformance | [Limitations](../v1-codebase-feature-and-flow-report.md#18-important-current-limitations-and-edge-cases) | TC-001, TC-009 | Yes | IPE-AUTH-001 for removed persona behaviour |
| LIM-02 | No durable selected-user session | Correct with session restoration/logout | Same | TC-001 | Yes | None |
| LIM-03 | No Group/Trip isolation | Correct with one-Group Tenant and two-Group tests | Same | TC-002, TC-019 | Yes | None |
| LIM-04 | No URL routing/deep linking | Excluded from v1 parity; future work requires approval | Same | Static scope check | No | None |
| LIM-05 | Destructive actions lack confirmation | Correct with explicit confirmation or an equivalent deliberate, cancellable action and safe result | Same | TE-06, SD-08 | Yes | IPE-ERR-001 |
| LIM-06 | Scan list ignores audience | Preserve list for authorized Group; audience remains presentation, not secrecy | Same | SD-07, IPE-EVENT-001 | Yes | IPE-EVENT-001 |
| LIM-07 | Storage delete may fail silently | Correct with reconciled safe outcome | Same | SD-08 | Yes | IPE-ERR-001 |
| LIM-08 | Failed scans orphan public objects | Correct with private quarantine/reconciliation | Same | SD-09 | Yes | IPE-SCAN-001 |
| LIM-09 | Manual edit cannot manage scan/flight fields | Preserve unless separately approved | Same | TE-06 | Yes for accidental expansion | None |
| LIM-10 | Event-linked Expenses absent from database Event cards | Preserve absence; seed-only display is not production parity | Same | TE-05 | No | None |
| LIM-11 | Expense deletion absent | Preserve absence | Same | FN-01 | Yes | None |
| LIM-12 | Settlement correction/deletion absent | Preserve absence | Same | FN-06 | Yes | None |
| LIM-13 | Non-equal authoring absent | Preserve absence; retain valid data only | Same | FP-012, FN-03 | Yes | IPE-SPLIT-001 |
| LIM-14 | `expenses.settled` unused | Data may be inventoried but field grants no behaviour | Same | FN-08 | No unless it changes results | None |
| LIM-15 | Read/delete/Todo errors hidden | Correct with safe visible outcomes | Same | TE-06, SD-08, TD-06 | Yes for false success/data loss | IPE-ERR-001 |
| LIM-16 | Live FX/accounting rate disagreement | Preserve conceptual separation and evidence | Same | FN-04, FX-06 | Yes | None |
| LIM-17 | No offline operation | Exclude false claim; no new offline parity | Same | SRC-03 | No | None |
| LIM-18 | No tests/CI | Target release requires evidence; tooling remains Phase 7 | Same | Section 14 | Yes | None |
| LIM-19 | Timeline status has no own timer | Correct with time-driven refresh sufficient to make start/end transitions observable | Same | TE-04 | Yes | IPE-TIME-001 |
| LIM-20 | Client and SQL seed disagree on dates | Resolve through deployed inventory/configuration, never silent overwrite | Same | SRC-01, M18 | Yes | IPE-TIME-001 if visible history changes |

## 13. Target-only architecture conformance

These cases are not v1 feature rows.

| Conformance ID | Target-only capability | Required evidence |
|---|---|---|
| TC-001 | Signup, verification, login, recovery, session restoration, expiry, and logout | Normal and failure lifecycle uses validated Supabase Auth and safe redirects |
| TC-002 | Group creation | One trusted retry-safe outcome atomically creates exactly one Group, its mandatory configuration, the validated creator’s stable Group Member identity, that identity as initial active Owner, and audit provenance; failure creates none |
| TC-003 | Active Group selection | Only authorized readable Groups are selectable; selection grants no authority |
| TC-004 | Invitation creation, safe inspection, revocation, acceptance, and replay | Recipient-bound lifecycle, secret exclusion, atomic acceptance, idempotency |
| TC-005 | Membership lifecycle | Join/reactivate/remove/leave/inactive states preserve identity and current authority |
| TC-006 | Owner lifecycle and last-Owner protection | Promotion/demotion/transfer/removal concurrency never creates zero active Owners |
| TC-007 | Group configuration | Valid destination/dates/IANA timezone and accounting/display currencies control each Group; a non-Bali USD fixture derives a 12.34 USD Settlement from its own configuration and receives no IDR tolerance |
| TC-008 | Archival and restoration | Ordinary writes/Invitation/realtime stop; trusted Owner restoration revalidates state |
| TC-009 | Deny-by-default RLS | Every undefined or unauthorized operation fails, including existing/resulting-row attacks |
| TC-010 | Trusted-operation rollback | Injected failures create no partial Group, identity, Invitation, finance, or document authority |
| TC-011 | Service-role confinement | Browser possession impossible; named purposes revalidate actor, Group, role, lifecycle |
| TC-012 | Private Storage | Current Group metadata authorization controls reads/mutations; guessed/public access fails |
| TC-013 | Authorized realtime | Only rows currently readable are delivered; removal/archive/logout/reconnect revoke delivery |
| TC-014 | Profile privacy | Self/minimum co-member projection passes; Auth/security/unrelated attributes are denied |
| TC-015 | Invitation-secret protection | Plaintext secrets absent from persistence, logs, audit, Storage, realtime, and ordinary responses |
| TC-016 | Audit/provenance | Trusted actor/system purpose, Group, target, outcome, and time are non-fabricable |
| TC-017 | Abuse resistance | Enumeration-resistant responses and controls create no authority or consumed valid Invitation |
| TC-018 | Legacy Participant claiming | Validated Auth identity, independently reviewed Bali Group/Participant adjudication, external corroborating evidence, and product/data/security/architecture approvals atomically preserve the stable ID, attach Auth, activate an ordinary Member, and record non-secret audit; failure remains unclaimed, while Owner promotion and Invitation acceptance remain separate |
| TC-019 | Two-Group isolation | Group A cannot read/write/reference/download/subscribe to any Group B protected resource |

## 14. Test levels and evidence

| Level | Required evidence |
|---|---|
| Static/document traceability | Every matrix ID links frozen evidence, Accepted requirement, migration category, exception, and gate. |
| Migration transform verification | Known input manifest produces exact target ownership, identity, values, provenance, and exception outputs. |
| Deterministic calculation | Exact inputs, decimal/rate/rounding rule, ordering key, and expected result are recorded. |
| Database integration | Complete logical mutations and same-Group relationships pass; partial/cross-Group states fail. |
| RLS/security | Positive matrix paths and unauthenticated, wrong-role, stale, archived, forged, and cross-Tenant denials pass. |
| Storage | Private object integrity, authorization, orphan reconciliation, and public/cross-Group denial pass. |
| Realtime | Authorized delivery and cross-Group/removal/archive/logout/reconnect denial pass. |
| Trusted-operation concurrency/rollback | Competing operations converge safely; injected failures leave no partial authority. |
| End-to-end user flow | Auth through primary Trip/Scan/Split/FX/Todo outcomes is recognizable and Group-correct. |
| Visual/interaction review | Product behaviour and design intent remain recognizable at representative mobile sizes. |
| Deployed smoke | Version-compatible Auth, query, Storage, realtime, trusted, and primary-flow checks pass in secured target. |
| Post-cutover reconciliation | Counts, ownership, finance totals/balances, object integrity, denials, and incidents match gates. |

Phase 7 chooses tools. Every implemented case records inputs, actor/Group state,
expected output or denial, evidence location, result, and linked release gate.

## 15. Failure, concurrency, and retry cases

The complete suite includes unauthenticated and unauthorized access, object-ID
substitution, stale membership, archived Group state, duplicate migration
retries, concurrent atomic bootstrap attempts, concurrent Legacy Participant
claim-and-ordinary-Member-activation attempts, insufficient/conflicting claim
evidence, Invitation replay and acceptance/revocation races, last-Owner
concurrency, scan partial failure, document reconciliation, finance atomic
rollback, realtime removal/reconnect, stale clients after cutover, migration
interruption, and rollback/forward recovery.

Every retried migration operation converges through the stable source mapping.
Every trusted business operation revalidates current state. Failure responses
are generic where detail would disclose another Group, user, document, or
Invitation. No failure creates partial authority or changes the designated
authoritative system silently.

## 16. Traceability and release gates

Traceability is bidirectional among frozen-report anchors, Accepted architecture
requirements, `M01`–`M18`, `FP-001`–`FP-020`, Security Model verification areas,
intentional exception IDs, Phase 7 test IDs, and release gates. A report must
find every upstream obligation from a test and every downstream test from an
obligation.

Release is blocked by:

- any unexplained missing or duplicate v1 feature row;
- any unapproved intentional parity exception;
- any retained row or object without exactly one Tenant;
- any unresolved identity used as authority;
- any authoritative Group lacking mandatory configuration, stable creator
  membership, or an initial active Owner;
- any claim with partial Auth attachment or lifecycle activation, a role other
  than ordinary Member, missing required proof/approval category, or coupling
  to Invitation acceptance;
- any finance mismatch without approved non-weakening disposition;
- any missing or mismatched private document without approved disposition;
- any successful cross-Tenant access;
- any public target document;
- any global unauthorized realtime event;
- any plaintext PIN or Invitation secret migration;
- any partial trusted operation;
- failed secured rollback/forward-recovery rehearsal; or
- incomplete migration, traceability, or acceptance evidence.

## 17. Deferred-scope compliance

Phase 6 introduces none of the following:

- [DEF-001 paid plans, subscriptions, trials, or paywalls](../product/deferred-scope-register.md#def-001--paid-plans-subscriptions-trials-and-paywalls);
- [DEF-002 premium Entitlements](../product/deferred-scope-register.md#def-002--premium-feature-entitlements);
- [DEF-003 Google OAuth or additional Auth providers](../product/deferred-scope-register.md#def-003--google-oauth-and-additional-identity-providers);
- [DEF-004 permanent friend Groups containing multiple Trips](../product/deferred-scope-register.md#def-004--permanent-friend-groups-containing-multiple-trips);
- [DEF-005 worldwide destination price guides](../product/deferred-scope-register.md#def-005--worldwide-destination-price-guides);
- [DEF-006 automatic Invitation email delivery](../product/deferred-scope-register.md#def-006--automatic-invitation-email-delivery);
- [DEF-007 roles beyond Owner and Member](../product/deferred-scope-register.md#def-007--roles-beyond-owner-and-member);
- [DEF-008 private or secret Events](../product/deferred-scope-register.md#def-008--private-or-secret-events);
- [DEF-009 payment processing](../product/deferred-scope-register.md#def-009--payment-processing);
- [DEF-010 wallets, custody, or stored balances](../product/deferred-scope-register.md#def-010--wallets-custody-or-stored-monetary-balances);
- [DEF-011 organization administration](../product/deferred-scope-register.md#def-011--advanced-organization-administration); or
- [DEF-012 automatic/global travel-content generation](../product/deferred-scope-register.md#def-012--automatic-or-global-travel-content-generation).

Bali-only content, ledger Settlements, owner/member roles, core Auth, and
Invitation acceptance remain within their Accepted boundaries. Phase 7
implementation detail is not a new deferred feature.

## 18. Phase 6 parity-contract acceptance checklist

- [x] Frozen-report evidence is traceable without treating stale, dormant, or
  unused material as delivered behaviour.
- [x] Every parity classification is applied consistently and completely.
- [x] All 20 frozen feature-inventory rows appear exactly once in the primary
  parity matrix.
- [x] All grouped UI and interaction behaviours have explicit evidence,
  assertions, disposition, and release impact.
- [x] Persona selection is replaced by validated identity without preserving
  impersonation.
- [x] Event audience presentation is resolved without claiming private Event
  confidentiality.
- [x] Latent split modes are resolved as data preservation, not exposed v1 UI.
- [x] The Astitva→Partha settlement hardcoding has an explicit intentional
  parity resolution.
- [x] Live reference FX and historical accounting FX remain distinct.
- [x] Bali guide content is confined to the migrated Bali Group.
- [x] Dormant AI and false offline/PWA/seed claims are excluded from parity.
- [x] Trip and Event cases cover configuration, time, audience, lifecycle,
  realtime, archive, and cross-Group behaviour.
- [x] Scan and document cases cover validation, parsing, private access,
  partial failure, orphans, lifecycle, and denial.
- [x] Finance cases define exact inputs, formulas, reconciliation, history,
  Settlements, suggestions, failures, and denial.
- [x] FX and destination-content cases cover both directions, live/fallback
  state, known discrepancies, accounting separation, and Group scope.
- [x] Todo cases cover ownership, states, mutations, realtime, lifecycle, and
  cross-Group denial.
- [x] Every frozen source-of-truth inconsistency has a documented decision and
  case.
- [x] Every frozen limitation and edge case is preserved, corrected, excluded,
  or intentionally excepted.
- [x] Target-only conformance remains separate from v1 feature parity.
- [x] Security, object substitution, stale authority, and two-Group isolation
  test specifications are complete.
- [x] Failure, concurrency, retry, rollback, and forward-recovery cases are
  implementable and fail closed.
- [x] Bidirectional traceability and release-blocking gates are complete.
- [x] Every Deferred boundary remains excluded and linked.
- [x] No test implementation, framework choice, Phase 7 document, or ADR work
  is introduced.
