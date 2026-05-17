import { prisma } from '@/lib/db'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { WordReveal } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { FontLoader } from './FontLoader'
import FeaturedImagesGallery from './FeaturedImagesGallery'

interface FeaturedCategoriesProps {
  title?: string | null
  count?: number
  titleFont?: string | null
  titleFontUrl?: string | null
  titleFontSize?: number | null
  titleColor?: string | null
  titleColorDark?: string | null
  /** Hero inmersivo: sin tapar el fondo que continúa bajo el bloque */
  ambientUnderlay?: boolean
}

export default async function FeaturedCategories({
  title,
  count = 6,
  titleFont,
  titleFontUrl,
  titleFontSize,
  titleColor,
  titleColorDark,
  ambientUnderlay = false,
}: FeaturedCategoriesProps) {
  // Public web colors are fixed; CMS title colors stay disabled here for now.
  void titleColor
  void titleColorDark

  const featuredImages = await prisma.categoryImage.findMany({
    where: { isFeatured: true, category: { isActive: true, deletedAt: null } },
    include: { category: { select: { name: true } } },
    orderBy: { order: 'asc' },
    take: count,
  })

  if (featuredImages.length === 0) return null

  const images = featuredImages.map((img) => ({
    id: img.id,
    url: img.url,
    width: img.width,
    height: img.height,
    categoryName: img.category.name,
  }))

  const fontsToLoad = titleFont ? [titleFont] : []

  return (
    <section
      className={cn(
        'relative z-10 py-12 transition-colors duration-500 lg:py-20',
        ambientUnderlay ? 'public-home-featured-section' : 'public-portfolio-page'
      )}
    >
      {fontsToLoad.length > 0 && <FontLoader fonts={fontsToLoad} />}
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-end justify-between gap-6 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-xl">
            <h2
              className="public-home-featured-title font-heading text-3xl font-bold sm:text-4xl lg:text-5xl"
              style={{
                fontFamily: titleFontUrl ? titleFont! : undefined,
                fontSize: titleFontSize ? `${titleFontSize}px` : undefined,
              }}
            >
              <WordReveal text={title || 'Imágenes Destacadas'} as="span" />
            </h2>
          </div>
          <Link
            href={ROUTES.public.portfolio}
            className="public-home-featured-link group flex items-center gap-2 underline-offset-4 transition-opacity hover:underline hover:opacity-80"
          >
            <span className="font-medium">Ver todo el portfolio</span>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Images grid with lightbox */}
        <FeaturedImagesGallery images={images} />
      </div>
    </section>
  )
}
