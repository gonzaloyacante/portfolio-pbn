import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Wrapper tipado sobre flutter_dotenv.
/// Acceder siempre a través de esta clase; nunca usar dotenv.env[] directamente.
class EnvConfig {
  EnvConfig._();

  // ── API ───────────────────────────────────────────────────────────────────
  /// URL base de la API (sin slash al final).
  /// Fallback: producción en release, localhost en debug.
  /// NUNCA será HTTP en release gracias al NetworkSecurityConfig.
  static String get apiBaseUrl {
    final fromEnv = dotenv.env['API_BASE_URL'] ?? '';
    if (fromEnv.isNotEmpty) return fromEnv;
    // Fallback seguro: producción en release, local en debug
    return kReleaseMode ? 'https://paolabolivar.es' : 'http://localhost:3000';
  }

  // ── Sentry ────────────────────────────────────────────────────────────────
  static String get sentryDsn => dotenv.env['SENTRY_DSN'] ?? '';

  // ── Entorno ───────────────────────────────────────────────────────────────
  static String get environment {
    final fromEnv = dotenv.env['ENVIRONMENT'] ?? '';
    if (fromEnv.isNotEmpty) return fromEnv;
    // Fallback: kReleaseMode determina el entorno si el .env no lo especifica
    return kReleaseMode ? 'production' : 'development';
  }

  static bool get isProduction => environment == 'production';
  static bool get isDevelopment => environment == 'development';

  // ── FCM (solo Android, iOS usa APNs automáticamente) ─────────────────────
  static String get fcmVapidKey => dotenv.env['FCM_VAPID_KEY'] ?? '';
}
