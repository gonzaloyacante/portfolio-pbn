import { getActiveServices, getServiceBySlug } from '@/actions/cms/services'
import JsonLd from '@/components/seo/JsonLd'
import { Button, OptimizedImage } from '@/components/ui'
import { IMAGE_SIZES } from '@/config/image-sizes'
import { ROUTES } from '@/config/routes'
import { getPublicSiteUrl } from '@/lib/site-url'
import Link from 'next/link'
import { Clock, Calendar, AlertCircle } from 'lucide-react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

/** ISR — alineado con `web/src/config/public-isr.ts` */
export const revalidate = 60

export async function generateStaticParams() {
  const services = await getActiveServices()
  return services.map((s: { slug: string }) => ({ slug: s.slug }))
}

interface PricingTier {
  name: string
  price: string
  description?: string | null
}

interface ServicePageProps {
  params: Promise<{
    slug: string
  }>
}

// ── Metadata Helpers ───────────────────────────────────────────────────────

type ServiceForMetadata = {
  name: string
  shortDesc?: string | null
  description?: string | null
  imageUrl?: string | null
}

function _resolveServiceMeta(service: ServiceForMetadata, slug: string) {
  const title = `${service.name} - Servicios`
  const description = service.shortDesc || service.description?.slice(0, 160) || ''
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
    alternates: { canonical: meta.canonicalUrl },
    openGraph: {
      title: service.name,
      description: meta.description,
      type: 'website',
      locale: 'es_ES',
      images: meta.images,
    },
    twitter: {
      card: 'summary_large_image',
      title: service.name,
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
  const service = await getServiceBySlug(slug)

  if (!service || !service.isActive) {
    notFound()
  }

  // Map relation rows to typed tiers
  const tiers: PricingTier[] = (service.pricingTiers ?? []).map((t) => ({
    name: t.name,
    price: t.price,
    description: t.description,
  }))

  return (
    <main className="pb-20">
      <JsonLd
        type="Service"
        data={{
          name: service.name,
          description: service.shortDesc || service.description?.slice(0, 160) || service.name,
          url: `${getPublicSiteUrl()}${ROUTES.public.serviceDetail(slug)}`,
          image: service.imageUrl ?? undefined,
          offers: tiers.map((t) => {
            const normalized = String(t.price).replace(',', '.').trim()
            const n = Number.parseFloat(normalized)
            return { name: t.name, price: Number.isFinite(n) ? n : 0 }
          }),
        }}
      />
      {/* Hero Section */}
      <div className="relative h-[60dvh] min-h-125 w-full overflow-hidden">
        {service.imageUrl ? (
          <OptimizedImage
            src={service.imageUrl}
            alt={service.name}
            fill
            sizes={IMAGE_SIZES.fullWidth}
            priority
            transparentBackground={false}
          />
        ) : (
          <div className="bg-muted h-full w-full" />
        )}
        <div className="bg-background/60 absolute inset-0 backdrop-blur-sm" />

        <div className="relative z-10 container mx-auto flex h-full flex-col justify-end px-6 pb-20">
          <h1 className="text-foreground mb-4 max-w-full text-4xl leading-tight font-bold break-words sm:text-5xl md:text-6xl lg:text-7xl">
            {service.name}
          </h1>
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
            <div className="prose prose-neutral dark:prose-invert text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary max-w-none whitespace-pre-line">
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
                    {tier.description && (
                      <p className="text-muted-foreground text-sm">{tier.description}</p>
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
                    <OptimizedImage
                      src={url}
                      alt={`${service.name} — imagen ${idx + 1}`}
                      fill
                      sizes={IMAGE_SIZES.publicServiceGallery}
                      transparentBackground={false}
                    />
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
                  <AlertCircle className="text-warning h-5 w-5" aria-hidden /> Requisitos
                </h3>
                <p className="text-muted-foreground text-sm whitespace-pre-line">
                  {service.requirements}
                </p>
              </div>
            )}
            {service.cancellationPolicy && (
              <div className="bg-muted/30 rounded-2xl p-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold">
                  <Calendar className="text-destructive h-5 w-5" aria-hidden /> Cancelaciones
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
          <div className="border-border bg-card sticky top-28 rounded-2xl border p-6 shadow-sm lg:top-32">
            <h3 className="mb-4 text-xl font-bold">Reserva tu Cita</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Para asegurar tu fecha, contáctame con anticipación.
              {service.advanceNoticeDays &&
                ` Se recomienda reservar al menos ${service.advanceNoticeDays} días antes.`}
            </p>

            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="w-full">
                <Link href={`${ROUTES.public.contact}?service=${encodeURIComponent(service.name)}`}>
                  Agendar Cita
                </Link>
              </Button>
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
