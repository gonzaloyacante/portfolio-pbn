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

import '../../../core/utils/app_logger.dart';

import 'widgets/app_settings_section_card.dart';
import 'widgets/check_for_updates_button.dart';
import 'widgets/info_tile.dart';
import 'widgets/notifications_pref_section.dart';
import 'widgets/theme_tile.dart';

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
        const SnackBar(
          content: Text('Caché limpiada correctamente'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      AppLogger.error('AppSettings: error clearing cache', e);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No se pudo limpiar la caché'),
          behavior: SnackBarBehavior.floating,
        ),
      );
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
          AppSettingsSectionCard(
            title: 'Apariencia',
            icon: Icons.palette_outlined,
            children: [
              ThemeTile(
                label: 'Claro',
                icon: Icons.light_mode_outlined,
                mode: ThemeMode.light,
                current: themeMode,
                onTap: () => ref
                    .read(themeModeProvider.notifier)
                    .setThemeMode(ThemeMode.light),
              ),
              ThemeTile(
                label: 'Oscuro',
                icon: Icons.dark_mode_outlined,
                mode: ThemeMode.dark,
                current: themeMode,
                onTap: () => ref
                    .read(themeModeProvider.notifier)
                    .setThemeMode(ThemeMode.dark),
              ),
              ThemeTile(
                label: 'Sistema',
                icon: Icons.brightness_auto_outlined,
                mode: ThemeMode.system,
                current: themeMode,
                onTap: () => ref
                    .read(themeModeProvider.notifier)
                    .setThemeMode(ThemeMode.system),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // ── Almacenamiento ───────────────────────────────────────────────
          AppSettingsSectionCard(
            title: 'Almacenamiento',
            icon: Icons.storage_outlined,
            children: [
              ListTile(
                dense: true,
                visualDensity: VisualDensity.compact,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 0,
                  vertical: 0,
                ),
                leading: Icon(
                  Icons.cleaning_services_outlined,
                  color: colorScheme.primary,
                ),
                title: const Text('Limpiar caché'),
                subtitle: const Text(
                  'Elimina archivos temporales e imágenes en caché',
                ),
                trailing: _clearingCache
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Icon(
                        Icons.chevron_right,
                        color: colorScheme.onSurface.withValues(alpha: 0.4),
                      ),
                onTap: _clearingCache ? null : _clearCache,
              ),
            ],
          ),
          const SizedBox(height: 16),

          // ── Notificaciones push ──────────────────────────────────────────
          const NotificationsPrefSection(),
          const SizedBox(height: 16),

          // ── Información de la app ─────────────────────────────────────────
          AppSettingsSectionCard(
            title: 'Información',
            icon: Icons.info_outlined,
            children: [
              Consumer(
                builder: (context, ref, child) {
                  final info = ref.watch(appBuildInfoProvider);
                  return info.when(
                    data: (v) => Column(
                      children: [
                        InfoTile(label: 'Versión', value: v.fullVersion),
                        InfoTile(
                          label: 'Aplicación',
                          value: 'Portfolio PBN Admin',
                        ),
                        InfoTile(label: 'Entorno', value: _environmentLabel),
                      ],
                    ),
                    loading: () => InfoTile(label: 'Versión', value: '...'),
                    error: (error, stackTrace) =>
                        InfoTile(label: 'Versión', value: 'N/A'),
                  );
                },
              ),
              // Buscar actualizaciones (solo Android: las updates se instalan
              // manualmente, no via App Store)
              if (Platform.isAndroid) const CheckForUpdatesButton(),
            ],
          ),

          // ── Sección Desarrollador (solo debug) ───────────────────────────────
          if (kDebugMode) ...[
            const SizedBox(height: 16),
            AppSettingsSectionCard(
              title: 'Desarrollador',
              icon: Icons.developer_mode,
              children: [
                ListTile(
                  dense: true,
                  visualDensity: VisualDensity.compact,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 0,
                    vertical: 0,
                  ),
                  leading: Icon(
                    Icons.bug_report_outlined,
                    color: colorScheme.primary,
                  ),
                  title: const Text('Developer Tools'),
                  subtitle: const Text(
                    'Ver estado, logs y herramientas de debug',
                  ),
                  trailing: Icon(
                    Icons.chevron_right,
                    color: colorScheme.onSurface.withValues(alpha: 0.4),
                  ),
                  onTap: () => DebugPanel.show(context),
                ),
                ListTile(
                  dense: true,
                  visualDensity: VisualDensity.compact,
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 0,
                    vertical: 0,
                  ),
                  leading: Icon(
                    Icons.article_outlined,
                    color: colorScheme.primary,
                  ),
                  title: const Text('Ver logs'),
                  subtitle: const Text('Historial de mensajes de la sesión'),
                  trailing: Icon(
                    Icons.chevron_right,
                    color: colorScheme.onSurface.withValues(alpha: 0.4),
                  ),
                  // Navigator.push used intentionally — debug-only page
                  // not registered in GoRouter (excluded from production).
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const DebugLogPage(),
                    ),
                  ),
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
