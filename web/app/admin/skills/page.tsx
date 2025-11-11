'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Badge, EmptyState, Loading, Input } from '@/components/cms/form-components';
import { Pencil, Trash2, Target, Plus, Search } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: number;
  description: string | null;
  order: number;
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    try {
      const data = await apiClient.getSkills();
      setSkills(data);
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSkill(id: string) {
    if (!confirm('¿Estás segura de eliminar esta habilidad?')) return;
    
    try {
      await apiClient.deleteSkill(id);
      setSkills(skills.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Error al eliminar la habilidad');
    }
  }

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading text="Cargando habilidades..." />;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Habilidades</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Gestiona las habilidades profesionales que se muestran en el portafolio
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Buscar habilidades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/admin/skills/new">
            <Button icon={Plus}>Nueva Habilidad</Button>
          </Link>
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <EmptyState
          icon={Target}
          title={searchQuery ? "No se encontraron habilidades" : "No hay habilidades"}
          description={
            searchQuery
              ? "Intenta con otros términos de búsqueda"
              : "Comienza agregando tu primera habilidad profesional"
          }
          action={
            !searchQuery ? (
              <Link href="/admin/skills/new">
                <Button icon={Plus}>Crear Primera Habilidad</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <Card key={skill.id} padding="md">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {skill.name}
                  </h3>
                  <Badge variant="info" className="mt-2">Orden {skill.order}</Badge>
                </div>
              </div>

              {/* Level Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Nivel de Dominio
                  </span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              {skill.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                  {skill.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <Link href={`/admin/skills/${skill.id}`} className="flex-1">
                  <Button variant="outline" icon={Pencil} className="w-full">
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => deleteSkill(skill.id)}
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
