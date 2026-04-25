import { ImageResponse } from 'next/og'
import { getSiteSettings } from '@/actions/settings/site'
import { getContactSettings } from '@/actions/settings/contact'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// OG image color palette — Satori (ImageResponse) does not support CSS variables,
// so raw hex values must be defined as typed constants here.
const OG_BACKGROUND = '#fff8fc'
const OG_PRIMARY = '#6c0a0a'
const OG_FOREGROUND = '#1a050a'
const OG_MUTED = '#737373'

export default async function Image() {
  const [site, contact] = await Promise.all([getSiteSettings(), getContactSettings()])

  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const tagline = site?.siteTagline || 'Maquilladora Profesional'
  const location = contact?.location || ''
  const specialty = `Caracterización · Efectos Especiales · Audiovisual${location ? ` · ${location}` : ''}`

  return new ImageResponse(
    <div
      style={{
        background: OG_BACKGROUND,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: '64px',
      }}
    >
      {/* Decorative bar */}
      <div
        style={{
          width: 80,
          height: 6,
          background: OG_PRIMARY,
          borderRadius: 3,
          marginBottom: 16,
        }}
      />
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: OG_PRIMARY,
          letterSpacing: '-1px',
          textAlign: 'center',
        }}
      >
        {ownerName}
      </div>
      <div
        style={{
          fontSize: 32,
          color: OG_FOREGROUND,
          textAlign: 'center',
        }}
      >
        {tagline}
      </div>
      <div
        style={{
          fontSize: 22,
          color: OG_MUTED,
          textAlign: 'center',
        }}
      >
        {specialty}
      </div>
      {/* Bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 64,
          width: 120,
          height: 4,
          background: OG_PRIMARY,
          borderRadius: 2,
          opacity: 0.4,
        }}
      />
    </div>,
    size
  )
}
