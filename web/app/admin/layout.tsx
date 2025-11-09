'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  Mail,
  Award,
  Share2,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Si estamos en /admin/login, no verificar autenticación
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Verificar autenticación
    const checkAuth = async () => {
      try {
        const token = apiClient.getToken();
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const userData = await apiClient.getMe();
        
        if (userData.role !== 'ADMIN') {
          throw new Error('No tienes permisos de administrador');
        }

        setUser(userData);
      } catch (err) {
        console.error('Error de autenticación:', err);
        apiClient.clearToken();
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isLoginPage, router]);

  const handleLogout = () => {
    apiClient.clearToken();
    router.push('/admin/login');
  };

  // Si estamos en login, mostrar solo el contenido sin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Mostrar loading mientras verificamos auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2 text-sm text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Inicio', href: '/admin', icon: LayoutDashboard, description: 'Panel principal' },
    { name: 'Proyectos', href: '/admin/projects', icon: FolderKanban, description: 'Tus trabajos' },
    { name: 'Categorías', href: '/admin/categories', icon: Tags, description: 'Organiza tus proyectos' },
    { name: 'Mensajes', href: '/admin/contacts', icon: Mail, description: 'Contactos recibidos' },
    { name: 'Habilidades', href: '/admin/skills', icon: Award, description: 'Tus skills' },
    { name: 'Redes Sociales', href: '/admin/social-links', icon: Share2, description: 'Tus perfiles' },
    { name: 'Configuración', href: '/admin/settings', icon: Settings, description: 'Ajustes generales' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Portfolio CMS
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Panel de administración</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex flex-col gap-1 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-pink-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${isActive ? '' : 'text-gray-500 dark:text-gray-400 group-hover:text-rose-500'}`} />
                    <span className="font-semibold text-sm">{item.name}</span>
                  </div>
                  <span className={`text-xs ml-8 ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    {item.description}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-300 dark:border-gray-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-700 dark:hover:text-rose-400 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between h-full px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1" />
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-10 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
