import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/sync/sync_manager.dart';

// ── SyncIndicator ─────────────────────────────────────────────────────────────

/// Indicador del estado de sincronización offline.
///
/// Muestra un badge con el número de operaciones pendientes y el estado actual.
/// Se coloca habitualmente en el AppBar o en el drawer header.
///
/// Uso:
/// ```dart
/// AppBar(
///   actions: [SyncIndicator()],
/// )
/// ```
class SyncIndicator extends ConsumerWidget {
  const SyncIndicator({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final syncStatus = ref.watch(syncManagerProvider);

    // Estado de sincronización
    return _SyncIndicatorContent(syncStatus: syncStatus);
  }
}

class _SyncIndicatorContent extends StatelessWidget {
  const _SyncIndicatorContent({required this.syncStatus});

  final SyncStatus syncStatus;

  @override
  Widget build(BuildContext context) {
    return switch (syncStatus) {
      SyncStatus.syncing => const Padding(
        padding: EdgeInsets.all(8),
        child: SizedBox(
          width: 20,
          height: 20,
          child: CircularProgressIndicator(strokeWidth: 2),
        ),
      ),
      SyncStatus.error => Tooltip(
        message: 'Error de sincronización',
        child: Icon(
          Icons.sync_problem_rounded,
          color: Theme.of(context).colorScheme.error,
        ),
      ),
      SyncStatus.idle => const SizedBox.shrink(),
    };
  }
}

// ── OfflineBanner ─────────────────────────────────────────────────────────────

/// Banner que se muestra en la parte superior cuando no hay conexión.
class OfflineBanner extends StatelessWidget {
  const OfflineBanner({super.key, required this.isVisible});

  final bool isVisible;

  @override
  Widget build(BuildContext context) {
    if (!isVisible) return const SizedBox.shrink();

    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      height: isVisible ? 36 : 0,
      color: const Color(0xFFF59E0B),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.wifi_off_rounded, size: 16, color: Colors.white),
          const SizedBox(width: 8),
          Text(
            'Sin conexión — los cambios se sincronizarán al reconectar',
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
