'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Button, Input, Card } from '@/components/forms'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUploader } from '@/components/media/image-uploader'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
}

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    thumbnailUrl: '',
    categoryId: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    featured: false,
    order: 0,
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await apiClient.getCategories()
      setCategories(data)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.categoryId) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    try {
      setLoading(true)
      await apiClient.createProject(formData)
      router.push('/admin/projects')
    } catch (err) {
      console.error('Error:', err)
      alert('Error al crear el proyecto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Crear Proyecto
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Agrega un nuevo trabajo a tu portfolio
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">
                Título del Proyecto <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ej: Maquillaje para Sesión Editorial"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-12 text-base border-2 focus:border-rose-300 dark:focus:border-rose-700"
                required
              />
              <p className="text-sm text-gray-500">El nombre de tu proyecto</p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-semibold">
                Categoría <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger className="h-12 text-base border-2 focus:border-rose-300">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">¿A qué tipo pertenece este proyecto?</p>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="shortDescription" className="text-base font-semibold">
                Descripción Corta
              </Label>
              <Input
                id="shortDescription"
                placeholder="Una descripción breve en una línea"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="h-12 text-base border-2 focus:border-rose-300 dark:focus:border-rose-700"
              />
              <p className="text-sm text-gray-500">Aparecerá en las tarjetas de proyecto</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Descripción Completa
              </Label>
              <Textarea
                id="description"
                placeholder="Describe tu proyecto en detalle..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="text-base border-2 focus:border-rose-300 dark:focus:border-rose-700 resize-none"
              />
              <p className="text-sm text-gray-500">Cuéntanos más sobre este trabajo</p>
            </div>

            {/* Thumbnail Image */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                Imagen Principal
              </Label>
              <ImageUploader
                value={formData.thumbnailUrl}
                onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                onRemove={() => setFormData({ ...formData, thumbnailUrl: '' })}
                label="Imagen principal del proyecto"
                description="Arrastra una imagen o haz clic para seleccionar"
              />
              <p className="text-sm text-gray-500">Esta será la imagen que se muestre en la portada</p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-base font-semibold">
                Estado
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="h-12 text-base border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Borrador (no visible)</SelectItem>
                  <SelectItem value="PUBLISHED">Publicado (visible)</SelectItem>
                  <SelectItem value="ARCHIVED">Archivado</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">Controla la visibilidad de tu proyecto</p>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-2 border-yellow-200 dark:border-yellow-800">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-yellow-500 text-yellow-600 focus:ring-2 focus:ring-yellow-500 cursor-pointer"
              />
              <div className="flex-1">
                <Label htmlFor="featured" className="text-base font-semibold cursor-pointer">
                  Proyecto Destacado ⭐
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Los proyectos destacados aparecen primero en tu portfolio
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/admin/projects" className="flex-1">
            <Button type="button" variant="outline" className="w-full h-12 text-base border-2">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 h-12 text-base bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-500/30"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Crear Proyecto
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
