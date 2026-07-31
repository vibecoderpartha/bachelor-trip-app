# IR-001 Consolidated Blocker Register

## Scope and status

This register consolidates observable IR-001 evidence-foundation blockers for
the 2026-07-31 correction session. It is not a verification decision. IR-001
remains **In progress**; GATE-007 through GATE-010 remain unchanged; W1 exit
is not achieved; and IR-002 remains unauthorised.

| Blocker ID | Source | Description | Severity | Status | Affected files | Affected gates | Root cause | Correction boundary | Validation | Rollback | Final disposition |
|---|---|---|---|---|---|---|---|---|---|---|---|
| F-IR001-VER-001 | Independent review | Raw Playwright `error-context.md` retained a developer-specific absolute path. | High | Resolved in hosted CI | `playwright.config.ts`, `tests/browser/run-failure-injection.mjs`, browser artifact controls, workflow upload path | GATE-010 | Automatically generated raw diagnostic output was retained. | Retain only the safe summary and screenshot; exclude raw result output. | Local/hosted failure injection, manifest, checksum, path/secret scans, and downloaded-artifact review passed. | Revert the bounded browser-evidence correction. | Corrected; final independent review must reassess. |
| F-IR001-VER-002 | Independent review | Database manifest depended on one mutable most-recent result. | High | Resolved locally; hosted confirmation blocked by F-IR001-VER-005 | database evidence wrappers, evidence contract, manifest writer, workflow | GATE-007, GATE-008, GATE-010 | Normal, controlled-failure, and recovery modes shared one mutable representation. | Retain three explicit, sequence-bound sanitised records. | Local complete sequence/manifests passed; hosted job must complete all phases. | Revert the bounded database-evidence correction. | Corrected locally; hosted re-review required. |
| F-IR001-VER-003 | Final verification review | Playwright below `1.55.1` did not provide the required browser-install authenticity protection. | High | Resolved locally and in hosted browser CI | `package.json`, `package-lock.json` | GATE-007, GATE-010 | Root `@playwright/test@1.52.0` resolved vulnerable Playwright tooling. | Retain only exact `1.55.1` aligned Playwright packages. | Audit returned to 11 findings without the advisory; hosted browser installation and evidence sequence passed. | Revert the exact dependency and lockfile change. | Corrected; final independent review must reassess. |
| F-IR001-VER-004 | Stopped security-correction run and Stage-A harness review | Exact IR-001 Docker resources could remain while cleanup was asserted immediately after `supabase stop`. | High | Resolved locally; hosted cleanup assertion passed after failed first probe | `tests/database/run-rls-probe.mjs`, cleanup support/tests, CI cleanup assertion | GATE-007, GATE-008, GATE-010 | The project-scoped stop was awaited, but the verifier checked Docker only once; observed removal took one to three seconds locally. | Exact-name bounded polling with a ten-second limit and safe category-only failure output. | Normal, controlled-failure, recovery, unit polling cases, and hosted final cleanup assertion passed. | Revert the polling helper and its callers; do not use broad Docker cleanup. | Corrected; final independent review must reassess. |
| F-IR001-VER-005 | Consolidated hosted rehearsal | Hosted database normal capability exits `1` before the required sequence and artifacts can be produced, although the exact cleanup assertion passes. | High | Still open | hosted database job; local-stack harness/runtime boundary | GATE-007, GATE-008, GATE-010 | The safe child record reports completed cleanup but does not establish a host-specific primary-failure category; no local reproduction was observed. | Diagnose the GitHub-hosted local-stack capability without weakening RLS cases, broadening cleanup, or introducing an external database. | A hosted run must pass normal, controlled-failure, recovery, manifest, cleanup, and artifact upload. | No rollback required; no speculative hosted-database change was made. | External/hosted evidence blocker. |

## Open review obligations

| Item | Status | Evidence or boundary |
|---|---|---|
| Hosted CI execution | Partially complete | Browser job passed; database job is blocked by F-IR001-VER-005. |
| Hosted artifact inspection | Partially complete | Browser artifact was downloaded, checksum/path/secret-reviewed; no database evidence was produced. |
| Hosted Playwright compatibility | Resolved in hosted browser CI | `ubuntu-22.04` installed Chromium `140.0.7339.186` build `1193` and completed browser evidence. |
| Starting-commit reconciliation | Reconciled locally; independent review must repeat | `f31233…` is an ancestor of `20d285…`; the sole intervening commit is the IR-001 authorisation/handoff record. |
| Remaining audit disposition | External review required | Post-upgrade audit has 11 findings (1 low, 3 moderate, 7 high) and one unchanged runtime high; the Playwright advisory is absent. |

## Discovery checkpoint

- Complete implementation-boundary blocker count: **4**.
- Open implementation/hosted blocker: **F-IR001-VER-005**.
- Resolved locally or in hosted CI: **F-IR001-VER-001**,
  **F-IR001-VER-002**, **F-IR001-VER-003**, and **F-IR001-VER-004**.
- Non-blocking local warning: Playwright's unsupported-host notice selects its
  Ubuntu 20.04 fallback browser locally; hosted compatibility remains pending.
- All identified corrections remain within the authorised IR-001 evidence,
  cleanup, manifest, workflow, dependency, and documentation boundary.
