// ignore_for_file: use_null_aware_elements
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/endpoints.dart';
import '../../../shared/models/api_response.dart';
import '../../../shared/models/paginated_response.dart';
import 'service_model.dart';

part 'services_repository.g.dart';

class ServicesRepository {
  const ServicesRepository(this._client);

  final ApiClient _client;

  Future<PaginatedResponse<ServiceItem>> getServices({
    int page = 1,
    int limit = 50,
    String? search,
    bool? isActive,
    bool? isFeatured,
  }) async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.services,
      queryParams: {
        'page': page,
        'limit': limit,
        if (search != null && search.isNotEmpty) 'search': search,
        if (isActive != null) 'active': isActive.toString(),
        if (isFeatured != null) 'featured': isFeatured.toString(),
      },
    );

    final apiResponse = ApiResponse<PaginatedResponse<ServiceItem>>.fromJson(
      resp,
      (json) => PaginatedResponse<ServiceItem>.fromJson(
        json as Map<String, dynamic>,
        (item) => ServiceItem.fromJson(item as Map<String, dynamic>),
      ),
    );

    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Error al obtener servicios');
    }
    return apiResponse.data!;
  }

  Future<ServiceDetail> getService(String id) async {
    final resp = await _client.get<Map<String, dynamic>>(Endpoints.service(id));

    final apiResponse = ApiResponse<ServiceDetail>.fromJson(
      resp,
      (json) => ServiceDetail.fromJson(json as Map<String, dynamic>),
    );

    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Servicio no encontrado');
    }
    return apiResponse.data!;
  }

  Future<ServiceDetail> createService(ServiceFormData data) async {
    final resp = await _client.post<Map<String, dynamic>>(
      Endpoints.services,
      data: data.toJson(),
    );

    final apiResponse = ApiResponse<ServiceDetail>.fromJson(
      resp,
      (json) => ServiceDetail.fromJson(json as Map<String, dynamic>),
    );

    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Error al crear servicio');
    }
    return apiResponse.data!;
  }

  Future<ServiceDetail> updateService(
    String id,
    Map<String, dynamic> data,
  ) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.service(id),
      data: data,
    );

    final apiResponse = ApiResponse<ServiceDetail>.fromJson(
      resp,
      (json) => ServiceDetail.fromJson(json as Map<String, dynamic>),
    );

    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Error al actualizar servicio');
    }
    return apiResponse.data!;
  }

  Future<void> deleteService(String id) async {
    final resp = await _client.delete<Map<String, dynamic>>(
      Endpoints.service(id),
    );

    final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});

    if (!apiResponse.success) {
      throw Exception(apiResponse.error ?? 'Error al eliminar servicio');
    }
  }
}

@Riverpod(keepAlive: true)
ServicesRepository servicesRepository(Ref ref) {
  final client = ref.watch(apiClientProvider);
  return ServicesRepository(client);
}
