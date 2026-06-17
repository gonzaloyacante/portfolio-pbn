import 'dart:io';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'app.dart';
import 'core/config/env_config.dart';
import 'core/notifications/push_service.dart';
import 'core/theme/theme_provider.dart';
import 'core/utils/app_logger.dart';
import 'firebase_options.dart';

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
  // 0. Google Fonts — permitir descarga de fuentes en runtime.
  // La app usa Google Fonts online para ciertas fuentes; habilitamos la
  // descarga en runtime para evitar fallos si la fuente no está bundleada.
  GoogleFonts.config.allowRuntimeFetching = true;

  // 1–3. Inicializaciones independientes en paralelo ─────────────────────────
  // preloadThemeMode se lanza ya aquí para que corra en paralelo con el resto.
  // Su resultado se recoge más abajo, después de que todos los futures terminen.
  final themeFuture = preloadThemeMode();

  await Future.wait([
    // Datos de locale para español (table_calendar, intl, etc.)
    initializeDateFormatting('es_ES'),
    initializeDateFormatting('es'),
    // Variables de entorno (asset bundleado; en prod distribute-prod.sh
    // copia .env.production sobre .env antes de compilar).
    _loadDotenv(),
    // Firebase (usa DefaultFirebaseOptions — no depende de dotenv).
    _initFirebase(),
  ]);

  // Recoger el tema inicial (seguro: preloadThemeMode ya terminó o está por
  // terminar junto con los demás futures del wait anterior).
  final initialTheme = await themeFuture;

  // 4. Sentry + runApp ───────────────────────────────────────────────────────
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
    }, appRunner: () => _runApp(initialTheme));
  } else {
    // Sin DSN de Sentry (entorno local sin configurar): arrancar directamente.
    AppLogger.warn(
      'Sentry DSN no configurado — omitiendo captura de errores remota',
    );
    _runApp(initialTheme);
  }
}

void _runApp(ThemeMode initialTheme) {
  runApp(
    ProviderScope(
      overrides: [initialThemeModeProvider.overrideWithValue(initialTheme)],
      child: const App(),
    ),
  );
}

Future<void> _loadDotenv() async {
  try {
    await dotenv.load(fileName: '.env', mergeWith: const {});
    AppLogger.info('✓ dotenv cargado (entorno: ${EnvConfig.environment})');
  } catch (e) {
    // Esto solo ocurre si el asset .env está ausente (error de build).
    // La app continuará con los valores fallback definidos en EnvConfig.
    AppLogger.warn(
      'dotenv no disponible: $e — usando valores fallback de EnvConfig',
    );
  }
}

Future<void> _initFirebase() async {
  try {
    // Inicialización explícita usando opciones generadas a partir de los
    // ficheros `google-services.json` / `GoogleService-Info.plist`.
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    AppLogger.info('✓ Firebase inicializado (con DefaultFirebaseOptions)');

    if (Platform.isAndroid) {
      FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);
    }
  } catch (e, st) {
    AppLogger.warn('Firebase no disponible, omitiendo inicialización FCM: $e');
    AppLogger.debug('Firebase init stack: $st');
  }
}
