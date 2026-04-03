import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../auth/auth_provider.dart';
import '../auth/auth_state.dart';
import '../auth/token_storage.dart';
import '../config/env_config.dart';
import '../utils/app_logger.dart';
import 'debug_log_page.dart';
import 'debug_provider.dart';
import 'server_url_provider.dart';
import '../theme/app_radius.dart';

part 'debug_panel_cards.dart';

// ── DebugPanel ────────────────────────────────────────────────────────────────

/// Panel de herramientas de desarrollador (solo en debug/profile).
///
/// Inspirado en el DevTools overlay de Immich: información contextual del
/// entorno, estado de auth, herramientas de diagnóstico y acciones rápidas.
///
/// Acceso:
/// - Sacudiendo el dispositivo (shake)
/// - Desde "Preferencias" → sección Desarrollador (kDebugMode only)
class DebugPanel extends ConsumerStatefulWidget {
  const DebugPanel({super.key});

  /// Mostrar el panel como bottom sheet.
  static Future<void> show(BuildContext context) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => const DebugPanel(),
    );
  }

  @override
  ConsumerState<DebugPanel> createState() => _DebugPanelState();
}

class _DebugPanelState extends ConsumerState<DebugPanel> {
  bool _clearingCache = false;

  // ── Acciones ──────────────────────────────────────────────────────────────

  Future<void> _clearCache() async {
    setState(() => _clearingCache = true);
    try {
      final dir = await getTemporaryDirectory();
      if (dir.existsSync()) {
        for (final entity in dir.listSync()) {
          try {
            if (entity is File) {
              await entity.delete();
            } else if (entity is Directory) {
              await entity.delete(recursive: true);
            }
          } catch (_) {}
        }
      }
      AppLogger.info('[Debug] Cache limpiada');
      if (mounted) {
        _showSnack('✅ Caché limpiada correctamente');
      }
    } catch (e) {
      AppLogger.error('[Debug] Error al limpiar caché', e);
      if (mounted) _showSnack('❌ Error al limpiar caché');
    } finally {
      if (mounted) setState(() => _clearingCache = false);
    }
  }

  Future<void> _clearTokens() async {
    try {
      await ref.read(tokenStorageProvider).clearAll();
      ref.invalidate(authProvider);
      AppLogger.warn('[Debug] Tokens eliminados — forzando logout');
      if (mounted) _showSnack('⚠️ Tokens eliminados. Se cerrará la sesión.');
    } catch (e) {
      AppLogger.error('[Debug] Error al limpiar tokens', e);
      if (mounted) _showSnack('❌ Error al eliminar tokens');
    }
  }

  void _copyToClipboard(String text, String label) {
    Clipboard.setData(ClipboardData(text: text));
    _showSnack('📋 $label copiado');
  }

  void _showSnack(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  // ── Build ─────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final buildInfoAsync = ref.watch(appBuildInfoProvider);
    final authAsync = ref.watch(authProvider);
    final colorScheme = Theme.of(context).colorScheme;

    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      minChildSize: 0.4,
      maxChildSize: 0.95,
      expand: false,
      builder: (context, scrollController) {
        return Column(
          children: [
            // ── Drag handle ────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.only(top: 12, bottom: 8),
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: colorScheme.outlineVariant,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            // ── Header ─────────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
              child: Row(
                children: [
                  Icon(
                    Icons.developer_mode,
                    color: colorScheme.primary,
                    size: 22,
                  ),
                  const SizedBox(width: 10),
                  Text(
                    'Developer Tools',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  // Badge de entorno
                  _EnvBadge(environment: EnvConfig.environment),
                ],
              ),
            ),
            const Divider(),
            // ── Contenido scrollable ────────────────────────────────────
            Expanded(
              child: ListView(
                controller: scrollController,
                padding: const EdgeInsets.all(16),
                children: [
                  // ── 🌐 Server Switcher (solo debug) ─────────────────
                  const _ServerSwitcherCard(),
                  const SizedBox(height: 12),

                  // ── Build Info ──────────────────────────────────────
                  buildInfoAsync.when(
                    data: (info) =>
                        _BuildInfoCard(info: info, onCopy: _copyToClipboard),
                    loading: () =>
                        const Center(child: CircularProgressIndicator()),
                    error: (e, _) => Text('Error cargando build info: $e'),
                  ),
                  const SizedBox(height: 12),

                  // ── Auth Status ─────────────────────────────────────
                  _AuthInfoCard(
                    authAsync: authAsync,
                    onClearTokens: _clearTokens,
                    onCopy: _copyToClipboard,
                  ),
                  const SizedBox(height: 12),

                  // ── Acciones de Debug ───────────────────────────────
                  _DebugActionsCard(
                    clearingCache: _clearingCache,
                    onClearCache: _clearCache,
                    onOpenLogs: () {
                      // Navigator.push used intentionally — debug-only page
                      // not registered in GoRouter (excluded from production).
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const DebugLogPage(),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 12),

                  // ── Info del sistema ────────────────────────────────
                  _SystemInfoCard(),

                  const SizedBox(height: 24),
                  Text(
                    'Solo visible en builds debug/profile.\n'
                    'No aparece en producción (kReleaseMode = true).',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 11,
                      color: colorScheme.onSurface.withValues(alpha: 0.4),
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}
