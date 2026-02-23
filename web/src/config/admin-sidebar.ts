import { ROUTES } from '@/config/routes'
import {
  LayoutDashboard,
  Home,
  ImageIcon,
  Folder,
  Sparkles,
  MessageSquare,
  Mail,
  User,
  Settings,
  Palette,
  Trash2,
  type LucideIcon,
} from 'lucide-react'

export interface SidebarItem {
  href: string
  label: string
  icon: LucideIcon
}

export const menuItems: SidebarItem[] = [
  {
    href: ROUTES.admin.dashboard,
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: ROUTES.admin.home,
    label: 'Inicio',
    icon: Home,
  },
  {
    href: ROUTES.admin.projects,
    label: 'Proyectos',
    icon: ImageIcon,
  },
  {
    href: ROUTES.admin.categories,
    label: 'Categorías',
    icon: Folder,
  },
  {
    href: ROUTES.admin.services,
    label: 'Servicios',
    icon: Sparkles,
  },
  {
    href: ROUTES.admin.testimonials,
    label: 'Testimonios',
    icon: MessageSquare,
  },
  {
    href: ROUTES.admin.contacts,
    label: 'Mensajes',
    icon: Mail,
  },
  {
    href: ROUTES.admin.about,
    label: 'Sobre Mí',
    icon: User,
  },
  {
    href: ROUTES.admin.settings,
    label: 'Contacto y Redes',
    icon: Settings,
  },
  {
    href: ROUTES.admin.theme,
    label: 'Tema',
    icon: Palette,
  },
  {
    href: ROUTES.admin.trash,
    label: 'Papelera',
    icon: Trash2,
  },
]
