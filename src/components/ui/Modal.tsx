import { type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import type { CSSProperties } from 'react'

interface Props {
  onClose: () => void
  children: ReactNode
  testId?: string
}

const overlay: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  background: 'rgba(15, 11, 8, 0.82)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  padding: '16px 16px env(safe-area-inset-bottom, 16px)',
}

export const sheetStyle: CSSProperties = {
  width: '100%',
  maxWidth: 480,
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: 20,
  padding: 22,
  margin: 'auto',
  flexShrink: 0,
}

export function Modal({ onClose, children, testId }: Props) {
  useBodyScrollLock()

  return createPortal(
    <div style={overlay} onClick={onClose} data-testid={testId}>
      <div style={sheetStyle} onClick={e => e.stopPropagation()} className="animate-slide-up">
        {children}
      </div>
    </div>,
    document.body,
  )
}
