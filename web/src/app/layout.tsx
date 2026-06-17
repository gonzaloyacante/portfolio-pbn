import type { Metadata, Viewport } from 'next'
import '@/lib/env' // ✅ Validate environment variables on server startup
import { Suspense } from 'react'
import { Great_Vibes, Open_Sans, Poppins } from 'next/font/google'
import '@/styles/globals.css'
import AppProviders from '@/components/providers/AppProviders'
import { NavigationProgress } from '@/components/layout'
import { ErrorBoundary } from '@/components/ui'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { getThemeValues, getThemeSettings } from '@/actions/settings/theme'
import { getPublicColorOverrides } from '@/actions/settings/public-colors'
import FontLoader from '@/components/layout/FontLoader'
import { BRAND } from '@/lib/design-tokens'
import { buildThemeInlineStylesheet, buildPublicColorInlineStylesheet } from '@/lib/theme-ssr-css'
import { getPublicSiteUrl } from '@/lib/site-url'

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

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  /* theme-color: solo <meta> en <head> (BD + BRAND) — evita duplicar con viewport export */
}

export const metadata: Metadata = {
  metadataBase: new URL(getPublicSiteUrl()),
  ...(googleSiteVerification ? { verification: { google: googleSiteVerification } } : {}),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [themeValues, settings, publicColorOverrides] = await Promise.all([
    getThemeValues(),
    getThemeSettings(),
    getPublicColorOverrides(),
  ])
  const themeInlineCss = buildThemeInlineStylesheet(themeValues)
  const publicColorsCss = buildPublicColorInlineStylesheet(publicColorOverrides)

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
        <link rel="preconnect" href="https://res.cloudinary.com" />
        {/* theme-color único: valores desde BD o BRAND (design-tokens) */}
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content={settings?.accentColor ?? BRAND.accent}
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content={settings?.darkPrimaryColor ?? BRAND.darkPrimary}
        />
        {/* Sin @layer: el bundle globals está en @layer base; este bloque gana en cascada. */}
        <style id="pbn-db-theme" dangerouslySetInnerHTML={{ __html: themeInlineCss }} />
        {publicColorsCss && (
          <style id="pbn-public-colors" dangerouslySetInnerHTML={{ __html: publicColorsCss }} />
        )}
      </head>
      <body
        className={`${headingFont.variable} ${scriptFont.variable} ${bodyFont.variable} antialiased`}
      >
        <FontLoader fonts={fonts} />
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <ErrorBoundary>
          <AppProviders>{children}</AppProviders>
        </ErrorBoundary>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  )
}
