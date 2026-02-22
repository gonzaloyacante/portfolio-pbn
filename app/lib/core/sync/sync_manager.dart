import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../network/connectivity_provider.dart';
import '../utils/app_logger.dart';
import 'sync_queue.dart';

part 'sync_manager.g.dart';

// ── SyncStatus ────────────────────────────────────────────────────────────────

enum SyncStatus { idle, syncing, error }

// ── SyncManager ───────────────────────────────────────────────────────────────

/// Procesa la cola de operaciones pendientes cuando hay conectividad.
///
/// Se activa automáticamente al recuperar la conexión a internet.
/// Procesa las operaciones en orden FIFO con reintento.
///
/// TODO (Fase de features): registrar los handlers por tipo de recurso
///   (ProjectSyncHandler, ServiceSyncHandler, etc.) usando un Map.
@riverpod
class SyncManager extends _$SyncManager {
  @override
  SyncStatus build() {
    // Escuchar cambios de conectividad para disparar sync automático.
    ref.listen<bool>(isOnlineProvider, (previous, isOnline) {
      if (isOnline && previous == false) {
        AppLogger.info('SyncManager: connectivity restored → starting sync');
        _processQueue();
      }
    });

    return SyncStatus.idle;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /// Fuerza el procesamiento inmediato de la cola.
  /// Útil al volver a la app desde segundo plano.
  Future<void> syncNow() => _processQueue();

  // ── Private ────────────────────────────────────────────────────────────────

  Future<void> _processQueue() async {
    if (state == SyncStatus.syncing) {
      AppLogger.debug('SyncManager: already syncing, skipping');
      return;
    }

    final isOnline = ref.read(isOnlineProvider);
    if (!isOnline) {
      AppLogger.debug('SyncManager: offline, skipping sync');
      return;
    }

    final queue = ref.read(syncQueueProvider);
    final pending = await queue.getPending();

    if (pending.isEmpty) {
      AppLogger.debug('SyncManager: queue empty, nothing to sync');
      return;
    }

    AppLogger.info('SyncManager: processing ${pending.length} operations');
    state = SyncStatus.syncing;

    try {
      for (final operation in pending) {
        await _processOperation(operation, queue);
      }
      AppLogger.info('SyncManager: queue processed successfully');
      state = SyncStatus.idle;
    } catch (e) {
      AppLogger.error('SyncManager: sync failed', e);
      state = SyncStatus.error;
    }
  }

  Future<void> _processOperation(
    dynamic operation,
    SyncQueueRepository queue,
  ) async {
    // TODO (Fase de features): implementar dispatch por operation.resource
    // usando un registro de handlers.
    //
    // Ejemplo:
    // final handler = _handlers[operation.resource];
    // if (handler != null) {
    //   await handler.execute(operation);
    //   await queue.markCompleted(operation.id);
    // }
    AppLogger.debug(
      'SyncManager: processing ${operation.operation} on '
      '${operation.resource} [${operation.id}]',
    );
    await queue.markCompleted(operation.id as String);
  }
}

// ── syncStatusProvider (alias legible) ───────────────────────────────────────

/// Estado actual del proceso de sincronización.
@riverpod
SyncStatus syncStatus(Ref ref) {
  return ref.watch(syncManagerProvider);
}
