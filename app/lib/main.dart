import 'dart:async';

import 'package:flutter/material.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import './bootstrap.dart';

/// Entry point. Usa [runZonedGuarded] para capturar TODOS los errores
/// no capturados (síncronos y asíncronos) dentro de la zona de ejecución.
/// Esto es imprescindible en producción: [main] async por sí solo no
/// intercepta errores en Futures que escapen del await-chain.
void main() {
  runZonedGuarded(
    () async {
      WidgetsFlutterBinding.ensureInitialized();
      await bootstrap();
    },
    (error, stack) {
      // Captura fallback antes de que Sentry esté inicializado
      // (errores muy tempranos durante bootstrap).
      debugPrint('[UNCAUGHT ERROR] $error\n$stack');
      Sentry.captureException(error, stackTrace: stack);
    },
  );
}
