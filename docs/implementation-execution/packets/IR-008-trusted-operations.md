# IR-008 — Trusted operations
## 1. Status and ownership

- Status: Draft
- Wave: W2
- Primary implementation owner: Not assigned unless documented
- Review owners: architecture, security, database/migration, design, and product reviewers as applicable
- Implementation authorised: No

## 2. Objective

Define narrow trusted-operation boundaries for atomic lifecycle, sensitive finance, document reconciliation, and configuration actions without browser service-role access.

## 3. Authoritative inputs

Security model §10; ADR-0008; roadmap IR-008; accepted operation-dependent design contracts.

The accepted documents govern; this Draft packet does not restate or amend their decisions.

## 4. Entry gate

Verified exit evidence for IR-007., clean repository, accepted design mapping, and no unresolved prerequisite security or architecture contradiction.

## 5. Dependencies

- Direct IR dependencies: IR-007.
- Schema dependencies: target schema/data contracts approved by owning earlier packets where applicable
- Auth dependencies: session-derived actor and current membership where applicable
- Trusted-operation dependencies: IR-008 for any authoritative atomic action
- Design dependencies: accepted docs/ui-design/manifests/screen-manifest.json and relevant screen contracts
- Test/fixture dependencies: IR-001 capability and packet-specific fixture/evidence plan

## 6. In scope

Complete candidate operation inventory, caller/validation/transaction/idempotency/replay/race/audit/failure/rollback requirements, and service-role confinement.

## 7. Explicitly out of scope

Implementing functions, one broad proxy, frontend service-role use, unbounded operation scope, or bypassing RLS review.

## 8. Current repository state

supabase/functions/parse-document/index.ts creates a service-role client, trusts client uploaded_by/for_users, uploads to public tickets, calls an external provider, and inserts events. UI mutations in tabs/modals directly use browser client.

## 9. Target repository change map

| Path | Action | Purpose | Depends on | Risk | Verification |
|---|---|---|---|---|---|
| supabase/functions/parse-document/index.ts | Existing file — later replace/restrict candidate | Legacy privileged parse/document path | IR-008/IR-013 | Critical | Trusted-operation audit |
| src/tabs/ScanTab.tsx | Existing file — later conversion candidate | Client submits authoritative fields | IR-013 | Critical | Provenance tests |
| `Proposed path — verify at packet start: supabase/functions/<operation>/index.ts` | Proposed path | Narrow future operation boundary | IR-008 | Critical | Operation-specific review |

Every proposed path is deliberately labelled **Proposed path — verify at packet start**. No proposed path is an assertion that it already exists.

## 10. Database and data-model work

No schema implementation in Draft; define audit/idempotency/result record needs consumed by operation-owning packets.

## 11. RLS and authorization work

No policy is written by this Draft. The implementation plan must define same-Group success; unrelated-Group, inactive Member, removed Member, archive-state, and direct-object substitution denial; Owner/Member boundaries; service-role confinement; and frontend non-authority. Any cross-Group success or permissive fallback blocks the packet.

## 12. Trusted operations

Owns the planning register TOP-001 onward. Minimum candidates: Group bootstrap, invitation acceptance, role transition, ownership transfer, Member removal, Participant claim, settlement recording, sensitive configuration changes, archive/restore, and document reconciliation.

For every applicable operation, record caller, validated Auth actor, validated current Group relationship and role, transaction boundary, idempotency key, replay/concurrency result, failure response, audit output, service-role use, test evidence, and reconciliation/rollback path.

## 13. Storage work

Document reconciliation candidate must validate current Group/member relationship and leave a reconciled/quarantined outcome.

## 14. Realtime work

Operations emit only authorised state; clients re-fetch/re-authorize rather than trusting payloads.

## 15. Frontend implementation

No operation success UI before server confirmation. Map in-progress/retry/idempotent result states from accepted contracts.

## 16. Design traceability

Cross-cutting operation states reference accepted loading, confirmation, denied, error, recovery, and audit-safe UI patterns.

No annotated export creates behavior beyond its accepted contract. Existing Screen IDs, Component IDs, tokens, navigation, and locked states remain stable unless their separate change-control process approves a change.

## 17. Migration and compatibility

Migration operations are separately controlled by IR-016–IR-020; no generic browser proxy.

## 18. Security acceptance

Required evidence includes same-Group success; unrelated-Group denial; inactive and removed Member denial; Owner/Member boundary; direct object/ID substitution denial; replay and race handling where applicable; service-role confinement; secret handling; and audit-safe output. Failure in a required negative case blocks release consumption.

## 19. Functional acceptance

S05, S09, S10, S12, S18; TC-012, TC-013.

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

1. Complete operation inventory. 2. Allocate operation ownership. 3. Define validation/transaction/idempotency/audit per operation. 4. Review failure injection. 5. Gate W3 only after no partial-authority path remains.

Each future step must name its intended outcome, systems/files touched, prerequisite, verification, and rollback point before execution begins.

## 26. Stop conditions

Stop rather than improvise for an architecture or locked-design contradiction, missing fixture, unsafe RLS result, cross-Group access, unreviewed migration ambiguity, unexpected production dependency, impossible rollback, unreviewed design change, or an R-02 defect that blocks the applicable acceptance gate.

## 27. Completion evidence

Before this packet can be Verified, retain reviewed implementation diff/test artifacts, negative security evidence, relevant fixture results, R-02 implementation evidence, rollback/recovery evidence, updated traceability, and an approved packet exit record. Draft status cannot satisfy this gate.

## 28. Open questions

No selected implementation mechanism for each operation is established; each candidate needs packet-start review.

## 29. Packet exit gate

Dependent work may begin only when this packet has its required evidence, rollback conditions, reviewer decision, and an explicit exit record. This Draft packet neither marks the packet complete nor authorises implementation.
