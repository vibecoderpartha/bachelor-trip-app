# IR-001 Tooling Decision and Implementation Record

## Status

- IR item: IR-001 — Evidence Foundation
- Packet status: In progress
- Current phase: IR-001C — Local database and RLS capability
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

## Phase IR-001B — deterministic fixture foundation

### Fixture contract

`tests/fixtures/two-account-two-group.ts` is an in-memory, test-only fixture.
It contains no Supabase connection, database operation, application import,
production UUID, email address, token, secret, personal data, or copied
production value.

| Fixture element | Stable value / rule |
|---|---|
| Deterministic clock | `2030-01-02T03:04:05.000Z` returned by `createDeterministicClock()` |
| Account A / Account B | `fixture-account-a` and `fixture-account-b` |
| Group A / Group B | `fixture-group-a` and `fixture-group-b` |
| Active ownership relationships | Account A → Group A and Account B → Group B only; each synthetic relationship has a distinct stable ID |
| Same-Group expectations | Account A → Group A and Account B → Group B are marked `allow` |
| Cross-Group expectations | Account A → Group B and Account B → Group A are marked `deny` |
| Lifecycle expectations for later policy work | Account A → Group A with `inactive` or `removed` state is marked `deny` |
| Reset / cleanup | `resetTwoAccountTwoGroupFixture()` returns a fresh deterministic fixture; cleanup reports an idempotent, zero-resource, in-memory scope |

The expectation matrix describes the accepted future test shape only. It does
not implement, simulate as authoritative, or claim evidence for a production
RLS policy. Database and RLS enforcement remain deferred to the isolated
capability phase.

### Phase IR-001B execution evidence — 2026-07-31

| Capability or check | Command / method | Environment and result | Evidence disposition |
|---|---|---|---|
| Deterministic clock | `npm test` | Local Node runner; exit code 0. The clock probe passed using the fixed instant. | `tests/unit/deterministic-clock.test.ts`. |
| Two-account/two-Group baseline | `npm test` | Local Node runner; exit code 0. The fixture probe confirmed two unique account IDs, two unique Group IDs, non-overlapping active memberships, expected same-Group allows, cross-Group denials, and inactive/removed denials. | `tests/unit/two-account-two-group-fixture.test.ts`. |
| Repeatable reset/cleanup | `npm test` | Local Node runner; exit code 0. Reset returned an equal fresh fixture and cleanup reported the idempotent in-memory boundary. | Fixture module and lifecycle probe above. |
| Application and test type-checks | `npm run typecheck` and `npm run test:types` | Local repository; both exit code 0. | Existing and test-only TypeScript configuration. |
| Build | `npm run build` | Local repository; exit code 0. | Existing build command remained strict. |
| Hygiene and scope | `git diff --check` and `git status --short` | Local repository; exit code 0. Only `package.json` and test-only paths changed in this phase. | Final staged diff and changed-content secret scan remain required before commit. |

No browser binary, Docker image, local Supabase stack, database/schema/policy,
external endpoint, credential, reset, or cleanup action was run in Phase
IR-001B.

### Phase IR-001B rollback boundary

Revert the bounded fixture commit to remove the in-memory fixture, its tests,
and the unit-test script expansion. This affects no application runtime source,
database, Supabase project, Docker resource, browser binary, schema, policy,
or deployed environment.

## Phase IR-001C — local database/RLS capability boundary

This boundary is recorded before any Supabase Docker image download, local
stack start, database connection, schema change, reset, or cleanup.

| Boundary | Approved local-only control |
|---|---|
| Environment classification | Ephemeral local Docker Supabase stack only. It is not a hosted Supabase project, deployed environment, rehearsal environment, or production environment. |
| Local project identifier | `bachelor-trip-app-ir001`. This is a local container namespace in the isolated test-workdir configuration, not a hosted project reference. |
| How non-production is proven | The harness will invoke only the repository-pinned CLI without `login`, `link`, `db push`, `db pull`, deployment, or a hosted URL. Before connecting, the CLI status and Docker container, network, and volume inspection must show no pre-existing resource for the local project identifier; any other project, endpoint, or existing resource stops the phase. |
| Credential category | Locally generated stack database/test credentials may be held only in a short-lived test process. No value is written to source, evidence, browser code, command output, or documentation. No production credential or service-role credential is used. |
| Allowed affected resources | Docker containers, network, and volumes created for the database-only `bachelor-trip-app-ir001` stack; one exact local test schema named `ir001_probe`; and test-only tables/policies in that schema. No `public` table, repository migration, seed, Edge Function, Storage object, Realtime configuration, or external resource may be changed. |
| Reset protections | `supabase db reset`, `db push`, `db pull`, `link`, and every remote/deployment command are prohibited. The legacy migrations and seed remain untouched. Test setup creates only `ir001_probe`; cleanup drops only that named schema after ownership verification. |
| Cleanup boundary | Stop only the local stack selected by this project identifier from its isolated workdir with `npx --no-install supabase stop --workdir tests/database/local-stack --project-id bachelor-trip-app-ir001 --no-backup`, verify no matching containers, networks, or volumes remain, then remove only the verified generated `.branches/_current_branch` and `.temp/cli-latest` files in the isolated test workdir. Cleanup never targets an unverified environment or a broad Docker resource set. |
| Rollback | Remove the local test schema, stop the verified local stack, then revert the bounded config/test-harness commit. No application or deployed data rollback is involved. |

The first bounded local-start attempt failed safely before any database
connection because its inherited default ports conflicted with an existing local
service. A read-only listener inspection confirmed the default Supabase range
was occupied while the dedicated `56321`–`56329` range was free. The isolated
test configuration now uses that dedicated range; the database probe accepts
only `loopback:56322`.

After that port correction, the default local service set failed its `auth`
health check. The capability canary connects directly to the local database and
does not exercise Auth, API, Storage, Realtime, Edge Functions, Studio,
Inbucket, or Analytics. The isolated `config.toml` therefore explicitly
disables those services and also disables migrations and seeds. This is a
test-stack reduction only: it does not alter product Auth behaviour, target
RLS, the repository's root Supabase configuration, or any migration. The
harness cleanup was also corrected to invoke `supabase stop` from the same
isolated workdir after every attempted start, including a failed one.

### Phase IR-001C proposed path classification

| Path | Classification | Purpose |
|---|---|---|
| `tests/database/local-stack/supabase/config.toml` | New proposed path verified by this boundary | Local-only, database-only Supabase CLI project namespace and test-stack configuration, deliberately outside the repository's legacy Supabase workdir. Migrations and seeds are explicitly disabled. |
| `tests/database/` | New proposed path verified by this boundary | Test-only setup, RLS probe, connection handling, and cleanup checks. |
| `supabase/config.toml`, `supabase/migrations/`, `supabase/seed.sql`, `supabase/functions/` | Read-only/excluded inputs | Never invoked, modified, or used as the probe schema. |

The database probe is a capability canary only. It may validate isolated RLS
execution with synthetic fixture identifiers, but it must not implement or
claim target schema, target Group tables, target Group membership, production
RLS, product policy behaviour, or a GATE-008/009/010 pass.

### Migration-execution protection

The Supabase CLI local-start workflow applies the selected workdir's migrations
and seed. Running it from the repository root would therefore execute the
legacy source SQL, which IR-001 does not authorise. The harness instead uses a
dedicated empty test workdir under `tests/database/local-stack/`; it contains
only local stack configuration and no `migrations/` or `seed.sql` path. The
repository root `supabase/` directory remains read-only and is never passed to
a stateful CLI command in IR-001.

### Phase IR-001C execution evidence — 2026-07-31

| Capability or check | Command / method | Environment and result | Evidence disposition |
|---|---|---|---|
| CLI safety controls | `npx --no-install supabase init/start/status/stop --help` | Local CLI help only; exit code 0. Confirmed project-scoped start/status controls and explicit `stop --project-id` cleanup. | Command output retained in the session record; no stack or credential was used by this check. |
| Root CLI-artifact correction | A repository-root CLI help invocation generated `supabase/.temp/cli-latest` without starting a stack or contacting a database. | The exact generated file and its empty `.temp` directory were inspected and removed. Subsequent stateful CLI commands use the isolated workdir explicitly. | Repository-root `supabase/` restored to its pre-run state; no root configuration, migration, seed, function, schema, or policy was changed. |
| Migration-execution protection | Isolated workdir `tests/database/local-stack/` with only `supabase/config.toml` | The probe's workdir has no migration or seed path. Repository-root `supabase/` was never a workdir for stack start or a database operation. | Configuration and boundary record above. |
| First local-stack attempt | `npm run test:db` before port correction | Failed safely at `stack-start` with the whitelisted category `local-port-conflict`; no database connection occurred. Cleanup reported complete and post-run inspection found no matching project Docker resource. | Corrected by using the documented isolated `56321`–`56329` range; no failure was suppressed. |
| Local-service correction | Repeated local-only `npm run test:db` attempts after the port correction | The default service set failed safely at `stack-start` with the whitelisted `service-health-check-failed` category and the safe `auth` label. The first cleanup implementation also exposed remaining exact project containers; they were stopped from the isolated workdir and the harness was corrected before rerun. | The test-only config now disables unneeded services, migrations, and seeds; the harness stops the exact project from the isolated workdir on every attempted start. No raw CLI, credential, or container log was retained. |
| Local endpoint and resource boundary | Probe preflight plus exact-project `docker ps --all`, `docker volume ls`, and `docker network ls` inspection | The harness required no pre-existing matching Docker resource, accepted only a loopback database endpoint at port `56322`, and never used an external project or credential. | Test harness source; no endpoint credential is recorded. |
| Isolated RLS canary | Corrected `npm run test:db` | Exit code 0. The local test-only `ir001_probe` schema verified two same-scope synthetic reads, two cross-scope denials, one inactive denial, and one removed denial under PostgreSQL RLS. The value-free temporary result record reports `result: passed`, `loopback:56322`, six cases, and confirmed cleanup. | `tests/database/rls-probe-setup.sql`, `tests/database/run-rls-probe.mjs`, and the session-only `/tmp/bachelor-trip-app-ir001-rls-result.json` record. |
| Safe cleanup | Harness `finally` block, followed by Docker/workdir inspection | Exit code 0. The exact `ir001_probe` schema was dropped and `supabase stop --workdir tests/database/local-stack --project-id bachelor-trip-app-ir001 --no-backup` completed; post-run Docker inspection returned no matching container, network, or volume and the isolated workdir retained only its committed `config.toml`. | Local-only cleanup proof; no broad Docker or database target was used. |
| Secret safety | Captured CLI/database output plus whitelisted test summaries | Connection material was parsed only inside the short-lived harness process. The harness emits only safe capability/failure categories and never logs a URL, password, token, key, or SQL connection output. | Source inspection and changed-content secret scan before commit. |

This capability canary proves that the selected local test harness can perform
an isolated, two-account/two-scope RLS allow/deny exercise and remove its own
resources. It is not an implementation or verification of target Groups,
memberships, production RLS, application authorization, or GATE-008, GATE-009,
or GATE-010.

### Phase IR-001C rollback boundary

Revert the bounded local-stack configuration, RLS probe SQL, harness, package
script, and this evidence record. The harness's successful cleanup has already
removed its test schema, containers, network, and volumes. No application
runtime source, root Supabase configuration, migration, seed, target schema,
policy, Storage, Realtime, or deployed resource is affected.
