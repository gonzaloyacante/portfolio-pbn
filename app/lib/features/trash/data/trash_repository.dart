// ignore_for_file: use_null_aware_elements
import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';
import 'package:portfolio_pbn/core/sync/offline_first_mixin.dart';
import 'package:portfolio_pbn/core/sync/sync_queue.dart';
import 'package:portfolio_pbn/shared/models/offline_result.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'trash_model.dart';

part 'trash_repository.g.dart';

/// Repositorio de la papelera.
///
/// Las operaciones de restauración y eliminación permanente se encolan si
/// no hay conexión — las encolamos con `operation=update` (restore) y
/// `operation=delete` (purge), incluyendo `{"type": "..."}` en el payload
/// para que el [TrashSyncHandler] construya el endpoint correcto.
class TrashRepository with OfflineFirstMixin {
  TrashRepository({required this.ref, required ApiClient client})
    : _client = client;

  @override
  final Ref ref;

  final ApiClient _client;

  /// Obtiene todos los elementos en papelera, agrupados por tipo.
  Future<Map<String, List<TrashItem>>> getTrash({String? type}) async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.trash,
      queryParams: {if (type != null) 'type': type},
    );

    final success = resp['success'] as bool? ?? false;
    if (!success) {
      throw Exception(resp['error']?.toString() ?? 'Error al obtener papelera');
    }
    final data = (resp['data'] as Map<String, dynamic>?) ?? {};
    final result = <String, List<TrashItem>>{};
    data.forEach((key, value) {
      if (value is List) {
        result[key] = value
            .whereType<Map<String, dynamic>>()
            .map((item) => TrashItem.fromMap(key, item))
            .toList();
      }
    });
    return result;
  }

  /// Restaura un elemento de la papelera.
  ///
  /// El [type] se incluye en el payload para que el [TrashSyncHandler] pueda
  /// reconstruir el endpoint `/api/admin/trash/{type}/{id}` al sincronizar.
  Future<MutationResult<void>> restore({
    required String type,
    required String id,
  }) => mutateOnlineOrEnqueue(
    operation: SyncOperationType.update,
    resource: 'trash',
    resourceId: id,
    payload: {'type': type},
    onOnline: () async {
      final resp = await _client.patch<Map<String, dynamic>>(
        Endpoints.trashTypedItem(type, id),
      );
      final success = resp['success'] as bool? ?? false;
      if (!success) {
        throw Exception(
          resp['error']?.toString() ?? 'Error al restaurar elemento',
        );
      }
    },
  );

  /// Elimina permanentemente un elemento de la papelera.
  ///
  /// El [type] se incluye en el payload para que el [TrashSyncHandler] pueda
  /// reconstruir el endpoint `/api/admin/trash/{type}/{id}` al sincronizar.
  Future<MutationResult<void>> purge({
    required String type,
    required String id,
  }) => mutateOnlineOrEnqueue(
    operation: SyncOperationType.delete,
    resource: 'trash',
    resourceId: id,
    payload: {'type': type},
    onOnline: () async {
      final resp = await _client.delete<Map<String, dynamic>>(
        Endpoints.trashTypedItem(type, id),
      );
      final success = resp['success'] as bool? ?? false;
      if (!success) {
        throw Exception(
          resp['error']?.toString() ??
              'Error al eliminar elemento permanentemente',
        );
      }
    },
  );
}

@Riverpod(keepAlive: true)
TrashRepository trashRepository(Ref ref) {
  return TrashRepository(ref: ref, client: ref.watch(apiClientProvider));
}
