import { getActiveServices, getServiceBySlug } from '@/actions/cms/services'
import JsonLd from '@/components/seo/JsonLd'
import { OptimizedImage } from '@/components/ui'
import { IMAGE_SIZES } from '@/config/image-sizes'
import { ROUTES } from '@/config/routes'
import { getPublicSiteUrl } from '@/lib/site-url'
import Link from 'next/link'
import { Clock, Calendar, AlertCircle } from 'lucide-react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteSettings } from '@/actions/settings/site'
import { getContactSettings } from '@/actions/settings/contact'
import { buildSeoMetadata } from '@/lib/seo-metadata'

/** Cache público — invalidación explícita desde CMS. */
export const revalidate = false

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

function _resolveServiceMeta(service: ServiceForMetadata, slug: string, ownerName: string) {
  const title = `${service.name} | ${ownerName}`
  const description = service.shortDesc || service.description?.slice(0, 160) || ''
  return { title, description, canonicalUrl: ROUTES.public.serviceDetail(slug) }
}

function buildServiceMetadata(
  service: ServiceForMetadata,
  slug: string,
  ownerName: string,
  site: Awaited<ReturnType<typeof getSiteSettings>>
): Metadata {
  const meta = _resolveServiceMeta(service, slug, ownerName)
  return buildSeoMetadata({
    title: meta.title,
    description: meta.description,
    path: meta.canonicalUrl,
    site,
    ownerName,
    image: service.imageUrl || site?.defaultOgImage,
    imageAlt: `${service.name} - ${ownerName}`,
    keywords: [service.name, 'servicio de maquillaje', 'maquillaje profesional'],
  })
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const [service, site, contact] = await Promise.all([
    getServiceBySlug(slug),
    getSiteSettings(),
    getContactSettings(),
  ])

  if (!service) return { title: 'Servicio no encontrado' }

  return buildServiceMetadata(service, slug, contact?.ownerName || 'Paola Bolívar Nievas', site)
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
    <main className="public-services-page pb-20">
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
      <JsonLd
        type="BreadcrumbList"
        data={{
          breadcrumbs: [
            { name: 'Inicio', url: getPublicSiteUrl() },
            { name: 'Servicios', url: `${getPublicSiteUrl()}${ROUTES.public.services}` },
            {
              name: service.name,
              url: `${getPublicSiteUrl()}${ROUTES.public.serviceDetail(slug)}`,
            },
          ],
        }}
      />
      {/* Hero Section */}
      <div className="public-services-detail-hero relative h-[60dvh] min-h-125 w-full overflow-hidden">
        {service.imageUrl ? (
          <OptimizedImage
            src={service.imageUrl}
            alt={service.name}
            fill
            sizes={IMAGE_SIZES.fullWidth}
            priority
            placeholder="empty"
            transparentBackground={false}
          />
        ) : (
          <div className="public-services-detail-hero-fallback h-full w-full" />
        )}
        <div className="public-services-detail-hero-overlay absolute inset-0" />
        <div className="relative z-10 container mx-auto flex h-full flex-col justify-end px-6 pb-20">
          <h1 className="public-services-detail-hero-title mb-4 max-w-full text-4xl leading-tight font-bold break-words sm:text-5xl md:text-6xl lg:text-7xl">
            {service.name}
          </h1>
          <p className="public-services-detail-hero-subtext max-w-2xl text-xl">
            {service.shortDesc || service.description?.slice(0, 100) + '...'}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {service.duration && (
              <div className="public-services-chip flex items-center gap-2 rounded-full border px-4 py-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">{service.duration}</span>
              </div>
            )}
            {service.price && (
              <div className="public-services-chip flex items-center gap-2 rounded-full border px-4 py-2">
                <span className="font-medium">
                  {service.priceLabel === 'desde' ? 'Desde' : ''} {service.currency}{' '}
                  {Number(service.price).toFixed(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative container mx-auto -mt-px grid grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-12 lg:col-span-2">
          {/* Description */}
          <section>
            <h2 className="public-services-title mb-4 text-2xl font-bold">Sobre el servicio</h2>
            <div className="public-services-muted max-w-none whitespace-pre-line">
              {service.description}
            </div>
          </section>

          {/* Pricing Tiers */}
          {tiers.length > 0 && (
            <section>
              <h2 className="public-services-title mb-6 text-2xl font-bold">Paquetes y Precios</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {tiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className="public-services-card rounded-2xl border p-6 transition-all hover:shadow-lg"
                  >
                    <h3 className="public-services-title mb-2 text-xl font-bold">{tier.name}</h3>
                    <p className="public-services-title mb-4 text-3xl font-bold">
                      {service.currency} {tier.price}
                    </p>
                    {tier.description && (
                      <p className="public-services-muted text-sm">{tier.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Gallery */}
          {service.galleryUrls && service.galleryUrls.length > 0 && (
            <section>
              <h2 className="public-services-title mb-6 text-2xl font-bold">Galería de Trabajos</h2>
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
          <section className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-8">
            {service.requirements && (
              <div className="public-services-card rounded-2xl p-6">
                <h3 className="public-services-title mb-3 flex items-center gap-2 font-bold">
                  <AlertCircle className="h-5 w-5" aria-hidden /> Requisitos
                </h3>
                <p className="public-services-muted text-sm whitespace-pre-line">
                  {service.requirements}
                </p>
              </div>
            )}
            {service.cancellationPolicy && (
              <div className="public-services-card rounded-2xl p-6">
                <h3 className="public-services-title mb-3 flex items-center gap-2 font-bold">
                  <Calendar className="h-5 w-5" aria-hidden /> Cancelaciones
                </h3>
                <p className="public-services-muted text-sm whitespace-pre-line">
                  {service.cancellationPolicy}
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="public-services-card sticky top-28 rounded-2xl border p-6 shadow-sm lg:top-32">
            <h3 className="public-services-title mb-4 text-xl font-bold">Reserva tu Cita</h3>
            <p className="public-services-muted mb-6 text-sm">
              Para asegurar tu fecha, contáctame con anticipación.
              {service.advanceNoticeDays &&
                ` Se recomienda reservar al menos ${service.advanceNoticeDays} días antes.`}
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href={`${ROUTES.public.contact}?service=${encodeURIComponent(service.slug)}&serviceName=${encodeURIComponent(service.name)}`}
                className="public-services-primary-button inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                Agendar cita
              </Link>
            </div>

            <div className="public-services-muted public-services-surface-border mt-6 border-t pt-6 text-xs">
              <p>• Pago seguro</p>
              <p className="mt-1">• Confirmación inmediata</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
