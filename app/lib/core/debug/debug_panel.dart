import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';

import '../auth/auth_provider.dart';
import '../auth/auth_state.dart';
import '../auth/token_storage.dart';
import '../config/env_config.dart';
import '../database/app_database.dart';
import '../sync/sync_queue.dart';
import '../utils/app_logger.dart';
import 'debug_log_page.dart';
import 'debug_provider.dart';
import 'server_url_provider.dart';
import '../../shared/widgets/app_card.dart';
import '../theme/app_radius.dart';

// ── Provider auxiliar ─────────────────────────────────────────────────────────

/// Conteo reactivo de operaciones sync pendientes (solo para debug panel).
final pendingSyncCountProvider = StreamProvider.autoDispose<int>((ref) {
  return ref.watch(syncQueueProvider).watchPendingCount();
});

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
  bool _clearingDb = false;

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

  Future<void> _clearDatabase() async {
    setState(() => _clearingDb = true);
    try {
      final db = ref.read(appDatabaseProvider);
      await db.close();
      final dbDir = await getApplicationDocumentsDirectory();
      final dbFile = File('${dbDir.path}/portfolio_pbn.db');
      if (dbFile.existsSync()) {
        await dbFile.delete();
        AppLogger.warn('[Debug] Base de datos local eliminada');
        if (mounted) {
          _showSnack('🗑️ DB local eliminada. Reinicia la app.');
        }
      } else {
        if (mounted) _showSnack('DB no encontrada en disco.');
      }
    } catch (e) {
      AppLogger.error('[Debug] Error al eliminar DB', e);
      if (mounted) _showSnack('❌ Error al eliminar la DB');
    } finally {
      if (mounted) setState(() => _clearingDb = false);
    }
  }

  Future<void> _clearSyncQueue() async {
    try {
      final queue = ref.read(syncQueueProvider);
      await queue.clearAll();
      AppLogger.info('[Debug] Cola de sync vaciada');
      if (mounted) _showSnack('✅ Cola de sync vaciada');
    } catch (e) {
      AppLogger.error('[Debug] Error al vaciar sync queue', e);
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
    final pendingSync = ref.watch(pendingSyncCountProvider);
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

                  // ── Sync Status ─────────────────────────────────────
                  _SyncInfoCard(
                    pendingCount: pendingSync,
                    onClearQueue: _clearSyncQueue,
                  ),
                  const SizedBox(height: 12),

                  // ── Acciones de Debug ───────────────────────────────
                  _DebugActionsCard(
                    clearingCache: _clearingCache,
                    clearingDb: _clearingDb,
                    onClearCache: _clearCache,
                    onClearDatabase: _clearDatabase,
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

// ── Tarjeta: Server Switcher ──────────────────────────────────────────────────

/// Permite cambiar la URL del servidor en tiempo real (solo en debug/profile).
/// El cambio persiste en SharedPreferences y es visible hasta que el panel
/// se cierra. Invalida [apiClientProvider] para aplicar el nuevo baseUrl.
class _ServerSwitcherCard extends ConsumerStatefulWidget {
  const _ServerSwitcherCard();

  @override
  ConsumerState<_ServerSwitcherCard> createState() =>
      _ServerSwitcherCardState();
}

class _ServerSwitcherCardState extends ConsumerState<_ServerSwitcherCard> {
  final _customUrlController = TextEditingController();
  bool _showCustomInput = false;

  @override
  void dispose() {
    _customUrlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final serverState = ref.watch<ServerUrlState>(serverUrlProvider);
    final notifier = ref.read<ServerUrlNotifier>(serverUrlProvider.notifier);
    final scheme = Theme.of(context).colorScheme;

    return _DebugCard(
      title: '🌐 Server Switcher',
      icon: Icons.swap_horiz_rounded,
      children: [
        // URL activa
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: Colors.green.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.green.withValues(alpha: 0.3)),
          ),
          child: Row(
            children: [
              const Icon(Icons.circle, color: Colors.green, size: 10),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  serverState.resolvedUrl,
                  style: const TextStyle(
                    fontSize: 12,
                    fontFamily: 'monospace',
                    fontWeight: FontWeight.w600,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),

        // Botones de preset
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: ServerPreset.values.map((preset) {
            final isSelected = serverState.preset == preset;
            return InkWell(
              onTap: () async {
                if (preset == ServerPreset.custom) {
                  setState(() => _showCustomInput = !_showCustomInput);
                  return;
                }
                setState(() => _showCustomInput = false);
                await notifier.setPreset(preset);
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        '${preset.emoji} Servidor: ${preset.resolveUrl()}',
                      ),
                      behavior: SnackBarBehavior.floating,
                      duration: const Duration(seconds: 2),
                    ),
                  );
                }
              },
              borderRadius: BorderRadius.circular(8),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: isSelected
                      ? scheme.primaryContainer
                      : scheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isSelected ? scheme.primary : scheme.outlineVariant,
                    width: isSelected ? 1.5 : 1,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(preset.emoji, style: const TextStyle(fontSize: 13)),
                    const SizedBox(width: 4),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          preset.label,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: isSelected ? scheme.primary : null,
                          ),
                        ),
                        Text(
                          preset.description,
                          style: TextStyle(
                            fontSize: 10,
                            color: scheme.onSurface.withValues(alpha: 0.5),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),

        // Input URL personalizada
        if (_showCustomInput) ...[
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _customUrlController,
                  decoration: const InputDecoration(
                    hintText: 'https://tu-servidor.com',
                    isDense: true,
                    prefixIcon: Icon(Icons.link, size: 16),
                    border: OutlineInputBorder(),
                  ),
                  style: const TextStyle(fontSize: 12),
                  keyboardType: TextInputType.url,
                  onSubmitted: (v) async {
                    if (v.trim().isEmpty) return;
                    await notifier.setCustomUrl(v.trim());
                    setState(() => _showCustomInput = false);
                  },
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                onPressed: () async {
                  final url = _customUrlController.text.trim();
                  if (url.isEmpty) return;
                  await notifier.setCustomUrl(url);
                  setState(() => _showCustomInput = false);
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('✏️ URL: $url'),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                ),
                child: const Text('OK', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
        ],

        const SizedBox(height: 4),
        Text(
          '⚠️ El cambio reconstruye el cliente HTTP (Dio). Válido solo en Debug.',
          style: TextStyle(
            fontSize: 10,
            color: scheme.onSurface.withValues(alpha: 0.5),
          ),
        ),
      ],
    );
  }
}

// ── Tarjeta: Build Info ───────────────────────────────────────────────────────

class _BuildInfoCard extends StatelessWidget {
  const _BuildInfoCard({required this.info, required this.onCopy});

  final AppBuildInfo info;
  final void Function(String value, String label) onCopy;

  @override
  Widget build(BuildContext context) {
    return _DebugCard(
      title: 'Build Info',
      icon: Icons.info_outline,
      children: [
        _InfoRow(
          label: 'Versión',
          value: info.fullVersion,
          onTap: () => onCopy(info.fullVersion, 'Versión'),
        ),
        _InfoRow(
          label: 'Package',
          value: info.packageName,
          onTap: () => onCopy(info.packageName, 'Package'),
        ),
        _InfoRow(
          label: 'Entorno',
          value: info.environment.toUpperCase(),
          valueColor: _envColor(info.environment, context),
        ),
        _InfoRow(
          label: 'API URL',
          value: info.apiBaseUrl,
          onTap: () => onCopy(info.apiBaseUrl, 'API URL'),
        ),
        _InfoRow(
          label: 'Sentry',
          value: info.hasActiveSentry ? '✅ Activo' : '⚪ Inactivo',
        ),
        _InfoRow(
          label: 'Modo Flutter',
          value: kDebugMode
              ? '🐛 Debug'
              : kProfileMode
              ? '📊 Profile'
              : '🚀 Release',
        ),
      ],
    );
  }

  Color _envColor(String env, BuildContext context) => switch (env) {
    'production' => Colors.red,
    'staging' => Colors.orange,
    _ => Colors.green,
  };
}

// ── Tarjeta: Auth Info ────────────────────────────────────────────────────────

class _AuthInfoCard extends StatelessWidget {
  const _AuthInfoCard({
    required this.authAsync,
    required this.onClearTokens,
    required this.onCopy,
  });

  final AsyncValue<AuthState> authAsync;
  final VoidCallback onClearTokens;
  final void Function(String, String) onCopy;

  @override
  Widget build(BuildContext context) {
    return _DebugCard(
      title: 'Auth State',
      icon: Icons.lock_outline,
      children: [
        authAsync.when(
          data: (state) => _AuthStateContent(
            state: state,
            onClearTokens: onClearTokens,
            onCopy: onCopy,
          ),
          loading: () => const Padding(
            padding: EdgeInsets.all(8),
            child: LinearProgressIndicator(),
          ),
          error: (e, _) => Text('Error: $e'),
        ),
      ],
    );
  }
}

class _AuthStateContent extends StatelessWidget {
  const _AuthStateContent({
    required this.state,
    required this.onClearTokens,
    required this.onCopy,
  });

  final AuthState state;
  final VoidCallback onClearTokens;
  final void Function(String, String) onCopy;

  @override
  Widget build(BuildContext context) {
    return switch (state) {
      Authenticated(:final user) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _InfoRow(
            label: 'Estado',
            value: '✅ Autenticado',
            valueColor: Colors.green,
          ),
          _InfoRow(label: 'Usuario', value: user.email),
          _InfoRow(label: 'Rol', value: user.role),
          const Divider(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              icon: const Icon(Icons.logout, size: 16),
              label: const Text('Forzar Logout (limpiar tokens)'),
              onPressed: onClearTokens,
              style: OutlinedButton.styleFrom(foregroundColor: Colors.orange),
            ),
          ),
        ],
      ),
      Unauthenticated() => _InfoRow(
        label: 'Estado',
        value: '🔴 No autenticado',
        valueColor: Colors.red,
      ),
      AuthError(:final message) => _InfoRow(
        label: 'Estado',
        value: '❌ Error: $message',
        valueColor: Colors.red,
      ),
      _ => _InfoRow(label: 'Estado', value: 'Cargando...'),
    };
  }
}

// ── Tarjeta: Sync Info ────────────────────────────────────────────────────────

class _SyncInfoCard extends StatelessWidget {
  const _SyncInfoCard({required this.pendingCount, required this.onClearQueue});

  final AsyncValue<int> pendingCount;
  final VoidCallback onClearQueue;

  @override
  Widget build(BuildContext context) {
    return _DebugCard(
      title: 'Offline Sync',
      icon: Icons.sync,
      children: [
        pendingCount.when(
          data: (count) => Row(
            children: [
              Expanded(
                child: _InfoRow(
                  label: 'Pendientes',
                  value: count.toString(),
                  valueColor: count > 0 ? Colors.orange : Colors.green,
                ),
              ),
              if (count > 0)
                TextButton.icon(
                  icon: const Icon(Icons.clear_all, size: 16),
                  label: const Text('Vaciar'),
                  onPressed: onClearQueue,
                  style: TextButton.styleFrom(foregroundColor: Colors.orange),
                ),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (e, _) => Text('Error: $e'),
        ),
      ],
    );
  }
}

// ── Tarjeta: Debug Actions ────────────────────────────────────────────────────

class _DebugActionsCard extends StatelessWidget {
  const _DebugActionsCard({
    required this.clearingCache,
    required this.clearingDb,
    required this.onClearCache,
    required this.onClearDatabase,
    required this.onOpenLogs,
  });

  final bool clearingCache;
  final bool clearingDb;
  final VoidCallback onClearCache;
  final VoidCallback onClearDatabase;
  final VoidCallback onOpenLogs;

  @override
  Widget build(BuildContext context) {
    return _DebugCard(
      title: 'Acciones',
      icon: Icons.build_outlined,
      children: [
        _ActionButton(
          icon: Icons.cached,
          label: 'Limpiar caché',
          loading: clearingCache,
          onTap: onClearCache,
        ),
        _ActionButton(
          icon: Icons.storage_outlined,
          label: 'Borrar DB local',
          loading: clearingDb,
          onTap: onClearDatabase,
          color: Colors.red,
        ),
        _ActionButton(
          icon: Icons.article_outlined,
          label: 'Ver logs',
          onTap: onOpenLogs,
        ),
        _ActionButton(
          icon: Icons.notifications_outlined,
          label: 'Test snackbar',
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('🧪 Snackbar de prueba — todo funciona ✅'),
                behavior: SnackBarBehavior.floating,
              ),
            );
          },
        ),
      ],
    );
  }
}

// ── Tarjeta: System Info ──────────────────────────────────────────────────────

class _SystemInfoCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return _DebugCard(
      title: 'Sistema',
      icon: Icons.phone_android_outlined,
      children: [
        _InfoRow(
          label: 'Plataforma',
          value: Platform.isAndroid
              ? '🤖 Android'
              : Platform.isIOS
              ? '🍎 iOS'
              : Platform.operatingSystem,
        ),
        _InfoRow(label: 'OS Version', value: Platform.operatingSystemVersion),
        _InfoRow(label: 'Dart VM', value: Platform.version.split(' ').first),
        _InfoRow(label: 'Localización', value: Platform.localeName),
      ],
    );
  }
}

// ── Componentes reutilizables ─────────────────────────────────────────────────

class _DebugCard extends StatelessWidget {
  const _DebugCard({
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

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppRadius.card),
        border: Border.all(color: colorScheme.outlineVariant),
      ),
      child: AppCard(
        title: title,
        leading: Icon(icon, size: 16, color: colorScheme.primary),
        elevation: 0,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [const SizedBox(height: 4), ...children],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.label,
    required this.value,
    this.valueColor,
    this.onTap,
  });

  final String label;
  final String value;
  final Color? valueColor;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final valueWidget = Text(
      value,
      style: TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: valueColor,
        fontFamily: 'monospace',
      ),
      overflow: TextOverflow.ellipsis,
    );

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 90,
            child: Text(
              label,
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ),
          Expanded(
            child: onTap != null
                ? InkWell(
                    onTap: onTap,
                    borderRadius: BorderRadius.circular(4),
                    child: valueWidget,
                  )
                : valueWidget,
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
    this.loading = false,
    this.color,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool loading;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: SizedBox(
        width: double.infinity,
        child: OutlinedButton.icon(
          icon: loading
              ? const SizedBox.square(
                  dimension: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : Icon(icon, size: 16),
          label: Text(label),
          onPressed: loading ? null : onTap,
          style: OutlinedButton.styleFrom(
            foregroundColor: color,
            alignment: Alignment.centerLeft,
          ),
        ),
      ),
    );
  }
}

class _EnvBadge extends StatelessWidget {
  const _EnvBadge({required this.environment});

  final String environment;

  @override
  Widget build(BuildContext context) {
    final (label, color) = switch (environment) {
      'production' => ('PROD', Colors.red),
      'staging' => ('STAGING', Colors.orange),
      _ => ('DEV', Colors.green),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: color,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
