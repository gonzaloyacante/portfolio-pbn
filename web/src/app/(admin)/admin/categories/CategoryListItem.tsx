import { Badge, Button, OptimizedImage } from '@/components/ui'
import { IMAGE_SIZES } from '@/config/image-sizes'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { ExternalLink, Pencil, Trash2, Images } from 'lucide-react'
import type { Category } from '@/generated/prisma/client'

type CategoryWithCount = Category & {
  _count: { images: number }
  images: { url: string }[]
}

interface CategoryListItemProps {
  category: CategoryWithCount
  isDragging: boolean
  onDelete: (id: string, name: string) => void
}

export function CategoryListItem({ category, isDragging, onDelete }: CategoryListItemProps) {
  const thumbnailUrl = category.coverImageUrl || category.images[0]?.url

  return (
    <div
      className={`border-border bg-card hover:border-primary flex items-center gap-4 rounded-lg border p-3 transition-colors ${
        isDragging ? 'bg-accent/10 shadow-lg' : ''
      }`}
    >
      <div className="w-6" />

      <div className="bg-muted relative h-16 w-24 shrink-0 overflow-hidden rounded-md">
        {thumbnailUrl ? (
          <OptimizedImage
            src={thumbnailUrl}
            alt={category.name}
            fill
            sizes={IMAGE_SIZES.adminThumbSm}
            variant="thumbnail"
            placeholder="empty"
          />
        ) : (
          <div className="flex h-full items-center justify-center opacity-20">
            <span className="text-2xl">📁</span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-foreground truncate font-semibold">{category.name}</h3>
          <Badge variant="outline" className="text-xs">
            #{category.sortOrder ?? 0}
          </Badge>
        </div>
        <div className="text-muted-foreground mt-1 text-xs">{category._count.images} imágenes</div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          asChild
          variant="ghost"
          size="sm"
          aria-label={`Ver categoría ${category.name} en público`}
        >
          <Link
            href={`${ROUTES.public.portfolio}/${category.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={16} />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" aria-label={`Editar categoría ${category.name}`}>
          <Link href={ROUTES.admin.editCategory(category.id)}>
            <Pencil size={16} />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" aria-label={`Ver galería de ${category.name}`}>
          <Link href={ROUTES.admin.categoryGallery(category.id)}>
            <Images size={16} />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          aria-label={`Eliminar categoría ${category.name}`}
          onClick={() => onDelete(category.id, category.name)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  )
}
