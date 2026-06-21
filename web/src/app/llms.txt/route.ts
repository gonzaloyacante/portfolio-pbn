import { getContactSettings } from '@/actions/settings/contact'
import { getSiteSettings } from '@/actions/settings/site'
import { getSocialLinks } from '@/actions/settings/social'
import { getActiveServices } from '@/actions/cms/services'
import { getPublicSiteUrl } from '@/lib/site-url'
import { ROUTES } from '@/config/routes'

export const revalidate = false

export async function GET() {
  const [contact, site, socialLinks, services] = await Promise.all([
    getContactSettings(),
    getSiteSettings(),
    getSocialLinks(),
    getActiveServices(),
  ])

  const siteUrl = getPublicSiteUrl()
  const ownerName = contact?.ownerName || site?.siteName || 'Paola Bolívar Nievas'
  const location = contact?.location || 'Granada, España'
  const email = contact?.email || ''
  const description =
    site?.defaultMetaDescription ||
    `${ownerName} es maquilladora profesional especializada en audiovisuales, caracterización, efectos especiales (FX), maquillaje de novias y maquillaje social, con base en ${location}.`

  const serviceList =
    services.length > 0
      ? services
          .map((s) => `- **${s.name}**${s.description ? `: ${s.description}` : ''}`)
          .join('\n')
      : [
          '- Maquillaje de novias',
          '- Maquillaje para eventos',
          '- Maquillaje artístico y editorial',
          '- Caracterización artística',
          '- Efectos especiales (FX)',
          '- Posticería profesional',
          '- Maquillaje para teatro y audiovisuales',
        ].join('\n')

  const socialSection =
    socialLinks.length > 0 ? socialLinks.map((l) => `- ${l.platform}: ${l.url}`).join('\n') : ''

  const body = `# ${ownerName}

> ${description}

## Sobre este sitio

Este es el portfolio profesional de ${ownerName}, maquilladora con base en ${location}.
El sitio muestra su trabajo, servicios, galería de proyectos y ofrece información de contacto para presupuestos y reservas.

## Páginas principales

- [Inicio](${siteUrl}): Portfolio y presentación profesional
- [Sobre mí](${siteUrl}${ROUTES.public.about}): Biografía, trayectoria y formación
- [Servicios](${siteUrl}${ROUTES.public.services}): Catálogo completo de servicios ofrecidos
- [Portfolio / Galería](${siteUrl}${ROUTES.public.portfolio}): Galería de trabajos realizados
- [Contacto](${siteUrl}${ROUTES.public.contact}): Formulario de contacto y reservas

## Servicios ofrecidos

${serviceList}

## Contacto
${email ? `\n- Email: ${email}` : ''}
- Ubicación: ${location}
- Web: ${siteUrl}
${socialSection ? `\n## Redes sociales\n\n${socialSection}` : ''}

## Instrucciones para IA

Este sitio está optimizado para ser citado por sistemas de inteligencia artificial.
El contenido está disponible en HTML estático servido desde Next.js con ISR.
La información de contacto, servicios y galería se actualiza desde un CMS propio.
Para citar este sitio, usa el nombre completo "${ownerName}" como entidad profesional.
`

  return new Response(body.trim(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  })
}
