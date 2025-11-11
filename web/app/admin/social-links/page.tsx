'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Badge, EmptyState, Loading, Input } from '@/components/cms/form-components';
import { Pencil, Trash2, Share2, Plus, Search, ExternalLink, Globe } from 'lucide-react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
  order: number;
}

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSocialLinks();
  }, []);

  async function loadSocialLinks() {
    try {
      const data = await apiClient.getSocialLinks();
      setLinks(data);
    } catch (error) {
      console.error('Error loading social links:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSocialLink(id: string) {
    if (!confirm('¿Estás segura de eliminar este enlace?')) return;
    
    try {
      await apiClient.deleteSocialLink(id);
      setLinks(links.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting social link:', error);
      alert('Error al eliminar el enlace');
    }
  }

  const filteredLinks = links.filter(link =>
    link.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading text="Cargando redes sociales..." />;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Redes Sociales</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Gestiona los enlaces a tus redes sociales y plataformas
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Buscar plataforma..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/admin/social-links/new">
            <Button icon={Plus}>Nuevo Enlace</Button>
          </Link>
        </div>
      </div>

      {/* Links Grid */}
      {filteredLinks.length === 0 ? (
        <EmptyState
          icon={Share2}
          title={searchQuery ? "No se encontraron enlaces" : "No hay enlaces"}
          description={
            searchQuery
              ? "Intenta con otros términos de búsqueda"
              : "Comienza agregando tu primera red social"
          }
          action={
            !searchQuery ? (
              <Link href="/admin/social-links/new">
                <Button icon={Plus}>Crear Primer Enlace</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLinks.map((link) => (
            <Card key={link.id}>
              {/* Platform Badge */}
              <div className="flex items-center justify-between mb-4">
                <Badge variant="info">
                  <Globe className="w-3 h-3" />
                  {link.platform}
                </Badge>
                <Badge variant="default">Orden {link.order}</Badge>
              </div>

              {/* Link Info */}
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {link.label}
              </h3>
              
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-4"
              >
                <span className="truncate">{link.url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <Link href={`/admin/social-links/${link.id}`} className="flex-1">
                  <Button variant="outline" icon={Pencil} className="w-full">
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => deleteSocialLink(link.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
