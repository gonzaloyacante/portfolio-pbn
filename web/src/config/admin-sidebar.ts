import { ROUTES } from '@/config/routes'
import {
  LayoutDashboard,
  Home,
  Folder,
  Sparkles,
  MessageSquare,
  Mail,
  User,
  Share2,
  Palette,
  Globe,
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
    href: ROUTES.admin.messages,
    label: 'Mensajes',
    icon: Mail,
  },
  {
    href: ROUTES.admin.about,
    label: 'Sobre Mí',
    icon: User,
  },
  {
    href: ROUTES.admin.contacts,
    label: 'Contacto y Redes',
    icon: Share2,
  },
  {
    href: ROUTES.admin.siteSettings,
    label: 'Sitio publico',
    icon: Globe,
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
