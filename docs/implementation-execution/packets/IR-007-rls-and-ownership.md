# IR-007 — RLS and ownership
## 1. Status and ownership

- Status: Draft
- Wave: W2
- Primary implementation owner: Not assigned unless documented
- Review owners: architecture, security, database/migration, design, and product reviewers as applicable
- Implementation authorised: No

## 2. Objective

Plan deny-by-default RLS and ownership enforcement for direct/indirect Group paths, lifecycle states, and cross-Group substitution denial.

## 3. Authoritative inputs

ADR-0008; docs/architecture/security-model.md §§9–10; target architecture; roadmap IR-007.

The accepted documents govern; this Draft packet does not restate or amend their decisions.

## 4. Entry gate

Verified exit evidence for IR-002, IR-004., clean repository, accepted design mapping, and no unresolved prerequisite security or architecture contradiction.

## 5. Dependencies

- Direct IR dependencies: IR-002, IR-004.
- Schema dependencies: target schema/data contracts approved by owning earlier packets where applicable
- Auth dependencies: session-derived actor and current membership where applicable
- Trusted-operation dependencies: IR-008 for any authoritative atomic action
- Design dependencies: accepted docs/ui-design/manifests/screen-manifest.json and relevant screen contracts
- Test/fixture dependencies: IR-001 capability and packet-specific fixture/evidence plan

## 6. In scope

Draft table-by-table logical policy matrix, active/inactive/removed/archive behavior, object substitution tests, two-Group evidence, service-role boundary, and transition sequencing.

## 7. Explicitly out of scope

Actual policies, permissive interval, Active Group predicate as authority, client authority, or a releasable partial-security state.

## 8. Current repository state

001_initial.sql enables RLS but uses `USING (true)` and `WITH CHECK (true)` policies; 002_tickets_bucket.sql makes tickets public; 005_todos.sql grants all access. Client hooks directly query/mutate tables.

## 9. Target repository change map

| Path | Action | Purpose | Depends on | Risk | Verification |
|---|---|---|---|---|---|
| supabase/migrations/001_initial.sql | Existing legacy policy source — do not edit in Draft | Permissive table policies | IR-007 | Critical | Policy matrix review |
| supabase/migrations/002_tickets_bucket.sql | Existing legacy policy source — do not edit in Draft | Public tickets policy | IR-007/IR-009 | Critical | Private-object denial evidence |
| src/hooks/useEvents.ts, useExpenses.ts, useSettlements.ts, useTodos.ts | Existing files — later conversion candidates | Direct client data access | IR-007/IR-011 | Critical | Scoped/RLS tests |

Every proposed path is deliberately labelled **Proposed path — verify at packet start**. No proposed path is an assertion that it already exists.

## 10. Database and data-model work

Define policy migration units after target tables/constraints exist. Include direct and indirect ownership, archived reads/writes, inactive/removed denial, indexes supporting policy predicates, and rollback limitations.

## 11. RLS and authorization work

No policy is written by this Draft. The implementation plan must define same-Group success; unrelated-Group, inactive Member, removed Member, archive-state, and direct-object substitution denial; Owner/Member boundaries; service-role confinement; and frontend non-authority. Any cross-Group success or permissive fallback blocks the packet.

## 12. Trusted operations

Trusted operations are planned in IR-008; RLS must not be bypassed by broad proxies or browser service role.

For every applicable operation, record caller, validated Auth actor, validated current Group relationship and role, transaction boundary, idempotency key, replay/concurrency result, failure response, audit output, service-role use, test evidence, and reconciliation/rollback path.

## 13. Storage work

Storage is separately implemented by IR-009 but uses this Group/member authorization model.

## 14. Realtime work

IR-010 subscriptions must use current authorization; a channel cannot bypass RLS.

## 15. Frontend implementation

Frontend is non-authority. Permission/read-only screens map to server-confirmed denial and safe unavailable state.

## 16. Design traceability

Affected PERM screens and all feature denial states retain exact manifest references; UI does not prove security.

No annotated export creates behavior beyond its accepted contract. Existing Screen IDs, Component IDs, tokens, navigation, and locked states remain stable unless their separate change-control process approves a change.

## 17. Migration and compatibility

Security activation is release-blocking; migration/rehearsal cannot release partial policy activation.

## 18. Security acceptance

Required evidence includes same-Group success; unrelated-Group denial; inactive and removed Member denial; Owner/Member boundary; direct object/ID substitution denial; replay and race handling where applicable; service-role confinement; secret handling; and audit-safe output. Failure in a required negative case blocks release consumption.

## 19. Functional acceptance

TC-011, TC-016, TC-017, TC-019; all security areas; two-Group matrix.

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

1. Convert invariants to policy matrix. 2. Identify direct/indirect objects. 3. Specify two-Group/lifecycle substitution cases. 4. Review rollback. 5. Permit IR-008 only after deny-by-default plan passes.

Each future step must name its intended outcome, systems/files touched, prerequisite, verification, and rollback point before execution begins.

## 26. Stop conditions

Stop rather than improvise for an architecture or locked-design contradiction, missing fixture, unsafe RLS result, cross-Group access, unreviewed migration ambiguity, unexpected production dependency, impossible rollback, unreviewed design change, or an R-02 defect that blocks the applicable acceptance gate.

## 27. Completion evidence

Before this packet can be Verified, retain reviewed implementation diff/test artifacts, negative security evidence, relevant fixture results, R-02 implementation evidence, rollback/recovery evidence, updated traceability, and an approved packet exit record. Draft status cannot satisfy this gate.

## 28. Open questions

OE-002: deployed RLS/schema state is not established; production policy changes require separate review.

## 29. Packet exit gate

Dependent work may begin only when this packet has its required evidence, rollback conditions, reviewer decision, and an explicit exit record. This Draft packet neither marks the packet complete nor authorises implementation.
