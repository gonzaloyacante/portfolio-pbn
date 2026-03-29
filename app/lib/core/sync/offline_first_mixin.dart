import 'dart:convert';

import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../network/connectivity_provider.dart';
import '../utils/app_logger.dart';
import '../../shared/models/offline_result.dart';
import 'sync_queue.dart';

/// Mixin que implementa el patrón Network-First con fallback a cola offline.
///
/// ### Uso
/// ```dart
/// class MyRepository with OfflineFirstMixin {
///   MyRepository({required this.ref, required this.client});
///
///   @override
///   final Ref ref;
///
///   Future<MutationResult<MyModel>> createFoo(MyFormData data) =>
///       mutateOnlineOrEnqueue(
///         operation: SyncOperationType.create,
///         resource: 'foos',
///         payload: data.toJson(),
///         onOnline: () => _apiCreate(data),
///       );
/// }
/// ```
///
/// ### Contrato
/// - Si hay conexión: ejecuta [onOnline] y devuelve [LiveResult].
/// - Si NO hay conexión: encola el payload en SQLite y devuelve
///   [OfflineEnqueuedResult]. Nunca lanza excepción por falta de red.
/// - Si [onOnline] lanza cualquier otra excepción (error HTTP, validación,
///   etc.), re-lanza para que el caller la trate normalmente.
mixin OfflineFirstMixin {
  /// La referencia de Riverpod necesaria para leer providers.
  Ref get ref;

  /// Decide si ejecutar la mutación en línea o encolarla offline.
  ///
  /// Para operaciones `create`, [resourceId] debe ser null (el server asigna ID).
  /// Para operaciones `update` / `delete`, [resourceId] es el ID del recurso.
  Future<MutationResult<T>> mutateOnlineOrEnqueue<T>({
    required SyncOperationType operation,
    required String resource,
    String? resourceId,
    required Map<String, dynamic> payload,
    required Future<T> Function() onOnline,
  }) async {
    final isOnline = ref.read(isOnlineProvider);

    if (isOnline) {
      // ── Online path: ejecutar en tiempo real ───────────────────────────────
      final result = await onOnline();
      return LiveResult(result);
    }

    // ── Offline path: encolar en SQLite ────────────────────────────────────
    AppLogger.info(
      'OfflineFirstMixin: offline → enqueuing $operation on $resource'
      '${resourceId != null ? ' [$resourceId]' : ''}',
    );

    final queue = ref.read(syncQueueProvider);
    await queue.enqueue(
      operation: operation,
      resource: resource,
      resourceId: resourceId,
      payload: jsonEncode(payload),
    );

    return OfflineEnqueuedResult<T>();
  }
}
