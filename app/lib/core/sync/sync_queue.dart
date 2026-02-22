import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:uuid/uuid.dart';

import '../database/app_database.dart';
import '../utils/app_logger.dart';

part 'sync_queue.g.dart';

// ── SyncOperation ─────────────────────────────────────────────────────────────

/// Tipos de operación que se pueden encolar para sincronización offline.
enum SyncOperationType { create, update, delete, upload }

// ── SyncQueueRepository ───────────────────────────────────────────────────────

/// Gestiona la cola de operaciones pendientes de sincronizar con el servidor.
///
/// Patrón: cuando la app está offline, las mutaciones se guardan aquí.
/// [SyncManager] lee esta cola y la procesa al recuperar la conexión.
@riverpod
SyncQueueRepository syncQueue(Ref ref) {
  return SyncQueueRepository(db: ref.watch(appDatabaseProvider));
}

class SyncQueueRepository {
  const SyncQueueRepository({required AppDatabase db}) : _db = db;

  final AppDatabase _db;
  static const _uuid = Uuid();

  // ── Enqueue ────────────────────────────────────────────────────────────────

  /// Añade una operación a la cola.
  Future<void> enqueue({
    required SyncOperationType operation,
    required String resource,
    String? resourceId,
    required String payload,
  }) async {
    final id = _uuid.v4();
    AppLogger.info('SyncQueue: enqueue $operation on $resource [$id]');

    await _db.into(_db.syncOperationsTable).insert(
          SyncOperationsTableCompanion.insert(
            id: id,
            operation: operation.name,
            resource: resource,
            resourceId: Value(resourceId),
            payload: payload,
            createdAt: DateTime.now(),
          ),
        );
  }

  // ── Read ───────────────────────────────────────────────────────────────────

  /// Devuelve todas las operaciones pendientes (no fallidas), en orden FIFO.
  Future<List<SyncOperationsTableData>> getPending() {
    return (_db.select(_db.syncOperationsTable)
          ..where((t) => t.failed.equals(false))
          ..orderBy([(t) => OrderingTerm.asc(t.createdAt)]))
        .get();
  }

  /// Stream reactivo de operaciones pendientes.
  Stream<List<SyncOperationsTableData>> watchPending() {
    return (_db.select(_db.syncOperationsTable)
          ..where((t) => t.failed.equals(false))
          ..orderBy([(t) => OrderingTerm.asc(t.createdAt)]))
        .watch();
  }

  /// Número de operaciones pendientes.
  Stream<int> watchPendingCount() {
    return watchPending().map((list) => list.length);
  }

  // ── Update ─────────────────────────────────────────────────────────────────

  /// Marca una operación como completada y la elimina de la cola.
  Future<void> markCompleted(String id) async {
    AppLogger.info('SyncQueue: completed [$id]');
    await (_db.delete(_db.syncOperationsTable)
          ..where((t) => t.id.equals(id)))
        .go();
  }

  /// Incrementa el contador de intentos de una operación.
  Future<void> incrementAttempts(String id) async {
    await (_db.update(_db.syncOperationsTable)
          ..where((t) => t.id.equals(id)))
        .write(
          SyncOperationsTableCompanion(
            lastAttemptAt: Value(DateTime.now()),
          ),
        );

    // Marcar como fallida si supera el máximo de intentos.
    final row = await (_db.select(_db.syncOperationsTable)
          ..where((t) => t.id.equals(id)))
        .getSingleOrNull();
    if (row != null && row.attempts >= 3) {
      await markFailed(id);
    }
  }

  /// Marca una operación como permanentemente fallida.
  Future<void> markFailed(String id) async {
    AppLogger.warn('SyncQueue: marking [$id] as permanently failed');
    await (_db.update(_db.syncOperationsTable)
          ..where((t) => t.id.equals(id)))
        .write(const SyncOperationsTableCompanion(failed: Value(true)));
  }

  // ── Clear ──────────────────────────────────────────────────────────────────

  /// Elimina todas las operaciones (completadas o no). Solo para tests/debug.
  Future<void> clearAll() => _db.delete(_db.syncOperationsTable).go();
}
