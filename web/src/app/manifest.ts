import type { MetadataRoute } from 'next'
import { getThemeSettings } from '@/actions/settings/theme'
import { BRAND } from '@/lib/design-tokens'

export const revalidate = 3600 // 1 hour

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const theme = await getThemeSettings()

  const themeColor = theme?.primaryColor || BRAND.primary
  const backgroundColor = theme?.backgroundColor || BRAND.background

  return {
    name: 'Portfolio Paola Bolívar',
    short_name: 'PBN Portfolio',
    description: 'Portfolio profesional de maquillaje artístico y belleza - Paola Bolívar Nievas',
    theme_color: themeColor,
    background_color: backgroundColor,
    display: 'browser',
    orientation: 'portrait',
    scope: '/',
    start_url: '/',
    categories: ['beauty', 'lifestyle', 'art'],
    icons: [
      { src: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
      { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcuts: [
      {
        name: 'Ver Portfolio',
        short_name: 'Portfolio',
        description: 'Ver galería de trabajos de maquillaje',
        url: '/portfolio',
        icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'Contacto',
        short_name: 'Contacto',
        description: 'Enviar mensaje de consulta',
        url: '/contacto',
        icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
      },
    ],
  }
}
