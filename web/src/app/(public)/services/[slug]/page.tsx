import { getServiceBySlug, getServices } from '@/actions/cms/services'
import { getContactSettings } from '@/actions/settings/contact'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { Check, Clock, Calendar, AlertCircle } from 'lucide-react'
import { Metadata } from 'next'
import JsonLd from '@/components/seo/JsonLd'

export const revalidate = 0

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((s: { slug: string }) => ({ slug: s.slug }))
}

interface PricingTier {
  name: string
  price: number
  features?: string[]
}

interface ServicePageProps {
  params: {
    slug: string
  }
}

// ── Metadata Helpers ───────────────────────────────────────────────────────

type ServiceForMetadata = {
  name: string
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords?: string[] | null
  shortDesc?: string | null
  description?: string | null
  imageUrl?: string | null
}

function _resolveServiceMeta(service: ServiceForMetadata, slug: string) {
  const title = service.metaTitle || `${service.name} - Servicios`
  const description =
    service.metaDescription || service.shortDesc || service.description?.slice(0, 160) || ''
  const images = service.imageUrl
    ? [{ url: service.imageUrl, width: 1200, height: 630, alt: service.name }]
    : ([] as { url: string; width: number; height: number; alt: string }[])
  return { title, description, images, canonicalUrl: `/servicios/${slug}` }
}

function buildServiceMetadata(service: ServiceForMetadata, slug: string): Metadata {
  const meta = _resolveServiceMeta(service, slug)
  return {
    title: meta.title,
    description: meta.description,
    keywords: service.metaKeywords,
    alternates: { canonical: meta.canonicalUrl },
    openGraph: {
      title: service.metaTitle || service.name,
      description: meta.description,
      type: 'website',
      locale: 'es_ES',
      images: meta.images,
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle || service.name,
      description: meta.description,
      images: service.imageUrl ? [service.imageUrl] : [],
    },
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) return { title: 'Servicio no encontrado' }

  return buildServiceMetadata(service, slug)
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params
  const [service, contactSettings] = await Promise.all([
    getServiceBySlug(slug),
    getContactSettings(),
  ])

  if (!service || !service.isActive) {
    notFound()
  }

  // Parse Pricing Tiers if string or JSON
  let tiers: PricingTier[] = []
  if (service.pricingTiers) {
    if (typeof service.pricingTiers === 'string') {
      try {
        tiers = JSON.parse(service.pricingTiers) as PricingTier[]
      } catch {}
    } else {
      tiers = service.pricingTiers as unknown as PricingTier[]
    }
  }

  return (
    <main className="pb-20">
      <JsonLd
        type="Service"
        data={{
          name: service.name,
          description: service.shortDesc || service.description?.slice(0, 160) || service.name,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/servicios/${slug}`,
          image: service.imageUrl ?? undefined,
          priceRange: tiers.length > 0 ? `${tiers[0].price}€` : undefined,
        }}
      />
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-125 w-full overflow-hidden">
        {service.imageUrl ? (
          <Image src={service.imageUrl} alt={service.name} fill className="object-cover" priority />
        ) : (
          <div className="bg-muted h-full w-full" />
        )}
        <div className="bg-background/60 absolute inset-0 backdrop-blur-sm" />

        <div className="relative z-10 container mx-auto flex h-full flex-col justify-end px-6 pb-20">
          <h1 className="text-foreground mb-4 text-5xl font-bold md:text-7xl">{service.name}</h1>
          <p className="text-foreground/80 max-w-2xl text-xl">
            {service.shortDesc || service.description?.slice(0, 100) + '...'}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {service.duration && (
              <div className="bg-background/80 border-border flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md">
                <Clock className="text-primary h-5 w-5" />
                <span className="font-medium">{service.duration}</span>
              </div>
            )}
            {service.price && (
              <div className="bg-background/80 border-border flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md">
                <span className="font-medium">
                  {service.priceLabel === 'desde' ? 'Desde' : ''} {service.currency}{' '}
                  {Number(service.price).toFixed(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-12 lg:col-span-2">
          {/* Description */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Sobre el servicio</h2>
            <div className="prose dark:prose-invert text-muted-foreground max-w-none whitespace-pre-line">
              {service.description}
            </div>
          </section>

          {/* Pricing Tiers */}
          {tiers.length > 0 && (
            <section>
              <h2 className="mb-6 text-2xl font-bold">Paquetes y Precios</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {tiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className="border-border bg-card rounded-2xl border p-6 transition-all hover:shadow-lg"
                  >
                    <h3 className="mb-2 text-xl font-bold">{tier.name}</h3>
                    <p className="text-primary mb-4 text-3xl font-bold">
                      {service.currency} {tier.price}
                    </p>
                    {tier.features && Array.isArray(tier.features) && (
                      <ul className="space-y-2">
                        {tier.features.map((f: string, i: number) => (
                          <li
                            key={i}
                            className="text-muted-foreground flex items-center gap-2 text-sm"
                          >
                            <Check className="h-4 w-4 text-green-500" /> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Gallery */}
          {service.galleryUrls && service.galleryUrls.length > 0 && (
            <section>
              <h2 className="mb-6 text-2xl font-bold">Galería de Trabajos</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {service.galleryUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square overflow-hidden rounded-xl transition-transform hover:scale-105"
                  >
                    <Image src={url} alt={`Gallery ${idx}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Requirements & Policy */}
          <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {service.requirements && (
              <div className="bg-muted/30 rounded-2xl p-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold">
                  <AlertCircle className="h-5 w-5 text-yellow-500" /> Requisitos
                </h3>
                <p className="text-muted-foreground text-sm whitespace-pre-line">
                  {service.requirements}
                </p>
              </div>
            )}
            {service.cancellationPolicy && (
              <div className="bg-muted/30 rounded-2xl p-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold">
                  <Calendar className="h-5 w-5 text-red-500" /> Cancelaciones
                </h3>
                <p className="text-muted-foreground text-sm whitespace-pre-line">
                  {service.cancellationPolicy}
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="border-border bg-card sticky top-24 rounded-2xl border p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold">Reserva tu Cita</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Para asegurar tu fecha, contáctame con anticipación.
              {service.advanceNoticeDays &&
                ` Se recomienda reservar al menos ${service.advanceNoticeDays} días antes.`}
            </p>

            <div className="flex flex-col gap-3">
              <Link href={`/contacto?subject=Reserva ${service.name}`} className="w-full">
                <Button size="lg" className="w-full">
                  Agendar Cita
                </Button>
              </Link>
              <Link
                href={
                  contactSettings?.whatsapp
                    ? `https://wa.me/${contactSettings.whatsapp.replace(/\D/g, '')}?text=Hola, info sobre ${service.name}`
                    : `/contacto?subject=Consulta sobre ${service.name}`
                }
                target={contactSettings?.whatsapp ? '_blank' : undefined}
                rel={contactSettings?.whatsapp ? 'noopener noreferrer' : undefined}
              >
                <Button variant="outline" size="lg" className="w-full">
                  Consultar por WhatsApp
                </Button>
              </Link>
            </div>

            <div className="border-border text-muted-foreground mt-6 border-t pt-6 text-xs">
              <p>• Pago seguro</p>
              <p className="mt-1">• Confirmación inmediata</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
