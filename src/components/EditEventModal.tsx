import { useState, type CSSProperties } from 'react'
import { supabase } from '../lib/supabase'
import { USERS } from '../constants/users'
import { NeonBtn } from './ui/NeonBtn'
import { NeonInput } from './ui/NeonInput'
import { Avatar } from './ui/Avatar'
import type { DBEvent } from '../hooks/useEvents'

interface Props {
  event: DBEvent
  onClose: () => void
}

/** "2026-05-22T06:15:00+05:30" → "2026-05-22T06:15" for datetime-local input */
function toLocalInput(iso: string | undefined | null): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    // Convert to IST (UTC+5:30) then format as datetime-local
    const istMs = d.getTime() + (5 * 60 + 30) * 60000
    const ist = new Date(istMs)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${ist.getUTCFullYear()}-${pad(ist.getUTCMonth() + 1)}-${pad(ist.getUTCDate())}T${pad(ist.getUTCHours())}:${pad(ist.getUTCMinutes())}`
  } catch { return '' }
}

/** "2026-05-22T06:15" → "2026-05-22T06:15:00+05:30" */
function toIST(localDatetime: string): string {
  if (!localDatetime) return ''
  return localDatetime + ':00+05:30'
}

export function EditEventModal({ event, onClose }: Props) {
  const [title, setTitle] = useState(event.title)
  const [dateIST, setDateIST] = useState(toLocalInput(event.date_ist))
  const [endDateIST, setEndDateIST] = useState(toLocalInput(event.end_date_ist))
  const [location, setLocation] = useState(event.location ?? '')
  const [locationTo, setLocationTo] = useState(event.location_to ?? '')
  const [notes, setNotes] = useState(event.notes ?? '')
  const [gmapUrl, setGmapUrl] = useState(event.gmap_url ?? '')
  const [forUsers, setForUsers] = useState<string[]>(event.for_users ?? [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allSelected = forUsers.length === 0 || forUsers.length === USERS.length

  function toggle(name: string) {
    setForUsers(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  async function save() {
    setError(null)
    if (!title.trim()) return setError('Title is required')
    if (!dateIST) return setError('Start date/time is required')

    setSaving(true)
    const value = forUsers.length === USERS.length ? [] : forUsers
    try {
      const { error: updErr } = await supabase.from('events').update({
        title: title.trim(),
        date_ist: toIST(dateIST),
        end_date_ist: endDateIST ? toIST(endDateIST) : null,
        location: location.trim() || null,
        location_to: locationTo.trim() || null,
        notes: notes.trim() || null,
        gmap_url: gmapUrl.trim() || null,
        for_users: value,
      }).eq('id', event.id)
      if (updErr) throw updErr
      onClose()
    } catch (e) {
      setError((e as Error).message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const overlay: CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 200,
    background: 'rgba(15, 11, 8, 0.78)',
    backdropFilter: 'blur(14px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  }
  const sheet: CSSProperties = {
    width: '100%', maxWidth: 480,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: 22,
    maxHeight: '88vh',
    overflowY: 'auto',
  }
  const label = (text: string, opt = false) => (
    <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>
      {text}{opt && <span style={{ opacity: 0.5, letterSpacing: 0, textTransform: 'none' }}> (opt.)</span>}
    </p>
  )

  return (
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={e => e.stopPropagation()} className="animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <p className="serif-display" style={{ fontSize: 20, color: 'var(--text-primary)', fontWeight: 400 }}>
            Edit event
          </p>
          <button onClick={onClose} style={{ fontSize: 18, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Title */}
        <label className="block mb-3">
          {label('Title')}
          <NeonInput value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title" />
        </label>

        {/* Date/time */}
        <div className="flex gap-2 mb-3">
          <label className="block flex-1">
            {label('Start (IST)')}
            <NeonInput type="datetime-local" value={dateIST} onChange={e => setDateIST(e.target.value)} />
          </label>
          <label className="block flex-1">
            {label('End (IST)', true)}
            <NeonInput type="datetime-local" value={endDateIST} onChange={e => setEndDateIST(e.target.value)} />
          </label>
        </div>

        {/* Location */}
        <label className="block mb-3">
          {label('Location', true)}
          <NeonInput value={location} onChange={e => setLocation(e.target.value)} placeholder="Kuta Beach, Bali" />
        </label>
        <label className="block mb-3">
          {label('To', true)}
          <NeonInput value={locationTo} onChange={e => setLocationTo(e.target.value)} placeholder="Destination, for flights/ferries" />
        </label>

        {/* Notes */}
        <label className="block mb-3">
          {label('Notes', true)}
          <NeonInput value={notes} onChange={e => setNotes(e.target.value)} placeholder="Seat number, booking ref…" />
        </label>

        {/* Google Maps */}
        <label className="block mb-4">
          {label('Google Maps link', true)}
          <NeonInput type="url" inputMode="url" value={gmapUrl} onChange={e => setGmapUrl(e.target.value)} placeholder="https://maps.app.goo.gl/..." />
        </label>

        {/* Visible to */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            {label('Visible to')}
            <button
              className="font-ui"
              style={{ fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setForUsers(allSelected ? [] : USERS.map(u => u.name))}
            >
              {allSelected ? 'Deselect all' : 'Everyone'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {USERS.map(u => {
              const selected = forUsers.length === 0 || forUsers.includes(u.name)
              return (
                <button
                  key={u.name}
                  onClick={() => toggle(u.name)}
                  className="font-ui flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
                  style={{
                    fontSize: 13,
                    border: `1px solid ${selected ? u.color : 'var(--border)'}`,
                    background: selected ? `${u.color}18` : 'transparent',
                    color: selected ? u.color : 'var(--text-tertiary)',
                    cursor: 'pointer',
                  }}
                >
                  <Avatar name={u.name} color={u.color} size={18} />
                  <span>{u.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {error && <p className="font-ui mb-3" style={{ fontSize: 12, color: 'var(--accent)' }}>{error}</p>}

        <div className="flex gap-2">
          <NeonBtn onClick={save} disabled={saving} className="flex-1">
            {saving ? 'Saving…' : 'Save'}
          </NeonBtn>
          <NeonBtn variant="ghost" onClick={onClose}>Cancel</NeonBtn>
        </div>
      </div>
    </div>
  )
}
