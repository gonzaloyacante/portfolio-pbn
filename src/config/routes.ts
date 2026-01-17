export const ROUTES = {
  home: '/',
  admin: {
    dashboard: '/admin/panel',
    contacts: '/admin/contactos',
    projects: '/admin/proyectos',
    testimonials: '/admin/testimonios',
    about: '/admin/sobre-mi',
    settings: '/admin/configuracion',
    theme: '/admin/tema',
    analytics: '/admin/analitica',
    account: '/admin/mi-cuenta',
    help: '/admin/ayuda',
    trash: '/admin/papelera',
  },
  public: {
    about: '/sobre-mi',
    projects: '/proyectos',
    contact: '/contacto',
    privacy: '/privacidad',
  },
} as const
