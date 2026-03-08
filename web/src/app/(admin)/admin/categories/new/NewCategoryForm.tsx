'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory } from '@/actions/cms/content'
import { Button, Input, Card, ImageUpload } from '@/components/ui'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'

export function NewCategoryForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createCategory(formData)
      if (result.success) {
        router.push(ROUTES.admin.categories)
      } else {
        setError(result.error ?? 'Error al crear la categoría')
      }
    })
  }

  return (
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
            placeholder="Ej: FX, Maquillaje social..."
            required
            className="w-full"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label htmlFor="slug" className="text-foreground text-sm font-medium">
            Slug (URL) *
          </label>
          <Input
            id="slug"
            name="slug"
            placeholder="ej: fx, maquillaje-social"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            className="w-full font-mono text-sm"
          />
          <p className="text-muted-foreground text-xs">
            Solo minúsculas, números y guiones. Ej: maquillaje-social
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-foreground text-sm font-medium">
            Descripción (opcional)
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe esta categoría..."
            rows={4}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <ImageUpload
            name="coverImageUrl"
            label="Imagen de Portada (Opcional)"
            folder="categories"
            mode="single"
          />
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
            {isPending ? 'Creando...' : 'Crear Categoría'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
