// ignore_for_file: use_null_aware_elements

import 'dart:async';
import 'dart:convert';

import 'package:drift/drift.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/api_exceptions.dart';
import '../../../core/api/endpoints.dart';
import '../../../core/database/app_database.dart';
import '../../../core/sync/outbox_service.dart';
import '../../../core/utils/app_logger.dart';
import '../../../shared/models/api_response.dart';
import '../../../shared/models/paginated_response.dart';
import 'service_model.dart';

part 'services_repository.g.dart';

class ServicesRepository {
  ServicesRepository({
    required ApiClient client,
    required AppDatabase db,
    required OutboxService outbox,
  }) : _client = client,
       _db = db,
       _outbox = outbox;

  final ApiClient _client;
  final AppDatabase _db;
  final OutboxService _outbox;

  // ── List ──────────────────────────────────────────────────────────────────

  Future<PaginatedResponse<ServiceItem>> getServices({
    int page = 1,
    int limit = 50,
    String? search,
    bool? isActive,
    bool? isFeatured,
  }) async {
    try {
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

      unawaited(_populateCache(apiResponse.data!.data));
      return apiResponse.data!;
    } on NetworkException {
      return _fromCache(
        search: search,
        isActive: isActive,
        isFeatured: isFeatured,
      );
    }
  }

  Future<PaginatedResponse<ServiceItem>> _fromCache({
    String? search,
    bool? isActive,
    bool? isFeatured,
  }) async {
    final rows = await _db.servicesDao.getAll();
    if (rows.isEmpty) throw const NetworkException();

    final q = search?.toLowerCase();
    final items = rows
        .where((r) => isActive == null || r.isActive == isActive)
        .map(
          (r) => ServiceItem.fromJson(
            jsonDecode(r.dataJson) as Map<String, dynamic>,
          ),
        )
        .where((item) => isFeatured == null || item.isFeatured == isFeatured)
        .where(
          (item) =>
              q == null ||
              item.name.toLowerCase().contains(q) ||
              (item.shortDesc?.toLowerCase().contains(q) ?? false),
        )
        .toList();

    AppLogger.info('[Services] serving ${items.length} items from cache');
    return PaginatedResponse(
      data: items,
      pagination: PaginationMeta(
        page: 1,
        limit: items.length,
        total: items.length,
        totalPages: 1,
      ),
    );
  }

  Future<void> _populateCache(List<ServiceItem> items) async {
    try {
      final rows = items
          .map(
            (item) => ServicesCacheCompanion.insert(
              id: item.id,
              dataJson: jsonEncode(item.toJson()),
              isActive: Value(item.isActive),
              sortOrder: Value(item.sortOrder),
              syncedAt: Value(DateTime.now()),
            ),
          )
          .toList();
      await _db.servicesDao.upsertMany(rows);
      await _db.syncMetadataDao.upsert(
        'services',
        DateTime.now(),
        count: items.length,
      );
    } catch (e) {
      AppLogger.warn('[Services] cache write failed: $e');
    }
  }

  // ── Detail ────────────────────────────────────────────────────────────────

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

  // ── Create ────────────────────────────────────────────────────────────────

  Future<ServiceDetail> createService(ServiceFormData data) async {
    try {
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
    } on NetworkException {
      await _outbox.enqueueOrThrow(
        method: 'POST',
        endpoint: Endpoints.services,
        body: data.toJson(),
      );
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────

  Future<ServiceDetail> updateService(
    String id,
    Map<String, dynamic> data,
  ) async {
    try {
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
    } on NetworkException {
      await _outbox.enqueueOrThrow(
        method: 'PATCH',
        endpoint: Endpoints.service(id),
        body: data,
      );
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  Future<void> deleteService(String id) async {
    try {
      final resp = await _client.delete<Map<String, dynamic>>(
        Endpoints.service(id),
      );
      final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});
      if (!apiResponse.success) {
        throw Exception(apiResponse.error ?? 'Error al eliminar servicio');
      }
    } on NetworkException {
      await _outbox.enqueueOrThrow(
        method: 'DELETE',
        endpoint: Endpoints.service(id),
      );
    }
  }
}

@Riverpod(keepAlive: true)
ServicesRepository servicesRepository(Ref ref) {
  return ServicesRepository(
    client: ref.watch(apiClientProvider),
    db: ref.watch(appDatabaseProvider),
    outbox: ref.watch(outboxServiceProvider),
  );
}
