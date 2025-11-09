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
  Eye
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
      title: 'Proyectos',
      value: stats.totalProjects,
      icon: FolderKanban,
      description: `${stats.publishedProjects} publicados`,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
    },
    {
      title: 'Categorías',
      value: stats.totalCategories,
      icon: Tags,
      description: 'Organiza tus proyectos',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30',
    },
    {
      title: 'Mensajes',
      value: stats.newContacts,
      icon: stats.newContacts > 0 ? MailOpen : Mail,
      description: stats.newContacts > 0 ? `${stats.newContacts} nuevos` : 'Sin mensajes nuevos',
      gradient: 'from-rose-500 to-red-500',
      bgGradient: 'from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30',
    },
    {
      title: 'Habilidades',
      value: stats.totalSkills,
      icon: Award,
      description: 'Tus capacidades',
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30',
    },
    {
      title: 'Redes Sociales',
      value: stats.totalSocialLinks,
      icon: Share2,
      description: 'Enlaces activos',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
          ¡Bienvenida de vuelta!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Aquí está el resumen de tu portfolio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={`border-0 shadow-lg bg-gradient-to-br ${stat.bgGradient} overflow-hidden relative group hover:shadow-xl transition-shadow duration-300`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 relative z-10">
                <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            ¿Qué quieres hacer hoy?
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Acciones rápidas para gestionar tu portfolio</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a
              href="/admin/projects"
              className="group flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-700 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <FolderKanban className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white text-lg">Mis Proyectos</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Agregar y editar tus trabajos
                </p>
              </div>
            </a>
            <a
              href="/admin/contacts"
              className="group flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-rose-300 dark:hover:border-rose-700 bg-gradient-to-br from-rose-50/50 to-red-50/50 dark:from-rose-950/20 dark:to-red-950/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white text-lg">Mensajes</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Ver contactos recibidos
                </p>
              </div>
            </a>
            <a
              href="/admin/settings"
              className="group flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-700 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white text-lg">Configuración</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Editar información general
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
