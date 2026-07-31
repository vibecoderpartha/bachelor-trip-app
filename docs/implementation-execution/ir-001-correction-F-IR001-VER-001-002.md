# IR-001 Combined Evidence Corrections — F-IR001-VER-001 and F-IR001-VER-002

## Status and review boundary

- Date: 2026-07-31
- IR item: IR-001 — Evidence Foundation
- Original review decision: Corrections required
- Correction implementation commit: `43d839b4e546188b1e60e56ff0515ff8826b6cfa`
- IR-001 status: **In progress**
- GATE-007 through GATE-010: unchanged
- IR-002: Not authorised

This is a bounded correction to IR-001 evidence infrastructure. It is not a
verification decision, a product implementation, or authority to begin a
later IR.

## Findings and root cause

### F-IR001-VER-001 — browser evidence portability

Playwright's raw `error-context.md` included a workstation-specific absolute
path. That file was automatically generated raw diagnostic output and was not
required as retained evidence. Its retention made the browser evidence set
non-portable and unsuitable for the safe artifact upload boundary.

### F-IR001-VER-002 — database evidence sequence integrity

The local normal probe and controlled-failure driver both wrote the same
session-local result record. The former manifest writer copied and accepted
only the controlled-failure shape. Consequently, the required recovery normal
run replaced that record with `runMode: normal`, and a later manifest rejected
an otherwise valid normal → controlled-failure → normal sequence.

This finding concerns evidence retention and manifest selection only. The
isolated probe's same-scope allows and cross-scope, inactive, and removed
denials were not changed.

## Corrected evidence design

### Browser

- Raw Playwright result trees, `.last-run.json`, and `error-context.md` are
  temporary input only and are removed after extraction.
- The retained browser allow-list contains exactly
  `controlled-failure.json` and `controlled-failure.png`.
- The JSON summary records the controlled child failure class, expected exit,
  Chromium/project classification, and repository-relative artifact names.
- Cross-platform path checks reject or normalise POSIX home paths, macOS home
  paths, Windows drive paths, UNC paths, repository roots, temporary paths,
  and file URLs. Raw absolute paths never enter retained text or a manifest.

### Database

- The single mutable result is no longer a manifest input. It remains
  session-local process output only.
- One prepared sequence retains three separate, sanitised records:
  `normal-result.json`, `controlled-failure-result.json`, and
  `recovery-result.json` under `artifacts/ir-001/database/`.
- Each record has a safe random UUID-based evidence sequence identity,
  evidence phase, run mode, expected/observed process result, fixed safe case
  counts, cleanup status, local-environment classification, local project
  identifier, loopback endpoint representation, fixture category, and schema
  version. It contains no connection string, credential, Docker ID, raw
  output, temporary path, or host path.
- The session-local sequence state must match all three records and reach
  `recovery-normal-complete`. It makes stale/mixed/incomplete evidence fail
  without relying on timestamps.
- A new initial normal preparation clears only the verified exact generated
  evidence scope. The controlled failure and recovery write only their own
  phase record and cannot overwrite earlier evidence.

### Manifest and CI contract

- Browser and database manifest inputs are explicit allow-lists; paths are
  repository-relative and each has a byte count and SHA-256 checksum.
- The database manifest rejects missing, duplicate, unexpected, malformed,
  unsafe, stale, wrong-mode, mixed-sequence, or cleanup-unconfirmed evidence.
- The browser CI upload is limited to the safe retained browser directory and
  manifest. The database CI job now runs initial normal, controlled failure,
  recovery normal, manifest, exact Docker cleanup assertion, then uploads
  only the three sanitised records and manifest.
- Workflow permissions remain `contents: read`; no deployment, environment,
  hosted Supabase reference, or secret configuration was added.

## Files changed

| Path | Classification | Purpose |
|---|---|---|
| `playwright.config.ts` | Existing evidence config modified | Move raw Playwright output to a temporary raw-result directory. |
| `tests/browser/run-failure-injection.mjs` | Existing test support modified | Extract the safe screenshot/summary and remove raw diagnostics. |
| `tests/evidence/browser-artifact-safety.mjs` | New IR-001 evidence support | Cross-platform path safety and browser allow-list contract. |
| `tests/unit/browser-artifact-safety.test.mjs` | New test | Browser path-safety regression coverage. |
| `tests/database/run-database-normal-evidence.mjs` | New test support | Capture initial/recovery normal evidence by explicit phase. |
| `tests/database/run-rls-failure-injection.mjs` | Existing test support modified | Capture the controlled-failure phase without overwriting normal evidence. |
| `tests/evidence/database-evidence-contract.mjs` | New IR-001 evidence support | Sanitised database phase, sequence, stale-state, and allow-list contract. |
| `tests/unit/database-evidence-contract.test.mjs` | New test | Complete/missing/mixed/stale/unsafe/allow-list regression coverage. |
| `tests/evidence/write-evidence-manifest.mjs` | Existing evidence support modified | Consume only safe explicit browser/database artifacts. |
| `package.json` | Existing file modified | Route normal database evidence through the phase-aware wrapper and include tests. |
| `.github/workflows/ir-001-evidence.yml` | Existing CI evidence plan modified | Use the corrected sequence and narrow reviewed uploads. |

No dependency or lockfile change occurred. No application, migration, seed,
production function, target schema, target RLS, Storage, Realtime, or
deployment file changed.

## Local correction evidence

All commands ran from the repository root.

| Command or check | Exit | Result |
|---|---:|---|
| `npm ci` | 0 | Clean install completed; only known deprecation/audit notices were reported. |
| `npm run typecheck` | 0 | Application type check passed. |
| `npm run test:types` | 0 | Test type check passed. |
| `npm test` | 0 | 13 tests passed, including browser and database evidence contracts. |
| `npm run build` | 0 | Existing production build passed. |
| `npm run test:browser` | 0 | One baseline Chromium test passed; controlled test skipped outside injection. |
| `npm run test:browser:failure` | 0 | Child exited 1 as injected; driver retained the two safe artifacts. |
| Browser manifest, twice | 0 / 0 | Two-artifact allow-list passed and meaningful manifest output was identical. |
| `npm run test:db` → failure → recovery | 0 / 0 / 0 | Initial normal, expected child failure, and recovery normal each confirmed exact cleanup. |
| Database manifest, twice | 0 / 0 | Three-artifact sequence passed and meaningful manifest output was identical. |
| Missing sequence-state negative check | expected 1 | Database manifest refused stale evidence without the active safe sequence state; state was restored and a subsequent manifest passed. |
| YAML parse and Node syntax checks | 0 | Corrected workflow and evidence scripts parsed locally. |
| Path/secret/allow-list/checksum scans | 0 | No unsafe textual path or secret candidate in retained evidence; both manifests' checksums and byte counts matched. |
| Exact Docker inspection | 0 | No `bachelor-trip-app-ir001` container, network, or volume remained. |
| `git diff --check` | 0 | No whitespace error. |

The local Playwright installer reported its existing Ubuntu 20.04 fallback
notice and downloaded Chromium build 1169. Browser execution passed. Hosted
compatibility remains a required full-review item; no hosted CI run occurred
in this correction session.

## Retention, cleanup, and rollback

Generated evidence remains ignored below `artifacts/ir-001/`. The browser raw
tree is removed by the failure driver. Database artifacts are fixed-name,
sanitised records; the temporary sequence state and raw probe result are not
retained/uploaded. Exact local Docker cleanup remains owned by the existing
probe/driver contract and was rechecked after the complete sequence.

Rollback is a bounded revert of
`43d839b4e546188b1e60e56ff0515ff8826b6cfa` followed by removal of verified,
ignored `artifacts/ir-001/browser` and `artifacts/ir-001/database` output.
It does not require an application, schema, hosted-service, or production
rollback.

## Remaining review work

- Full IR-001 completion and verification must restart from mandatory
  preflight at the clean correction head.
- Baseline/current audit comparison, Playwright hosted compatibility,
  starting-commit reconciliation, and hosted CI execution/artifact review are
  still pending.
- No gate or status may be promoted by this correction.

IR-001 remains In progress. GATE-007 through GATE-010 remain unchanged,
GATE-011 remains unsatisfied, W1 exit remains unachieved, and IR-002 remains
unauthorised.
