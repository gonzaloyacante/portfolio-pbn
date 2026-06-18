import { ImageResponse } from 'next/og'
import { getHomeSettings } from '@/actions/settings/home'
import { getSiteSettings } from '@/actions/settings/site'
import { getContactSettings } from '@/actions/settings/contact'
import { getThemeSettings } from '@/actions/settings/theme'
import { BRAND } from '@/lib/design-tokens'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const [site, contact, theme, home] = await Promise.all([
    getSiteSettings(),
    getContactSettings(),
    getThemeSettings(),
    getHomeSettings(),
  ])

  // Satori (ImageResponse) does not support CSS variables — use raw hex from DB with brand fallbacks.
  const OG_BACKGROUND = theme?.backgroundColor || BRAND.background
  const OG_PRIMARY = theme?.primaryColor || BRAND.primary
  const OG_FOREGROUND = theme?.textColor || BRAND.foreground

  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const tagline = site?.siteTagline || 'Maquilladora Profesional'
  const location = contact?.location || ''
  const specialty = `Caracterización · Efectos Especiales · Audiovisual${location ? ` · ${location}` : ''}`

  // Hero photo from CMS — Cloudinary URL already stored; request w_1200 variant.
  const rawHeroUrl = home?.heroMainImageUrl
  const heroImageUrl = rawHeroUrl?.includes('res.cloudinary.com')
    ? rawHeroUrl.replace('/upload/', '/upload/c_fill,w_1200,h_630,q_auto,f_jpg/')
    : rawHeroUrl

  return new ImageResponse(
    <div
      style={{
        background: OG_BACKGROUND,
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hero photo background — only rendered when CMS has one */}
      {heroImageUrl ? (
        <img
          src={heroImageUrl}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : null}

      {/* Scrim — darkens photo for legibility; also used as plain background when no photo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: heroImageUrl
            ? 'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 100%)'
            : OG_BACKGROUND,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
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
            color: heroImageUrl ? '#ffffff' : OG_PRIMARY,
            letterSpacing: '-1px',
            textAlign: 'center',
          }}
        >
          {ownerName}
        </div>
        <div
          style={{
            fontSize: 32,
            color: heroImageUrl ? 'rgba(255,255,255,0.92)' : OG_FOREGROUND,
            textAlign: 'center',
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            fontSize: 22,
            color: heroImageUrl ? 'rgba(255,255,255,0.70)' : '#737373',
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
      </div>
    </div>,
    size
  )
}
