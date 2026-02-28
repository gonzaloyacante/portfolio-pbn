import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/sync/sync_manager.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

// ── SyncIndicator ─────────────────────────────────────────────────────────────

/// Indicador del estado de sincronización offline.
///
/// Muestra un spinner durante la sync, ícono de error si falla, o nada si idle.
/// Se coloca habitualmente en el AppBar o en el drawer header.
class SyncIndicator extends ConsumerWidget {
  const SyncIndicator({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final syncStatus = ref.watch(syncManagerProvider);
    return _SyncIndicatorContent(syncStatus: syncStatus);
  }
}

class _SyncIndicatorContent extends StatelessWidget {
  const _SyncIndicatorContent({required this.syncStatus});

  final SyncStatus syncStatus;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return switch (syncStatus) {
      SyncStatus.syncing => Padding(
        padding: const EdgeInsets.all(AppSpacing.sm),
        child: SizedBox(
          width: 20,
          height: 20,
          child: CircularProgressIndicator(strokeWidth: 2, color: colorScheme.primary),
        ),
      ),
      SyncStatus.error => Tooltip(
        message: 'Error de sincronización. Toca para reintentar.',
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.sm),
          child: Icon(Icons.sync_problem_rounded, color: colorScheme.error, size: 22),
        ),
      ),
      SyncStatus.idle => const SizedBox.shrink(),
    };
  }
}

// ── OfflineBanner ─────────────────────────────────────────────────────────────

/// Banner animado que se muestra cuando no hay conexión a internet.
class OfflineBanner extends StatelessWidget {
  const OfflineBanner({super.key, required this.isVisible});

  final bool isVisible;

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 350),
      curve: Curves.easeInOut,
      height: isVisible ? 40 : 0,
      color: AppColors.warning,
      child: isVisible
          ? Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.wifi_off_rounded, size: 16, color: Colors.white),
                const SizedBox(width: AppSpacing.sm),
                Flexible(
                  child: Text(
                    'Sin conexión — los cambios se sincronizarán al reconectar',
                    style: Theme.of(
                      context,
                    ).textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.w600),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
              ],
            )
          : const SizedBox.shrink(),
    );
  }
}
