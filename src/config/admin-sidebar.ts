import { ROUTES } from '@/config/routes'

export const menuItems = [
  {
    href: ROUTES.admin.dashboard,
    label: 'Dashboard',
    icon: '📊',
  },
  {
    href: ROUTES.admin.home,
    label: 'Inicio',
    icon: '🏠',
  },
  {
    href: ROUTES.admin.projects,
    label: 'Proyectos',
    icon: '🎨',
  },
  {
    href: ROUTES.admin.categories,
    label: 'Categorías',
    icon: '📁',
  },
  {
    href: ROUTES.admin.services,
    label: 'Servicios',
    icon: '💅',
  },
  {
    href: ROUTES.admin.testimonials,
    label: 'Testimonios',
    icon: '💬',
  },
  {
    href: ROUTES.admin.contacts,
    label: 'Mensajes',
    icon: '📬',
  },
  {
    href: ROUTES.admin.about,
    label: 'Sobre Mí',
    icon: '👤',
  },
  {
    href: ROUTES.admin.settings,
    label: 'Contacto y Redes',
    icon: '⚙️',
  },
  {
    href: ROUTES.admin.theme,
    label: 'Tema',
    icon: '🖌️',
  },
  {
    href: ROUTES.admin.analytics,
    label: 'Analítica',
    icon: '📈',
  },
  // Trash can be useful
  {
    href: ROUTES.admin.trash,
    label: 'Papelera',
    icon: '🗑️',
  },
]
