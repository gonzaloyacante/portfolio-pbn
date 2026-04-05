import type { Viewport } from 'next'
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
import FontLoader from '@/components/layout/FontLoader'

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
        {/* Preload fuente decorativa crítica para reducir FOUT */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="https://fonts.gstatic.com/s/greatvibes/v19/RWmMoKWR9v4ksMfaWd_JN-XCg6UKDXlCbA.woff2"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />
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
