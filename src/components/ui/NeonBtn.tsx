import { type CSSProperties, type ReactNode, type ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string
  children: ReactNode
  variant?: 'solid' | 'outline'
}

export function NeonBtn({ color = 'var(--neon-pink)', children, variant = 'solid', className = '', style: externalStyle, ...rest }: Props) {
  const base: CSSProperties = variant === 'solid'
    ? {
        background: `${color}22`,
        border: `1px solid ${color}`,
        color,
        boxShadow: `0 0 12px ${color}44`,
      }
    : {
        background: 'transparent',
        border: `1px solid ${color}66`,
        color,
      }

  return (
    <button
      className={`px-4 py-2 text-sm tracking-widest uppercase font-ui transition-all duration-200 hover:brightness-125 active:scale-95 rounded-sm ${className}`}
      style={{ fontFamily: 'var(--font-ui)', ...base, ...externalStyle }}
      {...rest}
    >
      {children}
    </button>
  )
}
