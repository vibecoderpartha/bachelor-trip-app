export const FROZEN_TEST_INSTANT = '2030-01-02T03:04:05.000Z'

export type FixtureRelationshipState = 'active' | 'inactive' | 'removed'
export type FixtureRole = 'owner' | 'member'
export type ExpectedAccess = 'allow' | 'deny'

export interface AccountFixture {
  id: string
  label: string
}

export interface GroupFixture {
  id: string
  label: string
}

export interface MembershipFixture {
  id: string
  accountId: string
  groupId: string
  role: FixtureRole
  state: FixtureRelationshipState
}

export interface AccessExpectationFixture {
  id: string
  actorAccountId: string
  resourceGroupId: string
  relationshipState: FixtureRelationshipState | 'non-member'
  expected: ExpectedAccess
}

export interface TwoAccountTwoGroupFixture {
  frozenInstant: string
  accounts: AccountFixture[]
  groups: GroupFixture[]
  activeMemberships: MembershipFixture[]
  accessExpectations: AccessExpectationFixture[]
}

const TWO_ACCOUNT_TWO_GROUP_FIXTURE: TwoAccountTwoGroupFixture = {
  frozenInstant: FROZEN_TEST_INSTANT,
  accounts: [
    { id: 'fixture-account-a', label: 'Fixture Account A' },
    { id: 'fixture-account-b', label: 'Fixture Account B' },
  ],
  groups: [
    { id: 'fixture-group-a', label: 'Fixture Group A' },
    { id: 'fixture-group-b', label: 'Fixture Group B' },
  ],
  activeMemberships: [
    {
      id: 'fixture-membership-account-a-group-a',
      accountId: 'fixture-account-a',
      groupId: 'fixture-group-a',
      role: 'owner',
      state: 'active',
    },
    {
      id: 'fixture-membership-account-b-group-b',
      accountId: 'fixture-account-b',
      groupId: 'fixture-group-b',
      role: 'owner',
      state: 'active',
    },
  ],
  accessExpectations: [
    {
      id: 'same-group-account-a-group-a',
      actorAccountId: 'fixture-account-a',
      resourceGroupId: 'fixture-group-a',
      relationshipState: 'active',
      expected: 'allow',
    },
    {
      id: 'same-group-account-b-group-b',
      actorAccountId: 'fixture-account-b',
      resourceGroupId: 'fixture-group-b',
      relationshipState: 'active',
      expected: 'allow',
    },
    {
      id: 'cross-group-account-a-group-b',
      actorAccountId: 'fixture-account-a',
      resourceGroupId: 'fixture-group-b',
      relationshipState: 'non-member',
      expected: 'deny',
    },
    {
      id: 'cross-group-account-b-group-a',
      actorAccountId: 'fixture-account-b',
      resourceGroupId: 'fixture-group-a',
      relationshipState: 'non-member',
      expected: 'deny',
    },
    {
      id: 'inactive-account-a-group-a',
      actorAccountId: 'fixture-account-a',
      resourceGroupId: 'fixture-group-a',
      relationshipState: 'inactive',
      expected: 'deny',
    },
    {
      id: 'removed-account-a-group-a',
      actorAccountId: 'fixture-account-a',
      resourceGroupId: 'fixture-group-a',
      relationshipState: 'removed',
      expected: 'deny',
    },
  ],
}

export function createDeterministicClock() {
  return Object.freeze({
    now: () => new Date(FROZEN_TEST_INSTANT),
  })
}

export function createTwoAccountTwoGroupFixture(): TwoAccountTwoGroupFixture {
  return structuredClone(TWO_ACCOUNT_TWO_GROUP_FIXTURE)
}

export function resetTwoAccountTwoGroupFixture(): TwoAccountTwoGroupFixture {
  return createTwoAccountTwoGroupFixture()
}

export function cleanupTwoAccountTwoGroupFixture() {
  return Object.freeze({
    scope: 'in-memory' as const,
    affectedResources: 0,
    idempotent: true,
  })
}
