'use client''use client';



import { useEffect, useState } from 'react'import { useEffect, useState } from 'react';

import { apiClient } from '@/lib/api-client'import { apiClient } from '@/lib/api-client';

import { Plus, Zap, Pencil, Trash2, Loader2, Save, X } from 'lucide-react'import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

interface Skill {import { Label } from '@/components/ui/label';

  id: stringimport {

  name: string  Dialog,

  level: number  DialogContent,

  description: string | null  DialogDescription,

  order: number  DialogFooter,

}  DialogHeader,

  DialogTitle,

export default function AdminSkillsPage() {} from '@/components/ui/dialog';

  const [skills, setSkills] = useState<Skill[]>([])import {

  const [loading, setLoading] = useState(true)  AlertDialog,

  const [showModal, setShowModal] = useState(false)  AlertDialogAction,

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)  AlertDialogCancel,

  const [formData, setFormData] = useState({  AlertDialogContent,

    name: '',  AlertDialogDescription,

    level: 50,  AlertDialogFooter,

    description: '',  AlertDialogHeader,

    order: 0,  AlertDialogTitle,

  })} from '@/components/ui/alert-dialog';

  const [submitting, setSubmitting] = useState(false)import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Alert, AlertDescription } from '@/components/ui/alert';

  useEffect(() => {import { Plus, Pencil, Trash2, GripVertical, Award } from 'lucide-react';

    loadSkills()

  }, [])interface Skill {

  id: string;

  const loadSkills = async () => {  name: string;

    try {  level: number;

      setLoading(true)  order: number;

      const data = await apiClient.getSkills()  createdAt: string;

      setSkills(data || [])  updatedAt: string;

    } catch (error) {}

      console.error('Error al cargar habilidades:', error)

      alert('Error al cargar las habilidades')interface SkillFormData {

    } finally {  name: string;

      setLoading(false)  level: number;

    }  order: number;

  }}



  const handleOpenModal = (skill?: Skill) => {export default function AdminSkillsPage() {

    if (skill) {  const [skills, setSkills] = useState<Skill[]>([]);

      setEditingSkill(skill)  const [loading, setLoading] = useState(true);

      setFormData({  const [error, setError] = useState('');

        name: skill.name,

        level: skill.level,  // Modals

        description: skill.description || '',  const [createModalOpen, setCreateModalOpen] = useState(false);

        order: skill.order,  const [editModalOpen, setEditModalOpen] = useState(false);

      })  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    } else {

      setEditingSkill(null)  // Selected skill

      setFormData({ name: '', level: 50, description: '', order: 0 })  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    }

    setShowModal(true)  // Form data

  }  const [formData, setFormData] = useState<SkillFormData>({

    name: '',

  const handleCloseModal = () => {    level: 50,

    setShowModal(false)    order: 0,

    setEditingSkill(null)  });

    setFormData({ name: '', level: 50, description: '', order: 0 })

  }  // Submitting state

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()  useEffect(() => {

    setSubmitting(true)    fetchSkills();

  }, []);

    try {

      if (editingSkill) {  const fetchSkills = async () => {

        await apiClient.updateSkill(editingSkill.id, formData)    try {

        alert('¡Habilidad actualizada con éxito! ✨')      setLoading(true);

      } else {      const data = await apiClient.getSkills();

        await apiClient.createSkill(formData)      setSkills(data || []);

        alert('¡Habilidad creada con éxito! ✨')    } catch (err: any) {

      }      setError(err.message || 'Error al cargar skills');

      await loadSkills()    } finally {

      handleCloseModal()      setLoading(false);

    } catch (error) {    }

      console.error('Error:', error)  };

      alert('Hubo un error. Por favor, inténtalo de nuevo.')

    } finally {  const handleCreateSkill = async () => {

      setSubmitting(false)    try {

    }      setSubmitting(true);

  }      setError('');

      await apiClient.createSkill(formData);

  const handleDelete = async (skill: Skill) => {      await fetchSkills();

    if (!confirm(`¿Estás segura de eliminar "${skill.name}"?`)) return      setCreateModalOpen(false);

      resetForm();

    try {    } catch (err: any) {

      await apiClient.deleteSkill(skill.id)      setError(err.message || 'Error al crear skill');

      alert('Habilidad eliminada correctamente')    } finally {

      await loadSkills()      setSubmitting(false);

    } catch (error) {    }

      console.error('Error:', error)  };

      alert('Error al eliminar la habilidad')

    }  const handleUpdateSkill = async () => {

  }    if (!selectedSkill) return;

    try {

  const getLevelColor = (level: number) => {      setSubmitting(true);

    if (level >= 80) return 'from-emerald-500 to-green-500'      setError('');

    if (level >= 60) return 'from-blue-500 to-cyan-500'      await apiClient.updateSkill(selectedSkill.id, formData);

    if (level >= 40) return 'from-amber-500 to-yellow-500'      await fetchSkills();

    return 'from-slate-400 to-slate-500'      setEditModalOpen(false);

  }      setSelectedSkill(null);

      resetForm();

  const getLevelText = (level: number) => {    } catch (err: any) {

    if (level >= 80) return 'Experta'      setError(err.message || 'Error al actualizar skill');

    if (level >= 60) return 'Avanzada'    } finally {

    if (level >= 40) return 'Intermedia'      setSubmitting(false);

    return 'Principiante'    }

  }  };



  if (loading) {  const handleDeleteSkill = async () => {

    return (    if (!selectedSkill) return;

      <div className="flex items-center justify-center min-h-screen">    try {

        <div className="text-center">      setSubmitting(true);

          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />      setError('');

          <p className="mt-4 text-slate-600">Cargando habilidades...</p>      await apiClient.deleteSkill(selectedSkill.id);

        </div>      await fetchSkills();

      </div>      setDeleteModalOpen(false);

    )      setSelectedSkill(null);

  }    } catch (err: any) {

      setError(err.message || 'Error al eliminar skill');

  return (    } finally {

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8">      setSubmitting(false);

      <div className="max-w-6xl mx-auto">    }

        {/* Header */}  };

        <div className="mb-8">

          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">  const openEditModal = (skill: Skill) => {

            Habilidades y Capacidades    setSelectedSkill(skill);

          </h1>    setFormData({

          <p className="text-slate-600 mt-2">      name: skill.name,

            Muestra tus fortalezas y experiencia      level: skill.level,

          </p>      order: skill.order,

        </div>    });

    setEditModalOpen(true);

        {/* Add Button */}  };

        <button

          onClick={() => handleOpenModal()}  const openDeleteModal = (skill: Skill) => {

          className="mb-6 inline-flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"    setSelectedSkill(skill);

        >    setDeleteModalOpen(true);

          <Plus className="w-5 h-5" />  };

          Nueva Habilidad

        </button>  const openCreateModal = () => {

    resetForm();

        {/* Skills Grid */}    setCreateModalOpen(true);

        {skills.length === 0 ? (  };

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 text-center">

            <Zap className="w-16 h-16 mx-auto text-slate-300 mb-4" />  const resetForm = () => {

            <h3 className="text-xl font-semibold text-slate-700 mb-2">    setFormData({

              No hay habilidades todavía      name: '',

            </h3>      level: 50,

            <p className="text-slate-500">      order: 0,

              Añade tus primeras habilidades para destacar tu experiencia    });

            </p>    setError('');

          </div>  };

        ) : (

          <div className="space-y-4">  // Sort skills by order

            {skills.map((skill) => (  const sortedSkills = [...skills].sort((a, b) => a.order - b.order);

              <div

                key={skill.id}  if (loading) {

                className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all"    return (

              >      <div className="space-y-4">

                <div className="flex items-start gap-4">        <h1 className="text-3xl font-bold">Skills</h1>

                  {/* Icon */}        <div className="flex items-center justify-center h-64">

                  <div          <div className="text-center">

                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getLevelColor(            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />

                      skill.level            <p className="mt-2 text-sm text-muted-foreground">Cargando skills...</p>

                    )} flex items-center justify-center flex-shrink-0 shadow-lg`}          </div>

                  >        </div>

                    <Zap className="w-6 h-6 text-white" />      </div>

                  </div>    );

  }

                  {/* Content */}

                  <div className="flex-1 min-w-0">  return (

                    <div className="flex items-start justify-between gap-4 mb-3">    <div className="space-y-6">

                      <div className="flex-1 min-w-0">      {/* Header */}

                        <h3 className="text-lg font-bold text-slate-800 mb-1">      <div className="flex items-center justify-between">

                          {skill.name}        <div>

                        </h3>          <h1 className="text-3xl font-bold">Skills & Habilidades</h1>

                        {skill.description && (          <p className="text-muted-foreground">

                          <p className="text-sm text-slate-600">            Gestiona las habilidades y especialidades

                            {skill.description}          </p>

                          </p>        </div>

                        )}        <Button onClick={openCreateModal}>

                      </div>          <Plus className="h-4 w-4 mr-2" />

                      <div className="flex gap-2 flex-shrink-0">          Nueva Skill

                        <button        </Button>

                          onClick={() => handleOpenModal(skill)}      </div>

                          className="p-2 rounded-lg border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors"

                        >      {/* Error Alert */}

                          <Pencil className="w-4 h-4" />      {error && (

                        </button>        <Alert variant="destructive">

                        <button          <AlertDescription>{error}</AlertDescription>

                          onClick={() => handleDelete(skill)}        </Alert>

                          className="p-2 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors"      )}

                        >

                          <Trash2 className="w-4 h-4" />      {/* Skills Grid */}

                        </button>      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                      </div>        {sortedSkills.length === 0 ? (

                    </div>          <Card className="col-span-full">

            <CardContent className="flex items-center justify-center h-32">

                    {/* Progress Bar */}              <p className="text-muted-foreground">No hay skills creadas</p>

                    <div className="mb-2">            </CardContent>

                      <div className="flex items-center justify-between mb-2">          </Card>

                        <span className="text-sm font-semibold text-slate-700">        ) : (

                          {getLevelText(skill.level)}          sortedSkills.map((skill) => (

                        </span>            <Card key={skill.id} className="relative group">

                        <span className="text-sm font-bold text-slate-700">              <CardHeader className="pb-3">

                          {skill.level}%                <div className="flex items-start justify-between">

                        </span>                  <div className="flex items-center gap-3 flex-1">

                      </div>                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />

                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">                    <div className="flex-1">

                        <div                      <CardTitle className="text-base flex items-center gap-2">

                          className={`h-full bg-gradient-to-r ${getLevelColor(                        <Award className="h-4 w-4" />

                            skill.level                        {skill.name}

                          )} rounded-full transition-all duration-500 shadow-inner`}                      </CardTitle>

                          style={{ width: `${skill.level}%` }}                      <p className="text-xs text-muted-foreground mt-1">Orden: {skill.order}</p>

                        />                    </div>

                      </div>                  </div>

                    </div>                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                  </div>                    <Button

                </div>                      variant="ghost"

              </div>                      size="icon"

            ))}                      onClick={() => openEditModal(skill)}

          </div>                      className="h-8 w-8"

        )}                    >

                      <Pencil className="h-3 w-3" />

        {/* Info Card */}                    </Button>

        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200 p-6">                    <Button

          <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">                      variant="ghost"

            💡 Consejos                      size="icon"

          </h4>                      onClick={() => openDeleteModal(skill)}

          <ul className="text-sm text-slate-600 space-y-2">                      className="h-8 w-8"

            <li>• El nivel determina el color de la barra de progreso</li>                    >

            <li>• 80-100%: Experta (verde) | 60-79%: Avanzada (azul)</li>                      <Trash2 className="h-3 w-3 text-destructive" />

            <li>                    </Button>

              • 40-59%: Intermedia (amarillo) | 0-39%: Principiante (gris)                  </div>

            </li>                </div>

            <li>• El orden determina cómo aparecen en tu portfolio</li>              </CardHeader>

          </ul>              <CardContent>

        </div>                <div className="space-y-2">

      </div>                  <div className="flex items-center justify-between text-sm">

                    <span className="text-muted-foreground">Nivel</span>

      {/* Modal */}                    <span className="font-medium">{skill.level}%</span>

      {showModal && (                  </div>

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">

          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">                    <div

            {/* Modal Header */}                      className="bg-primary h-2 rounded-full transition-all"

            <div className="p-6 border-b border-slate-100">                      style={{ width: `${skill.level}%` }}

              <div className="flex items-center justify-between">                    />

                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">                  </div>

                  {editingSkill ? 'Editar Habilidad' : 'Nueva Habilidad'}                </div>

                </h2>              </CardContent>

                <button            </Card>

                  onClick={handleCloseModal}          ))

                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"        )}

                >      </div>

                  <X className="w-5 h-5 text-slate-400" />

                </button>      {/* Info Card */}

              </div>      <Card>

            </div>        <CardContent className="p-4">

          <div className="flex items-start gap-3">

            {/* Modal Body */}            <div className="flex-shrink-0 mt-0.5">

            <form onSubmit={handleSubmit} className="p-6 space-y-5">              <svg

              {/* Name */}                className="h-5 w-5 text-blue-500"

              <div>                fill="none"

                <label className="block text-sm font-semibold text-slate-700 mb-2">                strokeLinecap="round"

                  Nombre de la Habilidad{' '}                strokeLinejoin="round"

                  <span className="text-rose-500">*</span>                strokeWidth="2"

                </label>                viewBox="0 0 24 24"

                <input                stroke="currentColor"

                  type="text"              >

                  required                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>

                  value={formData.name}              </svg>

                  onChange={(e) =>            </div>

                    setFormData({ ...formData, name: e.target.value })            <div className="flex-1">

                  }              <p className="text-sm font-medium">Consejos para skills</p>

                  placeholder="Ej: Photoshop, Organización, Creatividad..."              <ul className="mt-2 text-sm text-muted-foreground space-y-1">

                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"                <li>• El nivel representa tu dominio de la habilidad (0-100%)</li>

                />                <li>• Usa el orden para controlar cómo aparecen en el sitio</li>

                <p className="text-xs text-slate-500 mt-1">                <li>• Arrastra el ícono ⋮⋮ para reordenar (próximamente)</li>

                  ¿En qué eres buena?              </ul>

                </p>            </div>

              </div>          </div>

        </CardContent>

              {/* Level */}      </Card>

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">      {/* Create/Edit Modal */}

                  Nivel de Dominio      <Dialog

                </label>        open={createModalOpen || editModalOpen}

                <div className="space-y-3">        onOpenChange={(open) => {

                  <input          if (!open) {

                    type="range"            setCreateModalOpen(false);

                    min="0"            setEditModalOpen(false);

                    max="100"            setSelectedSkill(null);

                    value={formData.level}            resetForm();

                    onChange={(e) =>          }

                      setFormData({        }}

                        ...formData,      >

                        level: parseInt(e.target.value),        <DialogContent className="max-w-md">

                      })          <DialogHeader>

                    }            <DialogTitle>

                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"              {createModalOpen ? 'Crear Nueva Skill' : 'Editar Skill'}

                  />            </DialogTitle>

                  <div className="flex items-center justify-between">            <DialogDescription>

                    <span className="text-sm text-slate-600">              {createModalOpen

                      {getLevelText(formData.level)}                ? 'Completa los datos para crear una nueva habilidad'

                    </span>                : 'Actualiza la información de la habilidad'}

                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">            </DialogDescription>

                      {formData.level}%          </DialogHeader>

                    </span>

                  </div>          <div className="space-y-4">

                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">            {/* Name */}

                    <div            <div className="space-y-2">

                      className={`h-full bg-gradient-to-r ${getLevelColor(              <Label htmlFor="name">Nombre *</Label>

                        formData.level              <Input

                      )} rounded-full transition-all duration-300`}                id="name"

                      style={{ width: `${formData.level}%` }}                value={formData.name}

                    />                onChange={(e) => setFormData({ ...formData, name: e.target.value })}

                  </div>                placeholder="Ej: Maquillaje de novias"

                </div>              />

                <p className="text-xs text-slate-500 mt-2">            </div>

                  Desliza para ajustar tu nivel de experiencia

                </p>            {/* Level */}

              </div>            <div className="space-y-2">

              <Label htmlFor="level">Nivel ({formData.level}%)</Label>

              {/* Description */}              <Input

              <div>                id="level"

                <label className="block text-sm font-semibold text-slate-700 mb-2">                type="range"

                  Descripción (opcional)                min="0"

                </label>                max="100"

                <textarea                step="5"

                  value={formData.description}                value={formData.level}

                  onChange={(e) =>                onChange={(e) =>

                    setFormData({ ...formData, description: e.target.value })                  setFormData({ ...formData, level: parseInt(e.target.value) })

                  }                }

                  placeholder="Breve descripción de tu experiencia..."                className="w-full"

                  rows={3}              />

                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all outline-none resize-none"              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">

                />                <div

                <p className="text-xs text-slate-500 mt-1">                  className="bg-primary h-2 rounded-full transition-all"

                  Explica un poco más sobre esta habilidad                  style={{ width: `${formData.level}%` }}

                </p>                />

              </div>              </div>

            </div>

              {/* Order */}

              <div>            {/* Order */}

                <label className="block text-sm font-semibold text-slate-700 mb-2">            <div className="space-y-2">

                  Orden de Aparición              <Label htmlFor="order">Orden</Label>

                </label>              <Input

                <input                id="order"

                  type="number"                type="number"

                  value={formData.order}                value={formData.order}

                  onChange={(e) =>                onChange={(e) =>

                    setFormData({                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })

                      ...formData,                }

                      order: parseInt(e.target.value) || 0,                placeholder="0"

                    })              />

                  }              <p className="text-xs text-muted-foreground">

                  placeholder="0"                Las skills se ordenan de menor a mayor

                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"              </p>

                />            </div>

                <p className="text-xs text-slate-500 mt-1">          </div>

                  Números más bajos aparecen primero

                </p>          <DialogFooter>

              </div>            <Button

              variant="outline"

              {/* Buttons */}              onClick={() => {

              <div className="flex gap-3 pt-4">                setCreateModalOpen(false);

                <button                setEditModalOpen(false);

                  type="button"                setSelectedSkill(null);

                  onClick={handleCloseModal}                resetForm();

                  disabled={submitting}              }}

                  className="flex-1 h-12 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"              disabled={submitting}

                >            >

                  Cancelar              Cancelar

                </button>            </Button>

                <button            <Button

                  type="submit"              onClick={createModalOpen ? handleCreateSkill : handleUpdateSkill}

                  disabled={submitting || !formData.name}              disabled={submitting || !formData.name}

                  className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"            >

                >              {submitting ? 'Guardando...' : createModalOpen ? 'Crear' : 'Actualizar'}

                  {submitting ? (            </Button>

                    <>          </DialogFooter>

                      <Loader2 className="w-5 h-5 animate-spin" />        </DialogContent>

                      Guardando...      </Dialog>

                    </>

                  ) : (      {/* Delete Confirmation */}

                    <>      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>

                      <Save className="w-5 h-5" />        <AlertDialogContent>

                      {editingSkill ? 'Guardar Cambios' : 'Crear Habilidad'}          <AlertDialogHeader>

                    </>            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>

                  )}            <AlertDialogDescription>

                </button>              Esta acción no se puede deshacer. Se eliminará permanentemente la skill "

              </div>              {selectedSkill?.name}".

            </form>            </AlertDialogDescription>

          </div>          </AlertDialogHeader>

        </div>          <AlertDialogFooter>

      )}            <AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel>

    </div>            <AlertDialogAction

  )              onClick={handleDeleteSkill}

}              disabled={submitting}

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
