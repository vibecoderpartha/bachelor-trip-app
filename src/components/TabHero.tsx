import { type CSSProperties } from 'react'
import { TAB_ASSETS, type TabId } from '../constants/tabAssets'
import { type User } from '../constants/users'

interface Props {
  tab: TabId
  user?: User
  height?: number
}

export function TabHero({ tab, user, height: _height = 220 }: Props) {
  const asset = TAB_ASSETS[tab]
  const imageSrc = user?.image ?? asset.image
  const tagline = (tab === 'trip' && user?.vibe) ? user.vibe : asset.tagline

  const wrapStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    isolation: 'isolate',
  }

  const imgStyle: CSSProperties = {
    display: 'block',
    width: '100%',
    height: 'auto',
    filter: 'saturate(0.92) contrast(1.02)',
  }

  const gradStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  }

  return (
    <div style={wrapStyle} data-testid={`tab-hero-${tab}`}>
      <img src={imageSrc} alt="" style={imgStyle} loading="eager" />
      <div className="hero-fade" style={gradStyle} />
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 18,
          color: 'var(--text-primary)',
        }}
      >
        <p
          className="serif-eyebrow"
          style={{
            fontSize: 13,
            color: asset.accent,
            marginBottom: 4,
            opacity: 0.95,
          }}
        >
          {asset.eyebrow}
        </p>
        <p
          className="serif-display"
          style={{
            fontSize: 26,
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            fontWeight: 400,
            maxWidth: 360,
          }}
        >
          {tagline}
        </p>
      </div>
    </div>
  )
}
