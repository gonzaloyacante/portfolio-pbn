'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import {
  FolderKanban,
  Tags,
  Mail,
  MailOpen,
  Award,
  Share2,
  Eye,
  TrendingUp
} from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalCategories: number;
  newContacts: number;
  totalContacts: number;
  totalSkills: number;
  totalSocialLinks: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    publishedProjects: 0,
    totalCategories: 0,
    newContacts: 0,
    totalContacts: 0,
    totalSkills: 0,
    totalSocialLinks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtener datos de todas las entidades
        const [projects, categories, contacts, skills, socialLinks] = await Promise.all([
          apiClient.getAllProjectsAdmin(),
          apiClient.getCategories(),
          apiClient.getContacts(),
          apiClient.getSkills(),
          apiClient.getSocialLinks(),
        ]);

        setStats({
          totalProjects: projects.length,
          publishedProjects: projects.filter((p: any) => p.status === 'PUBLISHED').length,
          totalCategories: categories.length,
          newContacts: contacts.filter((c: any) => c.status === 'NEW').length,
          totalContacts: contacts.length,
          totalSkills: skills.length,
          totalSocialLinks: socialLinks.length,
        });
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Proyectos Totales',
      value: stats.totalProjects,
      icon: FolderKanban,
      description: `${stats.publishedProjects} publicados`,
      color: 'text-blue-600',
    },
    {
      title: 'Categorías',
      value: stats.totalCategories,
      icon: Tags,
      description: 'Total de categorías',
      color: 'text-purple-600',
    },
    {
      title: 'Contactos Nuevos',
      value: stats.newContacts,
      icon: Mail,
      description: `${stats.totalContacts} total`,
      color: 'text-red-600',
    },
    {
      title: 'Skills',
      value: stats.totalSkills,
      icon: Award,
      description: 'Habilidades activas',
      color: 'text-green-600',
    },
    {
      title: 'Redes Sociales',
      value: stats.totalSocialLinks,
      icon: Share2,
      description: 'Enlaces configurados',
      color: 'text-pink-600',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen del estado del portfolio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a
              href="/admin/projects"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <FolderKanban className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium">Gestionar Proyectos</p>
                <p className="text-sm text-muted-foreground">Crear y editar proyectos</p>
              </div>
            </a>
            <a
              href="/admin/contacts"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Mail className="h-6 w-6 text-red-600" />
              <div>
                <p className="font-medium">Ver Contactos</p>
                <p className="text-sm text-muted-foreground">Revisar mensajes nuevos</p>
              </div>
            </a>
            <a
              href="/admin/settings"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Eye className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-medium">Configuración</p>
                <p className="text-sm text-muted-foreground">Editar info del portfolio</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
