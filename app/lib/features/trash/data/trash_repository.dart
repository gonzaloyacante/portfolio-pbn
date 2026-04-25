// ignore_for_file: use_null_aware_elements
import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../shared/models/api_response.dart';
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

    final apiResponse = ApiResponse<Map<String, List<TrashItem>>>.fromJson(
      resp,
      (json) {
        final data = (json as Map<String, dynamic>?) ?? {};
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
      },
    );

    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Error al obtener papelera');
    }

    return apiResponse.data!;
  }

  Future<void> restore({required String type, required String id}) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.trashTypedItem(type, id),
    );
    final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});
    if (!apiResponse.success) {
      throw Exception(apiResponse.error ?? 'Error al restaurar elemento');
    }
  }

  Future<void> purge({required String type, required String id}) async {
    final resp = await _client.delete<Map<String, dynamic>>(
      Endpoints.trashTypedItem(type, id),
    );
    final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});
    if (!apiResponse.success) {
      throw Exception(
        apiResponse.error ?? 'Error al eliminar elemento permanentemente',
      );
    }
  }
}

@Riverpod(keepAlive: true)
TrashRepository trashRepository(Ref ref) {
  return TrashRepository(client: ref.watch(apiClientProvider));
}
