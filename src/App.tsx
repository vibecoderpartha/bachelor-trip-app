import { useState } from 'react'
import { UserChips } from './components/ui/UserChips'
import { PersonaPicker } from './components/PersonaPicker'
import { TripTab } from './tabs/TripTab'
import { ScanTab } from './tabs/ScanTab'
import { SplitTab } from './tabs/SplitTab'
import { FXTab } from './tabs/FXTab'
import { useCurrentUser } from './hooks/useCurrentUser'
import { Avatar } from './components/ui/Avatar'
import { type User } from './constants/users'
import type { TabId } from './constants/tabAssets'

const TABS: { id: TabId; label: string }[] = [
  { id: 'trip',  label: 'Trip' },
  { id: 'scan',  label: 'Scan' },
  { id: 'split', label: 'Split' },
  { id: 'fx',    label: 'FX' },
]

export function App() {
  const { user, setUser } = useCurrentUser()
  const [activeTab, setActiveTab] = useState<TabId>('trip')

  function handleSelect(u: User) {
    setUser(u)
  }

  return (
    <div
      className="mx-auto flex flex-col"
      style={{ maxWidth: 480, minHeight: '100dvh', position: 'relative' }}
      data-testid="app-root"
    >
      {/* Slim, quiet header */}
      <header
        className="sticky top-0 z-20"
        style={{
          background: 'rgba(15, 11, 8, 0.78)',
          backdropFilter: 'saturate(180%) blur(14px)',
          WebkitBackdropFilter: 'saturate(180%) blur(14px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div>
            <p
              className="serif-display"
              style={{ fontSize: 20, color: 'var(--text-primary)', fontWeight: 400 }}
            >
              Bakchodi in Bali
            </p>
            <p
              className="font-mono"
              style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.18em', marginTop: 2 }}
            >
              MAY 22 — 27 · 2026
            </p>
          </div>
          {user && (
            <button
              onClick={() => setUser({ ...user })}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full"
              style={{
                background: 'rgba(245,241,235,0.04)',
                border: '1px solid var(--border)',
              }}
              data-testid="header-current-user"
              title={user.vibe}
            >
              <Avatar name={user.name} color={user.color} size={22} />
              <span
                className="font-ui"
                style={{ fontSize: 13, color: 'var(--text-secondary)', letterSpacing: 0.5 }}
              >
                {user.name}
              </span>
              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: user.color,
                  boxShadow: `0 0 4px ${user.color}aa`,
                }}
              />
            </button>
          )}
        </div>

        {user && (
          <div className="px-5 pb-3">
            <UserChips activeUser={user} onSelect={handleSelect} compact />
          </div>
        )}
      </header>

      {/* Tab content */}
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 16 }}>
        {user ? (
          <div key={activeTab} className="animate-fade-in">
            {activeTab === 'trip'  && <TripTab user={user} />}
            {activeTab === 'scan'  && <ScanTab user={user} />}
            {activeTab === 'split' && <SplitTab user={user} />}
            {activeTab === 'fx'    && <FXTab user={user ?? undefined} />}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="serif-eyebrow" style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
              Pick your persona to begin.
            </p>
          </div>
        )}
      </main>

      {/* Bottom nav */}
      <nav
        className="sticky bottom-0 z-10 flex"
        style={{
          background: 'rgba(15, 11, 8, 0.92)',
          backdropFilter: 'saturate(180%) blur(14px)',
          WebkitBackdropFilter: 'saturate(180%) blur(14px)',
          borderTop: '1px solid var(--border)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            data-testid={`nav-${tab.id}`}
          >
            <span
              className="serif-display"
              style={{ fontSize: 16, fontWeight: 400 }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </nav>

      {/* First-run persona picker */}
      {!user && <PersonaPicker onSelect={handleSelect} />}
    </div>
  )
}
