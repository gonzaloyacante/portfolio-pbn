import { getActiveServices } from '@/actions/cms/services'
import { getContactSettings } from '@/actions/settings/contact'
import { Metadata } from 'next'
import { FadeIn, StaggerChildren, ScaleIn, OptimizedImage, Button } from '@/components/ui'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import JsonLd from '@/components/seo/JsonLd'
import { ROUTES } from '@/config/routes'

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
  const services = await getActiveServices()
  const contactSettings = await getContactSettings()

  const ownerName = contactSettings?.ownerName || 'Paola Bolívar Nievas'
  const location = contactSettings?.location || ''
  const locationSuffix = location ? ` en ${location}` : ''

  // Generate WhatsApp link
  const whatsappNumber = contactSettings?.whatsapp?.replace(/\D/g, '') || ''
  const whatsappMessage = encodeURIComponent(
    '¡Hola! Me gustaría reservar una cita para un servicio de maquillaje.'
  )
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : null

  return (
    <main className="py-8 md:py-12">
      <JsonLd
        type="ProfessionalService"
        data={{
          name: `${ownerName} - Servicios de Maquillaje`,
          description: `Servicios profesionales de maquillaje${locationSuffix}: bodas, editoriales, caracterización artística y eventos.`,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/servicios`,
          address: {
            addressLocality: location,
            addressCountry: 'ES',
          },
        }}
      />
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <FadeIn className="mb-12 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">Mis Servicios</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Servicios profesionales de maquillaje para cada ocasión. Desde novias hasta producciones
            editoriales, cada look es único y personalizado.
          </p>
        </FadeIn>

        {/* Services Grid */}
        {services.length === 0 ? (
          <FadeIn className="py-20 text-center">
            <p className="text-muted-foreground text-lg">
              Próximamente estarán disponibles nuestros servicios.
            </p>
          </FadeIn>
        ) : (
          <StaggerChildren className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              return (
                <ScaleIn key={service.id}>
                  <article className="border-border bg-card group relative flex h-full flex-col overflow-hidden rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <Link
                      href={`/servicios/${service.slug}`}
                      className="relative block"
                      aria-label={`Ver servicio: ${service.name}`}
                    >
                      {/* Image or Icon Header */}
                      <div className="bg-muted/30 relative flex h-48 items-center justify-center overflow-hidden">
                        {service.imageUrl ? (
                          <OptimizedImage
                            src={service.imageUrl}
                            alt={service.name}
                            width={400}
                            height={300}
                            className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <span className="text-6xl opacity-30">💄</span>
                        )}
                        {service.isFeatured && (
                          <span className="bg-primary text-primary-foreground absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                            ⭐ Destacado
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      <Link href={`/servicios/${service.slug}`}>
                        <h2 className="text-foreground hover:text-primary mb-2 text-xl font-bold transition-colors">
                          {service.name}
                        </h2>
                      </Link>
                      {(service.shortDesc || service.description) && (
                        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm">
                          {service.shortDesc || service.description}
                        </p>
                      )}

                      {/* Price & Duration */}
                      <div className="border-border mb-4 flex flex-wrap items-center gap-4 border-t pt-4">
                        {service.price && (
                          <div className="text-foreground">
                            <span className="text-muted-foreground text-xs uppercase">
                              {service.priceLabel === 'desde'
                                ? 'Desde'
                                : service.priceLabel === 'consultar'
                                  ? 'A consultar'
                                  : 'Precio'}
                            </span>
                            <p className="text-2xl font-bold">
                              {Number(service.price).toFixed(0)}€
                            </p>
                          </div>
                        )}
                        {service.duration && (
                          <div className="text-muted-foreground">
                            <span className="text-muted-foreground text-xs uppercase">
                              Duración
                            </span>
                            <p className="font-medium">{service.duration}</p>
                          </div>
                        )}
                      </div>

                      {/* CTA Buttons */}
                      <div className="mt-auto flex flex-col gap-3">
                        {whatsappLink && (
                          <Button
                            asChild
                            className="w-full rounded-xl py-3 font-semibold hover:shadow-lg"
                          >
                            <Link
                              href={`${whatsappLink}&text=${encodeURIComponent(`¡Hola! Me interesa el servicio de ${service.name}. ¿Podrías darme más información?`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="h-5 w-5" />
                              Reservar por WhatsApp
                            </Link>
                          </Button>
                        )}

                        <Button
                          asChild
                          variant="outline"
                          className="w-full rounded-xl py-3 font-semibold"
                        >
                          <Link href={`/servicios/${service.slug}`}>Ver Detalles & Precios</Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                </ScaleIn>
              )
            })}
          </StaggerChildren>
        )}

        {/* Bottom CTA */}
        {whatsappLink && (
          <FadeIn className="mt-16 text-center">
            <div className="bg-card border-border mx-auto max-w-2xl rounded-3xl border p-8 backdrop-blur-sm">
              <h2 className="text-foreground mb-3 text-2xl font-bold">
                ¿No encuentras lo que buscas?
              </h2>
              <p className="text-muted-foreground mb-6">
                Contáctame para servicios personalizados o paquetes especiales.
              </p>
              <Button
                asChild
                className="rounded-xl bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600 hover:shadow-lg"
              >
                <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Escribirme por WhatsApp
                </Link>
              </Button>
            </div>
          </FadeIn>
        )}
      </div>
    </main>
  )
}
