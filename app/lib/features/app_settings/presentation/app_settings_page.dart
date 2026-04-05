import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:path_provider/path_provider.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../core/debug/debug_log_page.dart';
import '../../../core/debug/debug_panel.dart';
import '../../../core/debug/debug_provider.dart';
import '../../../features/app_settings/providers/app_preferences_provider.dart';
import '../../../core/theme/theme_provider.dart';

import '../../../core/utils/app_logger.dart';

import 'widgets/app_settings_section_card.dart';
import 'widgets/check_for_updates_button.dart';
import 'widgets/info_tile.dart';
import 'widgets/notifications_pref_section.dart';
import 'widgets/theme_tile.dart';
part 'app_settings_page_builders.dart';

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
  Widget build(BuildContext context) => _buildBody(context);

  static String get _environmentLabel {
    const env = String.fromEnvironment('ENVIRONMENT', defaultValue: 'dev');
    return switch (env) {
      'production' => 'Producción',
      'staging' => 'Staging',
      _ => 'Desarrollo',
    };
  }
}
