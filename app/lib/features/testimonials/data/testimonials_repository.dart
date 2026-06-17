// ignore_for_file: use_null_aware_elements

import 'dart:async';
import 'dart:convert';

import 'package:drift/drift.dart';
import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/api_exceptions.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';
import 'package:portfolio_pbn/core/database/app_database.dart';
import 'package:portfolio_pbn/core/sync/outbox_service.dart';
import 'package:portfolio_pbn/core/utils/app_logger.dart';
import 'package:portfolio_pbn/shared/models/api_response.dart';
import 'package:portfolio_pbn/shared/models/paginated_response.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'testimonial_model.dart';

part 'testimonials_repository.g.dart';

class TestimonialsRepository {
  TestimonialsRepository({
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

  Future<PaginatedResponse<TestimonialItem>> getTestimonials({
    int page = 1,
    int limit = 50,
    String? search,
    String? status,
    bool? isFeatured,
    bool? isActive,
  }) async {
    try {
      final resp = await _client.get<Map<String, dynamic>>(
        Endpoints.testimonials,
        queryParams: {
          'page': page.toString(),
          'limit': limit.toString(),
          if (search != null && search.isNotEmpty) 'search': search,
          if (status != null) 'status': status,
          if (isFeatured != null) 'featured': isFeatured.toString(),
          if (isActive != null) 'active': isActive.toString(),
        },
      );

      final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(
        resp,
        (d) => d as Map<String, dynamic>,
      );

      if (!apiResp.success || apiResp.data == null) {
        throw Exception(apiResp.error ?? 'Error al obtener testimonios');
      }

      final result = PaginatedResponse<TestimonialItem>.fromJson(
        apiResp.data!,
        (e) => TestimonialItem.fromJson(e as Map<String, dynamic>),
      );

      unawaited(_populateCache(result.data));
      return result;
    } on NetworkException {
      return _fromCache(isActive: isActive);
    }
  }

  Future<PaginatedResponse<TestimonialItem>> _fromCache({
    bool? isActive,
  }) async {
    final rows = await _db.testimonialsDao.getAll();
    if (rows.isEmpty) throw const NetworkException();

    final items = rows
        .where((r) => isActive == null || r.isActive == isActive)
        .map(
          (r) => TestimonialItem.fromJson(
            jsonDecode(r.dataJson) as Map<String, dynamic>,
          ),
        )
        .toList();

    AppLogger.info('[Testimonials] serving ${items.length} items from cache');
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

  Future<void> _populateCache(List<TestimonialItem> items) async {
    try {
      final rows = items
          .map(
            (item) => TestimonialsCacheCompanion.insert(
              id: item.id,
              dataJson: jsonEncode(item.toJson()),
              isActive: Value(item.isActive),
              createdAt: item.createdAt,
              syncedAt: Value(DateTime.now()),
            ),
          )
          .toList();
      await _db.testimonialsDao.upsertMany(rows);
      await _db.syncMetadataDao.upsert(
        'testimonials',
        DateTime.now(),
        count: items.length,
      );
    } catch (e) {
      AppLogger.warn('[Testimonials] cache write failed: $e');
    }
  }

  // ── Detail ────────────────────────────────────────────────────────────────

  Future<TestimonialDetail> getTestimonial(String id) async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.testimonial(id),
    );

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(
      resp,
      (d) => d as Map<String, dynamic>,
    );

    if (!apiResp.success || apiResp.data == null) {
      throw Exception(apiResp.error ?? 'Testimonio no encontrado');
    }
    return TestimonialDetail.fromJson(apiResp.data!);
  }

  // ── Create ────────────────────────────────────────────────────────────────

  Future<TestimonialDetail> createTestimonial(TestimonialFormData data) async {
    try {
      final resp = await _client.post<Map<String, dynamic>>(
        Endpoints.testimonials,
        data: data.toJson(),
      );
      final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(
        resp,
        (d) => d as Map<String, dynamic>,
      );
      if (!apiResp.success || apiResp.data == null) {
        throw Exception(apiResp.error ?? 'Error al crear testimonio');
      }
      return TestimonialDetail.fromJson(apiResp.data!);
    } on NetworkException {
      await _outbox.enqueue(
        method: 'POST',
        endpoint: Endpoints.testimonials,
        body: data.toJson(),
      );
      throw const OfflineMutationException();
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────

  Future<TestimonialDetail> updateTestimonial(
    String id,
    Map<String, dynamic> updates,
  ) async {
    try {
      final resp = await _client.patch<Map<String, dynamic>>(
        Endpoints.testimonial(id),
        data: updates,
      );
      final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(
        resp,
        (d) => d as Map<String, dynamic>,
      );
      if (!apiResp.success || apiResp.data == null) {
        throw Exception(apiResp.error ?? 'Error al actualizar testimonio');
      }
      return TestimonialDetail.fromJson(apiResp.data!);
    } on NetworkException {
      await _outbox.enqueue(
        method: 'PATCH',
        endpoint: Endpoints.testimonial(id),
        body: updates,
      );
      throw const OfflineMutationException();
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  Future<void> deleteTestimonial(String id) async {
    try {
      final resp = await _client.delete<Map<String, dynamic>>(
        Endpoints.testimonial(id),
      );
      final apiResp = ApiResponse<void>.fromJson(resp, (_) {});
      if (!apiResp.success) {
        throw Exception(apiResp.error ?? 'Error al eliminar testimonio');
      }
    } on NetworkException {
      await _outbox.enqueue(
        method: 'DELETE',
        endpoint: Endpoints.testimonial(id),
      );
      throw const OfflineMutationException();
    }
  }
}

@Riverpod(keepAlive: true)
TestimonialsRepository testimonialsRepository(Ref ref) {
  return TestimonialsRepository(
    client: ref.watch(apiClientProvider),
    db: ref.watch(appDatabaseProvider),
    outbox: ref.watch(outboxServiceProvider),
  );
}
