import { prisma } from '@/lib/db'
import { uploadImageAndCreateProject } from '@/actions/content.actions'
import { Button, PageHeader } from '@/components/ui'
import { FormField, Section, ImageUpload } from '@/components/admin'

export default async function NewProjectPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

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
            await uploadImageAndCreateProject(formData)
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
          <ImageUpload name="images" label="Imágenes del proyecto" multiple />

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
