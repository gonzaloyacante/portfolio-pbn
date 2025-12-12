import type { Metadata } from 'next'
import { Open_Sans, Pacifico, Raleway } from 'next/font/google'
import '@/styles/globals.css'
import ThemeProvider from '@/components/layout/ThemeProvider'
import { NavigationProgress } from '@/components/layout/NavigationProgress'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import CookieConsent from '@/components/legal/CookieConsent'
import { getSiteConfig } from '@/actions/settings.actions'

// Script font (alternativa a Amsterdam Four) - Para "Make-up" y "Paola Bolívar Nievas"
const scriptFont = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
})

// Primary font (alternativa a Aileron) - Para "Portfolio", NavLinks, Títulos categorías
const primaryFont = Raleway({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
})

// Body font - Para texto de "Sobre mí" y cuerpo general
const bodyFont = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Portfolio PBN | Makeup Artist Profesional',
    template: '%s | Portfolio PBN',
  },
  description:
    'Portfolio profesional de maquillaje artístico. Explora nuestros trabajos y proyectos de maquillaje para eventos, novias, sesiones fotográficas y más.',
  keywords: ['maquillaje', 'makeup artist', 'portfolio', 'belleza', 'eventos', 'novias'],
  authors: [{ name: 'Portfolio PBN' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    title: 'Portfolio PBN | Makeup Artist Profesional',
    description: 'Portfolio profesional de maquillaje artístico',
    siteName: 'Portfolio PBN',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteConfig = await getSiteConfig()

  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6c0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Portfolio PBN" />
      </head>
      <body
        className={`${primaryFont.variable} ${scriptFont.variable} ${bodyFont.variable} antialiased`}
      >
        <NavigationProgress />
        <ErrorBoundary>
          <ThemeProvider initialConfig={siteConfig}>
            {children}
            <CookieConsent />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
