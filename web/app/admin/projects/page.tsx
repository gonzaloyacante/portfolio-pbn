'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Eye,
  Search,
  Filter,
  X,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  images: Array<{ id: string; url: string; altText: string; order: number }>;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  content: string;
  categoryId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imagesModalOpen, setImagesModalOpen] = useState(false);

  // Selected project for edit/delete/images
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form data
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    content: '',
    categoryId: '',
    status: 'DRAFT',
    featured: false,
    order: 0,
  });

  // Image management
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  // Submitting state
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsData, categoriesData] = await Promise.all([
        apiClient.getAllProjectsAdmin(),
        apiClient.getCategories(),
      ]);
      setProjects(projectsData || []);
      setCategories(categoriesData || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      setSubmitting(true);
      setError('');
      await apiClient.createProject(formData);
      await fetchData();
      setCreateModalOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Error al crear proyecto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject) return;
    try {
      setSubmitting(true);
      setError('');
      await apiClient.updateProject(selectedProject.id, formData);
      await fetchData();
      setEditModalOpen(false);
      setSelectedProject(null);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar proyecto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    try {
      setSubmitting(true);
      setError('');
      await apiClient.deleteProject(selectedProject.id);
      await fetchData();
      setDeleteModalOpen(false);
      setSelectedProject(null);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar proyecto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddImage = async () => {
    if (!selectedProject || !newImageUrl) return;
    try {
      setSubmitting(true);
      setError('');
      await apiClient.addProjectImage(selectedProject.id, {
        url: newImageUrl,
        alt: newImageAlt || selectedProject.title,
        order: selectedProject.images.length,
      });
      await fetchData();
      // Update selected project
      const updated = await apiClient.getAllProjectsAdmin();
      const updatedProject = updated.find((p: Project) => p.id === selectedProject.id);
      if (updatedProject) setSelectedProject(updatedProject);
      setNewImageUrl('');
      setNewImageAlt('');
    } catch (err: any) {
      setError(err.message || 'Error al añadir imagen');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!selectedProject) return;
    try {
      setSubmitting(true);
      setError('');
      await apiClient.deleteProjectImage(selectedProject.id, imageId);
      await fetchData();
      // Update selected project
      const updated = await apiClient.getAllProjectsAdmin();
      const updatedProject = updated.find((p: Project) => p.id === selectedProject.id);
      if (updatedProject) setSelectedProject(updatedProject);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar imagen');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      content: project.content,
      categoryId: project.categoryId,
      status: project.status,
      featured: project.featured,
      order: project.order,
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (project: Project) => {
    setSelectedProject(project);
    setDeleteModalOpen(true);
  };

  const openImagesModal = (project: Project) => {
    setSelectedProject(project);
    setImagesModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setCreateModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      categoryId: '',
      status: 'DRAFT',
      featured: false,
      order: 0,
    });
    setError('');
  };

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    if (statusFilter !== 'all' && project.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && project.categoryId !== categoryFilter) return false;
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      PUBLISHED: 'default',
      DRAFT: 'secondary',
      ARCHIVED: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {status === 'PUBLISHED' ? 'Publicado' : status === 'DRAFT' ? 'Borrador' : 'Archivado'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Proyectos</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-sm text-muted-foreground">Cargando proyectos...</p>
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
          <h1 className="text-3xl font-bold">Proyectos</h1>
          <p className="text-muted-foreground">
            Gestiona todos los proyectos del portfolio
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="PUBLISHED">Publicados</SelectItem>
                  <SelectItem value="DRAFT">Borradores</SelectItem>
                  <SelectItem value="ARCHIVED">Archivados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter('all');
                setCategoryFilter('all');
                setSearchQuery('');
              }}
              className="mt-4"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar Filtros
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Destacado</TableHead>
                <TableHead>Imágenes</TableHead>
                <TableHead>Orden</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron proyectos
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.category.name}</TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell>
                      {project.featured && (
                        <Badge variant="outline" className="bg-yellow-50">
                          ⭐ Destacado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{project.images.length}</TableCell>
                    <TableCell>{project.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openImagesModal(project)}
                          title="Gestionar imágenes"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(project)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteModal(project)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={createModalOpen || editModalOpen} onOpenChange={(open) => {
        if (!open) {
          setCreateModalOpen(false);
          setEditModalOpen(false);
          setSelectedProject(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {createModalOpen ? 'Crear Nuevo Proyecto' : 'Editar Proyecto'}
            </DialogTitle>
            <DialogDescription>
              {createModalOpen
                ? 'Completa los datos para crear un nuevo proyecto'
                : 'Actualiza la información del proyecto'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Maquillaje de novia elegante"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descripción del proyecto..."
                rows={3}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Contenido Detallado *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Descripción completa del proyecto, técnicas utilizadas, etc..."
                rows={5}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
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
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Borrador</SelectItem>
                    <SelectItem value="PUBLISHED">Publicado</SelectItem>
                    <SelectItem value="ARCHIVED">Archivado</SelectItem>
                  </SelectContent>
                </Select>
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
                />
              </div>

              {/* Featured */}
              <div className="space-y-2">
                <Label htmlFor="featured">Destacado</Label>
                <div className="flex items-center h-10">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm">
                    Destacar en home
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateModalOpen(false);
                setEditModalOpen(false);
                setSelectedProject(null);
                resetForm();
              }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={createModalOpen ? handleCreateProject : handleUpdateProject}
              disabled={submitting || !formData.title || !formData.categoryId}
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
              Esta acción no se puede deshacer. Se eliminará permanentemente el proyecto "
              {selectedProject?.title}" y todas sus imágenes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={submitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Images Management Modal */}
      <Dialog open={imagesModalOpen} onOpenChange={(open) => {
        if (!open) {
          setImagesModalOpen(false);
          setSelectedProject(null);
          setNewImageUrl('');
          setNewImageAlt('');
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestionar Imágenes - {selectedProject?.title}</DialogTitle>
            <DialogDescription>
              Añade o elimina imágenes del proyecto
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Add New Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Añadir Nueva Imagen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL de la imagen *</Label>
                  <Input
                    id="imageUrl"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageAlt">Texto alternativo</Label>
                  <Input
                    id="imageAlt"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    placeholder="Descripción de la imagen"
                  />
                </div>
                <Button
                  onClick={handleAddImage}
                  disabled={submitting || !newImageUrl}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {submitting ? 'Añadiendo...' : 'Añadir Imagen'}
                </Button>
              </CardContent>
            </Card>

            {/* Current Images */}
            <div className="space-y-2">
              <Label>Imágenes Actuales ({selectedProject?.images.length || 0})</Label>
              {selectedProject?.images.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center border rounded-lg">
                  No hay imágenes en este proyecto
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {selectedProject?.images
                    .sort((a, b) => a.order - b.order)
                    .map((image) => (
                      <Card key={image.id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={image.url}
                                alt={image.altText}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{image.altText}</p>
                                <p className="text-xs text-muted-foreground">
                                  Orden: {image.order}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteImage(image.id)}
                                disabled={submitting}
                                className="flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setImagesModalOpen(false);
                setSelectedProject(null);
                setNewImageUrl('');
                setNewImageAlt('');
              }}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
