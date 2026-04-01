import { prisma } from '@/lib/db'
import { Button, Card } from '@/components/ui'
import { PageHeader, Section } from '@/components/layout'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { FolderOpen, Plus } from 'lucide-react'
import NewProjectForm from '@/components/features/projects/NewProjectForm'

export default async function NewProjectPage() {
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  // Sin categorías → mostrar estado vacío con CTA
  if (categories.length === 0) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <PageHeader
          title="✨ Crear Nuevo Proyecto"
          description="Sube las fotos y añade los detalles de tu nuevo proyecto"
        />
        <Card className="flex flex-col items-center gap-6 p-12 text-center">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <FolderOpen className="text-muted-foreground h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-foreground text-lg font-semibold">No hay categorías creadas</h3>
            <p className="text-muted-foreground max-w-md text-sm">
              Para crear un proyecto necesitas al menos una categoría. Crea una categoría primero y
              luego vuelve aquí.
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href={ROUTES.admin.newCategory}>
              <Plus size={16} />
              Crear primera categoría
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="✨ Crear Nuevo Proyecto"
        description="Sube las fotos y añade los detalles de tu nuevo proyecto"
      />

      <Section title="Información del Proyecto">
        <NewProjectForm categories={categories} />
      </Section>
    </div>
  )
}
