import { type CSSProperties, type InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  color?: string
}

export function NeonInput({ color = 'var(--accent)', className = '', style: externalStyle, ...rest }: Props) {
  const base: CSSProperties = {
    background: 'rgba(245,241,235,0.035)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-ui)',
    outline: 'none',
    transition: 'border-color 0.2s, background-color 0.2s',
    fontSize: 14,
  }

  return (
    <input
      className={`px-3.5 py-2.5 rounded-md w-full ${className}`}
      style={{ ...base, ...externalStyle }}
      onFocus={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = 'rgba(245,241,235,0.06)' }}
      onBlur={e =>  { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(245,241,235,0.035)' }}
      {...rest}
    />
  )
}
