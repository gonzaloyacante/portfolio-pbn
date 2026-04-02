'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card } from '@/components/ui'
import CategoryCoverSelector from '@/components/features/categories/CategoryCoverSelector'
import GalleryOrderButton from '@/components/admin/GalleryOrderButton'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/config/routes'

interface EditCategoryFormProps {
  category: {
    id: string
    name: string
    slug: string
    description: string | null
    coverImageUrl: string | null
    sortOrder: number
  }
  updateAction: (id: string, formData: FormData) => Promise<{ success: boolean; error?: string }>
}

export default function EditCategoryForm({ category, updateAction }: EditCategoryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateAction(category.id, formData)
      if (result.success) {
        router.push(ROUTES.admin.categories)
      } else {
        setError(result.error ?? 'Error al actualizar la categoría')
      }
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href={ROUTES.admin.categories}>
              <ArrowLeft size={16} />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-foreground text-2xl font-bold">✏️ Editar: {category.name}</h1>
          </div>
        </div>

        {/* Gallery Order Button */}
        <GalleryOrderButton categoryId={category.id} categoryName={category.name} />
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border p-3 text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-foreground text-sm font-medium">
              Nombre *
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={category.name}
              placeholder="Ej: FX, Maquillaje social..."
              required
              maxLength={100}
              className="w-full"
            />
          </div>

          {/* Slug: hidden from UI to avoid accidental edits. Preserved in form data. */}
          <input type="hidden" name="slug" defaultValue={category.slug} maxLength={120} />

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-foreground text-sm font-medium">
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={category.description || ''}
              placeholder="Describe esta categoría..."
              rows={4}
              maxLength={500}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>

          {/* Cover Image Selector */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Imagen de Portada</label>
            <CategoryCoverSelector
              categoryId={category.id}
              currentCoverUrl={category.coverImageUrl}
              onSelect={undefined} // Controlled by internal hidden input
            />
          </div>

          {/* Stats (read-only) */}
          <div className="border-border bg-muted/30 rounded-lg border p-4">
            <h4 className="text-foreground mb-2 text-sm font-semibold">Estadísticas</h4>
            <div className="text-muted-foreground space-y-1 text-sm">
              <p> Orden: #{category.sortOrder}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="border-border flex gap-3 border-t pt-6">
            <Button
              asChild
              type="button"
              variant="ghost"
              className="w-full flex-1"
              disabled={isPending}
            >
              <Link
                href={ROUTES.admin.categories}
                aria-disabled={isPending || undefined}
                style={isPending ? { pointerEvents: 'none' } : undefined}
              >
                Cancelar
              </Link>
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
