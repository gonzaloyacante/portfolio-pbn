import { redirect } from 'next/navigation'
import { createCategory } from '@/actions/cms/content'
import { Button, Input, Card, ImageUpload } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/config/routes'

export const metadata = {
  title: 'Nueva Categoría | Admin',
  description: 'Crear una nueva categoria de proyectos',
}

export default function NewCategoryPage() {
  async function handleSubmit(formData: FormData) {
    'use server'
    const result = await createCategory(formData)
    if (result.success) {
      redirect(ROUTES.admin.categories)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <Link href={ROUTES.admin.categories}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={16} />
            Volver
          </Button>
        </Link>
        <PageHeader
          title="📁 Nueva Categoría"
          description="Crea una nueva categoría para organizar tus proyectos"
        />
      </div>

      <Card className="p-8">
        <form action={handleSubmit} className="space-y-6">
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
            />
          </div>

          {/* Actions */}
          <div className="border-border flex gap-3 border-t pt-6">
            <Link href={ROUTES.admin.categories} className="flex-1">
              <Button type="button" variant="ghost" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1">
              Crear Categoría
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
