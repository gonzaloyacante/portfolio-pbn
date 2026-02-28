import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../shared/widgets/app_scaffold.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:path_provider/path_provider.dart';

import '../../../core/debug/debug_log_page.dart';
import '../../../core/debug/debug_panel.dart';
import '../../../core/debug/debug_provider.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../core/updates/app_release_model.dart';
import '../../../core/updates/app_update_provider.dart';
import '../../../core/utils/app_logger.dart';
import '../../../shared/widgets/app_update_dialog.dart';
import '../providers/notification_prefs_provider.dart';

// ── AppSettingsPage ───────────────────────────────────────────────────────────

/// Página de preferencias de la aplicación.
///
/// Gestiona configuraciones locales del dispositivo: tema, caché y
/// datos de la app. Se diferencia de "Ajustes del Sitio" que edita
/// el contenido del backend.
class AppSettingsPage extends ConsumerStatefulWidget {
  const AppSettingsPage({super.key});

  @override
  ConsumerState<AppSettingsPage> createState() => _AppSettingsPageState();
}

class _AppSettingsPageState extends ConsumerState<AppSettingsPage> {
  bool _clearingCache = false;

  Future<void> _clearCache() async {
    setState(() => _clearingCache = true);
    try {
      final tempDir = await getTemporaryDirectory();
      if (tempDir.existsSync()) {
        for (final entity in tempDir.listSync()) {
          try {
            if (entity is File) {
              await entity.delete();
            } else if (entity is Directory) {
              await entity.delete(recursive: true);
            }
          } catch (_) {
            // Ignorar errores en archivos individuales.
          }
        }
      }
      AppLogger.info('AppSettings: cache cleared');
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Caché limpiada correctamente'), behavior: SnackBarBehavior.floating),
      );
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      AppLogger.error('AppSettings: error clearing cache', e);
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('No se pudo limpiar la caché'), behavior: SnackBarBehavior.floating));
    } finally {
      if (mounted) setState(() => _clearingCache = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeMode = ref.watch(themeModeProvider);
    final colorScheme = Theme.of(context).colorScheme;

    return AppScaffold(
      title: 'Preferencias',
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
        children: [
          // ── Apariencia ───────────────────────────────────────────────────
          _SectionCard(
            title: 'Apariencia',
            icon: Icons.palette_outlined,
            children: [
              _ThemeTile(
                label: 'Claro',
                icon: Icons.light_mode_outlined,
                mode: ThemeMode.light,
                current: themeMode,
                onTap: () => ref.read(themeModeProvider.notifier).setThemeMode(ThemeMode.light),
              ),
              _ThemeTile(
                label: 'Oscuro',
                icon: Icons.dark_mode_outlined,
                mode: ThemeMode.dark,
                current: themeMode,
                onTap: () => ref.read(themeModeProvider.notifier).setThemeMode(ThemeMode.dark),
              ),
              _ThemeTile(
                label: 'Sistema',
                icon: Icons.brightness_auto_outlined,
                mode: ThemeMode.system,
                current: themeMode,
                onTap: () => ref.read(themeModeProvider.notifier).setThemeMode(ThemeMode.system),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // ── Almacenamiento ───────────────────────────────────────────────
          _SectionCard(
            title: 'Almacenamiento',
            icon: Icons.storage_outlined,
            children: [
              ListTile(
                dense: true,
                visualDensity: VisualDensity.compact,
                contentPadding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
                leading: Icon(Icons.cleaning_services_outlined, color: colorScheme.primary),
                title: const Text('Limpiar caché'),
                subtitle: const Text('Elimina archivos temporales e imágenes en caché'),
                trailing: _clearingCache
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                    : Icon(Icons.chevron_right, color: colorScheme.onSurface.withValues(alpha: 0.4)),
                onTap: _clearingCache ? null : _clearCache,
              ),
            ],
          ),
          const SizedBox(height: 16),

          // ── Notificaciones push ──────────────────────────────────────────
          const _NotificationsPrefSection(),
          const SizedBox(height: 16),

          // ── Información de la app ─────────────────────────────────────────
          _SectionCard(
            title: 'Información',
            icon: Icons.info_outlined,
            children: [
              Consumer(
                builder: (context, ref, child) {
                  final info = ref.watch(appBuildInfoProvider);
                  return info.when(
                    data: (v) => Column(
                      children: [
                        _InfoTile(label: 'Versión', value: v.fullVersion),
                        _InfoTile(label: 'Aplicación', value: 'Portfolio PBN Admin'),
                        _InfoTile(label: 'Entorno', value: _environmentLabel),
                      ],
                    ),
                    loading: () => _InfoTile(label: 'Versión', value: '...'),
                    error: (error, stackTrace) => _InfoTile(label: 'Versión', value: 'N/A'),
                  );
                },
              ),
              // Buscar actualizaciones (solo Android: las updates se instalan
              // manualmente, no via App Store)
              if (Platform.isAndroid) const _CheckForUpdatesButton(),
            ],
          ),

          // ── Sección Desarrollador (solo debug) ───────────────────────────────
          if (kDebugMode) ...[
            const SizedBox(height: 16),
            _SectionCard(
              title: 'Desarrollador',
              icon: Icons.developer_mode,
              children: [
                ListTile(
                  dense: true,
                  visualDensity: VisualDensity.compact,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
                  leading: Icon(Icons.bug_report_outlined, color: colorScheme.primary),
                  title: const Text('Developer Tools'),
                  subtitle: const Text('Ver estado, logs y herramientas de debug'),
                  trailing: Icon(Icons.chevron_right, color: colorScheme.onSurface.withValues(alpha: 0.4)),
                  onTap: () => DebugPanel.show(context),
                ),
                ListTile(
                  dense: true,
                  visualDensity: VisualDensity.compact,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
                  leading: Icon(Icons.article_outlined, color: colorScheme.primary),
                  title: const Text('Ver logs'),
                  subtitle: const Text('Historial de mensajes de la sesión'),
                  trailing: Icon(Icons.chevron_right, color: colorScheme.onSurface.withValues(alpha: 0.4)),
                  onTap: () =>
                      Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const DebugLogPage())),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  static String get _environmentLabel {
    const env = String.fromEnvironment('ENVIRONMENT', defaultValue: 'dev');
    return switch (env) {
      'production' => 'Producción',
      'staging' => 'Staging',
      _ => 'Desarrollo',
    };
  }
}

// ── _SectionCard ──────────────────────────────────────────────────────────────

class _SectionCard extends StatelessWidget {
  const _SectionCard({required this.title, required this.icon, required this.children});

  final String title;
  final IconData icon;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 18, color: colorScheme.primary),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: Theme.of(
                    context,
                  ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold, color: colorScheme.primary),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Divider(height: 1),
            ...children,
          ],
        ),
      ),
    );
  }
}

// ── _ThemeTile ────────────────────────────────────────────────────────────────

class _ThemeTile extends StatelessWidget {
  const _ThemeTile({
    required this.label,
    required this.icon,
    required this.mode,
    required this.current,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final ThemeMode mode;
  final ThemeMode current;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isSelected = mode == current;
    final colorScheme = Theme.of(context).colorScheme;

    return ListTile(
      dense: true,
      visualDensity: VisualDensity.compact,
      contentPadding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
      leading: Icon(icon, color: isSelected ? colorScheme.primary : null),
      title: Text(
        label,
        style: TextStyle(
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          color: isSelected ? colorScheme.primary : null,
        ),
      ),
      trailing: isSelected ? Icon(Icons.check_circle, color: colorScheme.primary) : const SizedBox.shrink(),
      onTap: onTap,
    );
  }
}

// ── _InfoTile ─────────────────────────────────────────────────────────────────

class _InfoTile extends StatelessWidget {
  const _InfoTile({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      dense: true,
      visualDensity: VisualDensity.compact,
      contentPadding: const EdgeInsets.all(0),
      title: Text(label),
      trailing: Text(
        value,
        style: Theme.of(
          context,
        ).textTheme.bodyMedium?.copyWith(color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6)),
      ),
    );
  }
}

// ── _NotificationsPrefSection ─────────────────────────────────────────────────

/// Sección de preferencias de notificaciones push.
///
/// Permite al usuario habilitar/deshabilitar las notificaciones de foreground
/// para cada tipo de evento. Las notificaciones de sistema (background/terminado)
/// siguen llegando desde FCM independientemente de estas preferencias.
class _NotificationsPrefSection extends ConsumerWidget {
  const _NotificationsPrefSection();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final prefs = ref.watch(notificationPrefsProvider);
    final notifier = ref.read(notificationPrefsProvider.notifier);
    final colorScheme = Theme.of(context).colorScheme;

    return _SectionCard(
      title: 'Notificaciones',
      icon: Icons.notifications_outlined,
      children: [
        // ── Actividad del público ──────────────────────────────────────────
        _NotifGroupHeader(label: 'Actividad del público', colorScheme: colorScheme),
        _NotifToggleTile(
          icon: Icons.mail_outline,
          label: 'Mensajes de contacto',
          subtitle: 'Alerta cuando alguien te escribe',
          value: prefs.contactsEnabled,
          colorScheme: colorScheme,
          onChanged: (v) => notifier.setContacts(enabled: v),
        ),
        _NotifToggleTile(
          icon: Icons.calendar_today_outlined,
          label: 'Nuevas reservas',
          subtitle: 'Alerta cuando llega una nueva cita',
          value: prefs.bookingsEnabled,
          colorScheme: colorScheme,
          onChanged: (v) => notifier.setBookings(enabled: v),
        ),

        // ── Recordatorios ─────────────────────────────────────────────────
        _NotifGroupHeader(label: 'Recordatorios', colorScheme: colorScheme),
        _NotifToggleTile(
          icon: Icons.alarm_outlined,
          label: 'Recordatorio de reservas',
          subtitle: '24h y 1h antes de cada cita confirmada',
          value: prefs.bookingRemindersEnabled,
          colorScheme: colorScheme,
          onChanged: (v) => notifier.setBookingReminders(enabled: v),
        ),

        // ── Contenido del sitio ────────────────────────────────────────────
        _NotifGroupHeader(label: 'Contenido del sitio', colorScheme: colorScheme),
        _NotifToggleTile(
          icon: Icons.photo_library_outlined,
          label: 'Proyectos',
          subtitle: 'Al publicar o actualizar un proyecto',
          value: prefs.projectsEnabled,
          colorScheme: colorScheme,
          onChanged: (v) => notifier.setProjects(enabled: v),
        ),
        _NotifToggleTile(
          icon: Icons.design_services_outlined,
          label: 'Servicios',
          subtitle: 'Al añadir o modificar un servicio',
          value: prefs.servicesEnabled,
          colorScheme: colorScheme,
          onChanged: (v) => notifier.setServices(enabled: v),
        ),
        _NotifToggleTile(
          icon: Icons.star_outline_rounded,
          label: 'Testimoniales',
          subtitle: 'Al recibir un nuevo testimonio',
          value: prefs.testimonialsEnabled,
          colorScheme: colorScheme,
          onChanged: (v) => notifier.setTestimonials(enabled: v),
        ),

        // ── Sistema ───────────────────────────────────────────────────────
        _NotifGroupHeader(label: 'Sistema', colorScheme: colorScheme),
        _NotifToggleTile(
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
              Icon(Icons.info_outline, size: 13, color: colorScheme.onSurface.withValues(alpha: 0.4)),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  'Estas preferencias solo afectan a las alertas en '
                  'primer plano. Las notificaciones del sistema siguen '
                  'llegando desde el servidor.',
                  style: Theme.of(
                    context,
                  ).textTheme.bodySmall?.copyWith(color: colorScheme.onSurface.withValues(alpha: 0.45), fontSize: 11),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _NotifGroupHeader extends StatelessWidget {
  const _NotifGroupHeader({required this.label, required this.colorScheme});

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

class _NotifToggleTile extends StatelessWidget {
  const _NotifToggleTile({
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
      secondary: Icon(icon, color: value ? colorScheme.primary : colorScheme.outline),
      title: Text(
        label,
        style: TextStyle(
          fontWeight: FontWeight.w500,
          color: value ? null : colorScheme.onSurface.withValues(alpha: 0.5),
        ),
      ),
      subtitle: Text(subtitle, style: TextStyle(color: colorScheme.onSurface.withValues(alpha: 0.5), fontSize: 12)),
      value: value,
      onChanged: onChanged,
      activeThumbColor: colorScheme.primary,
    );
  }
}

// ── _CheckForUpdatesButton ────────────────────────────────────────────────────

/// Botón en la sección "Información" para verificar manualmente si hay una
/// nueva versión disponible.
///
/// En caso de actualización disponible, abre automáticamente el
/// [AppUpdateDialog] con la información de la nueva versión.
class _CheckForUpdatesButton extends ConsumerStatefulWidget {
  const _CheckForUpdatesButton();

  @override
  ConsumerState<_CheckForUpdatesButton> createState() => _CheckForUpdatesButtonState();
}

class _CheckForUpdatesButtonState extends ConsumerState<_CheckForUpdatesButton> {
  bool _checking = false;

  Future<void> _check() async {
    if (_checking) return;
    setState(() => _checking = true);

    try {
      // Incrementar el trigger para forzar una nueva comprobación
      ref.read(appUpdateTriggerProvider.notifier).trigger();

      // Escuchar el primer resultado disponible
      final status = await ref.read(appUpdateStatusProvider.future);

      if (!mounted) return;

      if (status is AppUpdateAvailable) {
        // Mostrar el diálogo in-app directamente
        await AppUpdateDialog.show(context, release: status.release, forceUpdate: status.forceUpdate);
      } else if (status is AppUpToDate) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('✅ La app está actualizada'), duration: Duration(seconds: 3)));
      } else if (status is AppUpdateCheckFailed) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('No se pudo verificar actualizaciones: ${status.reason}'),
            duration: const Duration(seconds: 4),
          ),
        );
      }
    } on Exception catch (e) {
      AppLogger.error('_CheckForUpdatesButton: error — $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error al verificar actualizaciones'), duration: Duration(seconds: 3)),
        );
      }
    } finally {
      if (mounted) setState(() => _checking = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return ListTile(
      dense: true,
      visualDensity: VisualDensity.compact,
      contentPadding: EdgeInsets.zero,
      leading: _checking
          ? SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2.5, color: colorScheme.primary),
            )
          : Icon(Icons.system_update_alt_outlined, color: colorScheme.primary),
      title: const Text('Buscar actualizaciones'),
      subtitle: Text(
        _checking ? 'Verificando...' : 'Comprobar si hay una nueva versión',
        style: TextStyle(fontSize: 12, color: colorScheme.onSurface.withValues(alpha: 0.5)),
      ),
      onTap: _checking ? null : _check,
    );
  }
}
