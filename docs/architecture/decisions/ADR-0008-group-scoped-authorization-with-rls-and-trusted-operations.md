# ADR-0008: Group-Scoped Authorization Is Enforced by RLS and Narrowly Trusted Operations

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-24 |
| Decision owners/reviewers | Pranjal Kumar Maurya — product owner; architecture and security review completed 2026-07-24 |
| Related documents | [V1 Codebase Feature and Flow Report](../../v1-codebase-feature-and-flow-report.md); [Multi-Tenant Target Architecture](../multi-tenant-target-architecture.md); [Domain and Data Model](../domain-and-data-model.md); [Authentication, Group, and Invitation Flows](../auth-groups-and-invitations.md); [Security Model](../security-model.md); [Architecture Glossary](../glossary.md); [Deferred-Scope Register](../../product/deferred-scope-register.md); [ADR-0001](ADR-0001-group-is-trip-tenant.md); [ADR-0002](ADR-0002-supabase-auth-is-authoritative.md); [ADR-0003](ADR-0003-commercial-membership-deferred.md); [ADR-0004](ADR-0004-group-member-id-is-participant-identity.md); [ADR-0005](ADR-0005-normalized-finance-payers-and-shares.md); [ADR-0006](ADR-0006-group-configuration.md); [ADR-0007](ADR-0007-single-use-atomic-invitation-acceptance.md) |
| Supersedes | None |
| Superseded by | None |

## Context

### Current state

V1 has no Supabase Auth flow, Group, Group Member relationship, Owner, or Tenant
ownership key. Its RLS policies use unconditional access predicates, including
for anonymous access. Operational queries and realtime subscriptions are
global or display-name-filtered, scanned documents are public, and the scan
Edge Function uses service-role capability without a target Group
authorization model.

The selected persona, display-name fields, and client filters do not establish
an authenticated actor or permission. The current database and Storage access
therefore cannot isolate one future Group from another.

### Target problem

The Accepted architecture makes Group the Tenant, Supabase Auth the global
identity authority, and the current Group Member relationship the bridge
between an Auth User and Group-scoped Participant authority. The conversion
needs one durable enforcement boundary that still protects data when a client
modifies URLs or payloads, bypasses UI filters, guesses object identifiers,
opens realtime subscriptions, or invokes a privileged server operation.

Some multi-record transitions must preserve membership, Invitation, ownership,
finance, or lifecycle invariants atomically. RLS alone cannot authorize a
service-role bypass or make separate client mutations atomic, so the boundary
must define both ordinary RLS access and narrowly trusted operations.

## Decision

1. Tenant data Authorization is enforced at the database boundary through
   Group-scoped RLS.
2. Policies deny access unless the operation is explicitly permitted.
3. The actor is derived only from the validated Supabase Auth session.
4. Current active Group membership is required for ordinary Group data access.
5. Owner authority is derived from the current Group Member relationship and
   applies only to that Group.
6. Active Group, client-supplied actor/Group/Member IDs, roles, Profile fields,
   display names, and Participant IDs are never Authorization.
7. Both direct Group ownership and ownership derived through an authoritative
   parent are enforced.
8. Mutations validate the existing protected row and the complete proposed
   resulting row.
9. Cross-Group relationship creation, parent substitution, ownership
   reassignment, and Tenant movement are denied.
10. Multi-record authority and invariant transitions use narrowly trusted,
    all-or-nothing operations.
11. Service-role or equivalent elevated capability is confined to a named
    operation or controlled job and is not business Authorization.
12. Ordinary browser reads and writes do not bypass RLS.
13. Inactive Group Member and archived Group lifecycle states fail closed;
    archived Groups reject ordinary writes and Invitation acceptance.
14. Storage and realtime Authorization align with the same current database
    Tenant authorization used for underlying records.
15. Invitation-secret verification remains inside the trusted atomic
    acceptance boundary; plaintext secrets are not persisted or ordinarily
    disclosed.
16. Physical policy SQL, database functions, constraints, indexes, token
    algorithms, Storage/realtime configuration, and deployment sequencing
    remain implementation work.

This decision defines the security boundary. It does not implement it.

## Rationale

- Database-bound enforcement protects data independently from the UI, client
  routing, and ordinary API construction.
- Current database membership avoids treating stale JWT roles or Group lists
  as durable authority after removal, demotion, or archival.
- One Group ownership rule works for direct rows and normalized child
  relationships without trusting redundant payload fields.
- Existing-row plus resulting-row validation prevents mass assignment and
  cross-Tenant movement by update.
- Trusted atomic operations preserve invariants that independent client writes
  cannot safely preserve.
- Confining elevated capability prevents service-role bypass from becoming an
  alternate authorization system.
- Aligning Storage and realtime with database reads closes side channels around
  otherwise protected rows.
- Deny-by-default contracts make undefined operations explicit instead of
  silently granting generic CRUD.

## Consequences

### Positive

- One Group cannot read, mutate, subscribe to, or retrieve another Group's
  protected data through ordinary application paths.
- Member removal, Owner demotion, Group archival, and session expiry affect
  subsequent access from current authoritative state.
- Active Group remains a harmless navigation choice rather than a security
  control.
- Parent/child finance, Event, document, Todo, Settlement, and audit
  relationships have enforceable same-Group boundaries.
- Service-role and trusted-operation audits can show why elevated work was
  authorized.
- Security tests can use one operation matrix as the compliance contract.

### Constraints and costs

- Every protected resource needs an explicit direct or indirect Group ownership
  path.
- Every operation needs a reviewed predicate; missing rules deny access.
- Complex transitions require carefully scoped trusted operations and
  concurrency verification.
- Current-state membership checks may add database work compared with trusting
  cached claims.
- Storage and realtime require separate controls aligned with database
  Authorization.
- Migration must avoid an exposure window while replacing permissive RLS and
  public Storage.
- Implementation and test complexity increases because both positive and
  cross-Tenant denial paths are mandatory.

## Alternatives considered

### Client-only filtering

Rejected. A client can alter or bypass filters, URLs, local state, and request
payloads.

### Active Group as authorization

Rejected. Active Group is client navigation state and can be changed without
proof.

### Authoritative Group lists or roles in JWT/custom claims

Rejected. Membership, role, and archival state can change before a token
refreshes. Cached claims may be hints only and cannot replace current checks.

### Display-name, email, Profile, or Participant-ID authorization

Rejected. These values are presentation, sensitive attributes, or domain
references rather than proof that the current Auth User has an active
relationship to the Group.

### Blanket service-role access from application clients

Rejected. It exposes a Tenant-wide bypass and makes possession of a credential
equivalent to business Authorization.

### API-only authorization with permissive database policies

Rejected. Any direct database or unintended API path would bypass the
application-layer check, reproducing v1's weak boundary.

### Globally readable document Storage

Rejected. Public paths and URLs disclose Group-owned documents outside current
membership.

### Realtime subscriptions that bypass row-read authorization

Rejected. A live stream is a read path and cannot broadcast cross-Tenant
changes merely because initial queries are protected.

### RLS alone for every transition

Rejected. RLS remains the ordinary data boundary, but Group creation,
Invitation acceptance, ownership continuity, complete finance mutations, and
similar multi-record transitions require atomic trusted validation.

## Security implications

- Auth User identity comes only from the validated Supabase session; Auth User
  and Participant identity remain distinct.
- Ordinary Member and Owner checks resolve the current same-Group
  `group_members` relationship. Owner is not a global privilege.
- Direct ownership uses the protected resource's Group. Indirect ownership
  follows the authoritative parent; client Group values cannot replace it.
- Existing and proposed resulting rows must remain in one authorized Group with
  valid same-Group references.
- Active Group, stale JWT/custom claims, UI visibility, and submitted roles are
  non-authoritative.
- Trusted operations revalidate actor, Group, current role, target, lifecycle,
  and invariants even when elevated capability bypasses ordinary RLS.
- Service-role credentials remain server-only, least-privileged, purpose-bound,
  and auditable.
- Last-Owner, Invitation acceptance, archival, reactivation, finance, and
  document transitions fail without partial authority under races or retries.
- Storage objects and realtime payloads receive no broader access than their
  underlying Group data.
- Invitation plaintext secrets stay outside ordinary persistence, logs, audit,
  realtime, Storage, and reads; verification occurs inside the trusted
  acceptance boundary.

## Migration/compatibility implications

- Phase 6 must assign every retained v1 operational row and document to the one
  migrated Bali Group before enforcing Group-scoped access.
- The initial Bali Owner requires controlled bootstrap rather than persona or
  display-name authority.
- Legacy Participants remain non-authorizing until verified attachment and
  activation under the Phase 6 claiming plan.
- Plaintext legacy PINs cannot become credentials or trusted migration proof.
- Global queries, global realtime, permissive anonymous RLS, and public
  document Storage cannot survive cutover as authority.
- RLS, Storage, realtime, and trusted-operation activation must be sequenced
  without an unsafe public or cross-Tenant interval.
- Rollback cannot restore anonymous global access or public documents.
- Migration verification must include cross-Group fixtures, indirect
  relationships, Storage, realtime, service-role confinement, audit-secret
  exclusion, and concurrency.
- Exact migration, backfill, bootstrap, claiming, deployment, and rollback
  mechanics remain Phase 6 and Phase 7 work.

## Deferred implications

- Additional Auth providers remain Deferred under
  [DEF-003](../../product/deferred-scope-register.md#def-003--google-oauth-and-additional-identity-providers).
- Automatic Invitation email delivery remains Deferred under
  [DEF-006](../../product/deferred-scope-register.md#def-006--automatic-invitation-email-delivery).
- Roles beyond Owner and Member remain Deferred under
  [DEF-007](../../product/deferred-scope-register.md#def-007--roles-beyond-owner-and-member).
- Private/secret Event semantics remain Deferred under
  [DEF-008](../../product/deferred-scope-register.md#def-008--private-or-secret-events).
- Organization administration remains Deferred under
  [DEF-011](../../product/deferred-scope-register.md#def-011--advanced-organization-administration).
- Paid plans, Entitlements, payments, and custody remain excluded by
  [ADR-0003](ADR-0003-commercial-membership-deferred.md), DEF-001, DEF-002,
  DEF-009, and DEF-010.

These boundaries are not weakened or brought into scope by security
implementation requirements.

## Verification or compliance notes

Later documentation and implementation demonstrate compliance when:

- every protected Group resource has one tested direct or indirect ownership
  path;
- unauthenticated, inactive, non-member, and cross-Group ordinary access is
  denied by default;
- ordinary access derives current membership/role from database state rather
  than Active Group, payload fields, Profile/display values, or stale claims;
- insert and update tests reject cross-Group references, ownership
  reassignment, forged provenance, and invalid resulting rows;
- every trusted operation rejects a forged actor, wrong Group, insufficient
  role, stale lifecycle, invariant violation, replay, and unsafe concurrency;
- service-role capability is absent from clients and confined to audited
  purpose-specific execution;
- Storage and realtime tests cannot expose a row or object the actor may not
  currently read;
- Invitation tests prove recipient-bound single-use acceptance and no plaintext
  secret persistence or disclosure;
- last-Owner and multi-record rollback tests preserve every invariant; and
- any successful cross-Tenant access is treated as a release-blocking failure.
