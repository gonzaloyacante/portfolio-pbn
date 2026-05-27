import { getActiveServices } from '@/actions/cms/services'
import { getContactSettings } from '@/actions/settings/contact'
import { getServicesPageSettings } from '@/actions/settings/services-page'
import { Metadata } from 'next'
import { FadeIn, StaggerChildren, ScaleIn, OptimizedImage } from '@/components/ui'
import { ServicesPublicHero } from '@/components/features/services/ServicesPublicHero'
import Link from 'next/link'
import { MessageCircle, Palette, Star } from 'lucide-react'
import JsonLd from '@/components/seo/JsonLd'
import { ROUTES } from '@/config/routes'
import { getPublicSiteUrl } from '@/lib/site-url'

/** Cache público — invalidación explícita desde CMS. */
export const revalidate = false

function whatsappHref(phoneDigits: string, message: string): string {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`
}

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContactSettings()
  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const location = contact?.location || ''
  const locationSuffix = location ? ` en ${location}` : ''

  return {
    title: 'Servicios',
    description: `Descubre todos los servicios de maquillaje profesional de ${ownerName}${locationSuffix}: novias, editoriales, caracterización y más.`,
    alternates: {
      canonical: ROUTES.public.services,
    },
    openGraph: {
      title: `Servicios de Maquillaje | ${ownerName}`,
      description: `Maquillaje profesional${locationSuffix}: novias, editoriales, caracterización artística y eventos. Reserva tu cita.`,
      type: 'website',
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary',
      title: `Servicios | ${ownerName}`,
      description: `Maquillaje profesional${locationSuffix}: novias, editoriales, caracterización y eventos.`,
    },
  }
}

export default async function ServicesPage() {
  const [services, contactSettings, servicesPageSettings] = await Promise.all([
    getActiveServices(),
    getContactSettings(),
    getServicesPageSettings(),
  ])

  const ownerName = contactSettings?.ownerName || 'Paola Bolívar Nievas'
  const location = contactSettings?.location || ''
  const locationSuffix = location ? ` en ${location}` : ''

  // Generate WhatsApp link
  const whatsappNumber = contactSettings?.whatsapp?.replace(/\D/g, '') || ''
  const whatsappIntro = whatsappNumber
    ? whatsappHref(
        whatsappNumber,
        '¡Hola! Me gustaría reservar una cita para un servicio de maquillaje.'
      )
    : null

  return (
    <main className="public-services-page py-8 transition-colors duration-500 md:py-12">
      <JsonLd
        type="ProfessionalService"
        data={{
          name: `${ownerName} - Servicios de Maquillaje`,
          description: `Servicios profesionales de maquillaje${locationSuffix}: bodas, editoriales, caracterización artística y eventos.`,
          url: `${getPublicSiteUrl()}${ROUTES.public.services}`,
          address: {
            addressLocality: location,
            addressCountry: 'ES',
          },
        }}
      />
      <div className="container mx-auto max-w-6xl px-4">
        <ServicesPublicHero settings={servicesPageSettings} />

        {/* Services Grid */}
        {services.length === 0 ? (
          <FadeIn className="py-20 text-center">
            <p className="public-services-muted text-lg">
              Próximamente estarán disponibles nuestros servicios.
            </p>
          </FadeIn>
        ) : (
          <StaggerChildren className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              return (
                <ScaleIn key={service.id}>
                  <article className="public-services-card group relative flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <Link
                      href={ROUTES.public.serviceDetail(service.slug)}
                      className="relative block"
                      aria-label={`Ver servicio: ${service.name}`}
                    >
                      {/* Image or Icon Header */}
                      <div className="public-services-surface relative flex h-48 items-center justify-center overflow-hidden">
                        {service.imageUrl ? (
                          <OptimizedImage
                            src={service.imageUrl}
                            alt={service.name}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="relative z-0 h-full w-full"
                            imgClassName="h-full w-full object-center transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <Palette
                            className="public-services-muted size-16 opacity-40"
                            aria-hidden
                          />
                        )}
                        {service.isFeatured && (
                          <span className="public-services-badge absolute top-4 right-4 z-10 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                            <Star className="size-3.5 shrink-0 fill-current" aria-hidden />
                            Destacado
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      <Link href={ROUTES.public.serviceDetail(service.slug)}>
                        <h2 className="public-services-title mb-2 text-xl font-bold transition-colors">
                          {service.name}
                        </h2>
                      </Link>
                      {(service.shortDesc || service.description) && (
                        <p className="public-services-muted mb-4 line-clamp-3 flex-1 text-sm">
                          {service.shortDesc || service.description}
                        </p>
                      )}

                      {/* Price & Duration */}
                      <div className="public-services-surface-border mb-4 flex flex-wrap items-start gap-4 border-t pt-4">
                        {service.price && (
                          <div className="public-services-text">
                            <span className="public-services-muted text-xs uppercase">
                              {service.priceLabel === 'desde'
                                ? 'Desde'
                                : service.priceLabel === 'consultar'
                                  ? 'A consultar'
                                  : 'Precio'}
                            </span>
                            <p className="text-2xl leading-none font-bold">
                              {Number(service.price).toFixed(0)}€
                            </p>
                          </div>
                        )}
                        {service.duration && (
                          <div className="public-services-muted">
                            <span className="public-services-muted text-xs uppercase">
                              Duración
                            </span>
                            <p className="font-medium">{service.duration}</p>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="mt-auto flex flex-col gap-3">
                        <Link
                          href={ROUTES.public.serviceDetail(service.slug)}
                          className="public-services-secondary-button inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                        >
                          Ver detalles y precios
                        </Link>
                      </div>
                    </div>
                  </article>
                </ScaleIn>
              )
            })}
          </StaggerChildren>
        )}

        {/* Bottom CTA */}
        {whatsappIntro && (
          <FadeIn className="mt-16 text-center">
            <div className="public-services-card mx-auto max-w-2xl rounded-3xl border p-8">
              <h2 className="public-services-title mb-3 text-2xl font-bold">
                ¿No encuentras lo que buscas?
              </h2>
              <p className="public-services-muted mb-6">
                Contáctame para servicios personalizados o paquetes especiales.
              </p>
              <Link
                href={whatsappIntro}
                target="_blank"
                rel="noopener noreferrer"
                className="public-services-primary-button inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-sm transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-5 w-5" />
                Escribirme por WhatsApp
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
    </main>
  )
}
