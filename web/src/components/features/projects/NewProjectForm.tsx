'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { uploadImageAndCreateProject } from '@/actions/cms/content'
import { Button, SmartField as FormField, ImageUpload, Card } from '@/components/ui'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'

interface NewProjectFormProps {
  categories: { id: string; name: string }[]
}

export default function NewProjectForm({ categories }: NewProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        const result = await uploadImageAndCreateProject(formData)
        if (result.success) {
          router.push(ROUTES.admin.projects)
        } else {
          setError(result.error ?? 'Error al crear el proyecto')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error inesperado al crear el proyecto')
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField label="Título" name="title" required maxLength={200} />
          <FormField
            label="Categoría"
            name="categoryId"
            type="select"
            required
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>
        <FormField label="Descripción" name="description" type="textarea" rows={4} />
        <FormField
          label="Extracto / Resumen"
          name="excerpt"
          type="textarea"
          rows={2}
          maxLength={300}
          placeholder="Breve descripción para tarjetas y listados..."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            label="Cliente"
            name="client"
            placeholder="Nombre del cliente..."
            maxLength={100}
          />
          <FormField
            label="Duración"
            name="duration"
            placeholder="Ej: 2 horas, Todo el día..."
            maxLength={100}
          />
        </div>
        <FormField label="Fecha" name="date" type="date" placeholder="YYYY-MM-DD" />
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked
              className="h-4 w-4 rounded border text-(--primary) focus:ring-(--primary)"
            />
            <span className="text-sm font-medium text-(--foreground)">Activo (Visible)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              className="h-4 w-4 rounded border text-(--primary) focus:ring-(--primary)"
            />
            <span className="text-sm font-medium text-(--foreground)">Destacado</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="isPinned"
              className="h-4 w-4 rounded border text-(--primary) focus:ring-(--primary)"
            />
            <span className="text-sm font-medium text-(--foreground)">Fijado al inicio</span>
          </label>
        </div>
        <ImageUpload name="images" label="Imágenes del proyecto *" multiple mode="gallery" />

        <div className="border-border flex justify-end gap-4 border-t pt-4">
          <Button asChild type="button" variant="ghost" disabled={isPending}>
            <Link
              href={ROUTES.admin.projects}
              aria-disabled={isPending || undefined}
              style={isPending ? { pointerEvents: 'none' } : undefined}
            >
              Cancelar
            </Link>
          </Button>
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? 'Creando...' : 'Publicar Proyecto'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
