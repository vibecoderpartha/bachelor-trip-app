# ADR-0002: Supabase Auth Is the Authoritative Identity Provider

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-24 |
| Decision owners/reviewers | Pranjal Kumar Maurya — product owner; architecture review completed 2026-07-24 |
| Related documents | [V1 Codebase Feature and Flow Report](../../v1-codebase-feature-and-flow-report.md); [Multi-Tenant Target Architecture](../multi-tenant-target-architecture.md); [Architecture Glossary](../glossary.md); [Deferred-Scope Register](../../product/deferred-scope-register.md) |
| Supersedes | None |
| Superseded by | None |

## Context

### Current state

V1 has no authentication or authorization. A visitor selects one of five
hardcoded personas, and the selected object exists only in React memory. Any
visitor can switch personas. There is no Supabase Auth session, account lookup,
credential check, or durable current-user identity.

The v1 `users` table is not used by the frontend, contains unused plaintext PIN
values, and has no declared relationship to Supabase Auth. Events, expenses,
settlements, and Todos identify people through display-name strings or
name-keyed structures. These facts cannot provide target authentication or
durable identity.

### Target problem

The conversion needs one authoritative global identity and session source.
Without an explicit authority, an application Profile, Group Member record,
legacy persona, client-provided identifier, or a second credentials table could
compete with Supabase Auth and create account-confusion, impersonation, and
authorization vulnerabilities.

## Decision

1. Supabase Auth is the authoritative global provider of Authentication,
   Auth User identity, and session identity.
2. Authentication credentials and account proof originate from Supabase Auth.
3. Application tables may reference the Auth User but must not create a second
   credential, password, PIN, or session authority.
4. A Profile is global application-domain information associated with an Auth
   User; it is not an identity provider and grants no Group access.
5. A Group Member is the application-domain relationship between an Auth User
   and one Group; it is not an authentication authority.
6. A Participant is the stable Group-scoped identity used by group-owned
   records. Phase 3 will lock its technical representation.
7. The frontend cannot assert an Auth User different from the validated
   Supabase Auth session.
8. Additional external identity providers are not approved by this ADR. If
   approved later, they must integrate without creating a competing
   application identity authority.

This decision does not implement authentication or define login, recovery,
verification, session, Invitation, JWT, or RLS details.

## Rationale

- Supabase Auth is already part of the selected backend platform, while v1 has
  no valid application credential authority to preserve.
- One source for Auth User and session identity eliminates ambiguity between
  credentials and application-domain records.
- Separating Auth User, Profile, and Group Member supports one global person
  participating in multiple isolated Groups.
- Server-validated session identity prevents client-selected personas,
  display names, or request-body user IDs from becoming authentication.
- Provider extensibility remains possible through a later approved change
  without changing the application's authoritative Auth User boundary.

## Consequences

### Positive

- Every authenticated request has one global actor identity source.
- Profile presentation and Group membership can evolve independently from
  credentials.
- Phase 3 can reference Auth User identity without designing account secrets.
- Phase 4 can define complete authentication and onboarding flows against a
  fixed authority.
- Phase 5 can design authorization and RLS around validated Auth User identity.

### Constraints and costs

- Existing personas cannot become authenticated identities automatically.
- A display-name match, email supplied by the client, Profile selection, or
  Group Member ID cannot prove account ownership.
- Application-domain availability cannot redefine or bypass Supabase Auth
  session validity.
- Authentication-dependent features must account for Supabase Auth lifecycle
  and failure states in Phase 4.
- Additional identity providers require explicit reconsideration and cannot be
  added as a Phase 2 implementation detail.

## Alternatives considered

### Application-managed credentials or PINs

Rejected. V1's unused PIN values are not authentication, and creating a second
credential store would duplicate security-sensitive account and session
responsibilities.

### Profile as identity authority

Rejected. A Profile is mutable application-domain information and does not
prove the authenticated actor or Group access.

### Group Member as identity authority

Rejected. A Group Member is scoped to one Group, while one Auth User may belong
to several Groups. It cannot provide global authentication.

### Client-selected persona or user identifier

Rejected. V1 demonstrates that a client choice can be switched without proof
and permits impersonation.

### Provider-neutral application identity independent of Supabase Auth

Rejected for the current conversion. It introduces a second authority without
a current requirement. Future identity providers may be reconsidered under
DEF-003 while preserving one application Auth User authority.

## Security implications

- The authenticated actor must come from the validated Supabase Auth session,
  not from a request body, query parameter, local storage, display name, Profile
  ID, or Group Member ID.
- Authentication does not by itself authorize Group access. Server/database
  checks must also establish the relevant Group Member relationship and role.
- Service-role execution can bypass client RLS and therefore must validate the
  actor, Group, action, and affected resource independently. Possession of
  service-role capability is not authorization.
- Profiles must not contain credentials or become a backdoor account lookup.
- Exact JWT validation, RLS, Edge Function, Storage, and realtime enforcement
  belongs to Phase 5.

## Migration/compatibility implications

- Partha, Astitva, Vaibhav, Suryansh, and Bittu remain Legacy Participants until
  a controlled migration and claiming process relates them to Auth Users and
  Group Members.
- Display-name equality must not auto-claim a Legacy Participant.
- Phase 3 must define the identity relationships without storing credentials.
- Phase 4 must define login, verification, recovery, session restoration,
  onboarding, and Invitation flows.
- Phase 6 must define claiming, backfill, validation, collision handling,
  compatibility, and rollback.
- Existing Trip, Scan, Split, settlement, FX, Todo, realtime, and storage
  behaviour remains subject to the later Feature parity contract.

## Deferred implications

- Google OAuth and additional identity providers remain Deferred under
  [DEF-003](../../product/deferred-scope-register.md#def-003--google-oauth-and-additional-identity-providers).
- Automatic Invitation email delivery remains Deferred under
  [DEF-006](../../product/deferred-scope-register.md#def-006--automatic-invitation-email-delivery).
- This ADR neither rejects provider extensibility permanently nor approves any
  provider implementation.

## Verification or compliance notes

Later documentation and implementation demonstrate compliance when:

- all authenticated actor identity originates from validated Supabase Auth
  context;
- no application table, legacy PIN, Profile, Group Member, display name, or
  client selection acts as a second credential/session authority;
- Group authorization requires a distinct Group Member check;
- service-role operations record and validate actor and Group context;
- Phase 4 flow specifications consistently treat Supabase Auth as the
  prerequisite identity authority; and
- migration tests prevent automatic Legacy Participant claiming by display
  name alone.
