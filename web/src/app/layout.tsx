import type { Metadata, Viewport } from 'next'
import '@/lib/env' // ✅ Validate environment variables on server startup
import { Suspense } from 'react'
import { Great_Vibes, Open_Sans, Poppins } from 'next/font/google'
import '@/styles/globals.css'
import AppProviders from '@/components/providers/AppProviders'
import { NavigationProgress } from '@/components/layout'
import { ErrorBoundary } from '@/components/ui'
import CookieConsent from '@/components/legal/CookieConsent'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { getThemeValues, getThemeSettings } from '@/actions/settings/theme'
import { getSiteSettings } from '@/actions/settings/site'
import { getContactSettings } from '@/actions/settings/contact'
import FontLoader from '@/components/layout/FontLoader'

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.paolabolivar.es'

// Script font para "Make-up", firmas y detalles elegantes
// Alternativa a Amsterdam Four (Canva)
const scriptFont = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
})

// Heading font para títulos y navegación
// Alternativa a Aileron (Canva) - Geometric sans-serif
const headingFont = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

// Body font para textos generales
const bodyFont = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    // eslint-disable-next-line no-restricted-syntax -- browser meta tag requires HEX directly
    { media: '(prefers-color-scheme: light)', color: '#fff1f9' },
    // eslint-disable-next-line no-restricted-syntax -- browser meta tag requires HEX directly
    { media: '(prefers-color-scheme: dark)', color: '#6c0a0a' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
}

export async function generateMetadata(): Promise<Metadata> {
  const [site, contact] = await Promise.all([getSiteSettings(), getContactSettings()])

  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const location = contact?.location || ''
  const siteName = site?.siteName || ownerName

  const defaultTitle = site?.defaultMetaTitle || `${ownerName} | Maquilladora Profesional`
  const defaultDescription =
    site?.defaultMetaDescription ||
    `Portfolio de ${ownerName} - Maquilladora profesional especializada en audiovisuales, caracterización, efectos especiales y maquillaje social${location ? ` en ${location}` : ''}, España.`

  const locationKeyword = location ? `maquilladora ${location.toLowerCase()}` : 'maquilladora profesional'
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [themeValues, settings] = await Promise.all([getThemeValues(), getThemeSettings()])

  // Extract font URLs from settings
  const fonts = {
    headingUrl: settings?.headingFontUrl,
    bodyUrl: settings?.bodyFontUrl,
    scriptUrl: settings?.scriptFontUrl,
    brandUrl: settings?.brandFontUrl,
    portfolioUrl: settings?.portfolioFontUrl,
    signatureUrl: settings?.signatureFontUrl,
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${headingFont.variable} ${scriptFont.variable} ${bodyFont.variable} antialiased`}
      >
        <FontLoader fonts={fonts} />
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <ErrorBoundary>
          <AppProviders themeValues={themeValues}>
            {children}
            <CookieConsent />
          </AppProviders>
        </ErrorBoundary>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  )
}
