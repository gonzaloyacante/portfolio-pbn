import { prisma } from '@/lib/db'
import { uploadImageAndCreateProject } from '@/actions/cms/content'
import { Button, SmartField as FormField, ImageUpload, Card } from '@/components/ui'
import { PageHeader, Section } from '@/components/layout'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ROUTES } from '@/config/routes'
import { FolderOpen, Plus } from 'lucide-react'

export default async function NewProjectPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  // Sin categorías activas → mostrar estado vacío con CTA
  if (categories.length === 0) {
    return (
      <div className="mx-auto max-w-4xl space-y-8 p-6">
        <PageHeader
          title="✨ Crear Nuevo Proyecto"
          description="Sube las fotos y añade los detalles de tu nuevo proyecto"
        />
        <Card className="flex flex-col items-center gap-6 p-12 text-center">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <FolderOpen className="text-muted-foreground h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-foreground text-lg font-semibold">No hay categorías disponibles</h3>
            <p className="text-muted-foreground max-w-md text-sm">
              Para crear un proyecto necesitas al menos una categoría activa. Crea una categoría
              primero y luego vuelve aquí.
            </p>
          </div>
          <Link href={ROUTES.admin.newCategory}>
            <Button className="gap-2">
              <Plus size={16} />
              Crear primera categoría
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <PageHeader
        title="✨ Crear Nuevo Proyecto"
        description="Sube las fotos y añade los detalles de tu nuevo proyecto"
      />

      <Section title="Información del Proyecto">
        <form
          action={async (formData) => {
            'use server'
            const result = await uploadImageAndCreateProject(formData)
            if (result.success) {
              redirect(ROUTES.admin.projects)
            }
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField label="Título" name="title" required />
            <FormField
              label="Categoría"
              name="categoryId"
              type="select"
              required
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>
          <FormField label="Descripción" name="description" type="textarea" rows={4} />
          <FormField label="Fecha" name="date" type="date" placeholder="YYYY-MM-DD" />
          <ImageUpload name="images" label="Imágenes del proyecto" multiple mode="gallery" />

          <div className="border-border flex justify-end gap-4 border-t pt-4">
            <Button type="submit" size="lg">
              Publicar Proyecto
            </Button>
          </div>
        </form>
      </Section>
    </div>
  )
}
