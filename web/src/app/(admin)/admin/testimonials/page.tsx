import { prisma } from '@/lib/db'
import { createTestimonial, deleteTestimonial, toggleTestimonial } from '@/actions/cms/testimonials'
import { Button, Card, Badge } from '@/components/ui'
import { SmartField as FormField } from '@/components/ui'
import { Section, PageHeader } from '@/components/layout'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { requireAdmin } from '@/lib/security-server'

export const dynamic = 'force-dynamic'

export default async function TestimonialsPage() {
  await requireAdmin()
  const testimonials = await prisma.testimonial.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="💬 Gestión de Testimonios"
        description="Administra los testimonios de tus clientes"
      />

      {/* Formulario */}
      <Section title="Crear Nuevo Testimonio">
        <form
          action={async (formData) => {
            'use server'
            await createTestimonial(formData)
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Nombre del Cliente" name="name" required />
            <FormField label="Posición/Cargo (opcional)" name="position" />
          </div>
          <FormField label="Testimonio" name="text" type="textarea" required />
          <FormField
            label="Calificación"
            name="rating"
            type="select"
            defaultValue="5"
            options={[
              { value: '5', label: '⭐⭐⭐⭐⭐ (5 estrellas)' },
              { value: '4', label: '⭐⭐⭐⭐ (4 estrellas)' },
              { value: '3', label: '⭐⭐⭐ (3 estrellas)' },
            ]}
          />
          <div className="flex justify-end">
            <Button type="submit">Crear Testimonio</Button>
          </div>
        </form>
      </Section>

      {/* Lista */}
      <Card>
        {testimonials.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
            <span className="mb-4 text-4xl">💬</span>
            <p className="font-medium">No hay testimonios aún</p>
            <p className="text-sm">Tus testimonios aparecerán aquí</p>
          </div>
        ) : (
          <div className="divide-border divide-y">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="flex flex-col gap-4 py-6 md:flex-row md:items-start md:justify-between"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-foreground font-bold">{t.name}</span>
                    <Badge variant={t.isActive ? 'success' : 'default'} className="shadow-sm">
                      {t.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Badge
                      variant={
                        t.status === 'APPROVED'
                          ? 'success'
                          : t.status === 'REJECTED'
                            ? 'destructive'
                            : 'warning'
                      }
                      className="shadow-sm"
                    >
                      {t.status === 'APPROVED'
                        ? '✓ Aprobado'
                        : t.status === 'REJECTED'
                          ? '✕ Rechazado'
                          : '⏳ Pendiente'}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {t.position && <p className="text-muted-foreground text-sm">{t.position}</p>}
                  <div className="flex items-center gap-1">
                    {'⭐'
                      .repeat(t.rating)
                      .split('')
                      .map((s, i) => (
                        <span key={i} className="text-yellow-400 drop-shadow-sm">
                          {s}
                        </span>
                      ))}
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm italic">&quot;{t.text}&quot;</p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-start">
                  {/* Edit */}
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="px-3"
                    aria-label={`Editar testimonio de ${t.name}`}
                  >
                    <Link href={ROUTES.admin.editTestimonial(t.id)}>✏️</Link>
                  </Button>

                  {/* Toggle Active/Inactive */}
                  <form
                    action={async () => {
                      'use server'
                      await toggleTestimonial(t.id)
                    }}
                  >
                    <Button
                      type="submit"
                      variant={t.isActive ? 'secondary' : 'primary'}
                      size="sm"
                      className="shadow-sm"
                    >
                      {t.isActive ? '🔒 Ocultar' : '✅ Aprobar'}
                    </Button>
                  </form>
                  {/* Delete */}
                  <form
                    action={async () => {
                      'use server'
                      await deleteTestimonial(t.id)
                    }}
                  >
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      className="px-3"
                      aria-label={`Eliminar testimonio de ${t.name}`}
                    >
                      🗑️
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
