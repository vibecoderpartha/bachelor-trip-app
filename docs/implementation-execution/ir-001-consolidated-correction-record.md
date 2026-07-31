# IR-001 Consolidated Blocker Sweep and Correction Record

## Boundary and outcome

- Date: 2026-07-31
- IR item: IR-001 — Evidence Foundation
- Starting correction head: `2cb2d67de70da277eefe03aa4d661faf8c18a849`
- Combined implementation: `626ae2615f5f8d17d391287968afb8a4c096bbc5`
- Hosted-execution correction: `e83554c410c934a28946be20dbd311916d92506a`
- Current decision: **Blocked pending F-IR001-VER-005**

This session was a consolidated correction and hosted-evidence rehearsal. It
does not verify IR-001 or promote any gate or Wave status.

## Blocker results

| ID | Result |
|---|---|
| F-IR001-VER-001 | Browser raw diagnostic output remains temporary; the retained safe summary/screenshot set passed locally and in the hosted browser job. |
| F-IR001-VER-002 | Three phase-specific sanitised database records remain sequence-bound and deterministic locally. Hosted confirmation is blocked by F-IR001-VER-005 before the first phase completes. |
| F-IR001-VER-003 | Exact `@playwright/test@1.55.1` resolves aligned `playwright` and `playwright-core` `1.55.1`; `GHSA-7mvr-c777-76hp` is absent. |
| F-IR001-VER-004 | Exact resource polling replaced the single immediate assertion. Local normal, controlled-failure, and recovery cleanup required one to three seconds; the hosted job's final exact cleanup assertion also passed. |
| F-IR001-VER-005 | Hosted database normal capability exits `1` before retained database evidence is created. The hosted safe child result confirms cleanup completion but not a host-specific primary-failure category. No speculative change was made. |

## Dependency and local evidence

- Before the exact Playwright update, audit reported 13 findings: 1 low, 3
  moderate, and 9 high; the affected Playwright advisory was present.
- After the update, audit reported 11 findings: 1 low, 3 moderate, and 7
  high. Runtime-only audit remains one pre-existing high finding. No new high
  or critical finding was introduced.
- Clean install, type-check, test type-check, two 18-test unit runs, and build
  passed. The additional tests cover CI retry-safe screenshot selection and
  exact Docker-resource cleanup polling/timeout behaviour.
- Local browser install used Chromium `140.0.7339.186` build `1193`. The
  unsupported-host Ubuntu 20.04 fallback notice remains a local limitation,
  not a hosted compatibility claim.
- Local browser normal/failure/manifest commands passed; two browser manifests
  were deterministic. Retained browser evidence contains only
  `controlled-failure.json` and `controlled-failure.png`.
- Local database normal → controlled-failure → recovery passed. The three
  sanitised records share one sequence ID; two database manifests were
  deterministic. Exact cleanup polls succeeded after every phase.
- Retained evidence path and secret scans passed; manifests' byte counts and
  SHA-256 values matched; all generated evidence remains ignored.

## Cleanup correction

The prior harness ran exact project-scoped `supabase stop`, but checked Docker
only once immediately afterward. Docker removal was observed to be eventually
consistent. The new support module accepts only exact IR-001 container,
network, and volume names; it polls for at most ten seconds and reports only
safe resource categories when cleanup times out. It never removes Docker
resources directly or uses a partial-name match. The common probe `finally`
path applies this check to normal completion, controlled failure, failed start,
and recovery; CI runs the same checker after its database job.

## Hosted rehearsal

- Temporary branch: `review/ir-001-consolidated-evidence`
- Draft PR: #1, open and unmerged, into `v2`
- First run `30618949964` at `626ae26…`: browser retry artifact assumption and
  database normal capability failed. Its results were collected before changes.
- Second run `30619260158` at `e83554c…`: Browser evidence passed on
  `ubuntu-22.04`, including install, normal boot, controlled failure, manifest,
  upload, and a downloaded artifact review. The database job failed in its
  first normal phase; its exact cleanup assertion passed.
- The browser artifact is 40,686 bytes, configured for 14-day retention, and
  expires 2026-08-14. The repository is public; the artifact was inspected by
  an authenticated repository reviewer. It contains only the safe summary,
  screenshot, and manifest.
- No deployment, environment, declared secret, hosted Supabase project, or
  production operation appears in the workflow. Actions-action Node 20
  deprecation annotations are non-blocking platform notices; repository test
  jobs run on Node 22.

## Rollback and remaining boundary

Revert `e83554c…` and `626ae26…` to remove the correction code and restore the
prior lockfile/tooling state; this would restore a vulnerable Playwright tool
version and is not an acceptable final security state. Generated evidence can
be removed only from the verified ignored IR-001 artifact paths.

F-IR001-VER-005 requires a single bounded hosted-database evidence correction
or environment-capability decision. It must identify the safe primary-failure
cause and make the existing isolated database sequence pass without changing
RLS allow/deny semantics, introducing external Supabase access, modifying
product code, or broadening Docker cleanup.

IR-001 remains **In progress**. GATE-007 through GATE-010 remain unchanged,
GATE-011 remains unsatisfied, W1 exit remains blocked, IR-002 remains
unauthorised, and no deployment, merge, schema, production RLS, Storage, or
Realtime change occurred.
