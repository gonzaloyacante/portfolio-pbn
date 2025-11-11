'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Loading, Input, Select } from '@/components/cms/form-components';
import { ArrowLeft, Save, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
  order: number;
}

export default function EditSocialLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [link, setLink] = useState<SocialLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isNew = resolvedParams.id === 'new';

  useEffect(() => {
    loadData();
  }, [resolvedParams.id]);

  async function loadData() {
    try {
      if (!isNew) {
        const data = await apiClient.getSocialLink(resolvedParams.id);
        setLink(data);
      } else {
        setLink({
          id: '',
          platform: '',
          url: '',
          label: '',
          order: 0
        });
      }
    } catch (error) {
      console.error('Error loading link:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!link) return;

    setSaving(true);
    try {
      if (isNew) {
        await apiClient.createSocialLink(link);
      } else {
        await apiClient.updateSocialLink(resolvedParams.id, link);
      }
      router.push('/admin/social-links');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('¿Estás segura de eliminar este enlace?')) return;
    
    try {
      await apiClient.deleteSocialLink(resolvedParams.id);
      router.push('/admin/social-links');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error al eliminar');
    }
  }

  if (loading) return <Loading text={isNew ? "Preparando..." : "Cargando enlace..."} />;
  if (!link) return null;

  const platformOptions = [
    { value: 'Instagram', label: 'Instagram' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'TikTok', label: 'TikTok' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Twitter', label: 'Twitter / X' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Behance', label: 'Behance' },
    { value: 'Dribbble', label: 'Dribbble' },
    { value: 'GitHub', label: 'GitHub' },
    { value: 'Pinterest', label: 'Pinterest' },
    { value: 'WhatsApp', label: 'WhatsApp' },
    { value: 'Email', label: 'Email' },
    { value: 'Website', label: 'Sitio Web' },
    { value: 'Other', label: 'Otra' }
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/social-links">
          <Button variant="outline" icon={ArrowLeft}>Volver</Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {isNew ? 'Nuevo Enlace' : 'Editar Enlace'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {isNew ? 'Agrega un enlace a tus redes sociales' : 'Actualiza la información'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <div className="space-y-5">
              <Select
                label="Plataforma *"
                value={link.platform}
                onChange={(e) => setLink({ ...link, platform: e.target.value })}
                options={platformOptions}
                required
              />

              <Input
                label="Etiqueta *"
                value={link.label}
                onChange={(e) => setLink({ ...link, label: e.target.value })}
                placeholder="Ej: @tuusuario, Mi canal, Contáctame..."
                required
              />

              <Input
                label="URL *"
                type="url"
                value={link.url}
                onChange={(e) => setLink({ ...link, url: e.target.value })}
                placeholder="https://..."
                required
              />

              {link.url && (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Probar enlace
                </a>
              )}

              <Input
                label="Orden"
                type="number"
                value={link.order.toString()}
                onChange={(e) => setLink({ ...link, order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            {!isNew && (
              <Button
                type="button"
                variant="danger"
                icon={Trash2}
                onClick={handleDelete}
              >
                Eliminar Enlace
              </Button>
            )}
            
            <div className="flex gap-3 ml-auto">
              <Link href="/admin/social-links">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button
                type="submit"
                icon={Save}
                loading={saving}
                disabled={saving}
              >
                {saving ? 'Guardando...' : (isNew ? 'Crear Enlace' : 'Guardar Cambios')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
