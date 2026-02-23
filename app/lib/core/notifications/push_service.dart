import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

import '../utils/app_logger.dart';

// ── Background handler ─────────────────────────────────────────────────────────

/// Handler de mensajes en background/terminado.
///
/// DEBE ser una función top-level (no un método de clase) para ser reconocida
/// por Firebase Messaging como handler en isolate separado.
@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  AppLogger.info(
    'PushService[bg]: mensaje recibido — ${message.notification?.title}',
  );
  // Aquí se pueden guardar datos en base de datos local si es necesario.
  // Firebase muestra automáticamente la notificación del sistema.
}

// ── PushService ────────────────────────────────────────────────────────────────

/// Servicio de notificaciones push vía Firebase Cloud Messaging (FCM).
///
/// Responsabilidades:
/// - Solicitar permisos de notificación (iOS/macOS).
/// - Obtener y refrescar el token FCM del dispositivo.
/// - Configurar handlers de mensajes en foreground.
///
/// Uso:
/// ```dart
/// final service = PushService();
/// await service.init();
/// final token = await service.getToken();
/// ```
class PushService {
  PushService() : _messaging = FirebaseMessaging.instance;

  final FirebaseMessaging _messaging;

  // ── init ───────────────────────────────────────────────────────────────────

  /// Inicializa FCM: pide permisos y configura presentación en foreground.
  ///
  /// En Android los permisos son automáticos a partir de Android 13 (API 33).
  /// En iOS/macOS se muestra un diálogo de sistema.
  Future<void> init() async {
    try {
      // 1. Solicitar permisos (relevante en iOS/macOS)
      final settings = await _messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
        provisional: false,
      );

      if (settings.authorizationStatus == AuthorizationStatus.denied) {
        AppLogger.warn(
          'PushService: permisos de notificación denegados por el usuario',
        );
        return;
      }

      // 2. Configurar presentación de notificaciones en foreground (iOS)
      await FirebaseMessaging.instance
          .setForegroundNotificationPresentationOptions(
            alert: true,
            badge: true,
            sound: true,
          );

      AppLogger.info(
        'PushService: inicializado correctamente '
        '(status=${settings.authorizationStatus.name})',
      );
    } catch (e, st) {
      AppLogger.error('PushService: error en init()', e, st);
    }
  }

  // ── getToken ───────────────────────────────────────────────────────────────

  /// Obtiene el token FCM actual del dispositivo.
  ///
  /// Retorna `null` si los permisos están denegados o si hay un error.
  /// En web retorna el VAPID token; en móvil el FCM registration token.
  Future<String?> getToken() async {
    try {
      final token = await _messaging.getToken();
      if (token != null) {
        AppLogger.debug('PushService: token obtenido (${token.length} chars)');
      }
      return token;
    } catch (e, st) {
      AppLogger.error('PushService: error al obtener token', e, st);
      return null;
    }
  }

  // ── platform ───────────────────────────────────────────────────────────────

  /// Devuelve la plataforma actual para registrar el token en el backend.
  String get platform {
    if (defaultTargetPlatform == TargetPlatform.iOS ||
        defaultTargetPlatform == TargetPlatform.macOS) {
      return 'ios';
    }
    return 'android';
  }

  // ── onTokenRefresh ─────────────────────────────────────────────────────────

  /// Stream que emite un nuevo token cuando FCM lo rota.
  ///
  /// Subscríbete en el provider para re-registrar el token rotado.
  Stream<String> get onTokenRefresh => _messaging.onTokenRefresh;
}
