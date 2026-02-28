import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/notifications/notification_prefs.dart';

// ── Estado ────────────────────────────────────────────────────────────────────

/// Estado inmutable de las preferencias de notificaciones push.
class NotificationPrefsState {
  const NotificationPrefsState({
    this.contactsEnabled = true,
    this.bookingsEnabled = true,
    this.bookingRemindersEnabled = true,
    this.projectsEnabled = true,
    this.servicesEnabled = true,
    this.testimonialsEnabled = true,
    this.systemEnabled = true,
  });

  /// Alertas de nuevos mensajes de contacto.
  final bool contactsEnabled;

  /// Alertas de nuevas reservas.
  final bool bookingsEnabled;

  /// Recordatorios de reservas próximas (24h / 1h antes).
  final bool bookingRemindersEnabled;

  /// Alertas de proyectos publicados o actualizados.
  final bool projectsEnabled;

  /// Alertas de nuevos servicios publicados.
  final bool servicesEnabled;

  /// Alertas de nuevos testimoniales recibidos.
  final bool testimonialsEnabled;

  /// Alertas de sistema: errores de sync, actualizaciones, etc.
  final bool systemEnabled;

  NotificationPrefsState copyWith({
    bool? contactsEnabled,
    bool? bookingsEnabled,
    bool? bookingRemindersEnabled,
    bool? projectsEnabled,
    bool? servicesEnabled,
    bool? testimonialsEnabled,
    bool? systemEnabled,
  }) {
    return NotificationPrefsState(
      contactsEnabled: contactsEnabled ?? this.contactsEnabled,
      bookingsEnabled: bookingsEnabled ?? this.bookingsEnabled,
      bookingRemindersEnabled: bookingRemindersEnabled ?? this.bookingRemindersEnabled,
      projectsEnabled: projectsEnabled ?? this.projectsEnabled,
      servicesEnabled: servicesEnabled ?? this.servicesEnabled,
      testimonialsEnabled: testimonialsEnabled ?? this.testimonialsEnabled,
      systemEnabled: systemEnabled ?? this.systemEnabled,
    );
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

final notificationPrefsProvider = NotifierProvider<NotificationPrefsNotifier, NotificationPrefsState>(
  NotificationPrefsNotifier.new,
);

// ── Notifier ──────────────────────────────────────────────────────────────────

class NotificationPrefsNotifier extends Notifier<NotificationPrefsState> {
  @override
  NotificationPrefsState build() {
    _loadPrefs();
    return const NotificationPrefsState();
  }

  // ── Load ──────────────────────────────────────────────────────────────────

  Future<void> _loadPrefs() async {
    final prefs = await NotificationPrefs.init();
    if (!ref.mounted) return;
    state = NotificationPrefsState(
      contactsEnabled: prefs.contactsEnabled,
      bookingsEnabled: prefs.bookingsEnabled,
      bookingRemindersEnabled: prefs.bookingRemindersEnabled,
      projectsEnabled: prefs.projectsEnabled,
      servicesEnabled: prefs.servicesEnabled,
      testimonialsEnabled: prefs.testimonialsEnabled,
      systemEnabled: prefs.systemEnabled,
    );
  }

  // ── Setters ───────────────────────────────────────────────────────────────

  Future<void> setContacts({required bool enabled}) async {
    state = state.copyWith(contactsEnabled: enabled);
    await (await NotificationPrefs.init()).set(NotifPrefKeys.notifContacts, enabled: enabled);
  }

  Future<void> setBookings({required bool enabled}) async {
    state = state.copyWith(bookingsEnabled: enabled);
    await (await NotificationPrefs.init()).set(NotifPrefKeys.notifBookings, enabled: enabled);
  }

  Future<void> setBookingReminders({required bool enabled}) async {
    state = state.copyWith(bookingRemindersEnabled: enabled);
    await (await NotificationPrefs.init()).set(NotifPrefKeys.notifBookingReminders, enabled: enabled);
  }

  Future<void> setProjects({required bool enabled}) async {
    state = state.copyWith(projectsEnabled: enabled);
    await (await NotificationPrefs.init()).set(NotifPrefKeys.notifProjects, enabled: enabled);
  }

  Future<void> setServices({required bool enabled}) async {
    state = state.copyWith(servicesEnabled: enabled);
    await (await NotificationPrefs.init()).set(NotifPrefKeys.notifServices, enabled: enabled);
  }

  Future<void> setTestimonials({required bool enabled}) async {
    state = state.copyWith(testimonialsEnabled: enabled);
    await (await NotificationPrefs.init()).set(NotifPrefKeys.notifTestimonials, enabled: enabled);
  }

  Future<void> setSystem({required bool enabled}) async {
    state = state.copyWith(systemEnabled: enabled);
    await (await NotificationPrefs.init()).set(NotifPrefKeys.notifSystem, enabled: enabled);
  }
}
