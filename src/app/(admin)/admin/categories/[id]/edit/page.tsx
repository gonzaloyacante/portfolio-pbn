import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { updateCategory } from '@/actions/content.actions'
import { Button, Input, Card } from '@/components/ui'
import { PageHeader } from '@/components/layout'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/config/routes'

export const metadata = {
  title: 'Editar Categoría | Admin',
  description: 'Editar categoría existente',
}

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { projects: { where: { isActive: true, isDeleted: false } } },
      },
    },
  })

  if (!category) {
    notFound()
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    const result = await updateCategory(id, formData)
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
          title={`✏️ Editar: ${category.name}`}
          description={`${category._count.projects} proyecto${category._count.projects !== 1 ? 's' : ''} en esta categoría`}
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
              defaultValue={category.name}
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
              defaultValue={category.slug}
              placeholder="ej: fx, maquillaje-social"
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              className="w-full font-mono text-sm"
            />
            <p className="text-xs text-yellow-600 dark:text-yellow-500">
              ⚠️ Cambiar el slug puede romper enlaces existentes
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
              defaultValue={category.description || ''}
              placeholder="Describe esta categoría..."
              rows={4}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>

          {/* Stats (read-only) */}
          <div className="border-border bg-muted/30 rounded-lg border p-4">
            <h4 className="text-foreground mb-2 text-sm font-semibold">Estadísticas</h4>
            <div className="text-muted-foreground space-y-1 text-sm">
              <p>🖼️ Proyectos: {category._count.projects}</p>
              <p>📋 Orden: #{category.sortOrder}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="border-border flex gap-3 border-t pt-6">
            <Link href={ROUTES.admin.categories} className="flex-1">
              <Button type="button" variant="ghost" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1">
              Guardar Cambios
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
