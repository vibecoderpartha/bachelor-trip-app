import { type CSSProperties, type ReactNode } from 'react'

interface Props {
  color: string
  children: ReactNode
  className?: string
  pulse?: boolean
}

export function NeonText({ color, children, className = '', pulse = false }: Props) {
  const style: CSSProperties = {
    color,
    textShadow: `0 0 8px ${color}, 0 0 20px ${color}66`,
    animation: pulse ? 'neonPulse 2s ease-in-out infinite' : undefined,
  }
  return (
    <span className={className} style={style}>
      {children}
    </span>
  )
}
