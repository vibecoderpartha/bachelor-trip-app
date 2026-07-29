# Test and Evidence Plan

## Current tooling inventory

The repository proves only npm/Vite/TypeScript build capability: `npm run build`
runs `tsc && vite build`; `npm run dev` and `npm run start` run Vite. There is
no standalone lint/type-check script, test directory, unit/integration runner,
browser-test configuration, database/RLS harness, accessibility runner, CI
configuration, or generated database type file. The accepted static design
manifests are evidence inputs, not a visual-test runner.

## Nine test and evidence families

| Family | Current capability | First owning IR | Required capability / evidence | Consuming gate |
|---|---|---|---|---|
| Deterministic unit/domain | Not established | IR-001, then IR-014/015 | Exact calculation and pure-state tests; EQ-01, SET-01, USD-01 and FX/time fixtures. | W4 exit, W5 evidence |
| Database and RLS | Not established | IR-001, then IR-007 | Isolated target/database harness with two accounts, two Groups, lifecycle states, row/object substitution, and audit-safe results. | W1 exit; W2–W4 packet exits |
| Trusted-operation integration | Not established | IR-001, then IR-003/005/006/008/013/014/015 | Failure injection, transaction, idempotency, replay, race, audit, and reconciliation tests. | W3/W4 exits |
| Browser/application | Not established | IR-001, then IR-004/011–015 | Locked Screen/Component flow/state evidence, safe errors, responsive shell, routing/session, and multi-tab cases. | W4 exit; IR-021 |
| Storage and Realtime | Not established | IR-001, then IR-009/010/013 | Private object, orphan/reconciliation, current authorization, reconnect, removal, archive, and stale-event cases. | W3/W4 exits |
| Migration and reconciliation | Not established | IR-016 | M01–M18 manifest, count/checksum, quarantine, rerun/idempotency, and source/target reconciliation evidence. | W5 exit; W6 entry |
| Visual/design review | Static accepted exports only; runner not established | IR-021 | Targeted locked visual/state comparison plus documented manual decision; no claim of pixel runner before selection. | IR-021 exit |
| Accessibility / R-02 | Not established | IR-001 enables; owning component/flow IR executes; IR-021 rolls up | Automated candidates where selected plus manual browser/device/screen-reader evidence. | Owning packet exit and W5/W7 gates |
| Recovery and release | Not established | IR-017–020 | Rehearsal failure injection, rollback/forward recovery, cutover smoke, monitoring, containment, and retention evidence. | W6/W7 gates |

## Proposed capability decisions owned by IR-001

IR-001 may select capabilities after review; it must not assert that any of
them already exists. The table records the required review rather than naming a
package or vendor prematurely.

| Proposed capability | Reason | First owner | Package/dependency impact | Review requirement | Rollback/removal path |
|---|---|---|---|---|---|
| Unit/integration runner | Deterministic calculation and state evidence. | IR-001 | Proposed dependency/configuration; exact package is not established. | Compare TypeScript/Vite compatibility, isolation, CI suitability, and maintenance. | Remove unused config/dependency before target implementation; retain only evidence record. |
| Browser harness | Locked UI, Auth, modal, responsive, and R-02 behaviour requires a running browser. | IR-001 | Proposed dependency/configuration and browser runtime; exact tool is not established. | Review browser/device coverage, secret handling, fixture reset, and CI feasibility. | Remove unused config/runtime; do not retain screenshots with sensitive data. |
| Database/RLS fixture harness | Two-account/two-Group and policy evidence cannot be inferred from client unit tests. | IR-001 | Proposed isolated project/container/script capability; exact mechanism is not established. | Review isolation, credential boundary, reset/cleanup, concurrency, and audit-safe output. | Destroy only created isolated fixtures under their approved runbook; no production project use. |
| Failure-injection capability | Atomicity, retry, reconciliation, and recovery require controlled faults. | IR-001 | Proposed harness/adapters; exact mechanism is not established. | Review determinism, no production endpoint, retention, and safe cleanup. | Disable/remove fault adapter; preserve redacted result references. |
| Evidence storage and checksum convention | Results need stable, reviewable, secret-free retention. | IR-001 | Proposed artifact path/service; exact location is not established. | Review retention owner, access control, checksums, redaction, and removal. | Remove unneeded local artifacts; no secret value may enter the repository. |
| CI evidence gate | Later W5/W7 gates need reproducible evidence. | IR-001 | Proposed workflow/platform configuration; none exists now. | Review owner, runner isolation, credentials, branch policy, and failed-run retention. | Disable/revert the reviewed workflow; no permissive bypass. |

## Requirement and fixture mapping

| Requirement set | Primary implementation evidence owner | Integrated/release evidence owner |
|---|---|---|
| FP-001–FP-020 | Roadmap owners: IR-004, IR-009, IR-011–015, IR-022 as applicable | IR-021 |
| UI-01–UI-14 | IR-011–015 according to accepted UI traceability | IR-021 |
| TC-001–TC-019 | IR-003–011 and IR-014 according to the roadmap | IR-021; IR-022 retains gate record |
| IPE-AUTH/EVENT/ERR/SCAN/STORAGE/SPLIT/SET/FX/FIN/TIME | Named feature owner in the roadmap | IR-021 |
| Two-account/two-Group fixture | IR-001 creates capability; IR-007/009/010/011 enforce it | IR-021 and W7 smoke |
| Migration fixtures M01–M18 and S01–S19 | IR-016; IR-017–020 consume named stage evidence | W5–W7 gates |
| Finance fixtures EQ-01, SET-01, USD-01 | IR-014 | IR-016, IR-021, IR-017 |
| R-02 | IR-004, IR-010–015 execute applicable checks | IR-021 rollup; W7 release check |

Every retained artifact records requirement/fixture ID, environment category,
precondition, expected and actual outcome, reviewer, consuming gate, checksum
where useful, and failure disposition. No assertion about a runner, browser,
CI service, database harness, or deployed environment is made until IR-001
reviews and records it.
