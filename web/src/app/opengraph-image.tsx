import { ImageResponse } from 'next/og'
import { getSiteSettings } from '@/actions/settings/site'
import { getContactSettings } from '@/actions/settings/contact'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const [site, contact] = await Promise.all([getSiteSettings(), getContactSettings()])

  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const tagline = site?.siteTagline || 'Maquilladora Profesional'
  const location = contact?.location || ''
  const specialty = `Caracterización · Efectos Especiales · Audiovisual${location ? ` · ${location}` : ''}`

  return new ImageResponse(
    (
      <div
        style={{
          background: '#fff8fc',
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
            background: '#6c0a0a',
            borderRadius: 3,
            marginBottom: 16,
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#6c0a0a',
            letterSpacing: '-1px',
            textAlign: 'center',
          }}
        >
          {ownerName}
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#1a050a',
            textAlign: 'center',
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            fontSize: 22,
            color: '#737373',
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
            background: '#6c0a0a',
            borderRadius: 2,
            opacity: 0.4,
          }}
        />
      </div>
    ),
    size,
  )
}
