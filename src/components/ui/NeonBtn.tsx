import { type CSSProperties, type ReactNode, type ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string
  children: ReactNode
  variant?: 'solid' | 'outline' | 'ghost'
}

export function NeonBtn({
  color = 'var(--accent)',
  children,
  variant = 'solid',
  className = '',
  style: externalStyle,
  ...rest
}: Props) {
  const base: CSSProperties = (() => {
    if (variant === 'solid')   return { background: color, border: `1px solid ${color}`, color: '#1A0A03' }
    if (variant === 'outline') return { background: 'transparent', border: `1px solid ${color}55`, color }
    return { background: 'rgba(245,241,235,0.04)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
  })()

  return (
    <button
      className={`px-4 py-2.5 text-sm font-ui transition-all duration-200 hover:brightness-110 active:scale-[0.985] rounded-full ${className}`}
      style={{
        fontWeight: 500,
        letterSpacing: 0.2,
        ...base,
        ...externalStyle,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
