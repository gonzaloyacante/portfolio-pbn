import Link from 'next/link'
import { prisma } from '@/lib/db'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import {
  uploadImageAndCreateProject,
  deleteProject,
  createCategory,
  deleteCategory,
} from '@/actions/content.actions'
import ImageUpload from '@/components/admin/ImageUpload'

export default async function GestionPage({ params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params

  if (entity !== 'projects' && entity !== 'categories') {
    return <div>Entidad no válida</div>
  }

  const isProjects = entity === 'projects'

  // Admin: show all projects including soft-deleted ones
  const items = isProjects
    ? await prisma.project.findMany({
        include: { category: true, images: true },
        orderBy: { date: 'desc' },
      })
    : await prisma.category.findMany({ orderBy: { name: 'asc' } })

  const categories = isProjects ? await prisma.category.findMany() : []

  return (
    <div className="p-6">
      <h1 className="mb-8 text-3xl font-bold capitalize">
        Gestión de {isProjects ? 'Proyectos' : 'Categorías'}
      </h1>

      {/* Formulario de Creación */}
      <Card className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          Crear Nuevo {isProjects ? 'Proyecto' : 'Categoría'}
        </h2>
        <form
          action={async (formData) => {
            'use server'
            if (isProjects) {
              await uploadImageAndCreateProject(formData)
            } else {
              await createCategory(formData)
            }
          }}
          className="space-y-4"
        >
          {isProjects ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoría</label>
                  <select
                    name="categoryId"
                    required
                    className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  name="description"
                  rows={3}
                  className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                <input
                  type="date"
                  name="date"
                  className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
                />
              </div>

              <ImageUpload name="images" multiple label="Fotos del Proyecto" />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                  <input
                    type="text"
                    name="slug"
                    required
                    className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  name="description"
                  rows={3}
                  className="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm"
                ></textarea>
              </div>
            </>
          )}

          <Button type="submit">Guardar</Button>
        </form>
      </Card>

      {/* Tabla de Listado */}
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Nombre/Título
              </th>
              {isProjects && (
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Categoría
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {items.map(
              (item: {
                id: string
                title?: string
                name?: string
                date?: Date
                category?: { name: string }
                images?: Array<{ url: string }>
              }) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {isProjects ? item.title : item.name}
                    </div>
                    {isProjects && item.date && (
                      <div className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  {isProjects && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
                        {item.category?.name}
                      </span>
                    </td>
                  )}
                  <td className="flex gap-4 px-6 py-4 text-sm font-medium whitespace-nowrap">
                    {isProjects && (
                      <Link
                        href={`/admin/gestion/projects/${item.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </Link>
                    )}
                    <form
                      action={async () => {
                        'use server'
                        if (isProjects) {
                          await deleteProject(item.id)
                        } else {
                          await deleteCategory(item.id)
                        }
                      }}
                    >
                      <Button type="submit" variant="danger" size="sm">
                        Eliminar
                      </Button>
                    </form>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
