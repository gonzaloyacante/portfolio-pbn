import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'app.dart';
import 'core/config/env_config.dart';
import 'core/notifications/push_service.dart';
import 'core/utils/app_logger.dart';

/// Inicializa todos los servicios necesarios antes de arrancar la UI.
///
/// Orden de inicialización:
/// 1. Variables de entorno (dotenv) — debe ser lo primero
/// 2. Firebase — necesario para FCM, Crashlytics, etc.
/// 3. Sentry — envuelve [runApp] para captura total de errores
///
/// NOTA: Requiere `android/app/google-services.json` e
/// `ios/Runner/GoogleService-Info.plist` para Firebase (ficheros gitignored).
Future<void> bootstrap() async {
  // 1. Variables de entorno ─────────────────────────────────────────────────
  // Carga .env desde la raíz del proyecto Flutter.
  // En producción, las variables se inyectan vía CI/CD (no hay .env en prod).
  await dotenv.load(fileName: '.env', mergeWith: const {});
  AppLogger.info('✓ dotenv cargado (entorno: ${EnvConfig.environment})');

  // 2. Firebase ─────────────────────────────────────────────────────────────
  // El handler de background debe registrarse antes de initializeApp.
  // Debe ser una función top-level marcada con @pragma('vm:entry-point').
  FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);
  // Las opciones de Firebase se leen de google-services.json / GoogleService-Info.plist.
  // Para configurar Firebase: https://firebase.google.com/docs/flutter/setup
  await Firebase.initializeApp();
  AppLogger.info('✓ Firebase inicializado');

  // 3. Sentry + runApp ───────────────────────────────────────────────────────
  // SentryFlutter.init envuelve internamente runApp con captura de errores de
  // Flutter framework (FlutterError.onError) además de la zona de runZonedGuarded
  // definida en main.dart. Doble capa: zona async + flutter framework.
  if (EnvConfig.sentryDsn.isNotEmpty) {
    await SentryFlutter.init((options) {
      options.dsn = EnvConfig.sentryDsn;
      options.environment = EnvConfig.environment;
      // En dev capturamos todo; en prod solo el 10% de trazas de rendimiento.
      options.tracesSampleRate = EnvConfig.isProduction ? 0.1 : 1.0;
      options.debug = EnvConfig.isDevelopment;
    }, appRunner: _runApp);
  } else {
    // Sin DSN de Sentry (entorno local sin configurar): arrancar directamente.
    AppLogger.warn(
      'Sentry DSN no configurado — omitiendo captura de errores remota',
    );
    _runApp();
  }
}

void _runApp() {
  runApp(const ProviderScope(child: App()));
}
