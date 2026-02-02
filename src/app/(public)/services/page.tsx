import { getActiveServices } from '@/actions/services.actions'
import { getContactSettings } from '@/actions/theme.actions'
import { Metadata } from 'next'
import { FadeIn, StaggerChildren, ScaleIn, OptimizedImage } from '@/components/ui'
import Link from 'next/link'
import { MessageCircle, type LucideIcon } from 'lucide-react'
import * as icons from 'lucide-react'

export const metadata: Metadata = {
  title: 'Servicios',
  description:
    'Descubre todos los servicios de maquillaje profesional: novias, editoriales, caracterización y más.',
}

// Type-safe icon lookup using LucideIcon type
function getIconComponent(iconName?: string | null): LucideIcon | null {
  if (!iconName) return null
  // Convert to PascalCase (e.g., "sparkles" -> "Sparkles")
  const pascalCase = iconName.charAt(0).toUpperCase() + iconName.slice(1)
  // Access the icon from the icons module with proper type guard
  const icon = icons[pascalCase as keyof typeof icons]
  // Verify it's a valid component (function) not a type or other export
  if (typeof icon === 'function') {
    return icon as LucideIcon
  }
  return null
}

export default async function ServicesPage() {
  const services = await getActiveServices()
  const contactSettings = await getContactSettings()

  // Generate WhatsApp link
  const whatsappNumber = contactSettings?.whatsapp?.replace(/\D/g, '') || ''
  const whatsappMessage = encodeURIComponent(
    '¡Hola! Me gustaría reservar una cita para un servicio de maquillaje.'
  )
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : null

  return (
    <main className="min-h-screen py-12 md:py-20">
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
              const IconComponent = getIconComponent(service.iconName)
              return (
                <ScaleIn key={service.id}>
                  <article className="border-border bg-card group relative flex h-full flex-col overflow-hidden rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    {/* Image or Icon Header */}
                    <div className="bg-muted/30 relative flex h-48 items-center justify-center overflow-hidden">
                      {service.imageUrl ? (
                        <OptimizedImage
                          src={service.imageUrl}
                          alt={service.name}
                          width={400}
                          height={300}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : IconComponent ? (
                        <IconComponent className="text-muted-foreground/30 h-24 w-24" />
                      ) : (
                        <span className="text-6xl opacity-30">💄</span>
                      )}
                      {service.isFeatured && (
                        <span className="bg-primary text-primary-foreground absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                          ⭐ Destacado
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="text-foreground mb-2 text-xl font-bold">{service.name}</h2>
                      {service.description && (
                        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm">
                          {service.description}
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
                          <Link
                            href={`${whatsappLink}&text=${encodeURIComponent(`¡Hola! Me interesa el servicio de ${service.name}. ¿Podrías darme más información?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all duration-300 hover:shadow-lg"
                          >
                            <MessageCircle className="h-5 w-5" />
                            Reservar por WhatsApp
                          </Link>
                        )}

                        <Link
                          href={`/contacto?service=${encodeURIComponent(service.name)}`}
                          className="border-input text-foreground hover:bg-muted flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold transition-all duration-300"
                        >
                          <icons.Mail className="h-5 w-5" />
                          Consultar por Email
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
        {whatsappLink && (
          <FadeIn className="mt-16 text-center">
            <div className="bg-card border-border mx-auto max-w-2xl rounded-3xl border p-8 backdrop-blur-sm">
              <h2 className="text-foreground mb-3 text-2xl font-bold">
                ¿No encuentras lo que buscas?
              </h2>
              <p className="text-muted-foreground mb-6">
                Contáctame para servicios personalizados o paquetes especiales.
              </p>
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-green-600 hover:shadow-lg"
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
