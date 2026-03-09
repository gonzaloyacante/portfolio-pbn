/// Constantes globales de la aplicación.
/// No depende de ningún paquete externo — valores estáticos puros.
class AppConstants {
  AppConstants._();

  // ── API ───────────────────────────────────────────────────────────────────
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 30);
  static const int maxRetries = 3;

  // ── Autenticación ─────────────────────────────────────────────────────────
  /// Tiempo de expiración del access token (debe coincidir con el backend).
  static const Duration accessTokenTtl = Duration(minutes: 15);

  /// Tiempo de expiración del refresh token.
  static const Duration refreshTokenTtl = Duration(days: 30);

  // ── Paginación ────────────────────────────────────────────────────────────
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;

  // ── Imágenes ──────────────────────────────────────────────────────────────
  static const int imageQuality = 100;
  // Sin límite de dimensiones — se sube el original tal como está.
  // UCrop y image_picker reciben null = sin restricción de tamaño.

  // ── Sync offline ─────────────────────────────────────────────────────────
  static const Duration syncRetryDelay = Duration(seconds: 5);
  static const int maxSyncRetries = 5;

  // ── Cache ─────────────────────────────────────────────────────────────────
  static const Duration cacheTtl = Duration(minutes: 30);

  // ── Keys de SecureStorage ─────────────────────────────────────────────────
  static const String kAccessTokenKey = 'access_token';
  static const String kRefreshTokenKey = 'refresh_token';
  static const String kGoogleAccessTokenKey = 'google_access_token';
  static const String kGoogleRefreshTokenKey = 'google_refresh_token';

  // ── Keys de SharedPreferences ─────────────────────────────────────────────
  static const String kThemeModeKey = 'theme_mode';

  // ── Animaciones ───────────────────────────────────────────────────────────
  static const Duration defaultTransition = Duration(milliseconds: 500);
  static const Duration shortTransition = Duration(milliseconds: 200);

  // ── Información de contacto / soporte ─────────────────────────────────────
  static const String supportEmail = 'hola@paolabolivar.es';
  static const String siteUrl = 'www.paolabolivar.es';
  static const String ownerFullName = 'Paola Bolívar Nievas';
  static const String appName = 'Portfolio PBN — Admin';
}
