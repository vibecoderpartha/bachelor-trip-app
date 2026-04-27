import { type CSSProperties, type InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  color?: string
}

export function NeonInput({ color = 'var(--neon-cyan)', className = '', style: externalStyle, ...rest }: Props) {
  const style: CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${color}44`,
    color: '#fff',
    fontFamily: 'var(--font-mono)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  return (
    <input
      className={`px-3 py-2 rounded-sm w-full text-sm focus:border-opacity-100 ${className}`}
      style={{ ...style, ...externalStyle }}
      onFocus={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 8px ${color}44` }}
      onBlur={e =>  { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.boxShadow = 'none' }}
      {...rest}
    />
  )
}
