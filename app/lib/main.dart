import 'dart:async';

import 'package:flutter/material.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import './bootstrap.dart';

/// Entry point. Usa [runZonedGuarded] para capturar TODOS los errores
/// no capturados (síncronos y asíncronos) dentro de la zona de ejecución.
/// Esto es imprescindible en producción: [main] async por sí solo no
/// intercepta errores en Futures que escapen del await-chain.
Future<void> main() async {
  SentryWidgetsFlutterBinding.ensureInitialized();

  try {
    // bootstrap() inicializa Sentry (vía SentryFlutter.init) y luego arranca
    // la UI. Llamamos directamente a bootstrap() y atrapamos cualquier
    // excepción temprana para intentar reportarla de forma segura.
    await bootstrap();
  } catch (error, stack) {
    // Intentar enviar a Sentry si está disponible; si ocurre cualquier error
    // al hacerlo (p. ej. Sentry no inicializado), caeremos al fallback
    // de debugPrint para no ocultar el fallo.
    try {
      await Sentry.captureException(error, stackTrace: stack);
    } catch (e) {
      debugPrint('[UNCAUGHT ERROR BEFORE SENTRY] $error\n$stack');
      debugPrint('[SENTRY REPORT FAILED] $e');
    }
    // Re-lanzar para mantener el comportamiento por defecto (crash) en dev.
    rethrow;
  }
}
