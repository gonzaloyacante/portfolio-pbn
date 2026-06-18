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
import 'category_model.dart';

part 'categories_repository.g.dart';

// ── CategoriesRepository ──────────────────────────────────────────────────────

class CategoriesRepository {
  CategoriesRepository({
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

  Future<PaginatedResponse<CategoryItem>> getCategories({
    int page = 1,
    int limit = 50,
    String? search,
    bool? isActive,
  }) async {
    try {
      final resp = await _client.get<Map<String, dynamic>>(
        Endpoints.categories,
        queryParams: {
          'page': page,
          'limit': limit,
          if (search != null && search.isNotEmpty) 'search': search,
          if (isActive != null) 'active': isActive.toString(),
        },
      );

      final apiResponse = ApiResponse<PaginatedResponse<CategoryItem>>.fromJson(
        resp,
        (json) => PaginatedResponse<CategoryItem>.fromJson(
          json as Map<String, dynamic>,
          (item) => CategoryItem.fromJson(item as Map<String, dynamic>),
        ),
      );

      if (!apiResponse.success || apiResponse.data == null) {
        throw Exception(apiResponse.error ?? 'Error al obtener categorías');
      }

      unawaited(_populateCache(apiResponse.data!.data));
      return apiResponse.data!;
    } on NetworkException {
      return _fromCache(search: search, isActive: isActive);
    }
  }

  Future<PaginatedResponse<CategoryItem>> _fromCache({
    String? search,
    bool? isActive,
  }) async {
    final rows = await _db.categoriesDao.getAll();
    if (rows.isEmpty) throw const NetworkException();

    final q = search?.toLowerCase();
    final items = rows
        .where((r) => isActive == null || r.isActive == isActive)
        .map(
          (r) => CategoryItem.fromJson(
            jsonDecode(r.dataJson) as Map<String, dynamic>,
          ),
        )
        .where(
          (item) =>
              q == null ||
              item.name.toLowerCase().contains(q) ||
              (item.description?.toLowerCase().contains(q) ?? false),
        )
        .toList();

    AppLogger.info('[Categories] serving ${items.length} items from cache');
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

  Future<void> _populateCache(List<CategoryItem> items) async {
    try {
      final rows = items
          .map(
            (item) => CategoriesCacheCompanion.insert(
              id: item.id,
              dataJson: jsonEncode(item.toJson()),
              isActive: Value(item.isActive),
              sortOrder: Value(item.sortOrder),
              syncedAt: Value(DateTime.now()),
            ),
          )
          .toList();
      await _db.categoriesDao.upsertMany(rows);
      await _db.syncMetadataDao.upsert(
        'categories',
        DateTime.now(),
        count: items.length,
      );
    } catch (e) {
      AppLogger.warn('[Categories] cache write failed: $e');
    }
  }

  // ── Detail ────────────────────────────────────────────────────────────────

  Future<CategoryDetail> getCategory(String id) async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.category(id),
    );

    final apiResponse = ApiResponse<CategoryDetail>.fromJson(
      resp,
      (json) => CategoryDetail.fromJson(json as Map<String, dynamic>),
    );

    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Categoría no encontrada');
    }
    return apiResponse.data!;
  }

  // ── Create ────────────────────────────────────────────────────────────────

  Future<CategoryDetail> createCategory(CategoryFormData data) async {
    try {
      final resp = await _client.post<Map<String, dynamic>>(
        Endpoints.categories,
        data: data.toJson(),
      );
      final apiResponse = ApiResponse<CategoryDetail>.fromJson(
        resp,
        (json) => CategoryDetail.fromJson(json as Map<String, dynamic>),
      );
      if (!apiResponse.success || apiResponse.data == null) {
        throw Exception(apiResponse.error ?? 'Error al crear categoría');
      }
      return apiResponse.data!;
    } on NetworkException {
      await _outbox.enqueueOrThrow(
        method: 'POST',
        endpoint: Endpoints.categories,
        body: data.toJson(),
      );
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────

  Future<CategoryDetail> updateCategory(
    String id,
    Map<String, dynamic> data,
  ) async {
    try {
      final resp = await _client.patch<Map<String, dynamic>>(
        Endpoints.category(id),
        data: data,
      );
      final apiResponse = ApiResponse<CategoryDetail>.fromJson(
        resp,
        (json) => CategoryDetail.fromJson(json as Map<String, dynamic>),
      );
      if (!apiResponse.success || apiResponse.data == null) {
        throw Exception(apiResponse.error ?? 'Error al actualizar categoría');
      }
      return apiResponse.data!;
    } on NetworkException {
      await _outbox.enqueueOrThrow(
        method: 'PATCH',
        endpoint: Endpoints.category(id),
        body: data,
      );
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  Future<void> deleteCategory(String id) async {
    try {
      final resp = await _client.delete<Map<String, dynamic>>(
        Endpoints.category(id),
      );
      final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});
      if (!apiResponse.success) {
        throw Exception(apiResponse.error ?? 'Error al eliminar categoría');
      }
    } on NetworkException {
      await _outbox.enqueueOrThrow(
        method: 'DELETE',
        endpoint: Endpoints.category(id),
      );
    }
  }

  // ── Gallery ───────────────────────────────────────────────────────────────

  Future<List<GalleryImageItem>> getCategoryGallery(String categoryId) async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.categoryGallery(categoryId),
    );

    final apiResponse = ApiResponse<List<GalleryImageItem>>.fromJson(
      resp,
      (json) => (json as List<dynamic>)
          .whereType<Map<String, dynamic>>()
          .where((e) {
            final valid =
                e['id'] != null && e['url'] != null && e['categoryId'] != null;
            if (!valid) AppLogger.warn('Skipping malformed gallery image: $e');
            return valid;
          })
          .map((e) => GalleryImageItem.fromJson(e))
          .toList(),
    );

    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Error al obtener la galería');
    }
    return apiResponse.data!;
  }

  Future<void> updateGalleryOrder(
    String categoryId,
    List<({String id, int order})> items,
  ) async {
    final resp = await _client.put<Map<String, dynamic>>(
      Endpoints.categoryGallery(categoryId),
      data: {
        'order': items.map((e) => {'id': e.id, 'order': e.order}).toList(),
      },
    );

    final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});

    if (!apiResponse.success) {
      throw Exception(apiResponse.error ?? 'Error al guardar el orden');
    }
  }

  Future<void> addGalleryImages(
    String categoryId,
    List<({String url, String publicId, int? width, int? height})> images,
  ) async {
    final resp = await _client.post<Map<String, dynamic>>(
      Endpoints.categoryGallery(categoryId),
      data: {
        'images': images
            .map(
              (i) => {
                'url': i.url,
                'publicId': i.publicId,
                if (i.width != null) 'width': i.width,
                if (i.height != null) 'height': i.height,
              },
            )
            .toList(),
      },
    );

    final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});
    if (!apiResponse.success) {
      throw Exception(apiResponse.error ?? 'Error al agregar imágenes');
    }
  }

  Future<void> deleteGalleryImage(
    String categoryId,
    String imageId,
    String publicId,
  ) async {
    final resp = await _client.delete<Map<String, dynamic>>(
      Endpoints.categoryGallery(categoryId),
      data: {'imageId': imageId, 'publicId': publicId},
    );

    final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});
    if (!apiResponse.success) {
      throw Exception(apiResponse.error ?? 'Error al eliminar imagen');
    }
  }

  Future<void> toggleImageFeatured(
    String categoryId,
    String imageId, {
    required bool isFeatured,
  }) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.categoryGallery(categoryId),
      data: {'imageId': imageId, 'isFeatured': isFeatured},
    );

    final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});
    if (!apiResponse.success) {
      throw Exception(
        apiResponse.error ?? 'Error al actualizar imagen destacada',
      );
    }
  }
}

@Riverpod(keepAlive: true)
CategoriesRepository categoriesRepository(Ref ref) {
  return CategoriesRepository(
    client: ref.watch(apiClientProvider),
    db: ref.watch(appDatabaseProvider),
    outbox: ref.watch(outboxServiceProvider),
  );
}
