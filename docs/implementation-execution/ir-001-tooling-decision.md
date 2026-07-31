# IR-001 Tooling Decision and Implementation Record

## Status

- IR item: IR-001 — Evidence Foundation
- Packet status: In progress
- Current phase: IR-001A — Tooling and command foundation
- Started: 2026-07-31
- Implementation authority: `authorisations/IR-001-authorisation.md`
- Scope confirmation: Evidence capability only. No application feature, target
  schema, migration, target RLS policy, deployment, or later-IR work is in
  scope.

## Baseline and approval record

| Item | Record |
|---|---|
| Starting branch and commit | `v2` at `20d2855091efea7e1aec9231237a7f8c3227e815` |
| Starting worktree | Clean; `git diff --check` passed before the first change |
| Existing build/type capability | `npm run build` and `npx tsc --noEmit` passed on the existing lockfile |
| Existing test/CI capability | No test runner, test suite, browser runner, database/RLS harness, CI workflow, generated type file, or fixture framework was configured |
| Approved dependency decision | 2026-07-31: add exact development-only `@playwright/test@1.52.0` and `supabase@2.105.0` after metadata verification |
| Explicit exclusions | No Vitest or duplicate unit runner; no vulnerability upgrade, suppression, or remediation; no external Supabase project or credentials |

## Selected capability design

| Capability | Selected mechanism | Reason and boundary |
|---|---|---|
| Unit and integration execution | Node 22 built-in `node:test` runner | Already available in the execution environment; avoids adding a duplicate unit-test runner. Tests remain deterministic and run without a network or database dependency. |
| Test type-checking | New proposed `tsconfig.tests.json` | Keeps test-only TypeScript coverage separate from the application-only `tsconfig.json` include boundary. |
| Browser execution | `@playwright/test@1.52.0` | Provides repeatable browser assertions and failure artifacts. Managed browser downloads are permitted only in isolated local or CI runs. |
| Local database/RLS harness | `supabase@2.105.0` plus local Docker only | Pins the CLI used by later IR-001 phases. It must not start, link to, or use an external project. A local-boundary record is required before a stack/image download, reset, or cleanup. |
| Database test client | Existing `@supabase/supabase-js` dependency | Later isolated integration tests may use the existing client; no extra client package is selected. |

## Dependency decision controls

| Dependency | Classification | Required metadata before install | Package/lockfile impact | Removal path |
|---|---|---|---|---|
| `@playwright/test@1.52.0` | Development-only | Verify exact version, license, package identity, and runtime/dependency classification with `npm view` | Add exact root devDependency and transitive lockfile entries only | Remove the root devDependency and restore the prior lockfile in a bounded tooling revert. |
| `supabase@2.105.0` | Development-only | Verify exact version, license, package identity, and runtime/dependency classification with `npm view` | Add exact root devDependency and transitive lockfile entries only | Remove the root devDependency and restore the prior lockfile in a bounded tooling revert. |

Installation is blocked unless both metadata results match this record and the
approved exact versions. Existing dependency-audit findings are recorded as
baseline facts only and will not be changed in IR-001.

### Metadata verification — 2026-07-31

Command: `npm view @playwright/test@1.52.0 version license engines dependencies optionalDependencies --json` and `npm view supabase@2.105.0 version license engines dependencies optionalDependencies --json`.

Working directory: repository root. Environment category: local package-registry
metadata query; no application, Supabase, or credential environment was used.
Exit code: 0.

| Dependency | Exact result | License | Direct package metadata | Decision |
|---|---|---|---|---|
| `@playwright/test` | `1.52.0` | Apache-2.0 | Requires Node `>=18`; depends on matching `playwright@1.52.0` | Matches approval; root devDependency installation may proceed. |
| `supabase` | `2.105.0` | MIT | Supplies platform-specific optional CLI binary packages at `2.105.0`; no runtime application dependency was reported | Matches approval; root devDependency installation may proceed. |

The `playwright` and platform-specific Supabase CLI packages are expected
tooling transitives of the two approved root devDependencies. Installation
must stop if the root package classification is not development-only or if an
unexpected root runtime dependency appears.

## Phase IR-001A file classification

| Path | Classification | Phase-A purpose |
|---|---|---|
| `docs/implementation-execution/authorisations/IR-001-authorisation.md` | Existing file modified | Record the permitted IR-001 status progression only. |
| `docs/implementation-execution/ir-001-tooling-decision.md` | New confirmed path | Retain the tooling decision, command results, and IR-001 evidence metadata. |
| `package.json`, `package-lock.json` | Existing files modified after metadata verification | Add only the two approved exact development dependencies and scripts required by selected tooling. |
| `tsconfig.tests.json` | New proposed path verified by this decision | Type-check the new test-only TypeScript files without changing application source configuration. |
| `tests/` | New proposed path verified by this decision | Hold the minimal deterministic Node test and supporting test-only code. |
| `src/`, `supabase/migrations/`, `supabase/seed.sql`, `supabase/functions/` | Read-only/excluded inputs | No IR-001A modification. |

## IR-001A validation and evidence convention

Each recorded command must retain its working directory, environment category,
exit code, concise result, correction/rerun where applicable, and a
repository-relative evidence reference. Output must exclude credentials,
tokens, private content, and production identifiers.

Planned Phase-A checks are `npm view` for both approved packages, exact-pinned
installation, lockfile/root-package inspection, `npm run build`,
`npx tsc --noEmit`, test-only TypeScript validation, the deterministic Node
test, a source secret scan, `git diff --check`, and scope review. Browser and
database commands are deferred to their respective authorised IR-001 phases.

## Current gate position

GATE-007 through GATE-010 remain open. This record establishes no passing gate
claim and does not mark IR-001 Implemented, Verified, or Complete.

## Phase IR-001A execution evidence — 2026-07-31

| Capability or check | Command / method | Environment and result | Evidence disposition |
|---|---|---|---|
| Status progression | This record and the IR-001 authorisation record | Local repository documentation only; IR-001 changed from Authorised to In progress. Implemented/Verified/Complete and all gate status remain unchanged. | Retained in this file and `authorisations/IR-001-authorisation.md`. |
| Package metadata | `npm view` commands recorded above | First sandboxed query returned no metadata and was not accepted as verification. A read-only host query was rerun successfully with exit code 0 and produced the approved exact versions and licenses. | Metadata table above; no credential or package token recorded. |
| Exact dependency installation | `npm install --save-dev --save-exact @playwright/test@1.52.0 supabase@2.105.0` | Local npm installation, exit code 0. Added five installed packages and changed only the two approved root development dependencies plus their lockfile tooling transitives. npm reported 13 audit findings after installation; the 11 pre-existing findings were neither upgraded, suppressed, nor remediated. | `package.json` and `package-lock.json`; no runtime dependency was added. |
| Application type-check | `npm run typecheck` | Local repository; exit code 0. | Package script result. |
| Test type-check | `npm run test:types` | Local repository; exit code 0. | `tsconfig.tests.json` validates the test-only TypeScript file. |
| Deterministic unit capability | `npm test` | Local repository; exit code 0. Node's native runner executed one frozen-clock test with one pass and zero failures. | `tests/unit/deterministic-clock.test.ts`. |
| Build | `npm run build` | Local repository; exit code 0. TypeScript and Vite production build passed. | Existing build command remained strict. |
| Dependency and lockfile inspection | `npm ls @playwright/test playwright supabase --all` and a local package/lockfile assertion | Local repository; exit code 0. Root devDependencies and lockfile resolve exactly to Playwright 1.52.0 and Supabase CLI 2.105.0; no approved tool appears in root runtime dependencies. | Command output retained in the session record; lockfile diff is reviewed before commit. |
| Changed-content secret scan | Pattern scan for common credential/token/private-key literal forms across all Phase-A changed paths | Local repository; exit code 0 after expected no-match handling. No candidate literal was found; only filenames and never values would be emitted by this scan. | This is a narrow changed-content safeguard, not a claim about unrelated historical files. |
| Scope review | `git diff --name-only`, `git diff --check`, and `git status --short` | Local repository; exit code 0. Changed paths are limited to the authorisation status record, IR-001 tooling record, package files, test TypeScript configuration, and the test-only directory. | Final staged diff check remains required immediately before commit. |

No browser binary, Docker image, local Supabase stack, external endpoint, test
database, test credential, schema reset, or cleanup action was run in Phase
IR-001A. Those actions remain deferred until their local-only boundary and
resource/cleanup records are established in later IR-001 phases.

### Phase IR-001A rollback boundary

Revert this bounded commit to remove the package scripts, test-only
configuration and test, tooling decision record, status progression, and the
two root development dependencies. The rollback affects no application runtime
source, database, Supabase project, Docker resource, browser binary, schema,
policy, or deployed environment.
