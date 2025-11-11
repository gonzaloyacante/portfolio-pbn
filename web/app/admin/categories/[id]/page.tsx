'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Loading, Input, Textarea } from '@/components/cms/form-components';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
}

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isNew = resolvedParams.id === 'new';

  useEffect(() => {
    loadData();
  }, [resolvedParams.id]);

  async function loadData() {
    try {
      if (!isNew) {
        const data = await apiClient.getCategory(resolvedParams.id);
        setCategory(data);
      } else {
        setCategory({
          id: '',
          name: '',
          slug: '',
          description: null,
          order: 0
        });
      }
    } catch (error) {
      console.error('Error loading category:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;

    setSaving(true);
    try {
      if (isNew) {
        await apiClient.createCategory(category);
      } else {
        await apiClient.updateCategory(resolvedParams.id, category);
      }
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('¿Estás segura de eliminar esta categoría?')) return;
    
    try {
      await apiClient.deleteCategory(resolvedParams.id);
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error al eliminar');
    }
  }

  // Auto-generate slug
  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  if (loading) return <Loading text={isNew ? "Preparando..." : "Cargando categoría..."} />;
  if (!category) return null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/categories">
          <Button variant="outline" icon={ArrowLeft}>Volver</Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {isNew ? 'Nueva Categoría' : 'Editar Categoría'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {isNew ? 'Crea una categoría para organizar proyectos' : 'Actualiza la información'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <div className="space-y-5">
              <Input
                label="Nombre de la Categoría *"
                value={category.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setCategory({
                    ...category,
                    name,
                    slug: generateSlug(name)
                  });
                }}
                placeholder="Ej: Maquillaje Artístico"
                required
              />

              <Input
                label="Slug (URL amigable) *"
                value={category.slug}
                onChange={(e) => setCategory({ ...category, slug: e.target.value })}
                placeholder="maquillaje-artistico"
                required
              />

              <Textarea
                label="Descripción"
                value={category.description || ''}
                onChange={(e) => setCategory({ ...category, description: e.target.value })}
                rows={4}
                placeholder="Describe brevemente esta categoría..."
              />

              <Input
                label="Orden"
                type="number"
                value={category.order.toString()}
                onChange={(e) => setCategory({ ...category, order: parseInt(e.target.value) || 0 })}
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
                Eliminar Categoría
              </Button>
            )}
            
            <div className="flex gap-3 ml-auto">
              <Link href="/admin/categories">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button
                type="submit"
                icon={Save}
                loading={saving}
                disabled={saving}
              >
                {saving ? 'Guardando...' : (isNew ? 'Crear Categoría' : 'Guardar Cambios')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
