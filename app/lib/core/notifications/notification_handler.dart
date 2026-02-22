import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../router/route_names.dart';
import '../utils/app_logger.dart';

// ── NotificationHandler ────────────────────────────────────────────────────────

/// Gestiona la presentación y navegación de notificaciones push FCM.
///
/// Responsabilidades:
/// - Mostrar banner en foreground cuando la app está activa.
/// - Navegar a la sección correcta al hacer tap en una notificación.
/// - Manejar el mensaje inicial (app abierta desde notificación).
///
/// Uso (en el build de un [ConsumerStatefulWidget] raíz):
/// ```dart
/// @override
/// void initState() {
///   super.initState();
///   _notifHandler = NotificationHandler(router: ref.read(routerProvider));
///   _notifHandler.init();
/// }
/// ```
class NotificationHandler {
  NotificationHandler({
    required GoRouter router,
    required GlobalKey<NavigatorState> navigatorKey,
  }) : _router = router,
       _navigatorKey = navigatorKey;

  final GoRouter _router;
  final GlobalKey<NavigatorState> _navigatorKey;

  // ── init ───────────────────────────────────────────────────────────────────

  /// Registra todos los listeners de FCM.
  ///
  /// Llamar una sola vez tras montar el widget raíz de la app.
  void init() {
    // 1. Mensajes recibidos en foreground → mostrar SnackBar
    FirebaseMessaging.onMessage.listen((message) {
      AppLogger.info(
        'NotificationHandler[fg]: ${message.notification?.title}',
      );
      _showSnackBar(message);
    });

    // 2. App abierta desde notificación (background → foreground)
    FirebaseMessaging.onMessageOpenedApp.listen((message) {
      AppLogger.info(
        'NotificationHandler[tap]: ${message.notification?.title}',
      );
      _navigateFromMessage(message);
    });

    // 3. App abierta desde estado terminado por notificación
    FirebaseMessaging.instance.getInitialMessage().then((message) {
      if (message != null) {
        AppLogger.info(
          'NotificationHandler[initial]: ${message.notification?.title}',
        );
        // Leve delay para que el router esté montado
        Future.delayed(const Duration(milliseconds: 500), () {
          _navigateFromMessage(message);
        });
      }
    });
  }

  // ── _showSnackBar ──────────────────────────────────────────────────────────

  void _showSnackBar(RemoteMessage message) {
    final ctx = _navigatorKey.currentContext;
    if (ctx == null) return;

    final title = message.notification?.title ?? 'Notificación';
    final body = message.notification?.body;

    ScaffoldMessenger.of(ctx).showSnackBar(
      SnackBar(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            if (body != null && body.isNotEmpty)
              Text(body, style: const TextStyle(fontSize: 13)),
          ],
        ),
        duration: const Duration(seconds: 4),
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(
          label: 'Ver',
          onPressed: () => _navigateFromMessage(message),
        ),
      ),
    );
  }

  // ── _navigateFromMessage ───────────────────────────────────────────────────

  /// Navega a la pantalla correcta según los datos del mensaje.
  ///
  /// Convención de datos en la notificación:
  /// ```json
  /// { "screen": "contacts" | "bookings" | "dashboard" | "projects" }
  /// ```
  void _navigateFromMessage(RemoteMessage message) {
    final screen = message.data['screen'] as String?;

    switch (screen) {
      case 'contacts':
        _router.goNamed(RouteNames.contacts);
      case 'bookings':
      case 'calendar':
        _router.goNamed(RouteNames.calendar);
      case 'projects':
        _router.goNamed(RouteNames.projects);
      case 'dashboard':
      default:
        _router.goNamed(RouteNames.dashboard);
    }
  }
}
