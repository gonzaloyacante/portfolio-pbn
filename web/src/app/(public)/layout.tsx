import type { Metadata } from 'next'
import Footer from '@/components/layout/Footer'
import MaintenanceModeView from '@/components/layout/MaintenanceModeView'
import Navbar from '@/components/layout/Navbar'
import JsonLd from '@/components/seo/JsonLd'
import { getContactSettings } from '@/actions/settings/contact'
import { getSiteSettings, getPageVisibility } from '@/actions/settings/site'

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.paolabolivar.es'

export async function generateMetadata(): Promise<Metadata> {
  const [site, contact] = await Promise.all([getSiteSettings(), getContactSettings()])

  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const location = contact?.location || ''
  const siteName = site?.siteName || ownerName

  const defaultTitle = site?.defaultMetaTitle || `${ownerName} | Maquilladora Profesional`
  const defaultDescription =
    site?.defaultMetaDescription ||
    `Portfolio de ${ownerName} - Maquilladora profesional especializada en audiovisuales, caracterización, efectos especiales y maquillaje social${location ? ` en ${location}` : ''}, España.`

  const locationKeyword = location
    ? `maquilladora ${location.toLowerCase()}`
    : 'maquilladora profesional'
  const favicon = site?.faviconUrl || '/favicon.ico'
  const ogImage = site?.defaultOgImage || undefined

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultTitle,
      template: `%s | ${ownerName}`,
    },
    description: defaultDescription,
    keywords: [
      locationKeyword,
      'maquillaje profesional',
      'caracterización',
      'efectos especiales',
      'maquillaje audiovisual',
      'maquillaje cine',
      'maquillaje teatro',
      ownerName,
    ],
    authors: [{ name: ownerName }],
    creator: ownerName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: SITE_URL,
      siteName,
      title: defaultTitle,
      description: defaultDescription,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: ownerName }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
      ...(ogImage && { images: [ogImage] }),
    },
    robots: {
      index: site?.allowIndexing ?? true,
      follow: site?.allowIndexing ?? true,
      googleBot: {
        index: site?.allowIndexing ?? true,
        follow: site?.allowIndexing ?? true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: '/icons/icon-192x192.png',
    },
    manifest: '/manifest.json',
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [contactSettings, visibility] = await Promise.all([
    getContactSettings(),
    getPageVisibility(),
  ])

  // ── Maintenance mode: show a styled, responsive maintenance card
  if (visibility.maintenanceMode) {
    return (
      <MaintenanceModeView message={visibility.maintenanceMessage} settings={contactSettings} />
    )
  }

  return (
    <>
      {/* SEO: Schema.org Structured Data */}
      <JsonLd
        type="ProfessionalService"
        data={{
          name: contactSettings?.ownerName || 'Paola Bolívar Nievas',
          email: contactSettings?.email || 'contacto@paolamakeup.com',
          telephone: contactSettings?.phone || undefined,
          address: contactSettings?.location ? { addressLocality: contactSettings.location } : {},
        }}
      />

      {/* Navbar brand: custom font + colors via CSS variables */}
      {visibility.navbarBrandFontUrl && (
        <link rel="stylesheet" href={visibility.navbarBrandFontUrl} />
      )}
      {(visibility.navbarBrandFont ||
        visibility.navbarBrandFontSize ||
        visibility.navbarBrandColor ||
        visibility.navbarBrandColorDark) && (
        <style>
          {[
            '.nb-brand{',
            visibility.navbarBrandFont
              ? `font-family:'${visibility.navbarBrandFont.replace(/'/g, '')},sans-serif !important;`
              : '',
            visibility.navbarBrandFontSize
              ? `font-size:${Number(visibility.navbarBrandFontSize)}px !important;`
              : '',
            visibility.navbarBrandColor ? `color:${visibility.navbarBrandColor} !important;` : '',
            '}',
            visibility.navbarBrandColorDark
              ? `.dark .nb-brand{color:${visibility.navbarBrandColorDark} !important;}`
              : '',
          ].join('')}
        </style>
      )}

      <div className="bg-background flex min-h-dvh flex-col transition-colors duration-300">
        {/* Skip navigation link - accesibilidad para lectores de pantalla y teclado */}
        <a
          href="#main-content"
          className="bg-primary text-primary-foreground sr-only absolute top-4 left-4 z-200 rounded px-4 py-2 text-sm font-semibold focus:not-sr-only focus:block focus:ring-2 focus:ring-white focus:outline-none"
        >
          Saltar al contenido principal
        </a>
        <Navbar brandName={contactSettings?.ownerName || 'Paola BN'} visibility={visibility} />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer ownerName={contactSettings?.ownerName} />
      </div>
    </>
  )
}
