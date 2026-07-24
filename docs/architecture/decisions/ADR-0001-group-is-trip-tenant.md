# ADR-0001: One Group Represents One Trip and Is the Tenant Boundary

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

V1 was built for one fixed Bali Trip and five hardcoded personas. It has no
Group table, Trip table, membership relationship, owner relationship,
Invitation, `group_id`, or `trip_id`. Feature data, realtime subscriptions, RLS
rules, and scanned-document storage are global rather than Tenant-scoped.

The current feature set collaborates around one shared travel context:
itinerary events, scanned documents, expenses, balances, settlements, FX
information, and Todos. The conversion needs a reusable ownership and isolation
boundary for that same unit of collaboration.

### Target problem

“Group” and “Trip” could be modeled as one workspace, two independent Tenant
layers, or a permanent friend Group containing many Trips. Leaving that choice
open would make Phase 3 ownership, Phase 4 membership flows, Phase 5 security,
and Phase 6 migration ambiguous and potentially incompatible.

## Decision

For the current target architecture:

1. One Group represents exactly one Trip workspace.
2. Group is the internal ownership scope and Tenant boundary.
3. Trip may remain the primary user-facing product term.
4. Group and Trip are not separate Tenant layers.
5. No permanent friend-group-to-many-Trips hierarchy exists in the current
   target.
6. One Auth User may have independent Group Member relationships in multiple
   Groups.
7. Membership or ownership in one Group grants no access to another Group.

This decision establishes a product and ownership boundary. It does not define
tables, keys, constraints, RLS policies, application flows, or migration steps.

## Rationale

- One Trip workspace matches the unit of collaboration already present in v1.
- A single Tenant boundary prevents conflicting ownership keys and duplicated
  authorization layers.
- Users can participate in multiple Trips through multiple Group Member
  relationships without introducing a permanent social organization.
- The model supports a direct later migration target: one Bali Group for the
  existing Bali dataset.
- It keeps the conversion focused on secure multi-user Feature parity instead
  of adding an unvalidated Group-to-many-Trips product hierarchy.

## Consequences

### Positive

- Every group-owned domain area has one unambiguous Tenant context.
- Phase 3 can model ownership without choosing between Group and Trip keys.
- Phase 4 can define membership and Invitation flows around one workspace.
- Phase 5 can evaluate cross-Group isolation against one boundary.
- An Auth User can join several Trip workspaces while each remains isolated.

### Constraints and costs

- Creating a second Trip for the same cohort means creating a separate Group
  under the current target.
- Group membership, roles, Invitations, configuration, and feature data do not
  automatically carry across Groups.
- Cross-Trip history or administration cannot be implemented by silently
  treating multiple Groups as one Tenant.
- Later introduction of a permanent friend Group would require a new
  architecture decision and reviewed migration.

### Data ownership implications

- Trip/event information, document metadata, Group finance and settlements,
  Group FX records or snapshots, Todos, realtime access, and stored travel
  documents are group-owned concerns.
- Supabase Auth identity and genuinely global Profile information are not owned
  by one Group.
- Exact relationships and technical ownership fields belong to Phase 3.

## Alternatives considered

### Permanent friend Group containing many Trips

Deferred, not selected. It would introduce a parent organization, inherited
membership, cross-Trip roles, navigation, and lifecycle rules that are not
required for the current conversion. See DEF-004.

### Independent Group and Trip Tenant layers

Rejected for the current target. Two ownership scopes would leave every domain
record and permission rule needing a choice or synchronization between them
without a demonstrated product requirement.

### Auth User as Tenant

Rejected. Trip collaboration requires several users inside one isolated
workspace, and one user may participate in multiple workspaces.

### Continue one global dataset

Rejected. It cannot provide Tenant isolation and is the current limitation this
conversion must remove.

## Security implications

- Group is the boundary across which data access must be isolated.
- Active Group, URL state, local storage, client stores, request bodies, and
  knowledge of a Group identifier cannot prove membership.
- Server/database-controlled Auth User and Group Member relationships must
  establish Group context.
- Group-owned database rows, Storage objects, and realtime streams must not
  cross the Group boundary.
- Exact RLS, Storage, Edge Function, and realtime enforcement remains Phase 5
  work.

## Migration/compatibility implications

- Existing Bali data will later be associated with one Bali Group.
- The five Legacy Participants require a later mapping and claiming strategy.
- Existing global records and storage cannot be assumed Tenant-scoped merely
  because all current data belongs to the Bali Trip.
- Phase 6 must define backfill, validation, compatibility, rollback, and
  Feature parity evidence.
- This ADR does not prescribe migration mechanics or authorize changes.

## Deferred implications

- [DEF-004](../../product/deferred-scope-register.md#def-004--permanent-friend-groups-containing-multiple-trips)
  retains the permanent friend-group-to-many-Trips hierarchy as Deferred.
- [DEF-011](../../product/deferred-scope-register.md#def-011--advanced-organization-administration)
  retains organization-level administration as Deferred.
- Roles beyond Owner and Member remain Deferred under
  [DEF-007](../../product/deferred-scope-register.md#def-007--roles-beyond-owner-and-member).

## Verification or compliance notes

Later documentation and implementation demonstrate compliance when:

- domain ownership uses one Group Tenant context rather than independent Group
  and Trip scopes;
- a user may have independent memberships in multiple Groups;
- authorization and security tests deny cross-Group reads and writes;
- no parent friend-group entity or membership inheritance is introduced;
- the migrated v1 dataset is validated as one Bali Group; and
- product copy may say Trip without creating a second Tenant boundary.
