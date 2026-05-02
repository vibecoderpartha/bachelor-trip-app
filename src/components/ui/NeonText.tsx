import { type ReactNode } from 'react'

interface Props {
  color?: string
  children: ReactNode
  className?: string
  pulse?: boolean
}

/** Kept as a thin wrapper for back-compat — no glow in the new design. */
export function NeonText({ color, children, className = '' }: Props) {
  return <span className={className} style={{ color }}>{children}</span>
}
