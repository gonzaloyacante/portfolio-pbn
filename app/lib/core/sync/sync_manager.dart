import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../api/api_client.dart';
import '../network/connectivity_provider.dart';
import '../utils/app_logger.dart';
import 'sync_handlers.dart';
import 'sync_queue.dart';

part 'sync_manager.g.dart';

// ── SyncStatus ────────────────────────────────────────────────────────────────

enum SyncStatus { idle, syncing, error }

// ── SyncManager ───────────────────────────────────────────────────────────────

/// Procesa la cola de operaciones pendientes cuando hay conectividad.
///
/// Se activa automáticamente al recuperar la conexión a internet.
/// Procesa las operaciones en orden FIFO con reintento.
@riverpod
class SyncManager extends _$SyncManager {
  late final SyncHandlerRegistry _registry;

  @override
  SyncStatus build() {
    _registry = SyncHandlerRegistry(ref.read(apiClientProvider));

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
    final op = operation;
    final handler = _registry.handlerFor(op.resource as String);

    if (handler == null) {
      AppLogger.warn(
        'SyncManager: no handler for resource "${op.resource}" — skipping',
      );
      await queue.markCompleted(op.id as String);
      return;
    }

    try {
      await handler.execute(op);
      await queue.markCompleted(op.id as String);
      AppLogger.info(
        'SyncManager: completed ${op.operation} on ${op.resource} [${op.id}]',
      );
    } catch (e) {
      AppLogger.error(
        'SyncManager: failed ${op.operation} on ${op.resource} [${op.id}]',
        e,
      );
      await queue.incrementAttempts(op.id as String);
      rethrow;
    }
  }
}

// ── syncStatusProvider (alias legible) ───────────────────────────────────────

/// Estado actual del proceso de sincronización.
@riverpod
SyncStatus syncStatus(Ref ref) {
  return ref.watch(syncManagerProvider);
}
