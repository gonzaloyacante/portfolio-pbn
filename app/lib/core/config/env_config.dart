import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Wrapper tipado sobre flutter_dotenv.
/// Acceder siempre a través de esta clase; nunca usar dotenv.env[] directamente.
class EnvConfig {
  EnvConfig._();

  // ── API ───────────────────────────────────────────────────────────────────
  static String get apiBaseUrl =>
      dotenv.env['API_BASE_URL'] ?? 'http://localhost:3000';

  // ── Sentry ────────────────────────────────────────────────────────────────
  static String get sentryDsn => dotenv.env['SENTRY_DSN'] ?? '';

  // ── Entorno ───────────────────────────────────────────────────────────────
  static String get environment => dotenv.env['ENVIRONMENT'] ?? 'development';

  static bool get isProduction => environment == 'production';
  static bool get isDevelopment => environment == 'development';

  // ── FCM (solo Android, iOS usa APNs automáticamente) ─────────────────────
  static String get fcmVapidKey => dotenv.env['FCM_VAPID_KEY'] ?? '';
}
