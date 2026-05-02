interface Props {
  name: string
  color: string
  size?: number
  fontSize?: number
}

export function Avatar({ name, color, size = 32, fontSize }: Props) {
  const fs = fontSize ?? Math.round(size * 0.42)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `${color}22`,
        border: `1px solid ${color}66`,
        color,
        fontSize: fs,
        fontFamily: 'var(--font-ui)',
        fontWeight: 600,
        flexShrink: 0,
        lineHeight: 1,
        letterSpacing: 0,
      }}
    >
      {name[0].toUpperCase()}
    </span>
  )
}
