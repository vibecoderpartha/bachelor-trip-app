# Deferred-Scope Register

| Field | Value |
|---|---|
| Status | Draft |
| Document type | Permanent product and architecture scope register |
| Scope | Work intentionally excluded from the current multi-user conversion |
| Current-state baseline | [V1 Codebase Feature and Flow Report](../v1-codebase-feature-and-flow-report.md) |
| Related ADRs | [ADR-0001](../architecture/decisions/ADR-0001-group-is-trip-tenant.md), [ADR-0002](../architecture/decisions/ADR-0002-supabase-auth-is-authoritative.md), [ADR-0003](../architecture/decisions/ADR-0003-commercial-membership-deferred.md), [ADR-0004](../architecture/decisions/ADR-0004-group-member-id-is-participant-identity.md), [ADR-0005](../architecture/decisions/ADR-0005-normalized-finance-payers-and-shares.md), [ADR-0006](../architecture/decisions/ADR-0006-group-configuration.md), [ADR-0007](../architecture/decisions/ADR-0007-single-use-atomic-invitation-acceptance.md), and [ADR-0008](../architecture/decisions/ADR-0008-group-scoped-authorization-with-rls-and-trusted-operations.md) are Accepted |
| Last reviewed | 2026-07-24 |

## Purpose

This register preserves intentionally postponed work so it is neither
accidentally implemented nor silently forgotten. An entry records a boundary
and its revisit conditions; it is not an implementation promise or a design
plan.

## Register rules

- Each item receives a stable, sequential, zero-padded identifier:
  `DEF-001`, `DEF-002`, and so on.
- An identifier is never reused, even when its item is Delivered or Rejected.
- New items use the next available register-wide number.
- Changes to status, boundary, dependencies, or revisit trigger are dated in
  Notes and reviewed with affected architecture documents.
- A deferred item may enter an active documentation or implementation scope
  only after its status and boundary are explicitly reconsidered and the
  relevant governance process is followed.
- Permanent architectural decisions discovered during reconsideration require
  an ADR under the
  [ADR governance rules](../architecture/decisions/README.md).

Allowed statuses:

- **Deferred:** Intentionally excluded until its revisit trigger is met and a
  new decision brings it into scope.
- **Reconsidering:** Under explicit product and architecture review; not yet
  authorized for implementation.
- **Delivered:** The item was later approved, implemented, and verified. The
  entry remains as history and links to its delivery evidence.
- **Rejected:** Deliberately declined. The entry remains as history and records
  the deciding source.

Every entry contains the same fields: ID, Item, Status, Decision/boundary,
Reason for deferral, Explicitly excluded behaviour, Dependencies, Revisit
trigger, Possible future phase, Related documents or ADRs, and Notes.

## Register

### DEF-001 — Paid plans, subscriptions, trials, and paywalls

- **ID:** DEF-001
- **Item:** Paid plans, subscriptions, trials, and paywalls
- **Status:** Deferred
- **Decision/boundary:** The application remains free during the current
  multi-user conversion and testing period. Group creation and use of in-scope
  parity features must not depend on a paid plan, trial state, or paywall.
- **Reason for deferral:** The current phase is establishing secure multi-user
  tenancy and feature parity, not a commercial model.
- **Explicitly excluded behaviour:** Plan purchase, trial countdowns, free-tier
  limits, upgrade prompts, paywall enforcement, billing-state access checks,
  subscription cancellation, and paid-customer lifecycle handling.
- **Dependencies:** A separately approved business model, pricing and packaging
  decisions, billing/security review, and an entitlement boundary distinct
  from Group Member access.
- **Revisit trigger:** Product owners approve a commercial model and explicitly
  request a commercial architecture phase after conversion testing.
- **Possible future phase:** Post-conversion commercial-model phase
  (unscheduled).
- **Related documents or ADRs:** [Architecture governance](../architecture/README.md);
  [ADR-0003: Commercial Membership Is
  Deferred](../architecture/decisions/ADR-0003-commercial-membership-deferred.md);
  [Feature Parity Test Contract](../architecture/feature-parity-test-contract.md).
- **Notes:** `group_members` must never be used as evidence of paid status.
  Initial entry created 2026-07-24.

### DEF-002 — Premium feature entitlements

- **ID:** DEF-002
- **Item:** Premium feature entitlements
- **Status:** Deferred
- **Decision/boundary:** No in-scope Trip, Scan, Split, FX, settlement, Todo,
  realtime, or storage parity behaviour is gated by a premium entitlement
  during conversion and testing.
- **Reason for deferral:** Entitlements require a stable product catalogue and
  commercial policy that do not belong to the tenancy conversion.
- **Explicitly excluded behaviour:** Premium flags, feature gates, quota
  entitlements, tier-derived UI, entitlement caching, and entitlement-based
  database or storage access.
- **Dependencies:** Decisions for DEF-001, a capability catalogue, entitlement
  authority, and revocation/consistency requirements.
- **Revisit trigger:** An approved paid or administratively assigned feature
  model requires enforceable capability grants.
- **Possible future phase:** Post-conversion entitlement architecture
  (unscheduled).
- **Related documents or ADRs:** [Glossary definitions for Group Member and
  Entitlement](../architecture/glossary.md);
  [ADR-0003: Commercial Membership Is
  Deferred](../architecture/decisions/ADR-0003-commercial-membership-deferred.md);
  [Feature Parity Test Contract](../architecture/feature-parity-test-contract.md).
- **Notes:** Group roles authorize group operations; they are not premium
  tiers. Initial entry created 2026-07-24.

### DEF-003 — Google OAuth and additional identity providers

- **ID:** DEF-003
- **Item:** Google OAuth and additional identity providers
- **Status:** Deferred
- **Decision/boundary:** Supabase Auth may be designed as the authoritative
  identity system in the current conversion, but Google OAuth and any other
  additional identity provider are not part of this scope.
- **Reason for deferral:** Provider configuration, account linking, recovery,
  consent, and provider-specific failure modes expand the authentication
  surface beyond the core identity and tenant model.
- **Explicitly excluded behaviour:** Google sign-in, social sign-in buttons,
  additional provider configuration, provider account linking/unlinking, and
  provider-specific onboarding or recovery.
- **Dependencies:** Accepted core authentication and Profile model, provider
  security/privacy review, account-linking rules, and deployment configuration.
- **Revisit trigger:** Validated user demand or a product requirement for a
  provider beyond the conversion's approved core authentication flow.
- **Possible future phase:** Post-conversion identity expansion (unscheduled).
- **Related documents or ADRs:** [Authentication, Group, and Invitation
  Flows](../architecture/auth-groups-and-invitations.md);
  [ADR-0002: Supabase Auth Is the Authoritative Identity
  Provider](../architecture/decisions/ADR-0002-supabase-auth-is-authoritative.md);
  [Security Model](../architecture/security-model.md);
  [V1 Migration Plan](../architecture/v1-migration-plan.md);
  [Feature Parity Test Contract](../architecture/feature-parity-test-contract.md).
- **Notes:** Deferral of providers does not defer authentication itself.
  Initial entry created 2026-07-24.

### DEF-004 — Permanent friend groups containing multiple trips

- **ID:** DEF-004
- **Item:** Permanent friend groups containing multiple trips
- **Status:** Deferred
- **Decision/boundary:** The present target is one Group equals one Trip
  workspace. A separate permanent friend-group-to-many-trips hierarchy is
  deferred.
- **Reason for deferral:** Adding an organization-like social container above
  trips would change tenant ownership, roles, invitations, navigation, and data
  lifecycles before the single-workspace model is proven.
- **Explicitly excluded behaviour:** A reusable friend-group entity that owns
  multiple Trips, cross-trip membership inheritance, shared history across
  Trips, and moving Trips between permanent friend groups.
- **Dependencies:** Evidence that users need stable social groups across Trips,
  an accepted lifecycle and isolation model for the parent entity, and reviewed
  migration effects on existing Groups.
- **Revisit trigger:** Post-conversion usage demonstrates repeated Trips by the
  same cohort and product review approves a parent-child tenant model.
- **Possible future phase:** Post-conversion multi-trip social-group phase
  (unscheduled).
- **Related documents or ADRs:** [Glossary definitions for Group and
  Trip](../architecture/glossary.md);
  [ADR-0001: One Group Represents One Trip and Is the Tenant
  Boundary](../architecture/decisions/ADR-0001-group-is-trip-tenant.md);
  [V1 Migration Plan](../architecture/v1-migration-plan.md).
- **Notes:** Do not prebuild an unused friend-group layer into the current
  conversion. Initial entry created 2026-07-24.

### DEF-005 — Worldwide destination price guides

- **ID:** DEF-005
- **Item:** Worldwide destination price guides
- **Status:** Deferred
- **Decision/boundary:** Existing Bali-specific price information may be
  preserved for the migrated Bali Group. Automatically providing destination
  price guides for new Groups is deferred. New Groups must not receive
  misleading Bali-specific information.
- **Reason for deferral:** Reliable worldwide price content requires sourcing,
  freshness, localization, destination matching, and editorial ownership that
  are separate from multi-tenant conversion.
- **Explicitly excluded behaviour:** Automatically generated or globally
  populated price guides for arbitrary destinations, claims of worldwide price
  coverage, and showing the Bali guide as though it applies to a new non-Bali
  Group.
- **Dependencies:** Approved content sources, freshness/accuracy policy,
  destination taxonomy, localization policy, and product ownership for guide
  quality.
- **Revisit trigger:** Product owners approve a maintained destination-content
  programme with reliable sources and update responsibilities.
- **Possible future phase:** Post-conversion destination-content phase
  (unscheduled).
- **Related documents or ADRs:** [V1 report, Bali price
  guide](../v1-codebase-feature-and-flow-report.md#93-bali-price-guide);
  DEF-012;
  [Feature Parity Test Contract](../architecture/feature-parity-test-contract.md).
- **Notes:** Preservation for the migrated Bali Group is a parity concern, not
  authorization to generalize the content. Initial entry created 2026-07-24.

### DEF-006 — Automatic invitation email delivery

- **ID:** DEF-006
- **Item:** Automatic invitation email delivery
- **Status:** Deferred
- **Decision/boundary:** The core Invitation domain and secure acceptance flow
  belong to the current architecture package; automatic outbound email delivery
  does not.
- **Reason for deferral:** Delivery vendors, sender reputation, templates,
  retries, bounce handling, and operational monitoring are separable from
  invitation authorization and atomic acceptance.
- **Explicitly excluded behaviour:** Automatic email dispatch, email-provider
  integration, branded invitation templates, delivery tracking, retry queues,
  bounce processing, and deliverability operations.
- **Dependencies:** Accepted Invitation lifecycle and security model, approved
  provider and sender identity, privacy review, and operational ownership.
- **Revisit trigger:** The secure invitation flow is stable and product
  validation shows manual sharing is insufficient.
- **Possible future phase:** Post-conversion communications phase
  (unscheduled).
- **Related documents or ADRs:** [Authentication, Group, and Invitation
  Flows](../architecture/auth-groups-and-invitations.md);
  [ADR-0007: Invitations Are Single-Use and Accepted Atomically
  Server-Side](../architecture/decisions/ADR-0007-single-use-atomic-invitation-acceptance.md)
  (Accepted); [Security Model](../architecture/security-model.md);
  [ADR-0008: Group-Scoped Authorization Is Enforced by RLS and Narrowly Trusted
  Operations](../architecture/decisions/ADR-0008-group-scoped-authorization-with-rls-and-trusted-operations.md)
  (Accepted); [V1 Migration Plan](../architecture/v1-migration-plan.md);
  [Feature Parity Test Contract](../architecture/feature-parity-test-contract.md).
- **Notes:** This entry does not permit weakening invitation token or acceptance
  security. Initial entry created 2026-07-24.

### DEF-007 — Roles beyond owner and member

- **ID:** DEF-007
- **Item:** Roles beyond owner and member
- **Status:** Deferred
- **Decision/boundary:** The current target role set is limited to Group
  `owner` and Group `member`.
- **Reason for deferral:** Additional roles multiply authorization paths before
  the core ownership and membership rules are defined and verified.
- **Explicitly excluded behaviour:** Admin, moderator, viewer, guest, finance
  manager, itinerary editor, custom roles, granular permission sets, and
  per-feature role configuration.
- **Dependencies:** Stable owner/member authorization, observed need for a
  distinct capability set, and a reviewed permission/migration model.
- **Revisit trigger:** Real usage demonstrates a recurring authorization need
  that owner and member cannot safely express.
- **Possible future phase:** Post-conversion authorization expansion
  (unscheduled).
- **Related documents or ADRs:** [Glossary definitions for Owner and Member
  role](../architecture/glossary.md);
  [Authentication, Group, and Invitation
  Flows](../architecture/auth-groups-and-invitations.md);
  [Security Model](../architecture/security-model.md);
  [ADR-0008: Group-Scoped Authorization Is Enforced by RLS and Narrowly Trusted
  Operations](../architecture/decisions/ADR-0008-group-scoped-authorization-with-rls-and-trusted-operations.md)
  (Accepted);
  [Feature Parity Test Contract](../architecture/feature-parity-test-contract.md).
- **Notes:** UI labels must not imply unavailable roles. Initial entry created
  2026-07-24.

### DEF-008 — Private or secret events

- **ID:** DEF-008
- **Item:** Private or secret events
- **Status:** Deferred
- **Decision/boundary:** A new security-grade model for events hidden from some
  Group Members is deferred. The existing v1 per-person event visibility
  behaviour remains a feature-parity question and must not be silently removed
  or represented as secure secrecy.
- **Reason for deferral:** True intra-Group secrecy affects RLS, storage,
  realtime, aggregate leakage, ownership, and privileged operations beyond
  basic Group tenant isolation.
- **Explicitly excluded behaviour:** A “secret” or “private” guarantee,
  security-enforced hidden attendee lists or event content within a Group, and
  assumptions that client filtering provides confidentiality.
- **Dependencies:** Accepted Group isolation, an explicit product distinction
  between assignment/visibility and secrecy, leakage analysis, and a dedicated
  authorization design.
- **Revisit trigger:** Product requirements explicitly call for confidentiality
  between Group Members and approve its security and parity implications.
- **Possible future phase:** Post-conversion intra-Group privacy phase
  (unscheduled).
- **Related documents or ADRs:** [V1 report, Trip data loading and
  visibility](../v1-codebase-feature-and-flow-report.md#61-data-loading-and-visibility);
  [Security Model](../architecture/security-model.md);
  [Feature Parity Test Contract](../architecture/feature-parity-test-contract.md).
- **Notes:** Later parity documentation must decide how v1 assignment-based
  filtering is preserved without claiming private-event security. Initial entry
  created 2026-07-24.

### DEF-009 — Payment processing

- **ID:** DEF-009
- **Item:** Payment processing
- **Status:** Deferred
- **Decision/boundary:** The application may record shared expenses and
  settlements for parity, but it will not initiate, route, capture, refund, or
  reconcile real payments during the current conversion.
- **Reason for deferral:** Moving money introduces providers, financial
  regulation, fraud, disputes, reconciliation, and operational obligations
  unrelated to expense-ledger parity.
- **Explicitly excluded behaviour:** Card or bank payment initiation, payment
  links, provider checkout, payment status webhooks, refunds, chargebacks,
  payout routing, and automated settlement execution.
- **Dependencies:** Approved payments business case, jurisdictional/legal
  review, provider selection, security/compliance architecture, and operational
  support.
- **Revisit trigger:** Product owners separately approve real-money movement
  after the non-custodial expense and settlement ledger is stable.
- **Possible future phase:** Separate payments programme (unscheduled).
- **Related documents or ADRs:** [V1 report, settle-up
  flow](../v1-codebase-feature-and-flow-report.md#88-settle-up-flow); DEF-010;
  [ADR-0003: Commercial Membership Is
  Deferred](../architecture/decisions/ADR-0003-commercial-membership-deferred.md);
  [V1 Migration Plan](../architecture/v1-migration-plan.md);
  [Feature Parity Test Contract](../architecture/feature-parity-test-contract.md).
- **Notes:** “Record a settlement” remains ledger behaviour and must not be
  described as processing a payment. Initial entry created 2026-07-24.

### DEF-010 — Wallets, custody, or stored monetary balances

- **ID:** DEF-010
- **Item:** Wallets, custody, or stored monetary balances
- **Status:** Deferred
- **Decision/boundary:** Calculated expense balances remain accounting results;
  the application will not hold funds or represent a custodial wallet.
- **Reason for deferral:** Custody and stored value create legal, security,
  reconciliation, safeguarding, and incident-response obligations far beyond
  shared-expense calculation.
- **Explicitly excluded behaviour:** Wallet accounts, deposits, withdrawals,
  stored value, custodial balances, pooled funds, internal money transfers, and
  claims that calculated debts are funds held by the application.
- **Dependencies:** Separate regulated-product approval, legal/compliance
  analysis, ledger and reconciliation architecture, and security/operations
  ownership.
- **Revisit trigger:** A separately funded and approved regulated-finance
  programme is initiated.
- **Possible future phase:** Separate regulated-finance programme
  (unscheduled).
- **Related documents or ADRs:** [Glossary definition for Accounting
  currency](../architecture/glossary.md); DEF-009;
  [ADR-0003: Commercial Membership Is
  Deferred](../architecture/decisions/ADR-0003-commercial-membership-deferred.md);
  [V1 Migration Plan](../architecture/v1-migration-plan.md);
  [Feature Parity Test Contract](../architecture/feature-parity-test-contract.md).
- **Notes:** Target finance language must distinguish calculated net positions
  from stored money. Initial entry created 2026-07-24.

### DEF-011 — Advanced organization administration

- **ID:** DEF-011
- **Item:** Advanced organization administration
- **Status:** Deferred
- **Decision/boundary:** The current conversion covers only administration
  necessary for one-Trip Groups with owner/member roles; enterprise or
  organization administration is excluded.
- **Reason for deferral:** Organization hierarchies and delegated governance
  would introduce a broader tenant model and authorization system.
- **Explicitly excluded behaviour:** Organization accounts, departments,
  centralized administrators, delegated admin, policy inheritance, domain
  claiming, enterprise user provisioning, audit exports, and fleet-wide Group
  management.
- **Dependencies:** Approved organization product model, role and policy
  architecture, audit requirements, and evidence that multi-Group central
  administration is needed.
- **Revisit trigger:** Product direction expands from independent Trip Groups to
  managed organizations.
- **Possible future phase:** Post-conversion organization/enterprise phase
  (unscheduled).
- **Related documents or ADRs:** DEF-004; DEF-007;
  [Authentication, Group, and Invitation
  Flows](../architecture/auth-groups-and-invitations.md);
  [ADR-0001: One Group Represents One Trip and Is the Tenant
  Boundary](../architecture/decisions/ADR-0001-group-is-trip-tenant.md);
  [Security Model](../architecture/security-model.md);
  [ADR-0008: Group-Scoped Authorization Is Enforced by RLS and Narrowly Trusted
  Operations](../architecture/decisions/ADR-0008-group-scoped-authorization-with-rls-and-trusted-operations.md)
  (Accepted); [V1 Migration Plan](../architecture/v1-migration-plan.md);
  [Feature Parity Test Contract](../architecture/feature-parity-test-contract.md).
- **Notes:** A Group Owner is not an organization administrator. Initial entry
  created 2026-07-24.

### DEF-012 — Automatic or global travel-content generation

- **ID:** DEF-012
- **Item:** Automatic or global travel-content generation
- **Status:** Deferred
- **Decision/boundary:** The conversion does not automatically generate,
  source, or publish destination content for arbitrary Groups. Existing
  Bali-specific guide content may be preserved only for the migrated Bali Group
  under the boundary in DEF-005.
- **Reason for deferral:** Generated travel advice needs accuracy, sourcing,
  safety, localization, freshness, content moderation, and clear ownership that
  are not part of tenant conversion.
- **Explicitly excluded behaviour:** Automatic destination guides, generated
  recommendations presented as authoritative, global travel-content seeding,
  and silently substituting Bali content into other destinations.
- **Dependencies:** Approved content strategy, source and freshness rules,
  safety/editorial policy, destination matching, and ownership of generated
  output quality.
- **Revisit trigger:** Product owners approve a maintained and safety-reviewed
  travel-content capability after conversion.
- **Possible future phase:** Post-conversion travel-content phase
  (unscheduled).
- **Related documents or ADRs:** [V1 report, Bali price
  guide](../v1-codebase-feature-and-flow-report.md#93-bali-price-guide);
  [V1 report, dormant AI concierge](../v1-codebase-feature-and-flow-report.md#11-dormant-ai-concierge);
  DEF-005;
  [Feature Parity Test Contract](../architecture/feature-parity-test-contract.md).
- **Notes:** The dormant v1 AI concierge is not a parity feature merely because
  placeholder code exists. Initial entry created 2026-07-24.

## Maintenance rule

Every future documentation and implementation phase must review this entire
register at its start and acceptance gate. The review must:

1. confirm no Deferred or Rejected item has entered scope implicitly;
2. add any newly postponed work with the next stable ID;
3. update dependencies, triggers, and related-document references when they
   materially change;
4. move an item to Reconsidering before designing or implementing it;
5. record the approval source before it becomes active scope; and
6. retain Delivered and Rejected entries as permanent history.

Passing a phase gate without this check risks both accidental scope expansion
and permanent loss of deferred requirements.
