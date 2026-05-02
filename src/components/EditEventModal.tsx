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

export function EditEventModal({ event, onClose }: Props) {
  const [forUsers, setForUsers] = useState<string[]>(event.for_users ?? [])
  const [gmapUrl, setGmapUrl] = useState(event.gmap_url ?? '')
  const [saving, setSaving] = useState(false)

  const allSelected = forUsers.length === 0 || forUsers.length === USERS.length

  function toggle(name: string) {
    setForUsers(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  async function save() {
    setSaving(true)
    const value = forUsers.length === USERS.length ? [] : forUsers
    await supabase.from('events').update({
      for_users: value,
      gmap_url: gmapUrl.trim() || null,
    }).eq('id', event.id)
    setSaving(false)
    onClose()
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

  return (
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={e => e.stopPropagation()} className="animate-slide-up">
        <div className="flex items-center justify-between mb-1">
          <p className="serif-display" style={{ fontSize: 20, color: 'var(--text-primary)', fontWeight: 400 }}>
            Edit event
          </p>
          <button onClick={onClose} style={{ fontSize: 18, color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
        <p className="font-ui mb-5" style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
          {event.title}
        </p>

        <div className="mb-2 flex items-center justify-between">
          <p className="font-ui" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>
            Visible to
          </p>
          <button
            className="font-ui"
            style={{ fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setForUsers(allSelected ? [] : USERS.map(u => u.name))}
          >
            {allSelected ? 'Deselect all' : 'Everyone'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
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

        <label className="block mb-5">
          <p className="font-ui mb-1.5" style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' }}>
            Google Maps link <span style={{ opacity: 0.5, letterSpacing: 0, textTransform: 'none' }}>(optional)</span>
          </p>
          <NeonInput
            value={gmapUrl}
            onChange={e => setGmapUrl(e.target.value)}
            placeholder="https://maps.app.goo.gl/..."
            type="url"
            inputMode="url"
          />
        </label>

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
