'use client''use client';



import { useEffect, useState } from 'react'import { useEffect, useState } from 'react';

import { apiClient } from '@/lib/api-client'import { apiClient } from '@/lib/api-client';

import {import { Button } from '@/components/ui/button';

  Plus,import { Input } from '@/components/ui/input';

  Pencil,import { Label } from '@/components/ui/label';

  Trash2,import {

  Loader2,  Select,

  Save,  SelectContent,

  X,  SelectItem,

  Instagram,  SelectTrigger,

  Facebook,  SelectValue,

  Twitter,} from '@/components/ui/select';

  Linkedin,import {

  Github,  Dialog,

  Youtube,  DialogContent,

  Globe,  DialogDescription,

  Link as LinkIcon,  DialogFooter,

} from 'lucide-react'  DialogHeader,

  DialogTitle,

interface SocialLink {} from '@/components/ui/dialog';

  id: stringimport {

  platform: string  AlertDialog,

  url: string  AlertDialogAction,

  label: string  AlertDialogCancel,

  order: number  AlertDialogContent,

}  AlertDialogDescription,

  AlertDialogFooter,

const platformIcons: Record<string, any> = {  AlertDialogHeader,

  Instagram: Instagram,  AlertDialogTitle,

  Facebook: Facebook,} from '@/components/ui/alert-dialog';

  Twitter: Twitter,import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

  LinkedIn: Linkedin,import { Alert, AlertDescription } from '@/components/ui/alert';

  GitHub: Github,import {

  YouTube: Youtube,  Plus,

  Website: Globe,  Pencil,

  Other: LinkIcon,  Trash2,

}  ExternalLink,

  Facebook,

const platformColors: Record<string, string> = {  Instagram,

  Instagram: 'from-pink-500 to-purple-600',  Twitter,

  Facebook: 'from-blue-600 to-blue-700',  Linkedin,

  Twitter: 'from-sky-400 to-blue-500',  Youtube,

  LinkedIn: 'from-blue-700 to-blue-800',  Globe,

  GitHub: 'from-slate-700 to-slate-900',  Mail,

  YouTube: 'from-red-600 to-red-700',} from 'lucide-react';

  Website: 'from-emerald-500 to-teal-600',

  Other: 'from-slate-500 to-slate-600',interface SocialLink {

}  id: string;

  platform: 'FACEBOOK' | 'INSTAGRAM' | 'TWITTER' | 'LINKEDIN' | 'YOUTUBE' | 'TIKTOK' | 'WHATSAPP' | 'EMAIL' | 'OTHER';

export default function AdminSocialLinksPage() {  url: string;

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])  label?: string;

  const [loading, setLoading] = useState(true)  order: number;

  const [showModal, setShowModal] = useState(false)  createdAt: string;

  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)  updatedAt: string;

  const [formData, setFormData] = useState({}

    platform: 'Instagram',

    url: '',interface SocialLinkFormData {

    label: '',  platform: SocialLink['platform'];

    order: 0,  url: string;

  })  label?: string;

  const [submitting, setSubmitting] = useState(false)  order: number;

}

  useEffect(() => {

    loadSocialLinks()const platformIcons = {

  }, [])  FACEBOOK: Facebook,

  INSTAGRAM: Instagram,

  const loadSocialLinks = async () => {  TWITTER: Twitter,

    try {  LINKEDIN: Linkedin,

      setLoading(true)  YOUTUBE: Youtube,

      const data = await apiClient.getSocialLinks()  TIKTOK: Globe,

      setSocialLinks(data || [])  WHATSAPP: Mail,

    } catch (error) {  EMAIL: Mail,

      console.error('Error al cargar redes sociales:', error)  OTHER: Globe,

      alert('Error al cargar las redes sociales')};

    } finally {

      setLoading(false)const platformColors = {

    }  FACEBOOK: 'text-blue-600',

  }  INSTAGRAM: 'text-pink-600',

  TWITTER: 'text-sky-500',

  const handleOpenModal = (link?: SocialLink) => {  LINKEDIN: 'text-blue-700',

    if (link) {  YOUTUBE: 'text-red-600',

      setEditingLink(link)  TIKTOK: 'text-black dark:text-white',

      setFormData({  WHATSAPP: 'text-green-600',

        platform: link.platform,  EMAIL: 'text-gray-600',

        url: link.url,  OTHER: 'text-gray-600',

        label: link.label,};

        order: link.order,

      })export default function AdminSocialLinksPage() {

    } else {  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

      setEditingLink(null)  const [loading, setLoading] = useState(true);

      setFormData({ platform: 'Instagram', url: '', label: '', order: 0 })  const [error, setError] = useState('');

    }

    setShowModal(true)  // Modals

  }  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleCloseModal = () => {  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    setShowModal(false)

    setEditingLink(null)  // Selected link

    setFormData({ platform: 'Instagram', url: '', label: '', order: 0 })  const [selectedLink, setSelectedLink] = useState<SocialLink | null>(null);

  }

  // Form data

  const handleSubmit = async (e: React.FormEvent) => {  const [formData, setFormData] = useState<SocialLinkFormData>({

    e.preventDefault()    platform: 'INSTAGRAM',

    setSubmitting(true)    url: '',

    label: '',

    try {    order: 0,

      if (editingLink) {  });

        await apiClient.updateSocialLink(editingLink.id, formData)

        alert('¡Red social actualizada con éxito! ✨')  // Submitting state

      } else {  const [submitting, setSubmitting] = useState(false);

        await apiClient.createSocialLink(formData)

        alert('¡Red social creada con éxito! ✨')  useEffect(() => {

      }    fetchSocialLinks();

      await loadSocialLinks()  }, []);

      handleCloseModal()

    } catch (error) {  const fetchSocialLinks = async () => {

      console.error('Error:', error)    try {

      alert('Hubo un error. Por favor, inténtalo de nuevo.')      setLoading(true);

    } finally {      const data = await apiClient.getSocialLinks();

      setSubmitting(false)      setSocialLinks(data || []);

    }    } catch (err: any) {

  }      setError(err.message || 'Error al cargar redes sociales');

    } finally {

  const handleDelete = async (link: SocialLink) => {      setLoading(false);

    if (!confirm(`¿Estás segura de eliminar ${link.platform}?`)) return    }

  };

    try {

      await apiClient.deleteSocialLink(link.id)  const handleCreateLink = async () => {

      alert('Red social eliminada correctamente')    try {

      await loadSocialLinks()      setSubmitting(true);

    } catch (error) {      setError('');

      console.error('Error:', error)      await apiClient.createSocialLink(formData);

      alert('Error al eliminar la red social')      await fetchSocialLinks();

    }      setCreateModalOpen(false);

  }      resetForm();

    } catch (err: any) {

  if (loading) {      setError(err.message || 'Error al crear red social');

    return (    } finally {

      <div className="flex items-center justify-center min-h-screen">      setSubmitting(false);

        <div className="text-center">    }

          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />  };

          <p className="mt-4 text-slate-600">Cargando redes sociales...</p>

        </div>  const handleUpdateLink = async () => {

      </div>    if (!selectedLink) return;

    )    try {

  }      setSubmitting(true);

      setError('');

  return (      await apiClient.updateSocialLink(selectedLink.id, formData);

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8">      await fetchSocialLinks();

      <div className="max-w-6xl mx-auto">      setEditModalOpen(false);

        {/* Header */}      setSelectedLink(null);

        <div className="mb-8">      resetForm();

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">    } catch (err: any) {

            Redes Sociales      setError(err.message || 'Error al actualizar red social');

          </h1>    } finally {

          <p className="text-slate-600 mt-2">      setSubmitting(false);

            Conecta con tu audiencia en diferentes plataformas    }

          </p>  };

        </div>

  const handleDeleteLink = async () => {

        {/* Add Button */}    if (!selectedLink) return;

        <button    try {

          onClick={() => handleOpenModal()}      setSubmitting(true);

          className="mb-6 inline-flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"      setError('');

        >      await apiClient.deleteSocialLink(selectedLink.id);

          <Plus className="w-5 h-5" />      await fetchSocialLinks();

          Nueva Red Social      setDeleteModalOpen(false);

        </button>      setSelectedLink(null);

    } catch (err: any) {

        {/* Social Links Grid */}      setError(err.message || 'Error al eliminar red social');

        {socialLinks.length === 0 ? (    } finally {

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 text-center">      setSubmitting(false);

            <LinkIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />    }

            <h3 className="text-xl font-semibold text-slate-700 mb-2">  };

              No hay redes sociales todavía

            </h3>  const openEditModal = (link: SocialLink) => {

            <p className="text-slate-500">    setSelectedLink(link);

              Añade tus perfiles para que te puedan encontrar    setFormData({

            </p>      platform: link.platform,

          </div>      url: link.url,

        ) : (      label: link.label || '',

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">      order: link.order,

            {socialLinks.map((link) => {    });

              const Icon = platformIcons[link.platform] || LinkIcon    setEditModalOpen(true);

              const colorClass = platformColors[link.platform] || platformColors.Other  };



              return (  const openDeleteModal = (link: SocialLink) => {

                <div    setSelectedLink(link);

                  key={link.id}    setDeleteModalOpen(true);

                  className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all"  };

                >

                  <div className="flex items-start gap-4">  const openCreateModal = () => {

                    {/* Icon */}    resetForm();

                    <div    setCreateModalOpen(true);

                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0 shadow-lg`}  };

                    >

                      <Icon className="w-7 h-7 text-white" />  const resetForm = () => {

                    </div>    setFormData({

      platform: 'INSTAGRAM',

                    {/* Content */}      url: '',

                    <div className="flex-1 min-w-0">      label: '',

                      <h3 className="text-lg font-bold text-slate-800 mb-1">      order: 0,

                        {link.platform}    });

                      </h3>    setError('');

                      <p className="text-sm text-slate-600 mb-2">  };

                        {link.label}

                      </p>  // Sort by order

                      <a  const sortedLinks = [...socialLinks].sort((a, b) => a.order - b.order);

                        href={link.url}

                        target="_blank"  if (loading) {

                        rel="noopener noreferrer"    return (

                        className="text-sm text-blue-600 hover:underline truncate block"      <div className="space-y-4">

                      >        <h1 className="text-3xl font-bold">Redes Sociales</h1>

                        {link.url}        <div className="flex items-center justify-center h-64">

                      </a>          <div className="text-center">

                    </div>            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />

            <p className="mt-2 text-sm text-muted-foreground">Cargando redes sociales...</p>

                    {/* Actions */}          </div>

                    <div className="flex gap-2 flex-shrink-0">        </div>

                      <button      </div>

                        onClick={() => handleOpenModal(link)}    );

                        className="p-2 rounded-lg border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"  }

                      >

                        <Pencil className="w-4 h-4" />  return (

                      </button>    <div className="space-y-6">

                      <button      {/* Header */}

                        onClick={() => handleDelete(link)}      <div className="flex items-center justify-between">

                        className="p-2 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors"        <div>

                      >          <h1 className="text-3xl font-bold">Redes Sociales</h1>

                        <Trash2 className="w-4 h-4" />          <p className="text-muted-foreground">

                      </button>            Gestiona los enlaces a redes sociales

                    </div>          </p>

                  </div>        </div>

                </div>        <Button onClick={openCreateModal}>

              )          <Plus className="h-4 w-4 mr-2" />

            })}          Nueva Red Social

          </div>        </Button>

        )}      </div>



        {/* Info Card */}      {/* Error Alert */}

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 p-6">      {error && (

          <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">        <Alert variant="destructive">

            💡 Consejos          <AlertDescription>{error}</AlertDescription>

          </h4>        </Alert>

          <ul className="text-sm text-slate-600 space-y-2">      )}

            <li>• Usa URLs completas: https://instagram.com/tu_usuario</li>

            <li>      {/* Social Links Grid */}

              • El label es el texto que aparecerá junto al ícono en tu      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              portfolio        {sortedLinks.length === 0 ? (

            </li>          <Card className="col-span-full">

            <li>• Puedes agregar cualquier plataforma usando "Other"</li>            <CardContent className="flex items-center justify-center h-32">

            <li>• El orden determina cómo aparecen en tu sitio web</li>              <p className="text-muted-foreground">No hay redes sociales configuradas</p>

          </ul>            </CardContent>

        </div>          </Card>

      </div>        ) : (

          sortedLinks.map((link) => {

      {/* Modal */}            const Icon = platformIcons[link.platform];

      {showModal && (            const colorClass = platformColors[link.platform];

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">            

          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">            return (

            {/* Modal Header */}              <Card key={link.id} className="relative group">

            <div className="p-6 border-b border-slate-100">                <CardHeader className="pb-3">

              <div className="flex items-center justify-between">                  <div className="flex items-start justify-between">

                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">                    <CardTitle className="text-base flex items-center gap-3">

                  {editingLink ? 'Editar Red Social' : 'Nueva Red Social'}                      <Icon className={`h-6 w-6 ${colorClass}`} />

                </h2>                      <div>

                <button                        <p className="font-semibold">{link.platform}</p>

                  onClick={handleCloseModal}                        {link.label && (

                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"                          <p className="text-xs text-muted-foreground font-normal mt-0.5">

                >                            {link.label}

                  <X className="w-5 h-5 text-slate-400" />                          </p>

                </button>                        )}

              </div>                      </div>

            </div>                    </CardTitle>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

            {/* Modal Body */}                      <Button

            <form onSubmit={handleSubmit} className="p-6 space-y-5">                        variant="ghost"

              {/* Platform */}                        size="icon"

              <div>                        onClick={() => openEditModal(link)}

                <label className="block text-sm font-semibold text-slate-700 mb-2">                        className="h-8 w-8"

                  Plataforma <span className="text-rose-500">*</span>                      >

                </label>                        <Pencil className="h-3 w-3" />

                <select                      </Button>

                  required                      <Button

                  value={formData.platform}                        variant="ghost"

                  onChange={(e) =>                        size="icon"

                    setFormData({ ...formData, platform: e.target.value })                        onClick={() => openDeleteModal(link)}

                  }                        className="h-8 w-8"

                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all outline-none bg-white"                      >

                >                        <Trash2 className="h-3 w-3 text-destructive" />

                  <option value="Instagram">Instagram</option>                      </Button>

                  <option value="Facebook">Facebook</option>                    </div>

                  <option value="Twitter">Twitter</option>                  </div>

                  <option value="LinkedIn">LinkedIn</option>                </CardHeader>

                  <option value="GitHub">GitHub</option>                <CardContent>

                  <option value="YouTube">YouTube</option>                  <div className="space-y-2">

                  <option value="Website">Sitio Web</option>                    <a

                  <option value="Other">Otra</option>                      href={link.url}

                </select>                      target="_blank"

                <p className="text-xs text-slate-500 mt-1">                      rel="noopener noreferrer"

                  ¿Qué red social es?                      className="text-sm text-blue-600 hover:underline flex items-center gap-2 break-all"

                </p>                    >

              </div>                      <ExternalLink className="h-3 w-3 flex-shrink-0" />

                      <span className="truncate">{link.url}</span>

              {/* Label */}                    </a>

              <div>                    <p className="text-xs text-muted-foreground">Orden: {link.order}</p>

                <label className="block text-sm font-semibold text-slate-700 mb-2">                  </div>

                  Etiqueta <span className="text-rose-500">*</span>                </CardContent>

                </label>              </Card>

                <input            );

                  type="text"          })

                  required        )}

                  value={formData.label}      </div>

                  onChange={(e) =>

                    setFormData({ ...formData, label: e.target.value })      {/* Info Card */}

                  }      <Card>

                  placeholder="Ej: Mi Instagram, Portfolio en GitHub..."        <CardContent className="p-4">

                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all outline-none"          <div className="flex items-start gap-3">

                />            <div className="flex-shrink-0 mt-0.5">

                <p className="text-xs text-slate-500 mt-1">              <svg

                  Texto que aparecerá junto al ícono                className="h-5 w-5 text-blue-500"

                </p>                fill="none"

              </div>                strokeLinecap="round"

                strokeLinejoin="round"

              {/* URL */}                strokeWidth="2"

              <div>                viewBox="0 0 24 24"

                <label className="block text-sm font-semibold text-slate-700 mb-2">                stroke="currentColor"

                  URL <span className="text-rose-500">*</span>              >

                </label>                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>

                <input              </svg>

                  type="url"            </div>

                  required            <div className="flex-1">

                  value={formData.url}              <p className="text-sm font-medium">Consejos para redes sociales</p>

                  onChange={(e) =>              <ul className="mt-2 text-sm text-muted-foreground space-y-1">

                    setFormData({ ...formData, url: e.target.value })                <li>• Usa URLs completas (ej: https://instagram.com/tu_usuario)</li>

                  }                <li>• El label es opcional, úsalo para añadir contexto extra</li>

                  placeholder="https://..."                <li>• El orden controla cómo aparecen en el sitio público</li>

                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all outline-none"                <li>• Verifica que los enlaces funcionen correctamente</li>

                />              </ul>

                <p className="text-xs text-slate-500 mt-1">            </div>

                  Enlace completo a tu perfil          </div>

                </p>        </CardContent>

              </div>      </Card>



              {/* Order */}      {/* Create/Edit Modal */}

              <div>      <Dialog

                <label className="block text-sm font-semibold text-slate-700 mb-2">        open={createModalOpen || editModalOpen}

                  Orden de Aparición        onOpenChange={(open) => {

                </label>          if (!open) {

                <input            setCreateModalOpen(false);

                  type="number"            setEditModalOpen(false);

                  value={formData.order}            setSelectedLink(null);

                  onChange={(e) =>            resetForm();

                    setFormData({          }

                      ...formData,        }}

                      order: parseInt(e.target.value) || 0,      >

                    })        <DialogContent className="max-w-md">

                  }          <DialogHeader>

                  placeholder="0"            <DialogTitle>

                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all outline-none"              {createModalOpen ? 'Crear Nueva Red Social' : 'Editar Red Social'}

                />            </DialogTitle>

                <p className="text-xs text-slate-500 mt-1">            <DialogDescription>

                  Números más bajos aparecen primero              {createModalOpen

                </p>                ? 'Completa los datos para añadir una red social'

              </div>                : 'Actualiza la información de la red social'}

            </DialogDescription>

              {/* Buttons */}          </DialogHeader>

              <div className="flex gap-3 pt-4">

                <button          <div className="space-y-4">

                  type="button"            {/* Platform */}

                  onClick={handleCloseModal}            <div className="space-y-2">

                  disabled={submitting}              <Label htmlFor="platform">Plataforma *</Label>

                  className="flex-1 h-12 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"              <Select

                >                value={formData.platform}

                  Cancelar                onValueChange={(value: any) => setFormData({ ...formData, platform: value })}

                </button>              >

                <button                <SelectTrigger>

                  type="submit"                  <SelectValue />

                  disabled={submitting || !formData.url || !formData.label}                </SelectTrigger>

                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"                <SelectContent>

                >                  <SelectItem value="INSTAGRAM">Instagram</SelectItem>

                  {submitting ? (                  <SelectItem value="FACEBOOK">Facebook</SelectItem>

                    <>                  <SelectItem value="TWITTER">Twitter / X</SelectItem>

                      <Loader2 className="w-5 h-5 animate-spin" />                  <SelectItem value="LINKEDIN">LinkedIn</SelectItem>

                      Guardando...                  <SelectItem value="YOUTUBE">YouTube</SelectItem>

                    </>                  <SelectItem value="TIKTOK">TikTok</SelectItem>

                  ) : (                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>

                    <>                  <SelectItem value="EMAIL">Email</SelectItem>

                      <Save className="w-5 h-5" />                  <SelectItem value="OTHER">Otra</SelectItem>

                      {editingLink ? 'Guardar Cambios' : 'Crear Enlace'}                </SelectContent>

                    </>              </Select>

                  )}            </div>

                </button>

              </div>            {/* URL */}

            </form>            <div className="space-y-2">

          </div>              <Label htmlFor="url">URL *</Label>

        </div>              <Input

      )}                id="url"

    </div>                type="url"

  )                value={formData.url}

}                onChange={(e) => setFormData({ ...formData, url: e.target.value })}

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
