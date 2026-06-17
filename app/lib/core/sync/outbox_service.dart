import 'dart:convert';

import 'package:drift/drift.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:uuid/uuid.dart';

import '../api/api_client.dart';
import '../database/app_database.dart';
import '../utils/app_logger.dart';

part 'outbox_service.g.dart';

const _uuid = Uuid();

/// Queues mutations for later replay and flushes them against the live API.
class OutboxService {
  OutboxService({required AppDatabase db, required ApiClient client})
    : _db = db,
      _client = client;

  final AppDatabase _db;
  final ApiClient _client;

  // ── Enqueue ───────────────────────────────────────────────────────────────

  Future<void> enqueue({
    required String method,
    required String endpoint,
    Map<String, dynamic>? body,
  }) async {
    await _db.outboxDao.enqueue(
      OutboxQueueCompanion.insert(
        operationId: _uuid.v4(),
        method: method,
        endpoint: endpoint,
        bodyJson: Value(body != null ? jsonEncode(body) : '{}'),
        createdAt: DateTime.now(),
      ),
    );
    AppLogger.info('[Outbox] queued $method $endpoint');
  }

  // ── Flush ─────────────────────────────────────────────────────────────────

  /// Replays all pending outbox entries in order. Skips permanently failed rows.
  Future<void> flush() async {
    final pending = await _db.outboxDao.getPending();
    if (pending.isEmpty) return;

    AppLogger.info('[Outbox] flushing ${pending.length} operations');

    for (final op in pending) {
      await _replay(op);
    }
  }

  Future<void> _replay(OutboxQueueData op) async {
    final body = op.bodyJson.isNotEmpty && op.bodyJson != '{}'
        ? (jsonDecode(op.bodyJson) as Map<String, dynamic>)
        : null;

    try {
      switch (op.method.toUpperCase()) {
        case 'POST':
          await _client.post<dynamic>(op.endpoint, data: body);
        case 'PATCH':
          await _client.patch<dynamic>(op.endpoint, data: body);
        case 'PUT':
          await _client.put<dynamic>(op.endpoint, data: body);
        case 'DELETE':
          await _client.delete<dynamic>(op.endpoint);
        default:
          AppLogger.warn('[Outbox] unknown method ${op.method}, skipping');
          await _db.outboxDao.removeById(op.id);
          return;
      }
      await _db.outboxDao.removeById(op.id);
      AppLogger.info('[Outbox] replayed ${op.method} ${op.endpoint}');
    } catch (e) {
      final error = e.toString();
      AppLogger.warn('[Outbox] replay failed for ${op.endpoint}: $error');
      await _db.outboxDao.incrementRetryOrFail(op.id, error);
    }
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

@Riverpod(keepAlive: true)
OutboxService outboxService(Ref ref) {
  return OutboxService(
    db: ref.watch(appDatabaseProvider),
    client: ref.watch(apiClientProvider),
  );
}
