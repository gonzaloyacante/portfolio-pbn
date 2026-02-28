// ignore_for_file: use_null_aware_elements
import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';

import 'trash_model.dart';

class TrashRepository {
  final ApiClient _client;

  const TrashRepository(this._client);

  /// Obtiene todos los elementos en papelera, agrupados por tipo.
  Future<Map<String, List<TrashItem>>> getTrash({String? type}) async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.trash,
      queryParams: {if (type != null) 'type': type},
    );

    final data = (resp['data'] as Map<String, dynamic>?) ?? {};
    final result = <String, List<TrashItem>>{};
    data.forEach((key, value) {
      if (value is List) {
        result[key] = value.whereType<Map<String, dynamic>>().map((item) => TrashItem.fromMap(key, item)).toList();
      }
    });
    return result;
  }

  /// Restaura un elemento de la papelera.
  Future<void> restore({required String type, required String id}) async {
    await _client.patch<Map<String, dynamic>>(Endpoints.trashTypedItem(type, id));
  }

  /// Elimina permanentemente un elemento de la papelera.
  Future<void> purge({required String type, required String id}) async {
    await _client.delete<Map<String, dynamic>>(Endpoints.trashTypedItem(type, id));
  }
}
