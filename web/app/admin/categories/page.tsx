'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Badge, EmptyState, Loading, Input } from '@/components/cms/form-components';
import { Plus, Pencil, Trash2, Search, Folder } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }

  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function deleteCategory(id: string) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await apiClient.deleteCategory(id);
      loadCategories();
    } catch (error) {
      alert('Error al eliminar');
    }
  }

  if (loading) return <Loading text="Cargando categorías..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categorías</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organiza tus proyectos en categorías
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button variant="primary" icon={Plus}>
            Nueva Categoría
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card padding="md">
        <Input
          icon={Search}
          placeholder="Buscar categorías..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>

      {/* Categories */}
      {filteredCategories.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="No hay categorías"
          description={searchQuery ? "No se encontraron categorías" : "Crea tu primera categoría"}
          action={
            !searchQuery ? (
              <Link href="/admin/categories/new">
                <Button variant="primary" icon={Plus}>
                  Crear Categoría
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <Card key={category.id} padding="lg" className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      /{category.slug}
                    </p>
                    {category.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="info">#{category.order}</Badge>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/categories/${category.id}`} className="flex-1">
                    <Button variant="outline" icon={Pencil} className="w-full">
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="md"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
