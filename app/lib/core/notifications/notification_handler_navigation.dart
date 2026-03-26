part of 'notification_handler.dart';

extension _NotificationHandlerNavigation on NotificationHandler {
  void _onLocalNotifTap(NotificationResponse response) {
    AppLogger.info(
      'NotificationHandler[local-tap]: payload=${response.payload}',
    );
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
      _navigateFromData(
        screen: data['screen'] as String?,
        id: data['id'] as String?,
      );
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
    _navigateFromData(
      screen: message.data['screen'] as String?,
      id: message.data['id'] as String?,
    );
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

    if (version.isEmpty ||
        downloadUrl.isEmpty ||
        !downloadUrl.startsWith('https://')) {
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

    AppLogger.info(
      'NotificationHandler: mostrando diálogo para v${release.version}',
    );

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
