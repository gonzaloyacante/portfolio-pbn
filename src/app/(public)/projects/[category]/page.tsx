import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import JsonLd from '@/components/seo/JsonLd'
import CategoryGallery from '@/components/features/categories/CategoryGallery'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })

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
import { getProjectSettings } from '@/actions/project-settings.actions'

// ...

export default async function CategoryProjectsPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categorySlug } = await params

  // Fetch category and settings
  const [category, settings] = await Promise.all([
    prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        projects: {
          where: { isDeleted: false, isActive: true },
          orderBy: { date: 'desc' },
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    }),
    getProjectSettings(),
  ])

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
    }))
  )

  return (
    <section className="w-full bg-[var(--background)] transition-colors duration-500">
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
              href="/proyectos"
              className="group flex items-center gap-2 text-[var(--primary)] transition-colors hover:opacity-70"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--primary)] transition-all group-hover:-translate-x-1 group-hover:bg-[var(--primary)] group-hover:text-white">
                <ArrowLeft size={20} />
              </div>
            </Link>

            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
              {category.name}
            </h1>
          </div>

          <p className="max-w-md text-sm text-[var(--text-body)] opacity-80 sm:text-right">
            {category.description}
          </p>
        </div>

        {/* Gallery */}
        {allImages.length > 0 ? (
          <CategoryGallery
            images={allImages}
            categoryName={category.name}
            showTitles={showTitles}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <span className="mb-4 text-4xl">📷</span>
            <p className="text-lg text-[var(--text-body)]">
              No hay imágenes disponibles en esta categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
