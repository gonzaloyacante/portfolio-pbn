// ignore_for_file: use_null_aware_elements
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/endpoints.dart';
import '../../../shared/models/api_response.dart';
import '../../../shared/models/paginated_response.dart';
import 'category_model.dart';

part 'categories_repository.g.dart';

class CategoriesRepository {
  const CategoriesRepository(this._client);

  final ApiClient _client;

  // ── List ──────────────────────────────────────────────────────────────────

  Future<PaginatedResponse<CategoryItem>> getCategories({
    int page = 1,
    int limit = 50,
    String? search,
    bool? isActive,
  }) async {
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
    return apiResponse.data!;
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
  }

  // ── Update ────────────────────────────────────────────────────────────────

  Future<CategoryDetail> updateCategory(
    String id,
    Map<String, dynamic> data,
  ) async {
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
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  Future<void> deleteCategory(String id) async {
    final resp = await _client.delete<Map<String, dynamic>>(
      Endpoints.category(id),
    );

    final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});

    if (!apiResponse.success) {
      throw Exception(apiResponse.error ?? 'Error al eliminar categoría');
    }
  }
}

@riverpod
CategoriesRepository categoriesRepository(Ref ref) {
  final client = ref.watch(apiClientProvider);
  return CategoriesRepository(client);
}
