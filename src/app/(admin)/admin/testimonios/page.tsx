import { prisma } from '@/lib/db'
import { createTestimonial, deleteTestimonial } from '@/actions/testimonials.actions'
import { Button, Card, Badge } from '@/components/ui'
import { FormField, Section } from '@/components/admin'

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <h1 className="text-3xl font-bold">Gestión de Testimonios</h1>

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
          <Button type="submit">Crear Testimonio</Button>
        </form>
      </Section>

      {/* Lista */}
      <Card>
        {testimonials.length === 0 ? (
          <p className="text-center text-gray-500">No hay testimonios</p>
        ) : (
          <div className="divide-y">
            {testimonials.map((t) => (
              <div key={t.id} className="flex items-start justify-between py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t.name}</span>
                    <Badge variant={t.isActive ? 'success' : 'default'}>
                      {t.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  {t.position && <p className="text-sm text-gray-500">{t.position}</p>}
                  <p className="text-yellow-400">{'⭐'.repeat(t.rating)}</p>
                  <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{t.text}</p>
                </div>
                <form
                  action={async () => {
                    'use server'
                    await deleteTestimonial(t.id)
                  }}
                >
                  <Button type="submit" variant="danger" size="sm">
                    Eliminar
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
