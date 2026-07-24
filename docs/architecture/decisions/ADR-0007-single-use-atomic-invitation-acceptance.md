# ADR-0007: Invitations Are Single-Use and Accepted Atomically Server-Side

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-24 |
| Decision owners/reviewers | Pranjal Kumar Maurya — product owner; architecture review completed 2026-07-24 |
| Related documents | [V1 Codebase Feature and Flow Report](../../v1-codebase-feature-and-flow-report.md); [Multi-Tenant Target Architecture](../multi-tenant-target-architecture.md); [Domain and Data Model](../domain-and-data-model.md); [Authentication, Group, and Invitation Flows](../auth-groups-and-invitations.md); [Architecture Glossary](../glossary.md); [Deferred-Scope Register](../../product/deferred-scope-register.md); [ADR-0001](ADR-0001-group-is-trip-tenant.md); [ADR-0002](ADR-0002-supabase-auth-is-authoritative.md); [ADR-0003](ADR-0003-commercial-membership-deferred.md); [ADR-0004](ADR-0004-group-member-id-is-participant-identity.md) |
| Supersedes | None |
| Superseded by | None |

## Context

### Current state

V1 has no Supabase Auth flow, Group, Group Member relationship, Owner,
Invitation, recipient verification, or Tenant isolation. Any visitor selects
one of five hardcoded personas without proof. Display-name equality and legacy
plaintext PINs are not authenticated identity.

### Target problem

An Invitation bridges an authenticated global Auth User into one Group Tenant.
If a token alone grants access, can be replayed, is not recipient-bound, or is
consumed separately from Group Member creation, it can create impersonation,
duplicate membership, partial authority, and race-condition vulnerabilities.
The flow also needs to reactivate an existing stable Participant identity
without turning Invitation acceptance into Legacy Participant claiming.

## Decision

1. Each Invitation belongs to exactly one Group.
2. Each Invitation is intended for exactly one recipient.
3. Invitations expire and are single-use.
4. Invitation secrets are opaque, high-entropy, and unguessable.
5. Possessing a secret does not authenticate the recipient or grant Group
   membership.
6. Acceptance requires a validated Supabase Auth session and a match against
   the relevant verified recipient identity attribute.
7. Acceptance occurs only through one trusted server-side operation.
8. That operation derives the actor from the validated session and does not
   trust client-supplied actor, recipient, Group, role, or Invitation state.
9. Invitation validation, recipient validation, Group lifecycle validation,
   membership creation/reactivation, and Invitation consumption succeed or
   fail atomically.
10. Successful acceptance creates an ordinary Member role, never Owner
    authority.
11. Where the same Auth User previously had an inactive relationship to the
    Group and reactivation is allowed, acceptance preserves the existing
    `group_members.id`.
12. Reacceptance, replay, concurrent attempts, and duplicate requests cannot
    create additional Group Member identities, roles, or authority.
13. Acceptance racing with revocation or expiry produces exactly one valid
    terminal outcome; the losing operation creates no authority.
14. A safe idempotent already-completed result may be returned only to the same
    validated intended recipient.
15. Invitation acceptance cannot claim, merge, attach, or rewrite an unclaimed
    Legacy Participant.
16. Automatic Invitation email delivery is not part of this decision; manual
    sharing is the current delivery boundary.
17. Physical schema, token hashing and persistence, transaction/locking
    mechanics, database functions, RLS, rate limits, abuse controls, API shape,
    and implementation remain later work.

## Rationale

- Supabase Auth remains the single identity and session authority while the
  Invitation remains a Group-scoped onboarding intent.
- Verified recipient binding prevents a forwarded or stolen secret from being
  sufficient to create membership.
- One atomic operation prevents a consumed Invitation without membership or a
  membership created from an unconsumed Invitation.
- Single-use and terminal state rules prevent replay and ambiguous reuse.
- Ordinary Member as the only invited role prevents token-based Owner
  escalation.
- Preserving an existing `group_members.id` maintains historical Participant
  identity through removal and reactivation.
- Separating Invitation acceptance from Legacy Participant claiming prevents
  display-name or email coincidence from rewriting Bali history.
- Deferring delivery infrastructure keeps authorization independent of an email
  provider.

## Consequences

### Positive

- One Invitation can establish authority for at most one validated recipient
  and one Group Member relationship.
- Partial failure creates no partial Group authority.
- Concurrent acceptance, revocation, and expiry have explicit terminal
  outcomes.
- Retry behaviour can be safe without minting duplicate membership.
- Existing inactive Participants retain stable historical identity on
  reactivation.
- Invitation delivery can evolve without changing acceptance authority.

### Constraints and costs

- Acceptance cannot be implemented as independent client-side reads and writes.
- Recipient verification is required before authority can be created.
- The trusted operation must revalidate all conditions even after safe
  pre-acceptance inspection.
- Active existing membership, recipient mismatch, terminal tokens, archived
  Groups, and conflicting relationships require explicit no-authority
  outcomes.
- Phase 5 must address token enumeration, persistence, privileged execution,
  concurrency enforcement, and abuse resistance.
- Audit records must preserve lifecycle provenance without retaining plaintext
  secrets.

## Alternatives considered

### Token possession alone grants membership

Rejected. A forwarded, leaked, guessed, or logged token would become both
identity proof and Authorization.

### Client-side Invitation lookup followed by membership insert

Rejected. Client state is untrusted, and separate operations permit replay,
races, and partial completion.

### Reusable Group join link

Rejected for the current target. It is not recipient-bound or single-use and
would require a separate open-enrollment and abuse-control decision.

### Invite directly as Owner

Rejected. Invitation acceptance is an onboarding mechanism for ordinary
Members; Owner authority requires a separate currently authorized ownership
flow.

### Create a new Group Member identity on reactivation

Rejected when the same Auth User-to-Group relationship already exists.
Replacing `group_members.id` would fragment historical Participant references.

### Use Invitation acceptance to claim Legacy Participant history

Rejected. Legacy claiming requires Phase 6 evidence and collision handling
independent of Invitation recipient matching.

### Implement automatic email delivery with acceptance

Deferred. Delivery operations are separable from the security decision and
remain under DEF-006.

## Security implications

- The authenticated actor comes only from the validated Supabase Auth session.
- Acceptance additionally requires the relevant verified recipient match;
  Authentication alone and token possession alone are each insufficient.
- The Invitation, Group, Group lifecycle, recipient, state, expiry, revocation,
  use, existing membership, and requested outcome must be validated inside the
  trusted boundary.
- Service-role capability is not Authorization; privileged execution must
  validate the actor and operation despite any RLS bypass.
- Secrets must not appear in logs, analytics, audit records, realtime payloads,
  or ordinary database reads.
- Invalid responses must avoid recipient and Group enumeration.
- The Phase 5 security architecture owns JWT handling, RLS, service-role
  confinement, token storage and comparison, constraints, rate limits, abuse
  controls, and security tests.

## Migration/compatibility implications

- V1 has no Invitation flow or authenticated Group membership to migrate.
- Persona selection and plaintext PINs cannot satisfy Invitation acceptance.
- The migrated Bali Group needs a separately controlled Owner/bootstrap and
  Legacy Participant claiming plan in Phase 6.
- Invitation acceptance must not attach an Auth User to a Legacy Participant,
  even when display name or email appears to match.
- An inactive target Group Member may be reactivated with the same stable
  Participant ID only when the same Auth User and Group relationship is
  established and every lifecycle condition passes.
- Exact bootstrap, migration, compatibility, validation, and rollback remain
  Phase 6 work.

## Deferred implications

- Google OAuth and additional identity providers remain Deferred under
  [DEF-003](../../product/deferred-scope-register.md#def-003--google-oauth-and-additional-identity-providers).
- Automatic Invitation email delivery remains Deferred under
  [DEF-006](../../product/deferred-scope-register.md#def-006--automatic-invitation-email-delivery).
- Roles beyond Owner and Member remain Deferred under
  [DEF-007](../../product/deferred-scope-register.md#def-007--roles-beyond-owner-and-member).
- Paid plans and premium Entitlements remain excluded under
  [ADR-0003](ADR-0003-commercial-membership-deferred.md), DEF-001, and DEF-002.
- Payment processing, wallets, and stored monetary value remain unrelated and
  Deferred under DEF-009 and DEF-010.

## Verification or compliance notes

Later documentation and implementation demonstrate compliance when:

- every Invitation belongs to one Group and one intended recipient;
- every successful acceptance uses a validated Supabase Auth session and
  verified recipient match;
- no client-supplied actor, role, Group, or Invitation state is authoritative;
- one Invitation produces at most one ordinary Member relationship;
- membership creation/reactivation and Invitation consumption are atomic;
- expired, revoked, used, malformed, and recipient-mismatched secrets create no
  authority;
- replay, concurrent acceptance, and acceptance/revocation/expiry races cannot
  create duplicate or partial authority;
- same-relationship reactivation preserves `group_members.id`;
- no Invitation acceptance claims or rewrites Legacy Participant history;
- secret-handling tests show no plaintext leakage through logs, analytics,
  audit, realtime, or ordinary reads; and
- automatic email delivery and additional roles/providers remain absent.
