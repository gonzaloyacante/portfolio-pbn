'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  Mail,
} from 'lucide-react';

interface SocialLink {
  id: string;
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'TWITTER' | 'LINKEDIN' | 'YOUTUBE' | 'TIKTOK' | 'WHATSAPP' | 'EMAIL' | 'OTHER';
  url: string;
  label?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface SocialLinkFormData {
  platform: SocialLink['platform'];
  url: string;
  label?: string;
  order: number;
}

const platformIcons = {
  FACEBOOK: Facebook,
  INSTAGRAM: Instagram,
  TWITTER: Twitter,
  LINKEDIN: Linkedin,
  YOUTUBE: Youtube,
  TIKTOK: Globe,
  WHATSAPP: Mail,
  EMAIL: Mail,
  OTHER: Globe,
};

const platformColors = {
  FACEBOOK: 'text-blue-600',
  INSTAGRAM: 'text-pink-600',
  TWITTER: 'text-sky-500',
  LINKEDIN: 'text-blue-700',
  YOUTUBE: 'text-red-600',
  TIKTOK: 'text-black dark:text-white',
  WHATSAPP: 'text-green-600',
  EMAIL: 'text-gray-600',
  OTHER: 'text-gray-600',
};

export default function AdminSocialLinksPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Selected link
  const [selectedLink, setSelectedLink] = useState<SocialLink | null>(null);

  // Form data
  const [formData, setFormData] = useState<SocialLinkFormData>({
    platform: 'INSTAGRAM',
    url: '',
    label: '',
    order: 0,
  });

  // Submitting state
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSocialLinks();
      setSocialLinks(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar redes sociales');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async () => {
    try {
      setSubmitting(true);
      setError('');
      await apiClient.createSocialLink(formData);
      await fetchSocialLinks();
      setCreateModalOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Error al crear red social');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateLink = async () => {
    if (!selectedLink) return;
    try {
      setSubmitting(true);
      setError('');
      await apiClient.updateSocialLink(selectedLink.id, formData);
      await fetchSocialLinks();
      setEditModalOpen(false);
      setSelectedLink(null);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar red social');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLink = async () => {
    if (!selectedLink) return;
    try {
      setSubmitting(true);
      setError('');
      await apiClient.deleteSocialLink(selectedLink.id);
      await fetchSocialLinks();
      setDeleteModalOpen(false);
      setSelectedLink(null);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar red social');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (link: SocialLink) => {
    setSelectedLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      label: link.label || '',
      order: link.order,
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (link: SocialLink) => {
    setSelectedLink(link);
    setDeleteModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setCreateModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      platform: 'INSTAGRAM',
      url: '',
      label: '',
      order: 0,
    });
    setError('');
  };

  // Sort by order
  const sortedLinks = [...socialLinks].sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Redes Sociales</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-sm text-muted-foreground">Cargando redes sociales...</p>
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
          <h1 className="text-3xl font-bold">Redes Sociales</h1>
          <p className="text-muted-foreground">
            Gestiona los enlaces a redes sociales
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Red Social
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Social Links Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedLinks.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No hay redes sociales configuradas</p>
            </CardContent>
          </Card>
        ) : (
          sortedLinks.map((link) => {
            const Icon = platformIcons[link.platform];
            const colorClass = platformColors[link.platform];
            
            return (
              <Card key={link.id} className="relative group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base flex items-center gap-3">
                      <Icon className={`h-6 w-6 ${colorClass}`} />
                      <div>
                        <p className="font-semibold">{link.platform}</p>
                        {link.label && (
                          <p className="text-xs text-muted-foreground font-normal mt-0.5">
                            {link.label}
                          </p>
                        )}
                      </div>
                    </CardTitle>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(link)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteModal(link)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-2 break-all"
                    >
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{link.url}</span>
                    </a>
                    <p className="text-xs text-muted-foreground">Orden: {link.order}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })
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
              <p className="text-sm font-medium">Consejos para redes sociales</p>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                <li>• Usa URLs completas (ej: https://instagram.com/tu_usuario)</li>
                <li>• El label es opcional, úsalo para añadir contexto extra</li>
                <li>• El orden controla cómo aparecen en el sitio público</li>
                <li>• Verifica que los enlaces funcionen correctamente</li>
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
            setSelectedLink(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {createModalOpen ? 'Crear Nueva Red Social' : 'Editar Red Social'}
            </DialogTitle>
            <DialogDescription>
              {createModalOpen
                ? 'Completa los datos para añadir una red social'
                : 'Actualiza la información de la red social'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Platform */}
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma *</Label>
              <Select
                value={formData.platform}
                onValueChange={(value: any) => setFormData({ ...formData, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                  <SelectItem value="FACEBOOK">Facebook</SelectItem>
                  <SelectItem value="TWITTER">Twitter / X</SelectItem>
                  <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                  <SelectItem value="YOUTUBE">YouTube</SelectItem>
                  <SelectItem value="TIKTOK">TikTok</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="OTHER">Otra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label">Etiqueta (opcional)</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ej: Canal oficial"
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
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateModalOpen(false);
                setEditModalOpen(false);
                setSelectedLink(null);
                resetForm();
              }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={createModalOpen ? handleCreateLink : handleUpdateLink}
              disabled={submitting || !formData.url}
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
              Esta acción no se puede deshacer. Se eliminará permanentemente el enlace a{' '}
              {selectedLink?.platform}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLink}
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
