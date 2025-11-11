'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Loading, Input, Textarea } from '@/components/cms/form-components';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Skill {
  id: string;
  name: string;
  level: number;
  description: string | null;
  order: number;
}

export default function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isNew = resolvedParams.id === 'new';

  useEffect(() => {
    loadData();
  }, [resolvedParams.id]);

  async function loadData() {
    try {
      if (!isNew) {
        const data = await apiClient.getSkill(resolvedParams.id);
        setSkill(data);
      } else {
        setSkill({
          id: '',
          name: '',
          level: 80,
          description: null,
          order: 0
        });
      }
    } catch (error) {
      console.error('Error loading skill:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!skill) return;

    setSaving(true);
    try {
      if (isNew) {
        await apiClient.createSkill(skill);
      } else {
        await apiClient.updateSkill(resolvedParams.id, skill);
      }
      router.push('/admin/skills');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('¿Estás segura de eliminar esta habilidad?')) return;
    
    try {
      await apiClient.deleteSkill(resolvedParams.id);
      router.push('/admin/skills');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error al eliminar');
    }
  }

  if (loading) return <Loading text={isNew ? "Preparando..." : "Cargando habilidad..."} />;
  if (!skill) return null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/skills">
          <Button variant="outline" icon={ArrowLeft}>Volver</Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {isNew ? 'Nueva Habilidad' : 'Editar Habilidad'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {isNew ? 'Agrega una nueva habilidad profesional' : 'Actualiza la información'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <div className="space-y-5">
              <Input
                label="Nombre de la Habilidad *"
                value={skill.name}
                onChange={(e) => setSkill({ ...skill, name: e.target.value })}
                placeholder="Ej: Photoshop, Ilustración, JavaScript..."
                required
              />

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Nivel de Dominio: <span className="text-blue-600 dark:text-blue-400 font-bold">{skill.level}%</span>
                </label>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={skill.level}
                  onChange={(e) => setSkill({ ...skill, level: parseInt(e.target.value) })}
                  className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(37, 99, 235) ${skill.level}%, rgb(229, 231, 235) ${skill.level}%, rgb(229, 231, 235) 100%)`
                  }}
                />
                
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  <span>Principiante</span>
                  <span>Intermedio</span>
                  <span>Experto</span>
                </div>
              </div>

              <Textarea
                label="Descripción"
                value={skill.description || ''}
                onChange={(e) => setSkill({ ...skill, description: e.target.value })}
                rows={4}
                placeholder="Describe tu experiencia con esta habilidad..."
              />

              <Input
                label="Orden"
                type="number"
                value={skill.order.toString()}
                onChange={(e) => setSkill({ ...skill, order: parseInt(e.target.value) || 0 })}
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
                Eliminar Habilidad
              </Button>
            )}
            
            <div className="flex gap-3 ml-auto">
              <Link href="/admin/skills">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button
                type="submit"
                icon={Save}
                loading={saving}
                disabled={saving}
              >
                {saving ? 'Guardando...' : (isNew ? 'Crear Habilidad' : 'Guardar Cambios')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
