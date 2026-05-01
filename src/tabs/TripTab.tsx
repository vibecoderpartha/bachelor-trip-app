import { useState, useMemo, type CSSProperties } from 'react'
import { type User } from '../constants/users'
import { useEvents, userSeesEvent, type DBEvent } from '../hooks/useEvents'
import { EventCard, type EventStatus } from '../components/EventCard'
import { CountdownClock } from '../components/CountdownClock'
import { CrewStatus } from '../components/CrewStatus'
import { VIPBadge } from '../components/ui/VIPBadge'
import { NeonBtn } from '../components/ui/NeonBtn'
import { fmtIST, fmtWITA } from '../lib/timezone'

interface Props { user: User }

export function TripTab({ user }: Props) {
  const { events, loading } = useEvents()
  const [showClock, setShowClock] = useState(false)

  const now = Date.now()

  const visible = useMemo(
    () => events.filter(e => userSeesEvent(e, user.name)),
    [events, user.name],
  )

  const nextId = useMemo(() => {
    return visible.find(e => new Date(e.date_ist).getTime() > now)?.id
  }, [visible, now])

  function statusOf(e: DBEvent): EventStatus {
    const start = new Date(e.date_ist).getTime()
    const end = e.end_date_ist ? new Date(e.end_date_ist).getTime() : start
    if (end < now) return 'past'
    if (start <= now && now <= end) return 'live'
    if (e.id === nextId) return 'next'
    return 'upcoming'
  }

  const nextFlight = useMemo<DBEvent | null>(() => {
    return (
      visible.find(
        e => e.type === 'flight' && new Date(e.date_ist).getTime() > now,
      ) ?? null
    )
  }, [visible, now])

  const skeletonStyle: CSSProperties = {
    height: 80,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.04)',
  }

  return (
    <div className="px-4 pt-4 pb-8" data-testid="trip-tab">
      {/* Crew status — "where is everyone right now?" */}
      <CrewStatus events={events} currentUserName={user.name} />

      {/* Countdown toggle */}
      <div className="mb-4">
        {!showClock ? (
          <button
            onClick={() => setShowClock(true)}
            className="w-full neon-card corner-bracket px-4 py-3 text-left transition-all hover:brightness-125"
            style={{ color: user.color }}
            data-testid="countdown-toggle-expand"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p
                  className="font-mono mb-1"
                  style={{ fontSize: 9, color: '#666', letterSpacing: 3 }}
                >
                  ⚡ NEXT FLIGHT
                </p>
                <p
                  className="font-display tracking-wide truncate"
                  style={{ fontSize: 13, color: user.color, textShadow: `0 0 8px ${user.color}66` }}
                >
                  {nextFlight ? nextFlight.title : 'NO UPCOMING FLIGHT'}
                </p>
                {nextFlight && (
                  <div
                    className="font-mono mt-1 flex gap-2"
                    style={{ fontSize: 10, color: '#888', letterSpacing: 1 }}
                  >
                    <span>{fmtIST(new Date(nextFlight.date_ist))} IST</span>
                    <span style={{ color: '#444' }}>·</span>
                    <span>{fmtWITA(new Date(nextFlight.date_ist))} WITA</span>
                  </div>
                )}
              </div>
              <span style={{ color: user.color, fontSize: 16 }}>↓</span>
            </div>
          </button>
        ) : (
          <div className="space-y-2">
            <CountdownClock event={nextFlight} userColor={user.color} />
            <button
              onClick={() => setShowClock(false)}
              className="w-full font-mono py-1.5 tracking-widest transition-all"
              style={{ fontSize: 10, color: '#666', letterSpacing: 4 }}
              data-testid="countdown-toggle-collapse"
            >
              ↑ COLLAPSE
            </button>
          </div>
        )}
      </div>

      {/* Timezone helper badge */}
      <div className="flex justify-center mb-5">
        <VIPBadge color="var(--neon-gold)">WITA = IST + 2:30 HRS</VIPBadge>
      </div>

      {/* Timeline */}
      <div className="relative" data-testid="trip-timeline">
        {/* Spine */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 22,
            top: 8,
            bottom: 8,
            width: 2,
            background: 'rgba(255,255,255,0.06)',
          }}
        />

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex gap-3 items-start">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)',
                    flexShrink: 0,
                  }}
                />
                <div className="flex-1 animate-pulse" style={skeletonStyle} />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-12 font-mono" style={{ fontSize: 11, color: '#555', letterSpacing: 3 }}>
            NO EVENTS YET
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map(e => (
              <EventCard
                key={e.id}
                event={e}
                status={statusOf(e)}
                userColor={user.color}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Event */}
      <div className="mt-6">
        <NeonBtn
          color="rgba(255,255,255,0.2)"
          variant="outline"
          className="w-full"
          style={{
            borderStyle: 'dashed',
            borderColor: 'rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.3)',
          }}
          data-testid="add-event-btn"
        >
          + ADD EVENT
        </NeonBtn>
      </div>
    </div>
  )
}
