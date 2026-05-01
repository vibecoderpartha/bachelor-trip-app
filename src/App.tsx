import { useState, type CSSProperties } from 'react'
import { Scanlines } from './components/ui/Scanlines'
import { UserChips } from './components/ui/UserChips'
import { NeonText } from './components/ui/NeonText'
import { PersonaPicker } from './components/PersonaPicker'
import { TripTab } from './tabs/TripTab'
import { ScanTab } from './tabs/ScanTab'
import { SplitTab } from './tabs/SplitTab'
import { FXTab } from './tabs/FXTab'
import { AITab } from './tabs/AITab'
import { useCurrentUser } from './hooks/useCurrentUser'
import { type User } from './constants/users'

type TabId = 'trip' | 'scan' | 'split' | 'fx' | 'ai'

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'trip',  icon: '🗓', label: 'TRIP' },
  { id: 'scan',  icon: '📎', label: 'SCAN' },
  { id: 'split', icon: '💸', label: 'SPLIT' },
  { id: 'fx',    icon: '💱', label: 'FX' },
  { id: 'ai',    icon: '🌴', label: 'AI' },
]

const TITLE_COLORS = [
  'var(--neon-pink)',
  'var(--neon-gold)',
  'var(--neon-cyan)',
  'var(--neon-purple)',
  'var(--neon-orange)',
]

const TITLE_CHARS = ['B','A','L','I',' ','✦',' ','B','A','C','H','E','L','O','R']

function BaliTitle() {
  return (
    <h1
      className="font-display text-2xl tracking-wider animate-flicker text-center"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {TITLE_CHARS.map((ch, i) => (
        <span
          key={i}
          style={{
            color: ch === ' ' ? 'transparent' : TITLE_COLORS[i % TITLE_COLORS.length],
            textShadow: ch === ' ' ? 'none' : `0 0 10px ${TITLE_COLORS[i % TITLE_COLORS.length]}`,
          }}
        >
          {ch}
        </span>
      ))}
    </h1>
  )
}

export function App() {
  const { user, setUser } = useCurrentUser()
  const [activeTab, setActiveTab] = useState<TabId>('trip')

  function handleSelect(u: User) {
    setUser(u)
  }

  const userColor = user?.color ?? 'var(--neon-gold)'
  const cssVarStyle = { '--active-color': userColor } as CSSProperties

  return (
    <>
      <Scanlines />
      <div
        className="mx-auto flex flex-col relative overflow-hidden"
        style={{ maxWidth: 480, minHeight: '100dvh', ...cssVarStyle }}
      >
        <div className="top-bar" />
        {/* Ambient glow — inline required: dynamic radial-gradient per user color */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
            width: 320, height: 200, borderRadius: '50%', pointerEvents: 'none',
            background: `radial-gradient(ellipse at center, ${userColor}18 0%, transparent 70%)`,
            transition: 'background 0.4s', zIndex: 0,
          }}
        />

        {/* Header */}
        <header
          className="sticky top-0 z-10 px-4 pt-3 pb-2.5 border-b border-white/[0.04]"
          style={{ background: 'rgba(5,3,8,0.92)', backdropFilter: 'blur(12px)' }}
        >
          <p className="font-mono text-center mb-1" style={{ fontSize: 9, letterSpacing: 6, color: '#333' }}>
            ◈ THE BOYS ARE IN ◈
          </p>
          <BaliTitle />
          <p className="font-mono text-center mt-1 mb-3" style={{ fontSize: 9, letterSpacing: 3, color: '#333' }}>
            MAY 22–27 · SEMINYAK · NUSA PENIDA · AMED
          </p>
          <UserChips activeUser={user} onSelect={handleSelect} />
          {user && (
            <p className="font-mono text-center mt-2" style={{ fontSize: 9, letterSpacing: 3, color: `${userColor}88` }}>
              {user.vibe.toUpperCase()}
            </p>
          )}
        </header>

        {/* Tab content */}
        <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 16 }}>
          {user ? (
            <>
              {activeTab === 'trip'  && <TripTab user={user} />}
              {activeTab === 'scan'  && <ScanTab />}
              {activeTab === 'split' && <SplitTab user={user} />}
              {activeTab === 'fx'    && <FXTab />}
              {activeTab === 'ai'    && <AITab />}
            </>
          ) : (
            <div className="flex items-center justify-center h-full py-16">
              <NeonText color="var(--neon-gold)" className="font-mono text-xs tracking-widest">
                SELECT YOUR PERSONA TO BEGIN
              </NeonText>
            </div>
          )}
        </main>

        {/* Bottom nav — .nav-tab / .nav-tab.active reference var(--active-color) */}
        <nav
          className="sticky bottom-0 z-10 flex border-t border-white/[0.06]"
          style={{ background: 'rgba(5,3,8,0.95)', backdropFilter: 'blur(12px)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              <span className="font-ui" style={{ fontSize: 9, letterSpacing: 2 }}>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Persona picker — shown on first load when no user in localStorage */}
      {!user && <PersonaPicker onSelect={handleSelect} />}
    </>
  )
}
