'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, Loader2 } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Habilidades</h1>
        <p className="text-muted-foreground">Gestiona las habilidades profesionales</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <Card key={skill.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold">{skill.name}</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${skill.level}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Nivel: {skill.level}%</p>
            {skill.description && (
              <p className="text-sm mt-2">{skill.description}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
