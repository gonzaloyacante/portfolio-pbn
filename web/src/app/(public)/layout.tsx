import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import JsonLd from '@/components/seo/JsonLd'
import PageTransitionWrapper from '@/components/layout/PageTransitionWrapper'
import PublicTestimonialsSection from '@/components/features/testimonials/PublicTestimonialsSection'
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
      <div
        className="bg-background text-foreground flex min-h-screen items-center justify-center p-4"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="bg-card w-full max-w-2xl rounded-2xl p-6 shadow-lg sm:p-10">
          <div className="flex flex-col items-start gap-4">
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">Sitio en mantenimiento</h1>
            <p className="text-muted-foreground max-w-xl text-base">
              {visibility.maintenanceMessage ||
                'Estamos realizando mejoras para mejorar la experiencia. Volvemos pronto.'}
            </p>

            <div className="mt-4 w-full">
              <div className="border-border bg-background/30 rounded-md border p-4">
                <p className="text-muted-foreground text-sm">
                  Si necesitas contactarnos, escribe a{' '}
                  <a href="mailto:contacto@paolabolivar.es" className="text-primary underline">
                    contacto@paolabolivar.es
                  </a>
                  .
                </p>
              </div>
            </div>

            <p className="text-muted-foreground mt-2 text-xs">
              Sitio temporalmente deshabilitado para mantenimiento.
            </p>
          </div>
        </div>
      </div>
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

      <div className="bg-background flex min-h-screen flex-col transition-colors duration-300">
        {/* Skip navigation link - accesibilidad para lectores de pantalla y teclado */}
        <a
          href="#main-content"
          className="bg-primary text-background sr-only absolute top-4 left-4 z-100 rounded px-4 py-2 text-sm font-semibold focus:not-sr-only focus:block"
        >
          Saltar al contenido principal
        </a>
        <Navbar brandName={contactSettings?.ownerName || 'Paola BN'} visibility={visibility} />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
        </main>
        <PublicTestimonialsSection />
      </div>
    </>
  )
}
