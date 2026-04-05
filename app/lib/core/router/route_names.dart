/// Nombres de ruta para GoRouter.
/// NUNCA hardcodear strings de rutas fuera de esta clase.
class RouteNames {
  RouteNames._();

  // ── Auth ───────────────────────────────────────────────────────────────────
  static const String login = 'login';
  static const String splash = 'splash';

  // ── Dashboard ─────────────────────────────────────────────────────────────
  static const String dashboard = 'dashboard';

  // ── Categorías ────────────────────────────────────────────────────────────
  static const String categories = 'categories';
  static const String categoryNew = 'category-new';
  static const String categoryEdit = 'category-edit';
  static const String categoryGallery = 'category-gallery';

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
  static const String bookingEdit = 'booking-edit';

  // ── Settings ──────────────────────────────────────────────────────────────
  static const String settings = 'settings';
  static const String settingsHome = 'settings-home';
  static const String settingsAbout = 'settings-about';
  static const String settingsContact = 'settings-contact';
  static const String settingsTheme = 'settings-theme';
  static const String settingsSite = 'settings-site';
  static const String settingsSocial = 'settings-social';

  // ── Papelera ──────────────────────────────────────────────────────────────
  static const String trash = 'trash';
  static const String trashDetail = 'trash-detail';

  // ── Cuenta ────────────────────────────────────────────────────────────────
  static const String account = 'account';

  // ── Ayuda ────────────────────────────────────────────────────────────────
  static const String help = 'help';

  // ── Preferencias de la App ────────────────────────────────────────────────
  static const String appSettings = 'app-settings';

  // ── Actualizaciones ───────────────────────────────────────────────────────
  static const String appUpdate = 'app-update';
}

/// Paths de ruta.
class RoutePaths {
  RoutePaths._();

  static const String login = '/login';
  static const String splash = '/splash';
  static const String dashboard = '/dashboard';
  static const String categories = '/categories';
  static const String categoryNew = '/categories/new';
  static const String categoryEdit = '/categories/:id/edit';
  static const String categoryGallery = '/categories/:id/gallery';
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
  static const String bookingEdit = '/calendar/:id/edit';
  static const String settings = '/settings';
  static const String settingsHome = '/settings/home';
  static const String settingsAbout = '/settings/about';
  static const String settingsContact = '/settings/contact';
  static const String settingsTheme = '/settings/theme';
  static const String settingsSite = '/settings/site';
  static const String settingsSocial = '/settings/social';
  static const String trash = '/trash';
  static const String trashDetail = '/trash/detail';
  static const String account = '/account';
  static const String help = '/help';
  static const String appSettings = '/app-settings';
  static const String appUpdate = '/app-update';
}
