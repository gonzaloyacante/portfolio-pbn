'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Pencil, Trash2, GripVertical, Award } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface SkillFormData {
  name: string;
  level: number;
  order: number;
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Selected skill
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Form data
  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    level: 50,
    order: 0,
  });

  // Submitting state
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSkills();
      setSkills(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar skills');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSkill = async () => {
    try {
      setSubmitting(true);
      setError('');
      await apiClient.createSkill(formData);
      await fetchSkills();
      setCreateModalOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Error al crear skill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSkill = async () => {
    if (!selectedSkill) return;
    try {
      setSubmitting(true);
      setError('');
      await apiClient.updateSkill(selectedSkill.id, formData);
      await fetchSkills();
      setEditModalOpen(false);
      setSelectedSkill(null);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar skill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async () => {
    if (!selectedSkill) return;
    try {
      setSubmitting(true);
      setError('');
      await apiClient.deleteSkill(selectedSkill.id);
      await fetchSkills();
      setDeleteModalOpen(false);
      setSelectedSkill(null);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar skill');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (skill: Skill) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name,
      level: skill.level,
      order: skill.order,
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (skill: Skill) => {
    setSelectedSkill(skill);
    setDeleteModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setCreateModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      level: 50,
      order: 0,
    });
    setError('');
  };

  // Sort skills by order
  const sortedSkills = [...skills].sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Skills</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-sm text-muted-foreground">Cargando skills...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skills & Habilidades</h1>
          <p className="text-muted-foreground">
            Gestiona las habilidades y especialidades
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Skill
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Skills Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedSkills.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No hay skills creadas</p>
            </CardContent>
          </Card>
        ) : (
          sortedSkills.map((skill) => (
            <Card key={skill.id} className="relative group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        {skill.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Orden: {skill.order}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(skill)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteModal(skill)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Nivel</span>
                    <span className="font-medium">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Info Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="h-5 w-5 text-blue-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Consejos para skills</p>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                <li>• El nivel representa tu dominio de la habilidad (0-100%)</li>
                <li>• Usa el orden para controlar cómo aparecen en el sitio</li>
                <li>• Arrastra el ícono ⋮⋮ para reordenar (próximamente)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog
        open={createModalOpen || editModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateModalOpen(false);
            setEditModalOpen(false);
            setSelectedSkill(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {createModalOpen ? 'Crear Nueva Skill' : 'Editar Skill'}
            </DialogTitle>
            <DialogDescription>
              {createModalOpen
                ? 'Completa los datos para crear una nueva habilidad'
                : 'Actualiza la información de la habilidad'}
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
                placeholder="Ej: Maquillaje de novias"
              />
            </div>

            {/* Level */}
            <div className="space-y-2">
              <Label htmlFor="level">Nivel ({formData.level}%)</Label>
              <Input
                id="level"
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${formData.level}%` }}
                />
              </div>
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
                Las skills se ordenan de menor a mayor
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateModalOpen(false);
                setEditModalOpen(false);
                setSelectedSkill(null);
                resetForm();
              }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={createModalOpen ? handleCreateSkill : handleUpdateSkill}
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
              Esta acción no se puede deshacer. Se eliminará permanentemente la skill "
              {selectedSkill?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSkill}
              disabled={submitting}
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
