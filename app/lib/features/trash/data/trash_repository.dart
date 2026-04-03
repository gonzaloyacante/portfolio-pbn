// ignore_for_file: use_null_aware_elements
import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'trash_model.dart';

part 'trash_repository.g.dart';

class TrashRepository {
  TrashRepository({required ApiClient client}) : _client = client;

  final ApiClient _client;

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

  Future<void> restore({required String type, required String id}) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.trashTypedItem(type, id),
    );
    final success = resp['success'] as bool? ?? false;
    if (!success) {
      throw Exception(
        resp['error']?.toString() ?? 'Error al restaurar elemento',
      );
    }
  }

  Future<void> purge({required String type, required String id}) async {
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
  }
}

@Riverpod(keepAlive: true)
TrashRepository trashRepository(Ref ref) {
  return TrashRepository(client: ref.watch(apiClientProvider));
}
