# Architecture Glossary

| Field | Value |
|---|---|
| Status | Draft |
| Document type | Canonical terminology reference |
| Scope | Current-state and target-state vocabulary for the multi-user conversion |
| Current-state baseline | [V1 Codebase Feature and Flow Report](../v1-codebase-feature-and-flow-report.md) |
| Related ADRs | None accepted; planned topics are indexed in [Architecture Decisions](decisions/README.md) |
| Last reviewed | 2026-07-24 |

## Usage rules

This glossary is the canonical vocabulary for the architecture package. It
defines target terms without changing the facts in the frozen current-state
report. While this document is Draft, its definitions are review inputs; once
Accepted, later documents must use them or explicitly propose an amendment.

- Use **Group Member** when referring to a user's relationship with a Group.
  Use **paid membership**, **Subscription**, or **Entitlement** only for
  commercial concepts.
- Do not use the unqualified word “member” where it could mean either a Group
  Member or a paid customer. Qualify it as **group member** or **paid member**.
- Do not use a display name as identity. Display names are mutable presentation
  data.
- State whether a sentence describes **Current state**, **Target state**,
  planned work, an Accepted decision, or **Deferred scope**.
- A term defined here does not make its related planned ADR Accepted. Permanent
  boundaries become locked through the lifecycle in the
  [architecture governance](README.md) and [ADR index](decisions/README.md).

## Canonical terms

| Canonical term | Exact definition | Scope | Must not be confused with | Relevant relationships |
|---|---|---|---|---|
| **Auth User** | The authenticated identity issued and identified by Supabase Auth. | Global identity; target state. | A Profile, display name, legacy persona, Group Member row, or Participant label. | One Auth User has global Profile information and may have Group Member relationships in many Groups. Supabase Auth is the planned authoritative identity provider. |
| **Profile** | Global, user-controlled or user-associated presentation information for one Auth User that is not owned by a particular Group. | Global data; target state. | Supabase authentication credentials, a Group Member, a paid membership, or group-specific role/configuration. | Belongs to one Auth User; may supply display data, but records must reference stable identities rather than copied display names. |
| **Group** | The internal workspace and tenant boundary that owns one trip's shared configuration, participants, and feature data in the current target model. | Group-scoped target state. | A permanent social/friend organization, an Auth User, a UI-selected Active Group, or a billing account. | One Group represents one Trip workspace in the current target model. It has Group Members and owns group-scoped data. This boundary is a planned ADR topic and not yet an Accepted ADR. |
| **Trip** | The user-facing travel experience represented by a Group, including its destination, dates, timezone, currency configuration, and shared feature data. | Product language and group-scoped target state. | A second tenant object nested under a Group in the current target model. | “Trip” may remain the user-facing name while Group is the internal workspace and tenant boundary. A friend-group-to-many-trips hierarchy is Deferred scope. |
| **Tenant** | The unit across which data access and ownership are isolated from other such units. In the current target model, the Tenant is the Group. | Security and data-ownership target state. | A database instance, Supabase project, browser session, Auth User, or Active Group selector. | Tenant isolation is enforced from authenticated identity and Group Member relationships, not from client navigation state. |
| **Group Member** | The group-scoped relationship between one Auth User and one Group, with a stable identity and a Member role. | Identity, authorization, and group ownership; target state. | Paid Membership, Subscription, Entitlement, Profile, or display name. | `group_members` is required for access control and participant identity. Its stable ID represents a Participant inside group-owned records. It is not pricing, billing, subscription, or paid membership. |
| **Participant** | A person acting within a Group whose identity in group-owned records is represented by a stable Group Member identity. | Group-owned events, expenses, settlements, Todos, and related target records. | A display name, arbitrary text label, global Profile, or unauthenticated legacy persona. | A Participant is the domain use of a Group Member identity. Planned ADR work will decide the permanent `group_members.id` reference rule. |
| **Owner** | A Group Member whose Member role grants the defined owner-level capabilities for that Group. | Group authorization; target state. | The database owner, Supabase project owner, record creator, service role, or permanent owner of another Group. | Owner is one allowed Member role. Exact transfer, deletion, and administrative capabilities belong in later flow and security documents. |
| **Member role** | A group-scoped authorization classification attached to a Group Member. The current target scope allows only `owner` and `member`. | Group authorization; target state. | Paid tier, Entitlement, global application role, or Profile attribute. | Owner and member are the only in-scope roles; additional roles are Deferred scope. |
| **Invitation** | A controlled, single-use mechanism by which an intended Auth User may acquire a Group Member relationship to a Group. | Group onboarding; target state. | A public Group identifier, reusable access credential, email delivery system, or authorization by itself before acceptance. | Invitation acceptance is planned to be atomic and server-side. Automatic email delivery is Deferred scope. |
| **Active Group** | The Group currently selected in client UI/navigation state for presentation and routing. | Client experience; target state. | Authorization proof, tenant ownership, an RLS input trusted from the client, or a permanent default. | Active Group may choose which authorized data to request, but authorization must derive from the Auth User and server-enforced Group Member relationship. |
| **Legacy Participant** | One of the five hardcoded v1 personas identified by a display-name string rather than authenticated and group-scoped identity. | Current state and migration language only. | An Auth User, Profile, target Group Member, or secure Participant identity. | Partha, Astitva, Vaibhav, Suryansh, and Bittu are Legacy Participants. Migration planning must map them without treating names as target identity. |
| **Paid Membership** | A commercial customer state indicating paid access under a future business model. | Deferred commercial scope. | Group Member or the `group_members` relation. | No paid membership exists in the current conversion. If introduced later, it may relate to a Subscription and Entitlements but must remain separate from tenant membership. |
| **Subscription** | A commercial agreement or recurring plan state that may govern billing over time. | Deferred commercial scope. | Group membership, Invitation, Auth session, or one-time Payment processing. | Paid plans, subscriptions, trials, and paywalls are deferred; the application remains free during conversion and testing. |
| **Entitlement** | A machine-evaluable grant to use a premium or restricted capability, typically derived from a commercial or administrative policy. | Deferred commercial scope. | Group access, Member role, authentication, or ownership of group-scoped data. | Premium feature entitlements are deferred and must not be inferred from `group_members`. |
| **Authentication** | Establishing and maintaining which Auth User is making a request. | Identity and session security; target state. | Authorization to access a Group or any group-owned record. | Supabase Auth is the planned authoritative identity provider; authorization additionally requires group-scoped checks. |
| **Authorization** | Deciding and enforcing whether an authenticated actor may perform a specific operation on a specific resource. | Database, API, Edge Function, storage, realtime, and UI operations. | Authentication, Active Group selection, hidden UI, or possession of an identifier. | Target authorization derives from Auth User identity, Group Member relationship, Member role where relevant, and resource ownership/scope. |
| **Tenant isolation** | The property that actors can read or mutate a Group's protected data only when an applicable server-enforced policy authorizes their relationship to that Group. | End-to-end target security. | Client-side filtering, obscured URLs, Active Group state, or globally permissive RLS. | Must cover database rows, storage objects, realtime streams, and privileged server operations. RLS is a primary planned enforcement mechanism. |
| **Group-scoped data** | Data owned by exactly one Group and inaccessible through another Group's tenant context without an explicitly designed cross-group rule. | Target data model and security. | Global Profile/configuration data or data merely filtered by the UI. | Includes the target equivalents of trip events, participant references, expenses, settlements, Todos, and storage metadata as later models define them. |
| **Global data** | Data whose ownership and meaning are not limited to one Group. | Target application-wide data. | Public data, universally readable data, or duplicated group-owned data. | Auth User identity and Profile information are global. Access rules still apply; “global” does not mean unrestricted. |
| **Current state** | Behaviour and structure factually observed in the frozen v1 report at its recorded repository snapshot. | Baseline and migration comparison. | Accepted target architecture, desired behaviour, stale README claims, or planned work. | The [v1 report](../v1-codebase-feature-and-flow-report.md) is the sole frozen factual narrative baseline. |
| **Target state** | The intended multi-user, multi-group architecture described by architecture documents and locked only when their status is Accepted. | Future design. | Existing behaviour, a Draft idea, implementation evidence, or Deferred scope. | Target documents preserve Feature parity unless an Intentional parity exception is approved. |
| **Feature parity** | Verifiable preservation of an existing v1 user-visible behaviour or necessary supporting behaviour in the target conversion, adjusted only as required for secure tenant scoping and approved configuration. | Migration and acceptance. | Pixel identity, preservation of a defect by default, new feature development, or an undocumented omission. | The planned feature-parity contract will enumerate evidence. Differences require an Intentional parity exception or an architecture/security requirement. |
| **Intentional parity exception** | An explicit, reviewed, and recorded decision that a named current-state behaviour will change or will not be preserved. | Architecture, parity, and migration control. | An accidental regression, undocumented cleanup, Deferred scope, or stale prose correction. | Must identify the current behaviour, rationale, impact, approval source, and verification expectation. Permanent exceptions may require an ADR. |
| **Deferred scope** | Work deliberately excluded from the current conversion and retained in the permanent deferred-scope register with a stable identifier and revisit conditions. | Product and architecture scope control. | Rejected work, forgotten work, a planned task in the current phase, or an implicit future promise. | Every phase checks the [register](../product/deferred-scope-register.md); Deferred items cannot enter implementation silently. |
| **ADR** | An Architecture Decision Record: an immutable-after-acceptance repository record of one permanent architectural decision, its context, rationale, and consequences. | Architecture governance. | General design notes, a task, meeting minutes, or a document that becomes Accepted merely by being created. | Governed and indexed by [Architecture Decisions](decisions/README.md). A changed Accepted decision requires a superseding ADR. |
| **RLS** | PostgreSQL Row Level Security policies that enforce which rows a database role/request may select or mutate. | Database authorization and tenant isolation. | A frontend filter, table ownership, authentication, storage policy, or all security by itself. | Target group access is planned to be enforced through RLS; storage, Edge Functions, and realtime also require aligned controls. |
| **Service role** | The privileged Supabase server credential/role that can bypass normal client RLS and therefore must be confined to trusted server-side operations. | Edge Functions and other trusted backend contexts. | Supabase anon key, authenticated Auth User, Owner Member role, or routine client authorization. | Any service-role operation must independently validate actor identity, Group scope, authorization, and input because RLS may be bypassed. |
| **Realtime subscription** | A live change stream for a defined set of database changes delivered to an authorized client. | Realtime feature behaviour and security. | Initial data fetch, polling, global broadcast, or tenant authorization. | Target subscriptions must align with Group scope and RLS so one Group cannot receive another Group's changes. |
| **Accounting currency** | The Group-configured currency in which normalized expense shares, balances, settlement calculations, and stable accounting values are evaluated. | Group finance configuration; target state. | Original Currency, live FX display rate, user's locale, or necessarily IDR. | Conversion from Original Currency uses a recorded FX Snapshot. V1 currently normalizes accounting to IDR at a static rate. |
| **Original currency** | The currency and amount in which an expense or monetary input was entered or incurred before accounting normalization. | Group finance records. | Accounting Currency or a reformatted display value. | Preserved alongside the normalized accounting value and its FX Snapshot where conversion is required. |
| **FX snapshot** | The immutable exchange-rate value and relevant currency-pair context recorded for a conversion at the point that conversion affects accounting. | Group finance auditability and parity; target state. | A continuously changing live converter rate, the current market rate, or an unrecorded compile-time constant. | Connects Original Currency values to Accounting Currency values and allows later calculations to reproduce the recorded conversion. |

## Locked distinctions

The following language constraints apply throughout the package:

1. One **Group** represents one **Trip** workspace in the current target model.
2. **Trip** may remain the user-facing name; **Group** is the internal workspace
   and Tenant boundary.
3. An **Auth User** is the Supabase identity. A **Profile** is global user
   information.
4. A **Group Member** is the group-scoped relationship between an Auth User and
   a Group. A **Participant** is represented inside group-owned records by that
   stable Group Member identity.
5. `group_members` is required for access control and participant identity. It
   is not pricing, billing, subscription, paid membership, or entitlement.
6. **Active Group** is UI/navigation state and never an authorization source.
7. Paid Subscriptions and Entitlements are Deferred scope.
8. Display names are presentation, not identity.
9. “Member” must be qualified whenever Group membership and paid membership
   could both be understood.

## Legacy terminology map

Existing source uses terms that are valid only as current-state or migration
language. These usages do not redefine the target glossary.

| Legacy usage | Current meaning | Target terminology rule |
|---|---|---|
| Hardcoded `User` objects and persona picker | One of five selectable, unauthenticated people in client memory | Call these **Legacy Participants**. Reserve **Auth User** for Supabase Auth identity. |
| Person names in `for_users`, `paid_by`, `split_among`, settlements, and Todos | Mutable strings acting as v1 identity | Do not carry display names forward as identity; use stable Group Member identity for Participants. |
| “Authenticated” wording in old README, SQL comments, or handoff notes | Stale wording around persona selection or permissive policies | It is not target **Authentication** or **Authorization**. The v1 report confirms there is no login. |
| “Trip” in the fixed Bali UI | The only hardcoded travel experience | In target product copy, Trip may remain visible; internally the owning Tenant workspace is Group. |
| Global tables and channels | Shared v1 data without a tenant key | They are not Group-scoped merely because the UI filters them. Target ownership and isolation must be explicit. |
| IDR normalization and live INR/IDR converter | Separate v1 accounting and FX behaviours | Later documents must distinguish Accounting Currency, Original Currency, and FX Snapshot without claiming v1 already records snapshots. |
