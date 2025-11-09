'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { ImageUploader } from '@/components/image-uploader'

interface Category {
  id: string
  name: string
}

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProject, setIsLoadingProject] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    shortDescription: '',
    description: '',
    thumbnailUrl: '',
    status: 'DRAFT' as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED',
    isFeatured: false,
  })

  // Cargar categorías y datos del proyecto
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar categorías
        const categoriesData = await apiClient.getCategories()
        setCategories(categoriesData)

        // Cargar proyecto
        const project = await apiClient.getProject(projectId)
        setFormData({
          title: project.title || '',
          categoryId: project.categoryId || '',
          shortDescription: project.shortDescription || '',
          description: project.description || '',
          thumbnailUrl: project.thumbnailUrl || '',
          status: project.status || 'DRAFT',
          isFeatured: project.isFeatured || false,
        })
      } catch (error) {
        console.error('Error al cargar datos:', error)
        alert('Error al cargar el proyecto')
        router.push('/admin/projects')
      } finally {
        setIsLoadingProject(false)
      }
    }

    loadData()
  }, [projectId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await apiClient.updateProject(projectId, formData)
      alert('¡Proyecto actualizado con éxito! ✨')
      router.push('/admin/projects')
    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error al guardar los cambios. Por favor, inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500" />
          <p className="mt-4 text-slate-600">Cargando proyecto...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-rose-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a proyectos
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Editar Proyecto
          </h1>
          <p className="text-slate-600 mt-2">
            Actualiza la información de tu proyecto
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Título del Proyecto <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ej: Diseño de logo para StartupXYZ"
                className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                El nombre de tu proyecto
              </p>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Categoría <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all outline-none bg-white"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                ¿A qué tipo pertenece este proyecto?
              </p>
            </div>

            {/* Descripción Corta */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Descripción Corta
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shortDescription: e.target.value,
                  })
                }
                placeholder="Ej: Logo moderno con identidad vibrante"
                className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Aparecerá en las tarjetas de proyecto
              </p>
            </div>

            {/* Descripción Completa */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Descripción Completa
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Cuéntanos más sobre este trabajo..."
                rows={6}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all outline-none resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Cuéntanos más sobre este trabajo
              </p>
            </div>

            {/* Imagen de Portada */}
            <div>
              <ImageUploader
                label="Imagen de Portada"
                description="Esta será la imagen que se muestre en la portada del proyecto"
                value={formData.thumbnailUrl}
                onChange={(url) =>
                  setFormData({ ...formData, thumbnailUrl: url })
                }
                onRemove={() =>
                  setFormData({ ...formData, thumbnailUrl: '' })
                }
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as
                      | 'PUBLISHED'
                      | 'DRAFT'
                      | 'ARCHIVED',
                  })
                }
                className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all outline-none bg-white"
              >
                <option value="DRAFT">Borrador</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="ARCHIVED">Archivado</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Controla la visibilidad de tu proyecto
              </p>
            </div>

            {/* Destacado */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="mt-1 w-5 h-5 text-rose-600 rounded focus:ring-2 focus:ring-rose-300"
                />
                <div>
                  <div className="font-semibold text-slate-700 flex items-center gap-2">
                    <span>⭐</span>
                    Proyecto Destacado
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    Los proyectos destacados aparecerán primero en tu portfolio
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando cambios...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Cambios
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
