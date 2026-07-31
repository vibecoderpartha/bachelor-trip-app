# IR-012 — Events, audiences and Todos
## 1. Status and ownership

- Status: Draft
- Wave: W4
- Primary implementation owner: Not assigned unless documented
- Review owners: architecture, security, database/migration, design, and product reviewers as applicable
- Implementation authorised: No

## 2. Objective

Plan Group-scoped Event and Participant Todo conversion with presentation audiences, timezone/configuration behavior, safe CRUD, archive/read-only, and realtime integration.

## 3. Authoritative inputs

Domain model; parity contract; migration M03–M05/M15; roadmap IR-012; accepted Trip/Todo design contracts.

The accepted documents govern; this Draft packet does not restate or amend their decisions.

## 4. Entry gate

Verified exit evidence for IR-003, IR-008, IR-011., clean repository, accepted design mapping, and no unresolved prerequisite security or architecture contradiction.

## 5. Dependencies

- Direct IR dependencies: IR-003, IR-008, IR-011.
- Schema dependencies: target schema/data contracts approved by owning earlier packets where applicable
- Auth dependencies: session-derived actor and current membership where applicable
- Trusted-operation dependencies: IR-008 for any authoritative atomic action
- Design dependencies: accepted docs/ui-design/manifests/screen-manifest.json and relevant screen contracts
- Test/fixture dependencies: IR-001 capability and packet-specific fixture/evidence plan

## 6. In scope

Draft Event/Todo data/control contracts, audience-as-presentation semantics, timezone rendering, destructive confirmation, lifecycle errors, archive behavior, and parity/migration evidence.

## 7. Explicitly out of scope

Private/confidential Events, name authority, inactive writes, client-authoritative audience/security, actual CRUD implementation, or legacy AI activation.

## 8. Current repository state

src/tabs/TripTab.tsx filters events.for_users by persona name and deletes directly. src/hooks/useEvents.ts queries globally. src/hooks/useTodos.ts filters/mutates todos.user_name. AddEventModal uses names and direct insert.

## 9. Target repository change map

| Path | Action | Purpose | Depends on | Risk | Verification |
|---|---|---|---|---|---|
| src/tabs/TripTab.tsx | Existing file — later replace/extend candidate | Timeline, audience filter, direct delete | IR-012 | High | Event lifecycle evidence |
| src/tabs/TodoTab.tsx, src/hooks/useTodos.ts | Existing files — later replace/extend candidates | Name-keyed Todo flow | IR-012 | High | Participant/Todo tests |
| src/components/AddEventModal.tsx, EditEventModal.tsx | Existing files — later conversion candidates | Direct Event mutations | IR-012 | High | Form/permission tests |

Every proposed path is deliberately labelled **Proposed path — verify at packet start**. No proposed path is an assertion that it already exists.

## 10. Database and data-model work

Define Group-scoped Events, presentation-audience relationship, Participant Todo ownership, timezone/configuration fields, archive/read-only constraints, and migration compatibility. No SQL is written here.

An Event presentation audience is not confidentiality: it changes presentation only and cannot grant or restrict access to the Group-scoped Event or any associated private document.

## 11. RLS and authorization work

No policy is written by this Draft. The implementation plan must define same-Group success; unrelated-Group, inactive Member, removed Member, archive-state, and direct-object substitution denial; Owner/Member boundaries; service-role confinement; and frontend non-authority. Any cross-Group success or permissive fallback blocks the packet.

## 12. Trusted operations

Sensitive/destructive lifecycle operations consume IR-008 operation boundaries where atomicity or server-derived fields require it.

For every applicable operation, record caller, validated Auth actor, validated current Group relationship and role, transaction boundary, idempotency key, replay/concurrency result, failure response, audit output, service-role use, test evidence, and reconciliation/rollback path.

## 13. Storage work

Scan-created Event association is consumed from IR-013; audience controls Event presentation, not document confidentiality.

## 14. Realtime work

Consume IR-010 scoped updates, stale form, removal, and Group switch behavior.

## 15. Frontend implementation

Map Trip timeline, Event forms, timezone, audience presentation, Todo lifecycle, loading/empty/validation/server failure/permission/offline/read-only/reconnect states from contracts.

## 16. Design traceability

Affected Screen IDs: IR-012-owned Event/Todo/PERM/DOC/CFG/RT/MIG states; UI-04–UI-08 and UI-14 are primary.

No annotated export creates behavior beyond its accepted contract. Existing Screen IDs, Component IDs, tokens, navigation, and locked states remain stable unless their separate change-control process approves a change.

## 17. Migration and compatibility

M03 Event mapping, M04 creator provenance, M05 audience presentation, M15 Todo mapping; no silent mapping of names to authority.

## 18. Security acceptance

Required evidence includes same-Group success; unrelated-Group denial; inactive and removed Member denial; Owner/Member boundary; direct object/ID substitution denial; replay and race handling where applicable; service-role confinement; secret handling; and audit-safe output. Failure in a required negative case blocks release consumption.

## 19. Functional acceptance

FP-002–FP-006, FP-019, UI-04–UI-08, UI-14, TC-009, IPE-EVENT-001, IPE-ERR-001.

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

1. Confirm Active Group boundary. 2. Specify Event/Todo data contracts. 3. Define audience/non-confidential behavior. 4. Define forms/permission/realtime outcomes. 5. Supply migration/parity tests to IR-016/IR-021.

Each future step must name its intended outcome, systems/files touched, prerequisite, verification, and rollback point before execution begins.

## 26. Stop conditions

Stop rather than improvise for an architecture or locked-design contradiction, missing fixture, unsafe RLS result, cross-Group access, unreviewed migration ambiguity, unexpected production dependency, impossible rollback, unreviewed design change, or an R-02 defect that blocks the applicable acceptance gate.

## 27. Completion evidence

Before this packet can be Verified, retain reviewed implementation diff/test artifacts, negative security evidence, relevant fixture results, R-02 implementation evidence, rollback/recovery evidence, updated traceability, and an approved packet exit record. Draft status cannot satisfy this gate.

## 28. Open questions

Legacy source records cannot establish current target membership/Participant authority; migration must retain exceptions.

## 29. Packet exit gate

Dependent work may begin only when this packet has its required evidence, rollback conditions, reviewer decision, and an explicit exit record. This Draft packet neither marks the packet complete nor authorises implementation.
