'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createCategory } from '@/actions/cms/content'
import { Button, Input, Card, ImageUpload, TextArea } from '@/components/ui'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'

export function NewCategoryForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string>('')
  const [coverError, setCoverError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setCoverError(null)
    if (!coverUrl) {
      setCoverError('La imagen de portada es obligatoria')
      return
    }
    const formData = new FormData(e.currentTarget)
    // Slug is intentionally left empty — the server action generates it via generateSlug()
    // using NFD normalization which correctly handles Spanish characters (é, á, ñ, etc.)
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
        <Input
          label="Nombre *"
          name="name"
          placeholder="Ej: FX, Maquillaje social..."
          required
          maxLength={100}
          className="w-full"
        />

        {/* Slug is auto-generated from Name (hidden from the form) */}
        <input type="hidden" name="slug" maxLength={120} />

        {/* Description */}
        <TextArea
          label="Descripción (opcional)"
          name="description"
          placeholder="Describe esta categoría..."
          rows={4}
          maxLength={500}
        />

        {/* Cover Image */}
        <div className="space-y-2">
          <ImageUpload
            name="coverImageUrl"
            label="Imagen de Portada *"
            folder="portfolio/categories"
            mode="single"
            onChange={(urls) => {
              setCoverUrl(urls[0] ?? '')
              if (urls[0]) setCoverError(null)
            }}
          />
          {coverError && <p className="text-destructive text-sm">{coverError}</p>}
        </div>

        {/* Actions */}
        <div className="border-border flex gap-3 border-t pt-6">
          <Button
            asChild
            type="button"
            variant="ghost"
            className="w-full flex-1"
            disabled={isPending}
            loading={isPending}
          >
            <Link
              href={ROUTES.admin.categories}
              aria-disabled={isPending || undefined}
              style={isPending ? { pointerEvents: 'none' } : undefined}
            >
              Cancelar
            </Link>
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending} loading={isPending}>
            {isPending ? 'Creando...' : 'Crear Categoría'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
