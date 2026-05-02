import { useState, useMemo } from 'react'
import { type User } from '../constants/users'
import { useEvents, userSeesEvent, type DBEvent } from '../hooks/useEvents'
import { supabase } from '../lib/supabase'
import { EditEventModal } from '../components/EditEventModal'
import { AddEventModal } from '../components/AddEventModal'
import { TabHero } from '../components/TabHero'
import { EventCard, type EventStatus } from '../components/EventCard'
import { CountdownClock } from '../components/CountdownClock'
import { CrewStatus } from '../components/CrewStatus'
import { fmtIST, fmtWITA } from '../lib/timezone'

interface Props { user: User }

export function TripTab({ user }: Props) {
  const { events, loading } = useEvents()
  const [showClock, setShowClock] = useState(false)
  const [editingEvent, setEditingEvent] = useState<DBEvent | null>(null)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const now = Date.now()

  const visible = useMemo(
    () => events.filter(e => userSeesEvent(e, user.name)),
    [events, user.name],
  )

  const nextId = useMemo(() => visible.find(e => new Date(e.date_ist).getTime() > now)?.id, [visible, now])

  function statusOf(e: DBEvent): EventStatus {
    const start = new Date(e.date_ist).getTime()
    const end = e.end_date_ist ? new Date(e.end_date_ist).getTime() : start
    if (end < now) return 'past'
    if (start <= now && now <= end) return 'live'
    if (e.id === nextId) return 'next'
    return 'upcoming'
  }

  const nextFlight = useMemo<DBEvent | null>(
    () => visible.find(e => e.type === 'flight' && new Date(e.date_ist).getTime() > now) ?? null,
    [visible, now],
  )

  return (
    <div data-testid="trip-tab">
      <TabHero tab="trip" user={user} />

      <div className="px-5 pt-5 pb-8 space-y-6">
        <CrewStatus events={events} currentUserName={user.name} />

        {/* Next flight — calm card with expandable countdown */}
        <section>
          {!showClock ? (
            <button
              onClick={() => setShowClock(true)}
              className="w-full text-left transition-all"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
              }}
              data-testid="countdown-toggle-expand"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="serif-eyebrow" style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 2 }}>
                    next flight
                  </p>
                  <p
                    className="serif-display truncate"
                    style={{ fontSize: 17, color: 'var(--text-primary)', fontWeight: 400 }}
                  >
                    {nextFlight ? nextFlight.title : 'No upcoming flight'}
                  </p>
                  {nextFlight && (
                    <p className="font-mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                      {fmtIST(new Date(nextFlight.date_ist))} IST · {fmtWITA(new Date(nextFlight.date_ist))} WITA
                    </p>
                  )}
                </div>
                <span style={{ color: 'var(--text-tertiary)', fontSize: 18 }}>↓</span>
              </div>
            </button>
          ) : (
            <div className="space-y-2">
              <CountdownClock event={nextFlight} userColor={user.color} />
              <button
                onClick={() => setShowClock(false)}
                className="w-full font-ui py-2 transition-colors"
                style={{ fontSize: 12, color: 'var(--text-tertiary)' }}
                data-testid="countdown-toggle-collapse"
              >
                Collapse
              </button>
            </div>
          )}
        </section>

        {/* Timeline */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <p className="serif-eyebrow" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              your itinerary
            </p>
            <div className="flex items-center gap-3">
              <span className="font-mono" style={{ fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.18em' }}>
                {visible.length} ITEMS · WITA = IST + 2h30
              </span>
              <button
                onClick={() => setShowAddEvent(true)}
                className="font-ui"
                style={{ fontSize: 11, color: 'var(--accent)', background: 'none', border: '1px solid var(--accent)44', borderRadius: 8, padding: '3px 10px', cursor: 'pointer' }}
                data-testid="add-event-btn"
              >
                + Add
              </button>
            </div>
          </div>

          <div className="relative" data-testid="trip-timeline">
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 18.5,
                top: 8,
                bottom: 8,
                width: 1,
                background: 'var(--border)',
              }}
            />
            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2].map(i => (
                  <div key={i} className="flex gap-3">
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--bg-card)', flexShrink: 0 }} />
                    <div className="flex-1 animate-pulse-soft" style={{ height: 86, background: 'var(--bg-card)', borderRadius: 12 }} />
                  </div>
                ))}
              </div>
            ) : visible.length === 0 ? (
              <p className="font-ui text-center py-12" style={{ fontSize: 13, color: 'var(--text-tertiary)' }} data-testid="events-empty">
                No events yet.
              </p>
            ) : (
              <div className="space-y-3">
                {visible.map(e => (
                  <EventCard
                    key={e.id}
                    event={e}
                    status={statusOf(e)}
                    userColor={user.color}
                    onEdit={() => setEditingEvent(e)}
                    onDelete={() => { supabase.from('events').delete().eq('id', e.id).then(() => {}) }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      {editingEvent && (
        <EditEventModal event={editingEvent} onClose={() => setEditingEvent(null)} />
      )}
      {showAddEvent && (
        <AddEventModal currentUser={user} onClose={() => setShowAddEvent(false)} />
      )}
    </div>
  )
}
