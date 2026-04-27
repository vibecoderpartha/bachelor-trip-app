import { type CSSProperties, type ReactNode } from 'react'

interface Props {
  color?: string
  children: ReactNode
  className?: string
}

export function VIPBadge({ color = 'var(--neon-gold)', children, className = '' }: Props) {
  const style: CSSProperties = {
    color,
    borderColor: color,
    boxShadow: `0 0 6px ${color}44`,
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-widest border font-mono uppercase rounded-sm ${className}`}
      style={style}
    >
      {children}
    </span>
  )
}
