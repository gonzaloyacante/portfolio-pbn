import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/notification_prefs_provider.dart';
import 'app_settings_section_card.dart';

class NotificationsPrefSection extends ConsumerWidget {
  const NotificationsPrefSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final prefs = ref.watch<NotificationPrefsState>(notificationPrefsProvider);
    final notifier = ref.read<NotificationPrefsNotifier>(
      notificationPrefsProvider.notifier,
    );
    final colorScheme = Theme.of(context).colorScheme;

    return AppSettingsSectionCard(
      title: 'Notificaciones',
      icon: Icons.notifications_outlined,
      children: [
        // ── Actividad del público ──────────────────────────────────────────
        NotifGroupHeader(
          label: 'Actividad del público',
          colorScheme: colorScheme,
        ),
        NotifToggleTile(
          icon: Icons.mail_outline,
          label: 'Mensajes de contacto',
          subtitle: 'Alerta cuando alguien te escribe',
          value: prefs.contactsEnabled,
          colorScheme: colorScheme,
          onChanged: (v) => notifier.setContacts(enabled: v),
        ),
        NotifToggleTile(
          icon: Icons.calendar_today_outlined,
          label: 'Nuevas reservas',
          subtitle: 'Alerta cuando llega una nueva cita',
          value: prefs.bookingsEnabled,
          colorScheme: colorScheme,
          onChanged: (v) => notifier.setBookings(enabled: v),
        ),

        // ── Recordatorios ─────────────────────────────────────────────────
        NotifGroupHeader(label: 'Recordatorios', colorScheme: colorScheme),
        NotifToggleTile(
          icon: Icons.alarm_outlined,
          label: 'Recordatorio de reservas',
          subtitle: '24h y 1h antes de cada cita confirmada',
          value: prefs.bookingRemindersEnabled,
          colorScheme: colorScheme,
          onChanged: (v) => notifier.setBookingReminders(enabled: v),
        ),

        // ── Contenido del sitio ────────────────────────────────────────────
        NotifGroupHeader(
          label: 'Contenido del sitio',
          colorScheme: colorScheme,
        ),
        NotifToggleTile(
          icon: Icons.design_services_outlined,
          label: 'Servicios',
          subtitle: 'Al añadir o modificar un servicio',
          value: prefs.servicesEnabled,
          colorScheme: colorScheme,
          onChanged: (v) => notifier.setServices(enabled: v),
        ),
        NotifToggleTile(
          icon: Icons.star_outline_rounded,
          label: 'Testimoniales',
          subtitle: 'Al recibir un nuevo testimonio',
          value: prefs.testimonialsEnabled,
          colorScheme: colorScheme,
          onChanged: (v) => notifier.setTestimonials(enabled: v),
        ),

        // ── Sistema ───────────────────────────────────────────────────────
        NotifGroupHeader(label: 'Sistema', colorScheme: colorScheme),
        NotifToggleTile(
          icon: Icons.sensors_outlined,
          label: 'Alertas del sistema',
          subtitle: 'Errores de sincronización y actualizaciones',
          value: prefs.systemEnabled,
          colorScheme: colorScheme,
          onChanged: (v) => notifier.setSystem(enabled: v),
        ),

        // ── Nota al pie ────────────────────────────────────────────────────
        Padding(
          padding: const EdgeInsets.only(top: 8, bottom: 2),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(
                Icons.info_outline,
                size: 13,
                color: colorScheme.onSurface.withValues(alpha: 0.4),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  'Estas preferencias solo afectan a las alertas en '
                  'primer plano. Las notificaciones del sistema siguen '
                  'llegando desde el servidor.',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: colorScheme.onSurface.withValues(alpha: 0.45),
                    fontSize: 11,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class NotifGroupHeader extends StatelessWidget {
  const NotifGroupHeader({
    super.key,
    required this.label,
    required this.colorScheme,
  });

  final String label;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 10, bottom: 2),
      child: Text(
        label.toUpperCase(),
        style: Theme.of(context).textTheme.labelSmall?.copyWith(
          color: colorScheme.onSurface.withValues(alpha: 0.45),
          letterSpacing: 0.8,
          fontSize: 10,
        ),
      ),
    );
  }
}

class NotifToggleTile extends StatelessWidget {
  const NotifToggleTile({
    super.key,
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.value,
    required this.colorScheme,
    required this.onChanged,
  });

  final IconData icon;
  final String label;
  final String subtitle;
  final bool value;
  final ColorScheme colorScheme;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      dense: true,
      visualDensity: VisualDensity.compact,
      contentPadding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
      secondary: Icon(
        icon,
        color: value ? colorScheme.primary : colorScheme.outline,
      ),
      title: Text(
        label,
        style: TextStyle(
          fontWeight: FontWeight.w500,
          color: value ? null : colorScheme.onSurface.withValues(alpha: 0.5),
        ),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          color: colorScheme.onSurface.withValues(alpha: 0.5),
          fontSize: 12,
        ),
      ),
      value: value,
      onChanged: onChanged,
      activeThumbColor: colorScheme.primary,
    );
  }
}
