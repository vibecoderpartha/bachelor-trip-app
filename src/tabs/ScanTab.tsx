import { useEffect, useRef, useState } from 'react'
import { TabHero } from '../components/TabHero'
import { NeonBtn } from '../components/ui/NeonBtn'
import { USERS, type User } from '../constants/users'
import { supabase } from '../lib/supabase'

interface ScannedEvent {
  id: string
  title: string
  date_ist: string
  doc_storage_path: string
  type: string
}

function fileIcon(file: File): string {
  if (file.type === 'application/pdf') return '📄'
  if (file.type.startsWith('image/')) return '🖼️'
  return '📎'
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

export function ScanTab({ user }: { user: User }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [scanning, setScanning] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [scannedDocs, setScannedDocs] = useState<ScannedEvent[]>([])
  const [forUsers, setForUsers] = useState<string[]>([user.name])

  // Reset forUsers when active profile changes
  useEffect(() => { setForUsers([user.name]) }, [user.name])

  function toggleUser(name: string) {
    if (name === user.name) return // current user always included
    setForUsers(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  const loadScannedDocs = async () => {
    const { data } = await supabase
      .from('events')
      .select('id, title, date_ist, doc_storage_path, type')
      .not('doc_storage_path', 'is', null)
      .order('created_at', { ascending: false })
    if (data) setScannedDocs(data as ScannedEvent[])
  }

  useEffect(() => { loadScannedDocs() }, [])

  const handleScan = async () => {
    if (!file) return
    setScanning(true)
    setSuccessMsg(null)
    setErrorMsg(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('uploaded_by', user.name)
      formData.append('for_users', JSON.stringify(forUsers))

      const { data: json, error: fnError } = await supabase.functions.invoke('parse-document', {
        body: formData,
      })

      if (fnError) throw new Error(fnError.message)
      if (json?.error) throw new Error(json.error)

      setSuccessMsg(`Added to itinerary: ${(json as { event?: { title: string } })?.event?.title ?? 'New event'}`)
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
      await loadScannedDocs()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setScanning(false)
    }
  }

  const getPublicUrl = (path: string) =>
    supabase.storage.from('tickets').getPublicUrl(path).data.publicUrl

  return (
    <div data-testid="scan-tab">
      <TabHero tab="scan" user={user} />

      <div className="px-5 pt-8 pb-4">
        <p className="serif-display text-center" style={{ fontSize: 22, color: 'var(--text-primary)', fontWeight: 400, lineHeight: 1.25 }}>
          Drop a ticket. We'll read it.
        </p>
        <p className="font-ui text-center mt-3" style={{ fontSize: 13, color: 'var(--text-tertiary)', maxWidth: 320, margin: '12px auto 0' }}>
          Boarding passes, hotel vouchers, ferry receipts — Claude pulls out times, codes, and confirmations and slots them into your itinerary.
        </p>

        {/* Upload area */}
        <div
          className="mt-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer"
          style={{ borderColor: 'var(--border)', padding: '32px 20px', background: 'rgba(245,241,235,0.02)' }}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null
              setFile(f)
              setSuccessMsg(null)
              setErrorMsg(null)
            }}
          />
          {file ? (
            <div className="flex items-center gap-2 font-ui" style={{ fontSize: 14, color: 'var(--text-primary)' }}>
              <span style={{ fontSize: 20 }}>{fileIcon(file)}</span>
              <span style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name}
              </span>
            </div>
          ) : (
            <>
              <span style={{ fontSize: 32 }}>📎</span>
              <span className="font-ui" style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                Tap to choose a PDF or photo
              </span>
            </>
          )}
        </div>

        {/* Feedback messages */}
        {successMsg && (
          <p className="font-ui mt-3 text-center" style={{ fontSize: 13, color: 'var(--accent)' }}>
            ✓ {successMsg}
          </p>
        )}
        {errorMsg && (
          <p className="font-ui mt-3 text-center" style={{ fontSize: 13, color: '#FF2D78' }}>
            {errorMsg}
          </p>
        )}

        {/* Crew picker */}
        <div className="mt-5">
          <p className="font-ui mb-2" style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
            Assign to
          </p>
          <div className="flex flex-wrap gap-2">
            {USERS.map(u => {
              const selected = forUsers.includes(u.name)
              const isMe = u.name === user.name
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
                    opacity: isMe ? 0.7 : 1,
                    cursor: isMe ? 'default' : 'pointer',
                  }}
                >
                  <span>{u.emoji}</span>
                  <span>{u.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Scan button */}
        <div className="mt-4 flex justify-center">
          {scanning ? (
            <div className="flex items-center gap-2 font-ui" style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 16, height: 16,
                  border: '2px solid var(--accent)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }}
              />
              Scanning…
            </div>
          ) : (
            <NeonBtn
              disabled={!file}
              onClick={handleScan}
              style={{ opacity: file ? 1 : 0.4, minWidth: 120 }}
            >
              SCAN IT
            </NeonBtn>
          )}
        </div>
      </div>

      {/* Previously scanned docs */}
      {scannedDocs.length > 0 && (
        <div className="px-5 pt-4 pb-8">
          <p className="font-ui mb-3" style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Previously scanned
          </p>
          <div className="flex flex-col gap-2">
            {scannedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{ background: 'rgba(245,241,235,0.04)', border: '1px solid var(--border)' }}
              >
                <div className="flex flex-col gap-0.5" style={{ minWidth: 0 }}>
                  <span className="font-ui" style={{ fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {doc.title}
                  </span>
                  <span className="font-ui" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {formatDate(doc.date_ist)}
                  </span>
                </div>
                <a
                  href={getPublicUrl(doc.doc_storage_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui ml-3 shrink-0"
                  style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}
                >
                  View ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
