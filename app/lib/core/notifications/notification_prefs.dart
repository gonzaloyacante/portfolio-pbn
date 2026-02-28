import 'package:shared_preferences/shared_preferences.dart';

/// Claves para las preferencias de notificaciones en SharedPreferences.
///
/// Cada clave controla si se muestra una notificación local (foreground) para
/// ese tipo de evento. Las notificaciones de sistema (background/terminado)
/// siempre llegan desde FCM independientemente de estas preferencias.
abstract final class NotifPrefKeys {
  // ── Actividad del público ─────────────────────────────────────────────────
  static const String notifContacts = 'notif_contacts';
  static const String notifBookings = 'notif_bookings';

  // ── Recordatorios ─────────────────────────────────────────────────────────
  /// Recordatorio enviado N horas antes de una reserva confirmada.
  static const String notifBookingReminders = 'notif_booking_reminders';

  // ── Contenido del sitio ───────────────────────────────────────────────────
  static const String notifProjects = 'notif_projects';
  static const String notifServices = 'notif_services';
  static const String notifTestimonials = 'notif_testimonials';

  // ── Sistema ───────────────────────────────────────────────────────────────
  /// Alertas de sistema: errores de sincronización, actualizaciones, etc.
  static const String notifSystem = 'notif_system';
}

/// Servicio de acceso a las preferencias de notificaciones.
///
/// Usa SharedPreferences para persistir las opciones del usuario.
/// Se usa como singleton via [NotificationPrefs.instance] después
/// de llamar a [NotificationPrefs.init()].
///
/// Ejemplo:
/// ```dart
/// // Inicializar (una vez en bootstrap o en el provider)
/// await NotificationPrefs.init();
///
/// // Leer
/// if (NotificationPrefs.instance.isEnabled(NotifPrefKeys.notifContacts)) { ... }
///
/// // Escribir
/// await NotificationPrefs.instance.set(NotifPrefKeys.notifContacts, false);
/// ```
class NotificationPrefs {
  NotificationPrefs._(this._prefs);

  static NotificationPrefs? _instance;

  /// Instancia singleton. Lanza [StateError] si no se ha llamado a [init].
  static NotificationPrefs get instance {
    assert(_instance != null, 'NotificationPrefs.init() debe llamarse antes de acceder a instance.');
    return _instance!;
  }

  final SharedPreferences _prefs;

  // ── Init ──────────────────────────────────────────────────────────────────

  /// Inicializa el singleton leyendo SharedPreferences.
  /// Llamar una sola vez (en bootstrap o en el primer acceso desde el provider).
  static Future<NotificationPrefs> init() async {
    if (_instance != null) return _instance!;
    final prefs = await SharedPreferences.getInstance();
    _instance = NotificationPrefs._(prefs);
    return _instance!;
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  /// Retorna `true` si la notificación del tipo [key] está habilitada.
  /// Por defecto todas están habilitadas.
  bool isEnabled(String key) => _prefs.getBool(key) ?? true;

  // ── Write ─────────────────────────────────────────────────────────────────

  /// Habilita o deshabilita las notificaciones del tipo [key].
  Future<void> set(String key, {required bool enabled}) async {
    await _prefs.setBool(key, enabled);
  }

  // ── Getters de conveniencia ───────────────────────────────────────────────

  bool get contactsEnabled => isEnabled(NotifPrefKeys.notifContacts);
  bool get bookingsEnabled => isEnabled(NotifPrefKeys.notifBookings);
  bool get bookingRemindersEnabled => isEnabled(NotifPrefKeys.notifBookingReminders);
  bool get projectsEnabled => isEnabled(NotifPrefKeys.notifProjects);
  bool get servicesEnabled => isEnabled(NotifPrefKeys.notifServices);
  bool get testimonialsEnabled => isEnabled(NotifPrefKeys.notifTestimonials);
  bool get systemEnabled => isEnabled(NotifPrefKeys.notifSystem);
}
