import { cache } from 'react'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import JsonLd from '@/components/seo/JsonLd'
import { ROUTES } from '@/config/routes'
import CategoryGallery from '@/components/features/categories/CategoryGallery'

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { isActive: true, deletedAt: null },
    select: { slug: true },
  })
  return categories.map((c) => ({ category: c.slug }))
}

const getCategory = cache((slug: string) =>
  prisma.category.findFirst({
    where: { slug, isActive: true, deletedAt: null },
    include: {
      projects: {
        where: { isDeleted: false, isActive: true },
        orderBy: { date: 'desc' },
        include: {
          images: {
            orderBy: [{ categoryGalleryOrder: 'asc' }, { order: 'asc' }],
          },
        },
      },
    },
  })
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = await getCategory(categorySlug)

  if (!category) {
    return { title: 'Categoría no encontrada' }
  }

  return {
    title: `${category.name} | Portfolio PBN`,
    description: category.description || `Galería de ${category.name}`,
  }
}

/**
 * Category Gallery Page
 * Displays a unified gallery of ALL images from ALL projects in this category.
 */
import { getProjectSettings } from '@/actions/settings/projects'

// ...

export default async function CategoryProjectsPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categorySlug } = await params

  // Fetch category (deduplicated by React.cache with generateMetadata) + settings
  const [category, settings] = await Promise.all([getCategory(categorySlug), getProjectSettings()])

  if (!category) {
    notFound()
  }

  const showTitles = settings?.showCardTitles ?? true

  // Flatten images for the gallery
  const allImages = category.projects.flatMap((project) =>
    project.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || project.title,
      title: project.title,
      projectSlug: project.slug,
      width: img.width,
      height: img.height,
    }))
  )

  return (
    <section className="bg-background w-full transition-colors duration-500">
      <AnalyticsTracker eventType="CATEGORY_VIEW" entityId={category.id} entityType="Category" />
      <JsonLd
        type="CollectionPage"
        data={{
          name: category.name,
          description: category.description || `Galería de ${category.name}`,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/proyectos/${category.slug}`,
          image: allImages[0]?.url,
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-12 lg:px-16 lg:py-12">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start gap-6 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href={ROUTES.public.projects}
              className="group text-primary flex items-center gap-2 transition-colors hover:opacity-70"
            >
              <div className="border-primary group-hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full border transition-all group-hover:-translate-x-1 group-hover:text-white">
                <ArrowLeft size={20} />
              </div>
            </Link>

            <h1 className="text-foreground font-heading text-3xl font-bold sm:text-4xl">
              {category.name}
            </h1>
          </div>

          <p className="text-muted-foreground max-w-md text-sm opacity-80 sm:text-right">
            {category.description}
          </p>
        </div>

        {/* Gallery */}
        {allImages.length > 0 ? (
          <CategoryGallery images={allImages} showTitles={showTitles} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <span className="mb-4 text-4xl">📷</span>
            <p className="text-muted-foreground text-lg">
              No hay imágenes disponibles en esta categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
