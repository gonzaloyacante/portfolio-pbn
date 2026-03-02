import 'dart:io';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'app.dart';
import 'core/config/env_config.dart';
import 'core/notifications/push_service.dart';
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
  // 0. Google Fonts — en release deshabilitar descarga de fuentes en runtime ──
  // En producción las fuentes debería estar bundleadas en assets.
  // allowRuntimeFetching = true solo en debug para facilitar el desarrollo.
  GoogleFonts.config.allowRuntimeFetching = kDebugMode;

  // Inicializar datos de locale para español (table_calendar, intl, etc.)
  await initializeDateFormatting('es_ES');
  await initializeDateFormatting('es');

  // 1. Variables de entorno ─────────────────────────────────────────────────
  // Carga .env desde la raíz del proyecto Flutter (asset bundleado).
  // En producción, el script distribute-prod.sh copia .env.production sobre .env
  // antes de compilar, garantizando los valores correctos en el APK.
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

  // 2. Firebase ─────────────────────────────────────────────────────────────
  // Inicializar Firebase antes de registrar handlers o usar servicios.
  // Las opciones de Firebase se leen de google-services.json / GoogleService-Info.plist
  // o de DefaultFirebaseOptions si se generaron. Ver:
  // https://firebase.google.com/docs/flutter/setup
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
