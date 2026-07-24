# ADR-0004: `group_members.id` Is the Stable Participant Identity

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-24 |
| Decision owners/reviewers | Pranjal Kumar Maurya — product owner; architecture review completed 2026-07-24 |
| Related documents | [V1 Codebase Feature and Flow Report](../../v1-codebase-feature-and-flow-report.md); [Multi-Tenant Target Architecture](../multi-tenant-target-architecture.md); [Domain and Data Model](../domain-and-data-model.md); [Architecture Glossary](../glossary.md); [ADR-0001](ADR-0001-group-is-trip-tenant.md); [ADR-0002](ADR-0002-supabase-auth-is-authoritative.md); [ADR-0003](ADR-0003-commercial-membership-deferred.md) |
| Supersedes | None |
| Superseded by | None |

## Context

### Current state

V1 identifies five hardcoded personas by display name. Event creators and
audiences, Expense payers and split participants, Settlement parties, and Todo
owners use names, name arrays, or name-keyed JSON. The selected persona is a
client-memory choice, the legacy `users` table is unused, and there is no
Supabase Auth identity or Group membership relationship.

Display names are mutable, non-unique presentation values and cannot safely
identify historical actors or prove account ownership. The Bali personas must
also survive migration before every persona is necessarily claimed by a real
Auth User.

### Target problem

The Accepted architecture separates a global Auth User and Profile from the
Group Member relationship. Group-owned records need one stable Participant
identity that supports duplicate names, one Auth User in multiple Groups,
historical preservation after removal, and controlled Legacy Participant
claiming without introducing a competing credential authority.

## Decision

1. `group_members.id` is the stable Participant identity inside a Group.
2. Group-owned records identify human participants and actors through the
   relevant same-Group `group_members.id`.
3. Auth User IDs, Profile IDs, display names, emails, and arbitrary strings do
   not replace Participant identity.
4. A Participant reference cannot cross a Group boundary.
5. One Auth User belonging to multiple Groups has a distinct
   `group_members.id` in each Group.
6. Presentation data may change without rewriting historical Participant
   references.
7. Member removal, inactivity, or Auth account lifecycle must preserve
   historical references; it must not reassign them to another identity.
8. A migration-only unclaimed Legacy Participant state may preserve a stable
   Bali Group Participant identity before an Auth User is attached. It is not
   an active Auth User-to-Group access relationship.
9. The unclaimed state grants no Group access, role, membership authority, or
   Authentication and cannot satisfy an authorization check.
10. Only later verified Auth User attachment and lifecycle activation can
    establish access. Claiming requires later-defined proof independent of
    display-name equality and preserves the Participant ID.
11. The unclaimed state is a narrow migration and lifecycle refinement of the
    Accepted Phase 2 Group Member boundary, not a competing identity,
    credential, session, or authorization authority.
12. Group membership and Participant identity have no paid, Subscription,
    trial, billing, or Entitlement meaning.

This is a logical identity decision. It does not prescribe columns, nullability,
constraints, SQL, claim flows, removal flows, or RLS policies.

## Rationale

- A Group Member is the point where global authenticated identity enters one
  Group Tenant, so its ID is the natural group-scoped Participant identity.
- A single stable reference supports Events, documents, finance, Settlements,
  Todos, and audit data without duplicating identity layers per feature.
- Separate IDs per Group make cross-Group mistakes detectable and prevent
  global Profile or Auth User identifiers from implying Group access.
- Stable references allow names and other presentation values to change while
  historical ownership remains intact.
- A narrowly defined unclaimed migration state preserves Bali history without
  converting a display-name match into authentication.
- Separating retained historical identity from active access preserves the
  Accepted Phase 2 Auth User-to-Group boundary: only verified attachment and
  lifecycle activation can establish an active relationship.
- Retaining historical identity after inactivity avoids orphaning or
  destructively rewriting ledger and itinerary history.

## Consequences

### Positive

- Duplicate display names are safe because identity does not depend on them.
- One Auth User can participate independently in multiple Groups.
- All Participant-bearing domain records use one consistent reference model.
- Presentation, Authentication, and Group participation can evolve under
  separate authorities.
- Legacy history can be preserved before or after a verified account claim.

### Constraints and costs

- Every Participant reference must be validated against the owning Group.
- Historical Group Member identities cannot be casually deleted when referenced
  by Group history.
- Application presentation must resolve names from stable identity rather than
  persisting names as authoritative links.
- Migration must handle unknown, duplicate, and conflicting legacy names
  explicitly.
- Phase 4 must distinguish active membership authority from retained historical
  identity.
- Later physical modeling must represent that distinction without allowing an
  unclaimed identity to satisfy access checks.

## Alternatives considered

### Auth User ID as Participant identity

Rejected. It is global, while participation and roles are Group-scoped. It
would obscure that one Auth User has independent identities and permissions in
different Groups.

### Profile ID as Participant identity

Rejected. Profile is global presentation data and grants no Group access.

### Display name or email as Participant identity

Rejected. Both can change, names can duplicate, email can be sensitive, and
neither proves a same-Group relationship.

### A separate Participant identity unrelated to Group Member

Rejected for normal target operation. It would add another identity layer that
must be synchronized with Group membership. The migration-only unclaimed state
is a lifecycle compatibility requirement, not a separate permanent identity
authority.

### Rewrite historical references when a Member changes

Rejected. It damages auditability and can falsely attribute historical actions
or finance records.

## Security implications

- Authorization must establish the validated Auth User's applicable Group
  Member relationship; possession or submission of a `group_members.id` is not
  proof of authority.
- Same-Group consistency must apply to every Participant-bearing Event,
  document, Expense, payer, share, Settlement, Todo, and audit relationship.
- Client-supplied display names, Profile IDs, Auth User IDs, and Participant IDs
  remain untrusted inputs.
- Unclaimed Legacy Participants cannot log in, exercise Owner or Member roles,
  satisfy an authorization check, or be used to impersonate historical
  personas.
- A stable Participant ID does not itself establish an active Group Member
  relationship. Access requires the later verified Auth User attachment and
  lifecycle activation defined by the appropriate later phases.
- Service-role operations must validate actor, Group, target Participant, and
  affected records rather than relying on bypass capability.
- RLS and operation-specific enforcement remain Phase 5 work.

## Migration/compatibility implications

- The five Bali personas require stable Participant identities within the one
  migrated Bali Group.
- Phase 6 must define deterministic backfill evidence, unresolved-name
  handling, duplicate-name handling, claim proof, rollback, and audit records.
- A display-name match cannot auto-claim an identity.
- Successful claiming attaches the proven Auth User without changing the stable
  Participant ID or historical Participant references. Access begins only
  after the later-defined lifecycle activation succeeds.
- Inactive or never-claimed identities remain distinguishable in history and do
  not acquire application access.
- Feature parity must validate Event, Expense, Settlement, and Todo attribution
  after mapping.

## Deferred implications

- Detailed Legacy Participant claiming is assigned to Phase 6, not approved by
  this ADR.
- Member removal, account-change, and ownership-transfer flows remain Phase 4.
- Roles beyond Owner and Member remain Deferred under
  [DEF-007](../../product/deferred-scope-register.md#def-007--roles-beyond-owner-and-member).
- Paid membership and Entitlements remain excluded by
  [ADR-0003](ADR-0003-commercial-membership-deferred.md).

## Verification or compliance notes

Later documentation and implementation demonstrate compliance when:

- every authoritative Participant relationship uses a same-Group
  `group_members.id`;
- Auth User, Profile, display-name, email, and arbitrary-string fields are not
  substituted for Participant identity;
- cross-Group references fail validation and authorization tests;
- duplicate display names do not collide;
- presentation changes leave historical references unchanged;
- inactive, removed, and unclaimed identities preserve history without
  retaining or gaining access;
- unclaimed identities never satisfy Authentication, Group membership, role,
  or authorization checks before verified attachment and activation; and
- migration tests prove that claiming requires evidence beyond display-name
  equality.
