/// Todas las URLs de la API REST admin.
/// NUNCA hardcodear paths fuera de esta clase.
class Endpoints {
  Endpoints._();

  // ── Auth ──────────────────────────────────────────────────────────────────
  static const String authLogin = '/api/admin/auth/login';
  static const String authRefresh = '/api/admin/auth/refresh';
  static const String authLogout = '/api/admin/auth/logout';
  static const String authMe = '/api/admin/auth/me';

  // ── Proyectos ─────────────────────────────────────────────────────────────
  static const String projects = '/api/admin/projects';
  static String project(String id) => '/api/admin/projects/$id';
  static const String projectsReorder = '/api/admin/projects/reorder';
  static String projectImages(String id) => '/api/admin/projects/$id/images';
  static String projectImage(String id, String imageId) => '/api/admin/projects/$id/images/$imageId';

  // ── Categorías ────────────────────────────────────────────────────────────
  static const String categories = '/api/admin/categories';
  static String category(String id) => '/api/admin/categories/$id';

  // ── Servicios ─────────────────────────────────────────────────────────────
  static const String services = '/api/admin/services';
  static String service(String id) => '/api/admin/services/$id';

  // ── Testimonios ───────────────────────────────────────────────────────────
  static const String testimonials = '/api/admin/testimonials';
  static String testimonial(String id) => '/api/admin/testimonials/$id';

  // ── Contactos ─────────────────────────────────────────────────────────────
  static const String contacts = '/api/admin/contacts';
  static String contact(String id) => '/api/admin/contacts/$id';

  // ── Reservas/Bookings ─────────────────────────────────────────────────────
  static const String bookings = '/api/admin/bookings';
  static String booking(String id) => '/api/admin/bookings/$id';

  // ── Settings ──────────────────────────────────────────────────────────────
  static const String settings = '/api/admin/settings';
  static String settingsSection(String section) => '/api/admin/settings/$section';

  // ── Analytics ────────────────────────────────────────────────────────────
  static const String analytics = '/api/admin/analytics';
  static const String analyticsOverview = '/api/admin/analytics/overview';
  static const String analyticsCharts = '/api/admin/analytics/charts';

  // ── Social Links ─────────────────────────────────────────────────────────
  static const String socialLinks = '/api/admin/settings/social';

  // ── Papelera ─────────────────────────────────────────────────────────────
  static const String trash = '/api/admin/trash';
  static String trashItem(String id) => '/api/admin/trash/$id';
  static String trashTypedItem(String type, String id) => '/api/admin/trash/$type/$id';

  // ── Push notifications ────────────────────────────────────────────────────
  static const String pushRegister = '/api/admin/push/register';
  static const String pushUnregister = '/api/admin/push/unregister';

  // ── Upload ────────────────────────────────────────────────────────────────
  /// Endpoint autenticado con JWT Flutter para subir imágenes.
  static const String adminUpload = '/api/admin/upload';

  // ── App Updates (in-app update check) ────────────────────────────────────
  /// GET público: retorna la última release de la app Flutter.
  /// Query params opcionales: ?version=1.0.0&versionCode=1
  static const String appLatestRelease = '/api/admin/app/latest-release';
}
