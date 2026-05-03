import { useState, type CSSProperties } from 'react'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { supabase } from '../lib/supabase'
import { USERS, type User } from '../constants/users'
import { EVENT_TYPES } from '../constants/eventTypes'
import { NeonBtn } from './ui/NeonBtn'
import { NeonInput } from './ui/NeonInput'
import { Avatar } from './ui/Avatar'

interface Props {
  currentUser: User
  onClose: () => void
}

export function AddEventModal({ currentUser, onClose }: Props) {
  const [type, setType] = useState('activity')
  const [title, setTitle] = useState('')
  const [dateIST, setDateIST] = useState('')
  const [endDateIST, setEndDateIST] = useState('')
  const [location, setLocation] = useState('')
  const [locationTo, setLocationTo] = useState('')
  const [notes, setNotes] = useState('')
  const [gmapUrl, setGmapUrl] = useState('')
  const [forUsers, setForUsers] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useBodyScrollLock()
  const meta = EVENT_TYPES.find(t => t.type === type) ?? EVENT_TYPES[0]

  function toggleUser(name: string) {
    setForUsers(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  function toIST(localDatetime: string): string {
    if (!localDatetime) return ''
    // User enters local time; we treat it as IST (UTC+5:30)
    return localDatetime + ':00+05:30'
  }

  async function save() {
    setError(null)
    if (!title.trim()) return setError('Title is required')
    if (!dateIST) return setError('Date & time is required')

    setSaving(true)
    try {
      const { error: insErr } = await supabase.from('events').insert({
        type,
        title: title.trim(),
        date_ist: toIST(dateIST),
        end_date_ist: endDateIST ? toIST(endDateIST) : null,
        location: location.trim() || null,
        location_to: locationTo.trim() || null,
        notes: notes.trim() || null,
        gmap_url: gmapUrl.trim() || null,
        color: meta.color,
        for_users: forUsers.length > 0 ? forUsers : [],
        created_by: currentUser.name,
      })
      if (insErr) throw insErr
      onClose()
    } catch (e) {
      setError((e as Error).message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const overlay: CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 200,
    background: 'rgba(15, 11, 8, 0.78)',
    backdropFilter: 'blur(14px)',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 16, overflowY: 'auto', overscrollBehavior: 'contain',
  }
  const sheet: CSSProperties = {
    width: '100%', maxWidth: 480,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: 22,
    margin: '16px auto',
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={e => e.stopPropagation()} className="animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <p className="serif-display" style={{ fontSize: 22, color: 'var(--text-primary)', fontWeight: 400 }}>
            Add event
          </p>
          <button onClick={onClose} style={{ fontSize: 18, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Type */}
        <div className="mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>Type</p>
          <div className="flex gap-1.5 flex-wrap">
            {EVENT_TYPES.map(t => (
              <button
                key={t.type}
                onClick={() => setType(t.type)}
                className="font-ui px-2.5 py-1 rounded-full transition-all"
                style={{
                  fontSize: 11,
                  border: `1px solid ${type === t.type ? t.color : 'var(--border)'}`,
                  background: type === t.type ? `${t.color}18` : 'transparent',
                  color: type === t.type ? t.color : 'var(--text-tertiary)',
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <label className="block mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>Title</p>
          <NeonInput value={title} onChange={e => setTitle(e.target.value)} placeholder="Surf lesson, hotel check-in…" />
        </label>

        {/* Date */}
        <div className="flex gap-2 mb-3.5">
          <label className="block flex-1">
            <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>Start (IST)</p>
            <NeonInput type="datetime-local" value={dateIST} onChange={e => setDateIST(e.target.value)} />
          </label>
          <label className="block flex-1">
            <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>End (IST) <span style={{ opacity: 0.5, letterSpacing: 0, textTransform: 'none' }}>opt.</span></p>
            <NeonInput type="datetime-local" value={endDateIST} onChange={e => setEndDateIST(e.target.value)} />
          </label>
        </div>

        {/* Location */}
        <label className="block mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>Location <span style={{ opacity: 0.5, letterSpacing: 0, textTransform: 'none' }}>opt.</span></p>
          <NeonInput value={location} onChange={e => setLocation(e.target.value)} placeholder="Kuta Beach, Bali" />
        </label>

        <label className="block mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>To <span style={{ opacity: 0.5, letterSpacing: 0, textTransform: 'none' }}>opt. — for flights/ferries</span></p>
          <NeonInput value={locationTo} onChange={e => setLocationTo(e.target.value)} placeholder="Ngurah Rai Airport, Denpasar" />
        </label>

        {/* Google Maps */}
        <label className="block mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>Google Maps link <span style={{ opacity: 0.5, letterSpacing: 0, textTransform: 'none' }}>opt.</span></p>
          <NeonInput type="url" inputMode="url" value={gmapUrl} onChange={e => setGmapUrl(e.target.value)} placeholder="https://maps.app.goo.gl/..." />
        </label>

        {/* Notes */}
        <label className="block mb-3.5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>Notes <span style={{ opacity: 0.5, letterSpacing: 0, textTransform: 'none' }}>opt.</span></p>
          <NeonInput value={notes} onChange={e => setNotes(e.target.value)} placeholder="Booking ref, instructions…" />
        </label>

        {/* Visible to */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-ui" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>Visible to</p>
            <button
              className="font-ui"
              style={{ fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setForUsers(forUsers.length === 0 ? USERS.map(u => u.name) : [])}
            >
              {forUsers.length === 0 ? 'Pick people' : 'Everyone'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {USERS.map(u => {
              const selected = forUsers.length === 0 || forUsers.includes(u.name)
              return (
                <button
                  key={u.name}
                  onClick={() => toggleUser(u.name)}
                  className="font-ui flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
                  style={{
                    fontSize: 12,
                    border: `1px solid ${selected ? u.color : 'var(--border)'}`,
                    background: selected ? `${u.color}18` : 'transparent',
                    color: selected ? u.color : 'var(--text-tertiary)',
                    cursor: 'pointer',
                  }}
                >
                  <Avatar name={u.name} color={u.color} size={16} />
                  <span>{u.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {error && <p className="font-ui mb-3" style={{ fontSize: 12, color: 'var(--accent)' }}>{error}</p>}

        <div className="flex gap-2">
          <NeonBtn onClick={save} disabled={saving} className="flex-1">{saving ? 'Saving…' : 'Add event'}</NeonBtn>
          <NeonBtn variant="ghost" onClick={onClose}>Cancel</NeonBtn>
        </div>
      </div>
    </div>
  )
}
