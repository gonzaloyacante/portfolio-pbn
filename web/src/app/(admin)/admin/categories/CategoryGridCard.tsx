import { Button, Card, Badge } from '@/components/ui'
import Link from 'next/link'
import Image from 'next/image'
import { ROUTES } from '@/config/routes'
import { ExternalLink, Pencil, Trash2, Images } from 'lucide-react'
import type { Category } from '@/generated/prisma/client'

type CategoryWithCount = Category & {
  _count: { images: number }
  images: { url: string }[]
}

interface CategoryGridCardProps {
  category: CategoryWithCount
  isDragging: boolean
  onDelete: (id: string, name: string) => void
}

export function CategoryGridCard({ category, isDragging, onDelete }: CategoryGridCardProps) {
  const thumbnailUrl = category.coverImageUrl || category.images[0]?.url

  return (
    <Card
      className={`group hover:border-primary h-full overflow-hidden transition-all hover:shadow-lg ${
        isDragging ? 'ring-primary/20 scale-105 shadow-xl ring-2' : ''
      }`}
    >
      <div className="bg-muted relative aspect-video overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center opacity-20">
            <span className="text-4xl">📁</span>
          </div>
        )}
        <Badge className="absolute top-2 right-2 shadow-sm">#{category.sortOrder ?? 0}</Badge>
      </div>

      <div className="space-y-3 p-5">
        <h3 className="text-foreground truncate text-lg font-bold">{category.name}</h3>

        {category.description && (
          <p className="text-muted-foreground line-clamp-2 min-h-10 text-sm">
            {category.description}
          </p>
        )}

        <div className="text-muted-foreground flex gap-3 text-xs">
          <span>🖼️ {category._count.images} imágenes</span>
        </div>

        <div className="border-border mt-auto flex gap-2 border-t pt-4">
          <Button asChild variant="outline" size="sm" className="flex-1 gap-2">
            <Link
              href={`${ROUTES.public.portfolio}/${category.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={14} />
              Ver
            </Link>
          </Button>
          <Button asChild size="sm" className="flex-1 gap-2">
            <Link href={ROUTES.admin.editCategory(category.id)}>
              <Pencil size={14} />
              Editar
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1 gap-2">
            <Link href={ROUTES.admin.categoryGallery(category.id)}>
              <Images size={14} />
              Galería
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            aria-label={`Eliminar categoría ${category.name}`}
            onClick={() => onDelete(category.id, category.name)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </Card>
  )
}
