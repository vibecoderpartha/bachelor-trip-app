import { type CSSProperties } from 'react'
import { TAB_ASSETS, type TabId } from '../constants/tabAssets'

interface Props {
  tab: TabId
  height?: number
}

/**
 * Editorial-style hero image at the top of each tab.
 * Image bleeds to edges with a soft gradient fade to bg.
 * Eyebrow + tagline overlay bottom-left.
 */
export function TabHero({ tab, height = 220 }: Props) {
  const asset = TAB_ASSETS[tab]

  const wrapStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height,
    overflow: 'hidden',
    isolation: 'isolate',
  }

  const imgStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 30%',
    filter: 'saturate(0.92) contrast(1.02)',
  }

  const gradStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  }

  return (
    <div style={wrapStyle} data-testid={`tab-hero-${tab}`}>
      <img src={asset.image} alt="" style={imgStyle} loading="eager" />
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
          {asset.tagline}
        </p>
      </div>
    </div>
  )
}
