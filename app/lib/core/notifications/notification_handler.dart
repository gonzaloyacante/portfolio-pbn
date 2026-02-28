import 'dart:convert';
import 'dart:io';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:go_router/go_router.dart';

import '../router/route_names.dart';
import '../updates/app_release_model.dart';
import '../updates/app_update_provider.dart';
import '../utils/app_logger.dart';
import 'notification_prefs.dart';

// ── Canal Android ─────────────────────────────────────────────────────────────

/// Canal de notificaciones de alta prioridad para la app de administración.
/// Debe coincidir con el `channel_id` que envía el backend (push-service.ts).
const _kChannelId = 'admin_high';
const _kChannelName = 'Notificaciones de Administración';
const _kChannelDesc = 'Alertas de nuevos contactos, reservas y actividad del sitio.';

// ── NotificationHandler ────────────────────────────────────────────────────────

/// Gestiona la presentación y navegación de notificaciones push FCM.
///
/// Responsabilidades:
/// - Mostrar notificación del sistema en foreground (Android vía
///   [FlutterLocalNotificationsPlugin]; iOS vía FCM presentation options).
/// - Navegar al detalle correcto al hacer tap en una notificación.
/// - Manejar el mensaje inicial (app abierta desde notificación terminada).
///
/// Convención de datos `data` en el payload FCM:
/// ```json
/// {
///   "screen": "contacts" | "calendar" | "projects" | "dashboard",
///   "id":     "<entity-id>",        // navegación directa al detalle
///   "type":   "contact" | "booking" | "project" | ...
/// }
/// ```
///
/// Uso (en `initState` del widget raíz, una sola vez):
/// ```dart
/// _notifHandler = NotificationHandler(router: router, navigatorKey: key);
/// await _notifHandler.init();
/// ```
class NotificationHandler {
  NotificationHandler({required GoRouter router}) : _router = router;

  final GoRouter _router;

  final FlutterLocalNotificationsPlugin _localNotif = FlutterLocalNotificationsPlugin();

  // ── init ───────────────────────────────────────────────────────────────────

  /// Registra todos los listeners de FCM e inicializa las notificaciones locales.
  ///
  /// Llamar una sola vez tras montar el widget raíz de la app.
  Future<void> init() async {
    // Evitar acceder a FirebaseMessaging si Firebase no ha sido inicializado.
    if (Firebase.apps.isEmpty) {
      AppLogger.warn('Firebase no inicializado — omitiendo NotificationHandler.init()');
      return;
    }

    // 1. Inicializar flutter_local_notifications (canal + plugin)
    await _initLocalNotifications();

    // 2. Mensajes recibidos en foreground → notificación del sistema
    try {
      FirebaseMessaging.onMessage.listen((message) {
        AppLogger.info('NotificationHandler[fg]: ${message.notification?.title}');
        _showLocalNotification(message);
      });
    } catch (e, st) {
      AppLogger.warn('Error al registrar listener onMessage FCM: $e');
      AppLogger.debug('FCM onMessage stack: $st');
      return;
    }

    // 3. App abierta desde notificación (background → foreground tap)
    try {
      FirebaseMessaging.onMessageOpenedApp.listen((message) {
        AppLogger.info('NotificationHandler[tap]: ${message.notification?.title}');
        _navigateFromMessage(message);
      });
    } catch (e, st) {
      AppLogger.warn('Error al registrar onMessageOpenedApp: $e');
      AppLogger.debug('onMessageOpenedApp stack: $st');
    }

    // 4. App abierta desde estado terminado por notificación
    try {
      FirebaseMessaging.instance.getInitialMessage().then((message) {
        if (message != null) {
          AppLogger.info('NotificationHandler[initial]: ${message.notification?.title}');
          // Leve delay para que el router esté montado
          Future.delayed(const Duration(milliseconds: 600), () {
            _navigateFromMessage(message);
          });
        }
      });
    } catch (e, st) {
      AppLogger.warn('Error al obtener initialMessage FCM: $e');
      AppLogger.debug('getInitialMessage stack: $st');
    }
  }

  // ── _initLocalNotifications ────────────────────────────────────────────────

  Future<void> _initLocalNotifications() async {
    try {
      const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');

      // En iOS no pedimos permisos aquí — ya los gestiona FirebaseMessaging.
      const iosSettings = DarwinInitializationSettings(
        requestAlertPermission: false,
        requestBadgePermission: false,
        requestSoundPermission: false,
        // Mostrar la notificación aunque la app esté en foreground
        defaultPresentAlert: true,
        defaultPresentBadge: true,
        defaultPresentSound: true,
      );

      const initSettings = InitializationSettings(android: androidSettings, iOS: iosSettings);

      await _localNotif.initialize(
        settings: initSettings,
        onDidReceiveNotificationResponse: _onLocalNotifTap,
        // Tap en notificación cuando la app estaba terminada
        onDidReceiveBackgroundNotificationResponse: _onLocalNotifBackgroundTap,
      );

      // Crear canal Android de alta prioridad
      if (Platform.isAndroid) {
        const channel = AndroidNotificationChannel(
          _kChannelId,
          _kChannelName,
          description: _kChannelDesc,
          importance: Importance.max,
          enableVibration: true,
          enableLights: true,
          playSound: true,
          showBadge: true,
        );

        await _localNotif
            .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
            ?.createNotificationChannel(channel);

        AppLogger.info('NotificationHandler: canal Android "$_kChannelId" creado');
      }

      AppLogger.info('NotificationHandler: flutter_local_notifications listo');

      // Inicializar preferencias de notificaciones (singleton)
      await NotificationPrefs.init();
    } catch (e, st) {
      AppLogger.error('NotificationHandler: error al inicializar local notifications', e, st);
    }
  }

  // ── _showLocalNotification ─────────────────────────────────────────────────

  /// Muestra una notificación del sistema cuando la app está en foreground.
  ///
  /// Codifica el payload de navegación como JSON en el campo `payload`
  /// para que el tap handler pueda navegar al detalle correcto.
  ///
  /// Si el usuario ha deshabilitado las notificaciones de este tipo en
  /// [NotificationPrefs], la notificación se suprime silenciosamente.
  void _showLocalNotification(RemoteMessage message) {
    final notification = message.notification;
    if (notification == null) return;

    final title = notification.title ?? 'Notificación';
    final body = notification.body ?? '';
    final data = message.data;
    final type = data['type'] as String?;

    // ── Caso especial: actualización in-app ───────────────────────────────
    // Para app_update no mostramos notificación del sistema en foreground:
    // mostramos el diálogo directamente en la UI.
    if (type == 'app_update') {
      AppLogger.info('NotificationHandler[fg]: mensaje app_update recibido → mostrando diálogo');
      _handleAppUpdateData(data);
      return;
    }

    // Comprobar preferencias del usuario (solo afecta al foreground)
    try {
      final prefs = NotificationPrefs.instance;
      final suppressed = switch (type) {
        'contact' => !prefs.contactsEnabled,
        'booking' => !prefs.bookingsEnabled,
        'booking_reminder' => !prefs.bookingRemindersEnabled,
        'project' => !prefs.projectsEnabled,
        'service' => !prefs.servicesEnabled,
        'testimonial' => !prefs.testimonialsEnabled,
        'system' => !prefs.systemEnabled,
        _ => false,
      };
      if (suppressed) {
        AppLogger.debug('NotificationHandler: notificación "$type" suprimida por preferencias');
        return;
      }
    } catch (_) {
      // NotificationPrefs no inicializado todavía → mostrar de todos modos
    }

    // Payload de navegación codificado como JSON
    final payloadJson = jsonEncode({'screen': data['screen'], 'id': data['id'], 'type': type});

    final androidDetails = AndroidNotificationDetails(
      _kChannelId,
      _kChannelName,
      channelDescription: _kChannelDesc,
      importance: Importance.max,
      priority: Priority.high,
      showWhen: true,
      enableVibration: true,
      playSound: true,
      icon: '@mipmap/ic_launcher',
      // Texto expandido en la sombra
      styleInformation: BigTextStyleInformation(
        body,
        contentTitle: title,
        htmlFormatContent: false,
        htmlFormatContentTitle: false,
      ),
    );

    const iosDetails = DarwinNotificationDetails(presentAlert: true, presentBadge: true, presentSound: true);

    final details = NotificationDetails(android: androidDetails, iOS: iosDetails);

    _localNotif
        .show(
          id: message.hashCode & 0x7FFFFFFF, // ID entero positivo
          title: title,
          body: body,
          notificationDetails: details,
          payload: payloadJson,
        )
        .catchError((Object e) => AppLogger.error('NotificationHandler: error al mostrar local notification', e));
  }

  // ── Tap handlers ───────────────────────────────────────────────────────────

  /// Tap en notificación local (app en foreground o background).
  void _onLocalNotifTap(NotificationResponse response) {
    AppLogger.info('NotificationHandler[local-tap]: payload=${response.payload}');
    _navigateFromPayload(response.payload);
  }

  /// Navega desde el payload JSON de una notificación local.
  void _navigateFromPayload(String? payloadJson) {
    if (payloadJson == null || payloadJson.isEmpty) {
      _router.goNamed(RouteNames.dashboard);
      return;
    }
    try {
      final data = jsonDecode(payloadJson) as Map<String, dynamic>;
      _navigateFromData(screen: data['screen'] as String?, id: data['id'] as String?);
    } catch (e) {
      AppLogger.warn('NotificationHandler: payload inválido — $payloadJson');
      _router.goNamed(RouteNames.dashboard);
    }
  }

  // ── _navigateFromMessage ───────────────────────────────────────────────────

  void _navigateFromMessage(RemoteMessage message) {
    // Si es un mensaje de actualización (usuario tapó la notificación)
    if (message.data['type'] == 'app_update') {
      _handleAppUpdateData(message.data);
      return;
    }
    _navigateFromData(screen: message.data['screen'] as String?, id: message.data['id'] as String?);
  }

  // ── _handleAppUpdateData ──────────────────────────────────────────────────────

  /// Gestiona un mensaje FCM de tipo `app_update`.
  ///
  /// Si el payload contiene datos de release válidos (versión + URL),
  /// muestra el diálogo directamente via el contexto del Navigator.
  /// Si los datos son incompletos, dispara una nueva comprobación al servidor.
  void _handleAppUpdateData(Map<String, dynamic> data) {
    // Convertir todos los valores a String (FCM los envía como dynamic)
    final stringData = data.map((k, v) => MapEntry(k, v?.toString() ?? ''));

    final version = stringData['version'] ?? '';
    final downloadUrl = stringData['downloadUrl'] ?? '';

    if (version.isEmpty || downloadUrl.isEmpty || !downloadUrl.startsWith('https://')) {
      // Datos insuficientes en el FCM → re-comprobar desde el servidor
      AppLogger.info(
        'NotificationHandler: datos de update incompletos en FCM → '
        'disparando comprobación al servidor',
      );
      triggerUpdateCheckGlobal();
      return;
    }

    // Datos OK en el FCM → construir release y mostrar diálogo directamente
    final release = AppRelease.fromFcmData(stringData);
    final mandatory = stringData['mandatory'] == 'true';

    AppLogger.info('NotificationHandler: mostrando diálogo para v${release.version}');

    // Usamos addPostFrameCallback para asegurarnos de que el Navigator
    // ya está montado antes de llamar a showDialog.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      showUpdateDialogFromData(release, mandatory);
    });
  }

  // ── _navigateFromData ──────────────────────────────────────────────────────

  /// Navega a la pantalla correcta según el screen y, si existe, al detalle
  /// directo usando el [id] de la entidad.
  /// Mapeo:
  /// - `contacts`    → [ContactDetailPage] (con id) o [ContactsListPage]
  /// - `calendar`    → [BookingDetailPage] (con id) o [CalendarPage]
  /// - `projects`    → [ProjectsListPage]
  /// - `services`    → [ServicesListPage]
  /// - `testimonials`→ [TestimonialsListPage]
  /// - default       → [DashboardPage]
  void _navigateFromData({String? screen, String? id}) {
    final hasId = id != null && id.isNotEmpty;

    switch (screen) {
      case 'contacts':
        if (hasId) {
          _router.goNamed(RouteNames.contactDetail, pathParameters: {'id': id});
        } else {
          _router.goNamed(RouteNames.contacts);
        }
      case 'bookings':
      case 'calendar':
        if (hasId) {
          _router.goNamed(RouteNames.bookingDetail, pathParameters: {'id': id});
        } else {
          _router.goNamed(RouteNames.calendar);
        }
      case 'projects':
        _router.goNamed(RouteNames.projects);
      case 'services':
        _router.goNamed(RouteNames.services);
      case 'testimonials':
        _router.goNamed(RouteNames.testimonials);
      case 'dashboard':
      default:
        _router.goNamed(RouteNames.dashboard);
    }
  }
}

// ── Background tap handler (top-level) ────────────────────────────────────────

/// Handler para tap en notificación local cuando la app estaba terminada.
/// DEBE ser una función top-level (no un método de clase).
@pragma('vm:entry-point')
void _onLocalNotifBackgroundTap(NotificationResponse response) {
  // En background/terminado no tenemos acceso al router todavía.
  // El router procesará la navegación al inicializarse via getInitialMessage
  // o a través del payload almacenado. Este handler solo loguea por ahora.
  //
  // Si se necesita navegación desde aquí en el futuro: usar un puerto de
  // comunicación entre isolates o almacenar el payload en SharedPreferences
  // y procesarlo en bootstrap().
  debugPrint('[NotificationHandler][bg-tap] payload=${response.payload}');
}
