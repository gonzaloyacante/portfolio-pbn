/// Nombres de ruta para GoRouter.
/// NUNCA hardcodear strings de rutas fuera de esta clase.
class RouteNames {
  RouteNames._();

  // ── Auth ───────────────────────────────────────────────────────────────────
  static const String login = 'login';

  // ── Dashboard ─────────────────────────────────────────────────────────────
  static const String dashboard = 'dashboard';

  // ── Proyectos ─────────────────────────────────────────────────────────────
  static const String projects = 'projects';
  static const String projectNew = 'project-new';
  static const String projectEdit = 'project-edit';

  // ── Categorías ────────────────────────────────────────────────────────────
  static const String categories = 'categories';
  static const String categoryNew = 'category-new';
  static const String categoryEdit = 'category-edit';

  // ── Servicios ─────────────────────────────────────────────────────────────
  static const String services = 'services';
  static const String serviceNew = 'service-new';
  static const String serviceEdit = 'service-edit';

  // ── Testimonios ───────────────────────────────────────────────────────────
  static const String testimonials = 'testimonials';
  static const String testimonialNew = 'testimonial-new';
  static const String testimonialEdit = 'testimonial-edit';

  // ── Contacto ──────────────────────────────────────────────────────────────
  static const String contacts = 'contacts';
  static const String contactDetail = 'contact-detail';

  // ── Calendario / Reservas ─────────────────────────────────────────────────
  static const String calendar = 'calendar';
  static const String bookingNew = 'booking-new';
  static const String bookingDetail = 'booking-detail';

  // ── Settings ──────────────────────────────────────────────────────────────
  static const String settings = 'settings';
  static const String settingsHome = 'settings-home';
  static const String settingsAbout = 'settings-about';
  static const String settingsContact = 'settings-contact';
  static const String settingsTheme = 'settings-theme';
  static const String settingsSite = 'settings-site';

  // ── Papelera ──────────────────────────────────────────────────────────────
  static const String trash = 'trash';

  // ── Cuenta ────────────────────────────────────────────────────────────────
  static const String account = 'account';

  // ── Ayuda ────────────────────────────────────────────────────────────────
  static const String help = 'help';
}

/// Paths de ruta.
class RoutePaths {
  RoutePaths._();

  static const String login = '/login';
  static const String dashboard = '/dashboard';
  static const String projects = '/projects';
  static const String projectNew = '/projects/new';
  static const String projectEdit = '/projects/:id/edit';
  static const String categories = '/categories';
  static const String categoryNew = '/categories/new';
  static const String categoryEdit = '/categories/:id/edit';
  static const String services = '/services';
  static const String serviceNew = '/services/new';
  static const String serviceEdit = '/services/:id/edit';
  static const String testimonials = '/testimonials';
  static const String testimonialNew = '/testimonials/new';
  static const String testimonialEdit = '/testimonials/:id/edit';
  static const String contacts = '/contacts';
  static const String contactDetail = '/contacts/:id';
  static const String calendar = '/calendar';
  static const String bookingNew = '/calendar/new';
  static const String bookingDetail = '/calendar/:id';
  static const String settings = '/settings';
  static const String settingsHome = '/settings/home';
  static const String settingsAbout = '/settings/about';
  static const String settingsContact = '/settings/contact';
  static const String settingsTheme = '/settings/theme';
  static const String settingsSite = '/settings/site';
  static const String trash = '/trash';
  static const String account = '/account';
  static const String help = '/help';
}
