import { prisma } from '@/lib/db'
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
}

export default async function FeaturedCategories({
  title,
  count = 6,
  titleFont,
  titleFontUrl,
  titleFontSize,
  titleColor,
  titleColorDark,
}: FeaturedCategoriesProps) {
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
    <section className="bg-(--background) py-12 transition-colors duration-500 lg:py-20">
      {fontsToLoad.length > 0 && <FontLoader fonts={fontsToLoad} />}
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-end justify-between gap-6 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-xl">
            <h2
              className="font-heading text-3xl font-bold text-(--foreground) sm:text-4xl lg:text-5xl"
              style={{
                fontFamily: titleFontUrl ? titleFont! : undefined,
                fontSize: titleFontSize ? `${titleFontSize}px` : undefined,
              }}
            >
              <WordReveal
                text={title || 'Imágenes Destacadas'}
                as="span"
                className="dark:hidden"
                style={{ color: titleColor || 'inherit' }}
              />
              <WordReveal
                text={title || 'Imágenes Destacadas'}
                as="span"
                className="hidden dark:inline"
                style={{ color: titleColorDark || titleColor || 'inherit' }}
              />
            </h2>
          </div>
          <Link
            href={ROUTES.public.portfolio}
            className="group flex items-center gap-2 text-(--primary) underline-offset-4 transition-colors hover:text-(--primary)/80 hover:underline"
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
