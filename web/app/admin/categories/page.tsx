'use client''use client';



import { useEffect, useState } from 'react'import { useEffect, useState } from 'react';

import { apiClient } from '@/lib/api-client'import { apiClient } from '@/lib/api-client';

import { Plus, FolderOpen, Pencil, Trash2, Loader2, Save, X } from 'lucide-react'import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

interface Category {import { Label } from '@/components/ui/label';

  id: stringimport { Textarea } from '@/components/ui/textarea';

  name: stringimport {

  slug: string  Dialog,

  description: string  DialogContent,

  order: number  DialogDescription,

  _count?: {  DialogFooter,

    projects: number  DialogHeader,

  }  DialogTitle,

}} from '@/components/ui/dialog';

import {

export default function AdminCategoriesPage() {  AlertDialog,

  const [categories, setCategories] = useState<Category[]>([])  AlertDialogAction,

  const [loading, setLoading] = useState(true)  AlertDialogCancel,

  const [showModal, setShowModal] = useState(false)  AlertDialogContent,

  const [editingCategory, setEditingCategory] = useState<Category | null>(null)  AlertDialogDescription,

  const [formData, setFormData] = useState({  AlertDialogFooter,

    name: '',  AlertDialogHeader,

    description: '',  AlertDialogTitle,

    order: 0,} from '@/components/ui/alert-dialog';

  })import {

  const [submitting, setSubmitting] = useState(false)  Table,

  TableBody,

  useEffect(() => {  TableCell,

    loadCategories()  TableHead,

  }, [])  TableHeader,

  TableRow,

  const loadCategories = async () => {} from '@/components/ui/table';

    try {import { Card, CardContent } from '@/components/ui/card';

      setLoading(true)import { Alert, AlertDescription } from '@/components/ui/alert';

      const data = await apiClient.getCategories()import {

      setCategories(data || [])  Plus,

    } catch (error) {  Pencil,

      console.error('Error al cargar categorías:', error)  Trash2,

      alert('Error al cargar las categorías')  GripVertical,

    } finally {  FolderOpen,

      setLoading(false)} from 'lucide-react';

    }

  }interface Category {

  id: string;

  const handleOpenModal = (category?: Category) => {  name: string;

    if (category) {  slug: string;

      setEditingCategory(category)  description: string;

      setFormData({  order: number;

        name: category.name,  createdAt: string;

        description: category.description || '',  updatedAt: string;

        order: category.order,  _count?: {

      })    projects: number;

    } else {  };

      setEditingCategory(null)}

      setFormData({ name: '', description: '', order: 0 })

    }interface CategoryFormData {

    setShowModal(true)  name: string;

  }  description: string;

  order: number;

  const handleCloseModal = () => {}

    setShowModal(false)

    setEditingCategory(null)export default function AdminCategoriesPage() {

    setFormData({ name: '', description: '', order: 0 })  const [categories, setCategories] = useState<Category[]>([]);

  }  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()  // Modals

    setSubmitting(true)  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);

    try {  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

      if (editingCategory) {

        await apiClient.updateCategory(editingCategory.id, formData)  // Selected category

        alert('¡Categoría actualizada con éxito! ✨')  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

      } else {

        await apiClient.createCategory(formData)  // Form data

        alert('¡Categoría creada con éxito! ✨')  const [formData, setFormData] = useState<CategoryFormData>({

      }    name: '',

      await loadCategories()    description: '',

      handleCloseModal()    order: 0,

    } catch (error) {  });

      console.error('Error:', error)

      alert('Hubo un error. Por favor, inténtalo de nuevo.')  // Submitting state

    } finally {  const [submitting, setSubmitting] = useState(false);

      setSubmitting(false)

    }  useEffect(() => {

  }    fetchCategories();

  }, []);

  const handleDelete = async (category: Category) => {

    if (category._count && category._count.projects > 0) {  const fetchCategories = async () => {

      alert(    try {

        `No se puede eliminar esta categoría porque tiene ${category._count.projects} proyecto(s) asociado(s).`      setLoading(true);

      )      const data = await apiClient.getCategories();

      return      setCategories(data || []);

    }    } catch (err: any) {

      setError(err.message || 'Error al cargar categorías');

    if (!confirm(`¿Estás segura de eliminar "${category.name}"?`)) return    } finally {

      setLoading(false);

    try {    }

      await apiClient.deleteCategory(category.id)  };

      alert('Categoría eliminada correctamente')

      await loadCategories()  const handleCreateCategory = async () => {

    } catch (error) {    try {

      console.error('Error:', error)      setSubmitting(true);

      alert('Error al eliminar la categoría')      setError('');

    }      await apiClient.createCategory(formData);

  }      await fetchCategories();

      setCreateModalOpen(false);

  if (loading) {      resetForm();

    return (    } catch (err: any) {

      <div className="flex items-center justify-center min-h-screen">      setError(err.message || 'Error al crear categoría');

        <div className="text-center">    } finally {

          <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500" />      setSubmitting(false);

          <p className="mt-4 text-slate-600">Cargando categorías...</p>    }

        </div>  };

      </div>

    )  const handleUpdateCategory = async () => {

  }    if (!selectedCategory) return;

    try {

  return (      setSubmitting(true);

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8">      setError('');

      <div className="max-w-6xl mx-auto">      await apiClient.updateCategory(selectedCategory.id, formData);

        {/* Header */}      await fetchCategories();

        <div className="mb-8">      setEditModalOpen(false);

          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">      setSelectedCategory(null);

            Categorías de Proyectos      resetForm();

          </h1>    } catch (err: any) {

          <p className="text-slate-600 mt-2">      setError(err.message || 'Error al actualizar categoría');

            Organiza tus proyectos en diferentes tipos    } finally {

          </p>      setSubmitting(false);

        </div>    }

  };

        {/* Add Button */}

        <button  const handleDeleteCategory = async () => {

          onClick={() => handleOpenModal()}    if (!selectedCategory) return;

          className="mb-6 inline-flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"    try {

        >      setSubmitting(true);

          <Plus className="w-5 h-5" />      setError('');

          Nueva Categoría      await apiClient.deleteCategory(selectedCategory.id);

        </button>      await fetchCategories();

      setDeleteModalOpen(false);

        {/* Categories Grid */}      setSelectedCategory(null);

        {categories.length === 0 ? (    } catch (err: any) {

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 text-center">      setError(err.message || 'Error al eliminar categoría');

            <FolderOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />    } finally {

            <h3 className="text-xl font-semibold text-slate-700 mb-2">      setSubmitting(false);

              No hay categorías todavía    }

            </h3>  };

            <p className="text-slate-500">

              Crea tu primera categoría para organizar tus proyectos  const openEditModal = (category: Category) => {

            </p>    setSelectedCategory(category);

          </div>    setFormData({

        ) : (      name: category.name,

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">      description: category.description,

            {categories.map((category) => (      order: category.order,

              <div    });

                key={category.id}    setEditModalOpen(true);

                className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all"  };

              >

                {/* Icon & Name */}  const openDeleteModal = (category: Category) => {

                <div className="flex items-start gap-3 mb-4">    setSelectedCategory(category);

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center flex-shrink-0">    setDeleteModalOpen(true);

                    <FolderOpen className="w-6 h-6 text-purple-600" />  };

                  </div>

                  <div className="flex-1 min-w-0">  const openCreateModal = () => {

                    <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">    resetForm();

                      {category.name}    setCreateModalOpen(true);

                    </h3>  };

                    <code className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">

                      {category.slug}  const resetForm = () => {

                    </code>    setFormData({

                  </div>      name: '',

                </div>      description: '',

      order: 0,

                {/* Description */}    });

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">    setError('');

                  {category.description || 'Sin descripción'}  };

                </p>

  // Sort categories by order

                {/* Stats */}  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

                <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">

                  <span>{category._count?.projects || 0} proyectos</span>  if (loading) {

                  <span>•</span>    return (

                  <span>Orden: {category.order}</span>      <div className="space-y-4">

                </div>        <h1 className="text-3xl font-bold">Categorías</h1>

        <div className="flex items-center justify-center h-64">

                {/* Actions */}          <div className="text-center">

                <div className="flex gap-2">            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />

                  <button            <p className="mt-2 text-sm text-muted-foreground">Cargando categorías...</p>

                    onClick={() => handleOpenModal(category)}          </div>

                    className="flex-1 h-10 flex items-center justify-center gap-2 border-2 border-purple-200 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"        </div>

                  >      </div>

                    <Pencil className="w-4 h-4" />    );

                    Editar  }

                  </button>

                  <button  return (

                    onClick={() => handleDelete(category)}    <div className="space-y-6">

                    disabled={category._count && category._count.projects > 0}      {/* Header */}

                    className="h-10 px-4 border-2 border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"      <div className="flex items-center justify-between">

                  >        <div>

                    <Trash2 className="w-4 h-4" />          <h1 className="text-3xl font-bold">Categorías</h1>

                  </button>          <p className="text-muted-foreground">

                </div>            Gestiona las categorías de proyectos

              </div>          </p>

            ))}        </div>

          </div>        <Button onClick={openCreateModal}>

        )}          <Plus className="h-4 w-4 mr-2" />

          Nueva Categoría

        {/* Info Card */}        </Button>

        <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-200 p-6">      </div>

          <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">

            💡 Consejos      {/* Error Alert */}

          </h4>      {error && (

          <ul className="text-sm text-slate-600 space-y-2">        <Alert variant="destructive">

            <li>• Las categorías te ayudan a organizar tus proyectos por tipo</li>          <AlertDescription>{error}</AlertDescription>

            <li>        </Alert>

              • No puedes eliminar una categoría que tiene proyectos asociados      )}

            </li>

            <li>• El orden determina cómo aparecen en tu portfolio</li>      {/* Categories Table */}

          </ul>      <Card>

        </div>        <CardContent className="p-0">

      </div>          <Table>

            <TableHeader>

      {/* Modal */}              <TableRow>

      {showModal && (                <TableHead className="w-12"></TableHead>

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">                <TableHead>Nombre</TableHead>

          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">                <TableHead>Slug</TableHead>

            {/* Modal Header */}                <TableHead>Descripción</TableHead>

            <div className="p-6 border-b border-slate-100">                <TableHead>Proyectos</TableHead>

              <div className="flex items-center justify-between">                <TableHead>Orden</TableHead>

                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">                <TableHead className="text-right">Acciones</TableHead>

                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}              </TableRow>

                </h2>            </TableHeader>

                <button            <TableBody>

                  onClick={handleCloseModal}              {sortedCategories.length === 0 ? (

                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"                <TableRow>

                >                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">

                  <X className="w-5 h-5 text-slate-400" />                    No hay categorías creadas

                </button>                  </TableCell>

              </div>                </TableRow>

            </div>              ) : (

                sortedCategories.map((category) => (

            {/* Modal Body */}                  <TableRow key={category.id}>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">                    <TableCell>

              {/* Name */}                      <div className="flex items-center justify-center">

              <div>                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />

                <label className="block text-sm font-semibold text-slate-700 mb-2">                      </div>

                  Nombre de la Categoría <span className="text-rose-500">*</span>                    </TableCell>

                </label>                    <TableCell className="font-medium">

                <input                      <div className="flex items-center gap-2">

                  type="text"                        <FolderOpen className="h-4 w-4 text-muted-foreground" />

                  required                        {category.name}

                  value={formData.name}                      </div>

                  onChange={(e) =>                    </TableCell>

                    setFormData({ ...formData, name: e.target.value })                    <TableCell>

                  }                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">

                  placeholder="Ej: Bodas, Quinceañeras, Empresarial..."                        {category.slug}

                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all outline-none"                      </code>

                />                    </TableCell>

                <p className="text-xs text-slate-500 mt-1">                    <TableCell className="max-w-md truncate">

                  ¿Qué tipo de proyectos agrupa?                      {category.description || (

                </p>                        <span className="text-muted-foreground italic">Sin descripción</span>

              </div>                      )}

                    </TableCell>

              {/* Description */}                    <TableCell>

              <div>                      <span className="text-sm">

                <label className="block text-sm font-semibold text-slate-700 mb-2">                        {category._count?.projects || 0} proyectos

                  Descripción                      </span>

                </label>                    </TableCell>

                <textarea                    <TableCell>{category.order}</TableCell>

                  value={formData.description}                    <TableCell className="text-right">

                  onChange={(e) =>                      <div className="flex justify-end gap-2">

                    setFormData({ ...formData, description: e.target.value })                        <Button

                  }                          variant="ghost"

                  placeholder="Breve descripción de esta categoría..."                          size="icon"

                  rows={3}                          onClick={() => openEditModal(category)}

                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all outline-none resize-none"                          title="Editar"

                />                        >

                <p className="text-xs text-slate-500 mt-1">                          <Pencil className="h-4 w-4" />

                  Ayuda a los visitantes a entender el tipo de trabajo                        </Button>

                </p>                        <Button

              </div>                          variant="ghost"

                          size="icon"

              {/* Order */}                          onClick={() => openDeleteModal(category)}

              <div>                          title="Eliminar"

                <label className="block text-sm font-semibold text-slate-700 mb-2">                          disabled={category._count && category._count.projects > 0}

                  Orden de Aparición                        >

                </label>                          <Trash2 className="h-4 w-4 text-destructive" />

                <input                        </Button>

                  type="number"                      </div>

                  value={formData.order}                    </TableCell>

                  onChange={(e) =>                  </TableRow>

                    setFormData({                ))

                      ...formData,              )}

                      order: parseInt(e.target.value) || 0,            </TableBody>

                    })          </Table>

                  }        </CardContent>

                  placeholder="0"      </Card>

                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all outline-none"

                />      {/* Info Card */}

                <p className="text-xs text-slate-500 mt-1">      <Card>

                  Números más bajos aparecen primero        <CardContent className="p-4">

                </p>          <div className="flex items-start gap-3">

              </div>            <div className="flex-shrink-0 mt-0.5">

              <svg

              {/* Buttons */}                className="h-5 w-5 text-blue-500"

              <div className="flex gap-3 pt-4">                fill="none"

                <button                strokeLinecap="round"

                  type="button"                strokeLinejoin="round"

                  onClick={handleCloseModal}                strokeWidth="2"

                  disabled={submitting}                viewBox="0 0 24 24"

                  className="flex-1 h-12 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"                stroke="currentColor"

                >              >

                  Cancelar                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>

                </button>              </svg>

                <button            </div>

                  type="submit"            <div className="flex-1">

                  disabled={submitting || !formData.name}              <p className="text-sm font-medium">Consejos para categorías</p>

                  className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"              <ul className="mt-2 text-sm text-muted-foreground space-y-1">

                >                <li>• Las categorías con proyectos asociados no se pueden eliminar</li>

                  {submitting ? (                <li>• El slug se genera automáticamente a partir del nombre</li>

                    <>                <li>• Usa el orden para controlar cómo aparecen en el sitio público</li>

                      <Loader2 className="w-5 h-5 animate-spin" />                <li>• Arrastra el ícono ⋮⋮ para reordenar (próximamente)</li>

                      Guardando...              </ul>

                    </>            </div>

                  ) : (          </div>

                    <>        </CardContent>

                      <Save className="w-5 h-5" />      </Card>

                      {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}

                    </>      {/* Create/Edit Modal */}

                  )}      <Dialog

                </button>        open={createModalOpen || editModalOpen}

              </div>        onOpenChange={(open) => {

            </form>          if (!open) {

          </div>            setCreateModalOpen(false);

        </div>            setEditModalOpen(false);

      )}            setSelectedCategory(null);

    </div>            resetForm();

  )          }

}        }}

      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {createModalOpen ? 'Crear Nueva Categoría' : 'Editar Categoría'}
            </DialogTitle>
            <DialogDescription>
              {createModalOpen
                ? 'Completa los datos para crear una nueva categoría'
                : 'Actualiza la información de la categoría'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Novias"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descripción de la categoría..."
                rows={3}
              />
            </div>

            {/* Order */}
            <div className="space-y-2">
              <Label htmlFor="order">Orden</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Las categorías se ordenan de menor a mayor
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateModalOpen(false);
                setEditModalOpen(false);
                setSelectedCategory(null);
                resetForm();
              }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={createModalOpen ? handleCreateCategory : handleUpdateCategory}
              disabled={submitting || !formData.name}
            >
              {submitting ? 'Guardando...' : createModalOpen ? 'Crear' : 'Actualizar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la categoría "
              {selectedCategory?.name}".
              {selectedCategory?._count && selectedCategory._count.projects > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  ⚠️ Esta categoría tiene {selectedCategory._count.projects} proyecto(s)
                  asociado(s). No se puede eliminar.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={
                submitting ||
                (selectedCategory?._count && selectedCategory._count.projects > 0)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
