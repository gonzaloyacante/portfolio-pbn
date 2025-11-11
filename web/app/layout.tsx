import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { DesignProvider } from "@/components/utils/design-provider"
import { SkipToContent } from "@/components/utils/skip-to-content"
import { QueryProvider } from "@/lib/query-provider"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const greatVibes = Great_Vibes({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Paola Bolívar Nievas - Maquilladora Profesional | Portfolio",
    template: "%s | Paola Bolívar Nievas"
  },
  description: "Portfolio profesional de Paola Bolívar Nievas, maquilladora especializada en audiovisuales, cine, televisión y eventos. Más de 5 años de experiencia transformando rostros y creando looks únicos en Granada, España.",
  keywords: ["maquilladora", "maquilladora profesional", "makeup artist", "Granada", "España", "audiovisuales", "cine", "televisión", "eventos", "bodas", "portfolio", "Paola Bolívar Nievas"],
  authors: [{ name: "Paola Bolívar Nievas" }],
  creator: "Paola Bolívar Nievas",
  publisher: "Paola Bolívar Nievas",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://paolabolivar.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    siteName: 'Paola Bolívar Nievas - Maquilladora Profesional',
    title: 'Paola Bolívar Nievas - Maquilladora Profesional',
    description: 'Portfolio profesional de Paola Bolívar Nievas, maquilladora especializada en audiovisuales, cine, televisión y eventos. Más de 5 años de experiencia.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Paola Bolívar Nievas - Maquilladora Profesional',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paola Bolívar Nievas - Maquilladora Profesional',
    description: 'Portfolio profesional de Paola Bolívar Nievas, maquilladora especializada en audiovisuales, cine, televisión y eventos.',
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
  verification: {
    google: 'google-site-verification-code',
    // Agregar otros códigos de verificación si es necesario
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} ${greatVibes.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <SkipToContent />
        <QueryProvider>
          <DesignProvider>
            {children}
          </DesignProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
