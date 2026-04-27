import { type CSSProperties, type ReactNode } from 'react'

interface Props {
  color: string
  children: ReactNode
  className?: string
}

export function NeonBorder({ color, children, className = '' }: Props) {
  const style: CSSProperties = { color }
  return (
    <div className={`corner-bracket neon-card ${className}`} style={style}>
      {children}
    </div>
  )
}
