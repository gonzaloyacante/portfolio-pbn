import { prisma } from '@/lib/db'
import { PageHeader, Card, Badge } from '@/components/ui'
import { Section } from '@/components/admin'
import { createCategory, deleteCategory } from '@/actions/content.actions'
import { Button, Input } from '@/components/ui'

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { projects: true } } },
  })

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <PageHeader
        title="📁 Gestión de Categorías"
        description="Administra las categorías de tus proyectos"
      />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Crear Categoría */}
        <Section title="Nueva Categoría">
          <Card className="border-[var(--primary)]/20">
            <form
              action={async (formData) => {
                'use server'
                await createCategory(formData)
              }}
              className="space-y-4 p-4"
            >
              <Input label="Nombre" name="name" placeholder="Ej. Retratos" required />
              <Input label="Slug (URL)" name="slug" placeholder="Ej. retratos" required />
              <Input label="Descripción" name="description" placeholder="Opcional" />
              <Button type="submit" className="w-full">
                Crear Categoría
              </Button>
            </form>
          </Card>
        </Section>

        {/* Lista de Categorías */}
        <Section title={`Categorías Existentes (${categories.length})`}>
          <div className="space-y-4">
            {categories.map((cat) => (
              <Card
                key={cat.id}
                className="group border-[var(--primary)]/10 p-4 transition-all hover:bg-[var(--primary)]/5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-[var(--foreground)]">{cat.name}</h3>
                    <p className="text-xs text-[var(--foreground)]/60">/{cat.slug}</p>
                    {cat.description && (
                      <p className="mt-1 text-sm text-[var(--foreground)]/80">{cat.description}</p>
                    )}
                    <Badge variant="info" className="mt-2 text-xs">
                      {cat._count.projects} proyectos
                    </Badge>
                  </div>
                  <form
                    action={async () => {
                      'use server'
                      await deleteCategory(cat.id)
                    }}
                  >
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      🗑️
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
            {categories.length === 0 && (
              <p className="text-center text-[var(--foreground)]/60">No hay categorías aun.</p>
            )}
          </div>
        </Section>
      </div>
    </div>
  )
}
