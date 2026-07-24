# Multi-Tenant Target Architecture

| Field | Value |
|---|---|
| Status | Accepted |
| Document type | Target architecture |
| Scope | Phase 2 product, Tenant, and global identity boundaries |
| Current-state baseline | [V1 Codebase Feature and Flow Report](../v1-codebase-feature-and-flow-report.md) |
| Related ADRs | [ADR-0001: One Group Represents One Trip and Is the Tenant Boundary](decisions/ADR-0001-group-is-trip-tenant.md); [ADR-0002: Supabase Auth Is the Authoritative Identity Provider](decisions/ADR-0002-supabase-auth-is-authoritative.md); [ADR-0003: Commercial Membership Is Deferred](decisions/ADR-0003-commercial-membership-deferred.md) |
| Last reviewed | 2026-07-24 |

> This document and its related ADRs were Accepted after product and
> architecture review on 2026-07-24. Acceptance does not authorize
> implementation.

## 1. Purpose and scope

Phase 2 defines the product boundary, the Tenant boundary, and the global
identity authority required to turn the fixed Bali application into a reusable
multi-user, multi-group trip application. It establishes:

- one Group as one Trip workspace and the Tenant boundary;
- Supabase Auth as the authoritative authenticated global identity source;
- separation between Auth User, Profile, Group Member, Participant, and Legacy
  Participant;
- Active Group as navigation state rather than authorization;
- Owner and Member as group-scoped, non-commercial access concepts; and
- commercial memberships, entitlements, and a permanent friend-group hierarchy
  as Deferred scope.

Explicit boundaries are necessary because v1 has neither authenticated identity
nor a Tenant key. Its five personas, display-name references, global queries,
global realtime subscriptions, and public storage cannot safely distinguish one
real user or Trip workspace from another.

The conversion must preserve the existing Trip, Scan, Split, settlement, FX,
Todo, realtime, and storage capabilities unless a later Intentional parity
exception is reviewed and recorded. Preserving a capability does not mean
preserving v1's insecure global access, display-name identity, or Bali-specific
hardcoding in unrelated Groups.

This document defines target boundaries, not implementation. It does not define
the complete data model, keys, constraints, application flows, RLS policies,
storage policies, realtime filters, migration steps, tests, or implementation
roadmap. Those belong to Phases 3 through 7.

## 2. Current-state summary

Everything in this section is a **Current state** fact from the
[frozen v1 report](../v1-codebase-feature-and-flow-report.md), not target
architecture.

### 2.1 Fixed product and people

- The application was built for one Bali bachelor Trip dated 22–27 May 2026 in
  frontend constants.
- It has five hardcoded personas: Partha, Astitva, Vaibhav, Suryansh, and Bittu.
- A visitor selects any persona in client memory. There is no Supabase Auth
  login, durable identity session, credential check, or authorization.
- Person references in events, expenses, settlements, and Todos are display
  names or name-keyed structures, not authenticated or group-scoped identities.
- The existing `users` table is not used by the frontend, contains unused
  plaintext PIN values, and has no declared relationship to Supabase Auth.

### 2.2 Existing capabilities

V1 currently provides:

- a persona-filtered Trip itinerary, crew status, next-flight countdown, event
  editing, notes, and Maps links;
- Scan upload, document parsing through an Edge Function, event creation, and
  Storage-backed document access;
- Split expenses, single and multiple payers, equal participant splits,
  balances, group totals, suggested settle-up transfers, and recorded
  settlements;
- an INR/IDR FX converter, live reference-rate refresh, and a static Bali price
  guide;
- a persona-keyed Todo list;
- realtime refresh for events, expenses, settlements, and Todos; and
- a public Storage bucket for scanned travel documents.

The dormant AI concierge is not a reachable v1 feature and is not included as a
Phase 2 preservation requirement.

### 2.3 Missing Tenant and identity boundaries

- There is no Group table, Trip table, membership relationship, Invitation,
  Trip owner, `group_id`, or `trip_id`.
- All event, expense, and settlement reads and realtime subscriptions are
  global. Todos are filtered only by the selected persona name.
- Current RLS policies are permissive and do not isolate users, Groups, or
  Trips.
- Scanned documents share a public, flat Storage namespace.
- The active persona is a client choice and can be switched without proof.
- Bali, DPS, IST/WITA, INR/IDR, fixed dates, and the five-person cohort are
  compiled into multiple behaviours.

These facts describe why the conversion needs new boundaries. They do not imply
that v1 already has Groups, authentication, secure private events, or Tenant
isolation. Stale claims in the root README and implementation handoff are not
used as architecture facts.

## 3. Target product model

The **Target state** has one product workspace concept:

- One Group represents exactly one Trip workspace.
- **Trip** may remain the primary user-facing product term.
- **Group** is the internal workspace, ownership scope, and Tenant boundary.
- Group and Trip are not independent Tenant layers in this target.
- A Trip does not sit under a separate permanent friend-group Tenant.
- A Group is not a reusable permanent social circle that contains many Trips.
- One Auth User may have separate Group Member relationships in multiple Groups.
- Membership, role, configuration, and feature data in each Group are isolated
  from every other Group.

The existing Bali dataset will later be migrated into one Bali Group. Phase 2
does not determine migration ordering, backfill mechanics, Legacy Participant
claiming, rollback, or compatibility; those belong to Phase 6, informed by the
Phase 3 model.

This model is selected because it matches the existing product's unit of shared
work: one cohort collaborates around one itinerary, its documents, expenses,
settlements, FX context, and Todos. It provides one ownership and isolation
boundary without introducing a second organizational hierarchy that v1 does
not need.

The following alternatives are outside the current target:

- a permanent friend Group that owns many Trips is Deferred under
  [DEF-004](../product/deferred-scope-register.md#def-004--permanent-friend-groups-containing-multiple-trips);
- an organization that administers many Groups is Deferred under
  [DEF-011](../product/deferred-scope-register.md#def-011--advanced-organization-administration);
- separate Group and Trip Tenant layers are rejected for this conversion
  because they duplicate ownership and authorization boundaries without a
  current requirement; and
- one Auth User as the Tenant is rejected because Trip collaboration requires
  multiple users inside the same isolated workspace.

## 4. Tenant boundary

Group is the single Tenant boundary for the current target.

### 4.1 Mandatory boundary

- Group-owned data from one Group must not be readable or writable through
  another Group.
- Group context must ultimately be established and verified from
  server/database-controlled identity and Group Member relationships.
- A group-owned record cannot obtain authority merely because the frontend
  labels a request with an Active Group.
- UI routing, cached selection, URL state, query parameters, request bodies,
  local storage, and Zustand or any other client store are untrusted inputs for
  authorization.
- Knowing or changing a Group identifier must not grant Group access.
- Cross-Group aggregation or sharing requires a separately documented rule; no
  such rule is introduced in Phase 2.

Exact ownership keys, constraints, indexes, RLS expressions, storage paths,
realtime filters, and verification tests belong to Phases 3, 5, and 6.

### 4.2 Global and Group-scoped concerns

“Global” means not owned by one Group. It does not mean public or unrestricted.

| Concern | Architectural scope | Boundary |
|---|---|---|
| Supabase Auth identity | Global | Supplies authenticated Auth User and session identity; it does not grant Group access by itself. |
| Profile | Global | Holds genuinely global presentation or user information associated with an Auth User; it does not carry Group role or membership. |
| Group membership | Group-scoped | Connects one Auth User to one Group and supplies group-scoped Participant and role context. |
| Group roles | Group-scoped | Owner or Member authority applies only within the related Group. |
| Invitations | Group-scoped | May create a Group Member relationship only through the later approved flow. |
| Trip and event information | Group-scoped | Belongs to the one Trip workspace represented by the Group. |
| Scan and document metadata | Group-scoped | Travel-document ownership and visibility cannot be global merely because a file service is shared. |
| Finance and settlements | Group-scoped | Expenses, payers, shares, balances, and recorded settlements belong to one Group ledger context. |
| FX records or snapshots | Group-scoped when persisted for Group accounting | Any accounting conversion evidence belongs with the Group finance context. A transient public reference rate is not authorization-bearing Group data. |
| Todos | Group-scoped | Personal checklist behaviour is associated with a Participant within a Group, not only a global display name. |
| Realtime access | Group-scoped for Group-owned changes | A shared realtime service must not turn Group events into a global stream. |
| Storage access | Group-scoped for Group-owned objects | A shared bucket or storage service does not remove object ownership and Tenant isolation requirements. |

Phase 3 will model these relationships. Phase 5 will define and verify their
enforcement.

## 5. Identity boundaries

Phase 2 separates authentication authority, global presentation data,
Group-scoped relationships, domain participation, and legacy migration
identities. None may silently substitute for another.

### 5.1 Auth User

An Auth User is the authoritative authenticated global identity supplied by
Supabase Auth. Authentication credentials and session identity originate from
Supabase Auth. Application tables may reference that identity but must not
create a competing credential, password, PIN, or session authority.

### 5.2 Profile

A Profile contains global presentation or user information associated with an
Auth User. A Profile:

- does not grant access to a Group;
- does not carry a Group role;
- does not become a Participant merely by existing; and
- must not replace the Group-scoped identity used by group-owned records.

### 5.3 Group Member

A Group Member is the relationship connecting an Auth User to a Group.
Group-scoped access and Member role information belong to this relationship.
It is not a paid membership, Subscription, billing state, pricing record,
trial, or Entitlement.

### 5.4 Participant

A Participant is the stable Group-scoped identity used by Group-owned records.
Phase 3 will decide and lock `group_members.id` as the technical Participant
identity and will define its relationships and constraints. Phase 2 neither
defines a table schema nor permits display names or Profile fields to stand in
for that identity.

### 5.5 Legacy Participant

The five Bali personas are Legacy Participants. They require later mapping,
backfill, and claiming decisions because they have display-name identity but no
authenticated account relationship. A matching display name is not sufficient
proof that an Auth User owns a Legacy Participant. Phase 3 defines the target
model; Phase 6 defines migration and claiming mechanics.

### 5.6 Identity-boundary table

| Concept | Authority | Scope | Purpose | Must not be used for |
|---|---|---|---|---|
| Auth User | Supabase Auth validated identity and session | Global | Identify the authenticated actor | Profile presentation, Group membership by itself, paid status, or a client-selected persona |
| Profile | Application-domain data associated with an Auth User | Global | Hold genuinely global user/presentation information | Credentials, session authority, Group access, Member role, or Participant identity |
| Group Member | Server/database-controlled relationship between Auth User and Group | One Group | Establish group-scoped relationship and role context | Subscription, billing, Entitlement, global privilege, or mutable display identity |
| Participant | Stable Group Member identity used in Group-owned records | One Group | Identify a person in events, finance, settlements, Todos, and related records | Display name, Profile ID, arbitrary text, or proof of payment |
| Legacy Participant | Frozen v1 persona data awaiting controlled migration | Migrated Bali context only | Preserve and later map existing Bali participant history | Authentication, automatic account ownership, or target authorization |

## 6. Supabase Auth boundary

The target authentication boundary is:

- Supabase Auth is authoritative for Authentication and session identity.
- Application records may reference Auth User identity but may not redefine
  credentials, account proof, or session authority.
- Profile and Group Member records are application-domain records, not
  alternative identity providers.
- The frontend cannot assert an Auth User different from the Auth User in the
  validated session.
- A client-supplied user ID, email, display name, persona, or Profile ID is
  untrusted until related to the validated Auth User by server-enforced rules.
- Service-role execution must not treat bypass capability as authorization. A
  trusted operation must independently validate the actor, Group, requested
  action, and affected resource.

Phase 4 will define login, recovery, email verification, session restoration,
Group onboarding, Invitation redirects, and related failure flows. Phase 5 will
define JWT handling, RLS, Edge Function, Storage, and realtime enforcement.
Phase 2 does not implement or select those flows.

Google OAuth and additional identity providers remain Deferred under
[DEF-003](../product/deferred-scope-register.md#def-003--google-oauth-and-additional-identity-providers).
A future provider could be integrated only through an approved change while
preserving Supabase Auth as the application's authoritative Auth User and
session boundary; Phase 2 approves no provider.

## 7. Active Group boundary

Active Group is navigation and presentation state.

- It may determine which workspace the UI requests or displays.
- It may be held in memory, a URL, local storage, or a client store for user
  experience purposes.
- It never proves Group membership, Member role, resource ownership, or
  permission.
- Changing a URL, local-storage value, cached selection, query parameter,
  client store, or request body cannot grant access.
- A missing or stale Active Group must produce navigation or loading behaviour,
  not an authorization fallback.
- Authorization must be enforced independently against validated Auth User and
  server/database-controlled Group relationships.

Phase 4 will define selection and navigation flows. Phase 5 will define
authorization enforcement.

## 8. Roles and access concepts

Phase 2 defines only two Member roles:

- **Owner:** a Group Member with owner-level capabilities inside that Group.
- **Member:** a Group Member with ordinary in-scope capabilities inside that
  Group.

Every Group requires a valid ownership model. Roles are Group-scoped and do not
exist as global user privileges. Owning one Group grants no role in another
Group. Owner and Member are access roles, not paid tiers or Entitlements.

Roles beyond Owner and Member remain Deferred under
[DEF-007](../product/deferred-scope-register.md#def-007--roles-beyond-owner-and-member).
Detailed operation permissions, owner transfer, ownership continuity, member
removal, Group archival/deletion, and RLS matrices belong to Phases 4 and 5.
Phase 2 does not define a permission matrix.

## 9. Existing feature boundaries

| Existing capability | Target architectural scope | Phase 2 boundary and later handling |
|---|---|---|
| Trip and events | Group-scoped | Each itinerary, status calculation, countdown input, event, assignment, notes, and Maps link belongs to one Trip workspace. Phase 3 models ownership; Phases 4–6 define operations, security, and parity. |
| Scan and stored travel documents | Group-scoped | Parsed event data, document metadata, and stored objects belong to one Group. Public v1 access is not preserved as a target security rule. Exact object and visibility controls belong to Phase 5. |
| Split and expenses | Group-scoped | Expense ledgers, payers, participants, shares, totals, and balances belong to one Group. Phase 3 handles stable identities and normalization without changing the Phase 2 Tenant boundary. |
| Settlements | Group-scoped | Recorded settlements remain ledger events inside one Group. They do not process payments or represent stored funds. Phase 3 models references; later phases preserve verified behaviour. |
| FX | Mixed non-authoritative reference and Group-scoped accounting context | The interactive converter may use transient external/global reference rates, but Group accounting configuration and persisted FX snapshots are Group-scoped. Phase 3 defines currency and snapshot concepts; no payment or worldwide guide feature is implied. |
| Todo | Group-scoped | Personal Todo behaviour attaches to a Participant within one Group. It is not a globally name-keyed private list. Phase 3 and Phase 5 define ownership and isolation. |
| Realtime | Group-scoped for Group-owned data | Realtime must preserve live collaboration without broadcasting one Group's changes to another. Subscription and RLS details belong to Phase 5. |
| Storage | Group-scoped for Group-owned objects | Storage infrastructure may be shared, but document ownership and access remain Group-scoped. Object namespace and policy design belong to Phase 5. |
| Bali guide and price information | Preserved only for the migrated Bali Group, subject to later parity review | Existing Bali-specific content may remain associated with the migrated Bali Group. It must not automatically appear in unrelated new Groups. Worldwide guides and automatic content generation remain Deferred under DEF-005 and DEF-012. |

V1's per-person event visibility remains a Phase 6 Feature parity question.
Phase 2 does not reclassify client-side filtering as secure private or secret
events; a new security-grade private-event model remains Deferred under
[DEF-008](../product/deferred-scope-register.md#def-008--private-or-secret-events).

## 10. System responsibility boundaries

| Component | Phase 2 responsibility | Must not be trusted or used as | Later detail |
|---|---|---|---|
| Frontend | Present Trip workspaces, request an Active Group, and send user intent | Identity authority, membership proof, final permission decision, or Tenant-isolation enforcement | Phase 4 flows; Phase 7 implementation ordering |
| Supabase Auth | Supply authoritative Auth User and validated session identity | Group membership, Member role, Profile storage, or permission to every group-owned record | Phase 4 Auth flows; Phase 5 token/enforcement details |
| Application database | Store global domain data and Group-controlled relationships and records | A second credential authority or a globally shared unscoped feature dataset | Phase 3 model; Phase 5 enforcement |
| RLS | Ultimately enforce row-level Group access for database operations | A client filter, the entire security model, or an implementation defined in Phase 2 | Phase 5 policies and verification |
| Edge Functions/server-side operations | Perform trusted operations that require server-side validation or privileged capabilities | Permission to trust request-body actor/Group claims or service-role bypass automatically | Phase 4 flow boundaries; Phase 5 validation and privilege rules |
| Storage | Hold Group-owned travel documents under enforceable ownership/access boundaries | Public-by-default authority or proof that possession of a path grants access | Phase 5 namespace and policy design |
| Realtime | Deliver authorized changes for Group-owned data | A global broadcast channel or substitute for initial authorization | Phase 5 filtering, RLS alignment, and tests |

Supabase Auth supplies identity. The application database stores domain
relationships. Database RLS, aligned server-side checks, Storage controls, and
realtime controls will ultimately enforce Tenant isolation. No client state,
including Active Group, may perform those responsibilities.

## 11. Commercial-scope boundary

The multi-user conversion remains free during the current conversion and
testing period.

- Group membership is not a purchase.
- Owner and Member are access roles, not Subscription tiers.
- No trial, paywall, billing integration, premium Entitlement, payment
  processing, wallet, custody, or stored monetary balance is introduced.
- Split balances and recorded settlements are accounting data, not funds held
  or transferred by the application.
- `group_members` must not contain or imply paid status merely because its name
  includes “members.”

The [deferred-scope register](../product/deferred-scope-register.md) remains
authoritative, including DEF-001, DEF-002, DEF-009, and DEF-010. Any future
commercial work requires an explicit scope reconsideration, applicable
architecture amendments or ADRs, and security review. It cannot be silently
added to a later migration or implementation slice.

## 12. Architectural invariants

As Accepted architecture, this document and its related ADRs require every
later phase to preserve these invariants:

1. One Group equals one Trip workspace.
2. Group is the Tenant boundary.
3. Supabase Auth is the authoritative authenticated identity source.
4. Profiles are global application-domain records and do not grant Group
   access.
5. Group Members and Member roles are Group-scoped.
6. Participant identity is stable and Group-scoped; Phase 3 locks its technical
   representation.
7. Active Group is not authorization.
8. Display names are presentation, not identity.
9. Group membership is unrelated to payment, Subscription, or Entitlement
   status.
10. Cross-Group access to group-owned data is prohibited unless a future
    explicit architecture decision defines a narrow exception.
11. Deferred commercial work and the permanent friend-group-to-many-Trips
    hierarchy remain excluded.
12. Existing Bali-specific content is not assigned to unrelated new Groups by
    default.

## 13. Prohibited interpretations

Phase 2 must not be read to mean:

- Group is a permanent social circle containing many Trips.
- Trip and Group are independent or nested Tenant layers.
- A Profile grants Group access or acts as a Participant identity.
- Client state, URL state, request parameters, or Active Group grants
  membership.
- A display name, email, persona, or Profile field is a durable identifier for
  a Group-owned record.
- `group_members` represents paid membership, billing, Subscription, or
  Entitlement state.
- an Owner has global privileges outside the Group in which the role exists.
- service-role access is automatically authorized merely because it can bypass
  RLS.
- a new Group receives Bali-specific guide or price content by default.
- Phase 2 authorizes application code, schemas, SQL, policies, migrations,
  configuration changes, or deployment.

## 14. Dependencies and later-phase handoff

Phase 2 resolves product boundaries. The following later details are delegated
intentionally; they are not unresolved alternatives to the Phase 2 Tenant or
identity decisions.

| Later phase | Phase 2 input | Intentionally delegated detail |
|---|---|---|
| Phase 3 — Domain and data model | One Group/Trip Tenant; global Auth User and Profile; Group-scoped Group Member and Participant; feature ownership scopes | Entity relationships, stable keys, constraints, Group configuration, normalized finance relationships, FX snapshots, and technical Participant identity |
| Phase 4 — Authentication, Group, and Invitation flows | Supabase Auth authority; Active Group limitation; Owner/Member scope; Group as workspace | Login, recovery, verification, session restoration, Group creation/selection, Invitation acceptance, ownership and member lifecycle flows |
| Phase 5 — Security architecture | Cross-Group prohibition; server/database-verified relationships; client and service-role trust limits | JWT use, RLS policies, Edge Function checks, Storage authorization, realtime enforcement, operation matrix, and security tests |
| Phase 6 — Migration and Feature parity | One Bali Group migration target; Legacy Participant is not Auth identity; capability ownership boundaries | Backfill and claiming, staged migration, compatibility, rollback, parity cases, intentional exceptions, and migrated Bali content validation |
| Phase 7 — Implementation roadmap | Accepted boundaries and verification prerequisites | Ordered delivery slices, dependency sequencing, rollout ownership, and implementation gates |

No Phase 3–7 document is created or implemented by Phase 2.

## 15. Phase 2 acceptance checklist

- [x] The Accepted architecture defines one Group as the single Tenant
  boundary.
- [x] The Accepted architecture defines one Group as exactly one Trip
  workspace.
- [x] Global Auth User/Profile concerns are separated from Group-scoped Group
  Member/Participant concerns.
- [x] Supabase Auth is the authoritative authenticated identity source.
- [x] Active Group is limited to navigation and presentation.
- [x] Owner and Member are Group-scoped, non-commercial roles.
- [x] Existing capability ownership boundaries are identified without defining
  schemas.
- [x] Commercial subscriptions, entitlements, payments, and stored value remain
  excluded.
- [x] The permanent friend-group-to-many-Trips hierarchy remains Deferred.
- [x] No schema, SQL, policy, migration, application flow, or implementation is
  introduced.
- [x] ADR-0001, ADR-0002, and ADR-0003 are reviewed and Accepted before Phase 3
  may be Accepted.
