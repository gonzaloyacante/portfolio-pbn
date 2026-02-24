import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:path_provider/path_provider.dart';

import '../../../core/debug/debug_log_page.dart';
import '../../../core/debug/debug_panel.dart';
import '../../../core/debug/debug_provider.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../core/utils/app_logger.dart';

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

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
          tooltip: 'Volver',
        ),
        title: const Text('Preferencias'),
      ),
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
                onTap: () => ref
                    .read(themeModeProvider.notifier)
                    .setThemeMode(ThemeMode.light),
              ),
              _ThemeTile(
                label: 'Oscuro',
                icon: Icons.dark_mode_outlined,
                mode: ThemeMode.dark,
                current: themeMode,
                onTap: () => ref
                    .read(themeModeProvider.notifier)
                    .setThemeMode(ThemeMode.dark),
              ),
              _ThemeTile(
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
          _SectionCard(
            title: 'Almacenamiento',
            icon: Icons.storage_outlined,
            children: [
              ListTile(
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
                        _InfoTile(
                          label: 'Aplicación',
                          value: 'Portfolio PBN Admin',
                        ),
                        _InfoTile(label: 'Entorno', value: _environmentLabel),
                      ],
                    ),
                    loading: () => _InfoTile(label: 'Versión', value: '...'),
                    error: (error, stackTrace) =>
                        _InfoTile(label: 'Versión', value: 'N/A'),
                  );
                },
              ),
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

// ── _SectionCard ──────────────────────────────────────────────────────────────

class _SectionCard extends StatelessWidget {
  const _SectionCard({
    required this.title,
    required this.icon,
    required this.children,
  });

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
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: colorScheme.primary,
                  ),
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
      leading: Icon(icon, color: isSelected ? colorScheme.primary : null),
      title: Text(
        label,
        style: TextStyle(
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          color: isSelected ? colorScheme.primary : null,
        ),
      ),
      trailing: isSelected
          ? Icon(Icons.check_circle, color: colorScheme.primary)
          : const SizedBox.shrink(),
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
      title: Text(label),
      trailing: Text(
        value,
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
          color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.6),
        ),
      ),
    );
  }
}
