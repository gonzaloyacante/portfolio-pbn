import { prisma } from '@/lib/db'
import { createTestimonial, deleteTestimonial } from '@/actions/testimonials.actions'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-8 text-3xl font-bold">Gestión de Testimonios</h1>

      {/* Formulario de Creación */}
      <Card className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Crear Nuevo Testimonio</h2>
        <form
          action={async (formData) => {
            'use server'
            await createTestimonial(formData)
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
              <input
                type="text"
                name="name"
                required
                className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Posición/Cargo (opcional)
              </label>
              <input
                type="text"
                name="position"
                className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Testimonio</label>
            <textarea
              name="text"
              required
              rows={4}
              className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Calificación</label>
            <select
              name="rating"
              defaultValue="5"
              className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 estrellas)</option>
              <option value="4">⭐⭐⭐⭐ (4 estrellas)</option>
              <option value="3">⭐⭐⭐ (3 estrellas)</option>
            </select>
          </div>

          <Button type="submit">Crear Testimonio</Button>
        </form>
      </Card>

      {/* Tabla de Testimonios */}
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Testimonio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.position || '-'}</div>
                  <div className="text-yellow-400">{'⭐'.repeat(testimonial.rating)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-md truncate text-sm text-gray-700">{testimonial.text}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${
                      testimonial.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {testimonial.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <form
                    action={async () => {
                      'use server'
                      await deleteTestimonial(testimonial.id)
                    }}
                  >
                    <Button type="submit" variant="danger" size="sm">
                      Eliminar
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
