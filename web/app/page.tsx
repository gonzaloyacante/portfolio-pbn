import type { Metadata } from 'next'
import HomeClient from './HomeClient'
import { getSiteUrl } from '@/lib/site'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Portfolio - Inicio',
  description: 'Explora proyectos por categorías y una galería destacada de trabajos.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Portfolio - Inicio',
    description: 'Explora proyectos por categorías y una galería destacada de trabajos.',
    url: `${siteUrl}/`,
    siteName: 'Portfolio PBN',
    type: 'website',
  },
}

export default function Page() {
  return <HomeClient />
}