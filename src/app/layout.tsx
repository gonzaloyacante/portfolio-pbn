import type { Metadata, Viewport } from 'next'
import { Great_Vibes, Open_Sans, Poppins } from 'next/font/google'
import '@/styles/globals.css'
import AppProviders from '@/components/providers/AppProviders'
import { NavigationProgress } from '@/components/layout/NavigationProgress'
import { ErrorBoundary } from '@/components/ui'
import CookieConsent from '@/components/legal/CookieConsent'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { getThemeValues } from '@/actions/theme.actions'

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
    { media: '(prefers-color-scheme: light)', color: '#fff1f9' },
    { media: '(prefers-color-scheme: dark)', color: '#6c0a0a' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Paola Bolívar Nievas | Maquilladora Profesional',
    template: '%s | Paola Bolívar Nievas',
  },
  description:
    'Portfolio de Paola Bolívar Nievas - Maquilladora profesional especializada en audiovisuales, caracterización, efectos especiales y maquillaje social en Málaga, España.',
  keywords: [
    'maquilladora málaga',
    'maquillaje profesional',
    'caracterización',
    'efectos especiales',
    'maquillaje audiovisual',
    'maquillaje cine',
    'maquillaje teatro',
    'Paola Bolívar Nievas',
  ],
  authors: [{ name: 'Paola Bolívar Nievas' }],
  creator: 'Paola Bolívar Nievas',
  publisher: 'Portfolio PBN',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: SITE_URL,
    siteName: 'Portfolio Paola Bolívar Nievas',
    title: 'Paola Bolívar Nievas | Maquilladora Profesional',
    description:
      'Maquilladora profesional especializada en audiovisuales, caracterización y efectos especiales. Descubre mi portfolio de trabajos.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Portfolio Paola Bolívar Nievas - Maquilladora Profesional',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paola Bolívar Nievas | Maquilladora Profesional',
    description: 'Portfolio de maquillaje profesional - Caracterización, efectos especiales y más.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  manifest: '/manifest.json',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const themeValues = await getThemeValues()

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${headingFont.variable} ${scriptFont.variable} ${bodyFont.variable} antialiased`}
      >
        <NavigationProgress />
        <ErrorBoundary>
          <AppProviders themeValues={themeValues}>
            {children}
            <CookieConsent />
          </AppProviders>
        </ErrorBoundary>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
