import { type CSSProperties, type ReactNode } from 'react'

interface Props {
  color?: string
  children: ReactNode
  className?: string
}

export function VIPBadge({ color = 'var(--accent)', children, className = '' }: Props) {
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 8px',
    fontSize: 10,
    fontFamily: 'var(--font-ui)',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color,
    border: `1px solid ${color}55`,
    background: 'transparent',
    borderRadius: 999,
  }
  return <span className={className} style={style}>{children}</span>
}
