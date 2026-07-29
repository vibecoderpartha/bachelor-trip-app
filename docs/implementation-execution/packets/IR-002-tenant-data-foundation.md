# IR-002 — Tenant data foundation
## 1. Status and ownership

- Status: Draft
- Wave: W1
- Primary implementation owner: Not assigned unless documented
- Review owners: architecture, security, database/migration, design, and product reviewers as applicable
- Implementation authorised: No

## 2. Objective

Define executable target ownership/configuration schema work for one Group per Trip Tenant, Profiles, stable group_members Participant identity, configuration, audit paths, and parent-derived Tenant scope.

## 3. Authoritative inputs

docs/architecture/domain-and-data-model.md; docs/architecture/multi-tenant-target-architecture.md; ADR-0001, ADR-0004, ADR-0005, ADR-0006; roadmap IR-002.

The accepted documents govern; this Draft packet does not restate or amend their decisions.

## 4. Entry gate

Verified exit evidence for IR-001., clean repository, accepted design mapping, and no unresolved prerequisite security or architecture contradiction.

## 5. Dependencies

- Direct IR dependencies: IR-001.
- Schema dependencies: target schema/data contracts approved by owning earlier packets where applicable
- Auth dependencies: session-derived actor and current membership where applicable
- Trusted-operation dependencies: IR-008 for any authoritative atomic action
- Design dependencies: accepted docs/ui-design/manifests/screen-manifest.json and relevant screen contracts
- Test/fixture dependencies: IR-001 capability and packet-specific fixture/evidence plan

## 6. In scope

Draft schema/migration order, constraints, indexes, audit fields, archive semantics, generated-type refresh, two-Group invariants, and deny-by-default transition design.

## 7. Explicitly out of scope

Applying migrations, client ownership/name identity, an organisation model, a separate Trip tenant, or production schema action.

## 8. Current repository state

supabase/migrations/001_initial.sql models users, events, expenses, settlements, and exchange_rates with name/text ownership. 004_paid_by_splits.sql adds JSONB contributions; 005_todos.sql adds name-scoped Todos. src/constants/users.ts is a five-person persona catalogue, not target identity.

## 9. Target repository change map

| Path | Action | Purpose | Depends on | Risk | Verification |
|---|---|---|---|---|---|
| supabase/migrations/001_initial.sql through 005_todos.sql | Existing files — legacy reference, not edit target in this Draft pass | Legacy schema/policy history | IR-002 | High | Reviewed migration register |
| supabase/seed.sql | Existing file — inspect only | Legacy seed source | IR-002/IR-016 | High | Source inventory |
| `Proposed path — verify at packet start: supabase/migrations/<new-unit>.sql` | Proposed path | Future ordered schema unit | IR-002 | High | Schema/RLS/test evidence |
| `Proposed path — verify at packet start: src/lib/database.types.ts` | Proposed generated path | Generated target types | IR-002 | Medium | Generation provenance |

Every proposed path is deliberately labelled **Proposed path — verify at packet start**. No proposed path is an assertion that it already exists.

## 10. Database and data-model work

Plan Group, Profile, group_members, Participant, configuration, audit, parent foreign keys, archive markers, constraints, indexes, and generated types. Preserve legacy source mapping; do not assign timestamp filenames in Draft.

## 11. RLS and authorization work

No policy is written by this Draft. The implementation plan must define same-Group success; unrelated-Group, inactive Member, removed Member, archive-state, and direct-object substitution denial; Owner/Member boundaries; service-role confinement; and frontend non-authority. Any cross-Group success or permissive fallback blocks the packet.

## 12. Trusted operations

No browser-authoritative operation. IR-003/IR-008 consume the schema for atomic bootstrap and trusted writes.

For every applicable operation, record caller, validated Auth actor, validated current Group relationship and role, transaction boundary, idempotency key, replay/concurrency result, failure response, audit output, service-role use, test evidence, and reconciliation/rollback path.

## 13. Storage work

No Storage change; establish Group parent identity required by later object metadata.

## 14. Realtime work

No Realtime activation; schema ownership is a prerequisite only.

## 15. Frontend implementation

No UI implementation. Existing src/App.tsx, useCurrentUser.ts, and persona constants remain untouched until their owning later packets.

## 16. Design traceability

Related Group/Onboarding/Membership design families are referenced through the accepted manifest; no visual asset changes.

No annotated export creates behavior beyond its accepted contract. Existing Screen IDs, Component IDs, tokens, navigation, and locked states remain stable unless their separate change-control process approves a change.

## 17. Migration and compatibility

M01–M18 parent mapping foundation; no transform execution and no silent source repair.

## 18. Security acceptance

Required evidence includes same-Group success; unrelated-Group denial; inactive and removed Member denial; Owner/Member boundary; direct object/ID substitution denial; replay and race handling where applicable; service-role confinement; secret handling; and audit-safe output. Failure in a required negative case blocks release consumption.

## 19. Functional acceptance

M01–M18, TC-002, TC-009, TC-019, ADR-0001/0004/0005/0006.

## 20. Automated tests

Use current test tooling only where it exists. Repository inspection found no configured test, lint, database-test, browser-test, or CI runner; any new tooling is a proposed dependency for review under IR-001. Planned coverage may include unit, integration, database/RLS, browser, concurrency, idempotency, migration, rollback, visual-regression, and accessibility automation only after the selected tooling and environment capability are approved.

## 21. Manual verification

Inspect affected locked screen states; keyboard/focus behavior; screen-reader announcements; responsive 480px-shell behavior; offline/reconnect/stale behavior; multi-tab behavior; and two-account/two-Group isolation. Where applicable, inspect archive/removal/current-user-change states and browser/device-specific safe-area/native chooser behavior.

## 22. R-02 accessibility obligations

Applicable running-build evidence must cover contrast measurement, touch-target measurement, keyboard order, visible focus, focus trap, focus restoration, connected errors, reduced motion, screen-reader loading/success/error announcements, realtime announcements, and safe-area behavior where relevant.

**R-02 remains open until verified on the running implementation.**

## 23. Observability

Use structured, audit-safe operation results and failure classification; correlation/reference identifiers; security-event evidence; reconciliation status; and release monitoring where applicable. Exclude passwords, tokens, full Invitation secrets, service-role credentials, private document contents, and unnecessary personal data.

## 24. Rollback and recovery

Define packet boundary, reversible and irreversible work, safe stop, data preservation, schema/application rollback, partial failure handling, reconciliation, and release-blocking conditions before implementation. Do not imply all migrations are reversible.

## 25. Implementation sequence

1. Reconcile accepted invariants with legacy SQL. 2. Draft ordered DBM units. 3. Define parent/child constraints and archive behavior. 4. Define generated-type provenance. 5. Review two-Group invariant evidence before W2.

Each future step must name its intended outcome, systems/files touched, prerequisite, verification, and rollback point before execution begins.

## 26. Stop conditions

Stop rather than improvise for an architecture or locked-design contradiction, missing fixture, unsafe RLS result, cross-Group access, unreviewed migration ambiguity, unexpected production dependency, impossible rollback, unreviewed design change, or an R-02 defect that blocks the applicable acceptance gate.

## 27. Completion evidence

Before this packet can be Verified, retain reviewed implementation diff/test artifacts, negative security evidence, relevant fixture results, R-02 implementation evidence, rollback/recovery evidence, updated traceability, and an approved packet exit record. Draft status cannot satisfy this gate.

## 28. Open questions

OE-002: deployed schema, RLS, row inventory, and production environment topology are not established by repository inspection.

## 29. Packet exit gate

Dependent work may begin only when this packet has its required evidence, rollback conditions, reviewer decision, and an explicit exit record. This Draft packet neither marks the packet complete nor authorises implementation.
