import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ImageOff } from 'lucide-react'
import { Metadata } from 'next'
import JsonLd from '@/components/seo/JsonLd'
import { ROUTES } from '@/config/routes'
import { getPublicSiteUrl } from '@/lib/site-url'
import CategoryGallery from '@/components/features/categories/CategoryGallery'
import { getContactSettings } from '@/actions/settings/contact'
import { getCategorySettings } from '@/actions/settings/categories'
import { CACHE_DURATIONS, CACHE_TAGS } from '@/lib/cache-tags'

/** ISR — alineado con `web/src/config/public-isr.ts` */
export const revalidate = 3600

const getPublicCategorySlugs = unstable_cache(
  async () =>
    prisma.category.findMany({
      where: { isActive: true, deletedAt: null },
      select: { slug: true },
    }),
  ['public-category-slugs'],
  { revalidate: CACHE_DURATIONS.VERY_LONG, tags: [CACHE_TAGS.categories] }
)

export async function generateStaticParams() {
  const categories = await getPublicCategorySlugs()
  return categories.map((c) => ({ category: c.slug }))
}

const getCategory = unstable_cache(
  async (slug: string) =>
    prisma.category.findFirst({
      where: { slug, isActive: true, deletedAt: null },
      include: {
        images: { orderBy: { order: 'asc' } },
      },
    }),
  ['public-category-detail'],
  {
    revalidate: CACHE_DURATIONS.VERY_LONG,
    tags: [CACHE_TAGS.categories, CACHE_TAGS.categoryImages],
  }
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: categorySlug } = await params
  const [category, contact] = await Promise.all([getCategory(categorySlug), getContactSettings()])

  if (!category) {
    return { title: 'Categoría no encontrada' }
  }

  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'

  return {
    title: `${category.name} | ${ownerName}`,
    description: category.description || `Galería de ${category.name}`,
    alternates: {
      canonical: `${ROUTES.public.portfolio}/${categorySlug}`,
    },
    openGraph: {
      title: `${category.name} | ${ownerName}`,
      description: category.description || `Galería de ${category.name}`,
      url: `${ROUTES.public.portfolio}/${categorySlug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | ${ownerName}`,
      description: category.description || `Galería de ${category.name}`,
    },
  }
}

export default async function CategoryGalleryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categorySlug } = await params

  const [category, categorySettings] = await Promise.all([
    getCategory(categorySlug),
    getCategorySettings(),
  ])

  if (!category) {
    notFound()
  }

  const showTitles = categorySettings?.showDescription ?? true

  const allImages = category.images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: category.name,
    title: category.name,
    width: img.width,
    height: img.height,
    isFeatured: img.isFeatured,
  }))

  return (
    <section className="public-portfolio-page w-full transition-colors duration-500">
      <JsonLd
        type="ImageGallery"
        data={{
          name: category.name,
          description: category.description || `Galería de ${category.name}`,
          url: `${getPublicSiteUrl()}${ROUTES.public.portfolio}/${category.slug}`,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-12 lg:px-16 lg:py-12">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start gap-6 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href={ROUTES.public.portfolio}
              aria-label="Volver al portfolio"
              className="group flex items-center gap-2 transition-colors hover:opacity-80"
            >
              <div className="public-category-back-button flex h-10 w-10 items-center justify-center rounded-full border transition-all group-hover:-translate-x-1">
                <ArrowLeft size={20} />
              </div>
            </Link>

            <h1 className="public-portfolio-category-title font-heading text-3xl font-bold sm:text-4xl">
              {category.name}
            </h1>
          </div>

          <p className="public-portfolio-muted max-w-md text-sm sm:text-right">
            {category.description}
          </p>
        </div>

        {/* Gallery */}
        {allImages.length > 0 ? (
          <CategoryGallery images={allImages} showTitles={showTitles} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <ImageOff className="public-portfolio-muted mb-4 size-12 shrink-0" aria-hidden />
            <p className="public-portfolio-muted text-lg">
              No hay imágenes disponibles en esta categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
