// ignore_for_file: use_null_aware_elements
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/endpoints.dart';
import '../../../core/sync/offline_first_mixin.dart';
import '../../../core/sync/sync_queue.dart';
import '../../../shared/models/api_response.dart';
import '../../../shared/models/offline_result.dart';
import '../../../shared/models/paginated_response.dart';
import 'service_model.dart';

part 'services_repository.g.dart';

class ServicesRepository with OfflineFirstMixin {
  ServicesRepository({required this.ref, required ApiClient client})
    : _client = client;

  @override
  final Ref ref;

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

  Future<MutationResult<ServiceDetail>> createService(ServiceFormData data) =>
      mutateOnlineOrEnqueue(
        operation: SyncOperationType.create,
        resource: 'services',
        payload: data.toJson(),
        onOnline: () async {
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
        },
      );

  Future<MutationResult<ServiceDetail>> updateService(
    String id,
    Map<String, dynamic> data,
  ) => mutateOnlineOrEnqueue(
    operation: SyncOperationType.update,
    resource: 'services',
    resourceId: id,
    payload: data,
    onOnline: () async {
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
    },
  );

  Future<MutationResult<void>> deleteService(String id) =>
      mutateOnlineOrEnqueue(
        operation: SyncOperationType.delete,
        resource: 'services',
        resourceId: id,
        payload: {},
        onOnline: () async {
          final resp = await _client.delete<Map<String, dynamic>>(
            Endpoints.service(id),
          );
          final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});
          if (!apiResponse.success) {
            throw Exception(apiResponse.error ?? 'Error al eliminar servicio');
          }
        },
      );
}

@Riverpod(keepAlive: true)
ServicesRepository servicesRepository(Ref ref) {
  return ServicesRepository(ref: ref, client: ref.watch(apiClientProvider));
}
