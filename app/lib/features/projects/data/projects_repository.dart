// ignore_for_file: use_null_aware_elements
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/endpoints.dart';
import '../../../shared/models/api_response.dart';
import '../../../shared/models/paginated_response.dart';
import 'project_model.dart';

part 'projects_repository.g.dart';

// ── ProjectsRepository ────────────────────────────────────────────────────────

/// Accede a los endpoints de proyectos del panel de administración.
class ProjectsRepository {
  const ProjectsRepository(this._client);

  final ApiClient _client;

  // ── List ────────────────────────────────────────────────────────────────────

  Future<PaginatedResponse<ProjectListItem>> getProjects({
    int page = 1,
    int limit = 20,
    String? search,
    String? categoryId,
    bool? isActive,
    bool? isFeatured,
  }) async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.projects,
      queryParams: {
        'page': page,
        'limit': limit,
        if (search != null && search.isNotEmpty) 'search': search,
        if (categoryId != null) 'categoryId': categoryId,
        if (isActive != null) 'active': isActive.toString(),
        if (isFeatured != null) 'featured': isFeatured.toString(),
      },
    );

    final apiResponse =
        ApiResponse<PaginatedResponse<ProjectListItem>>.fromJson(
          resp,
          (json) => PaginatedResponse<ProjectListItem>.fromJson(
            json as Map<String, dynamic>,
            (item) => ProjectListItem.fromJson(item as Map<String, dynamic>),
          ),
        );

    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Error al obtener proyectos');
    }
    return apiResponse.data!;
  }

  // ── Detail ──────────────────────────────────────────────────────────────────

  Future<ProjectDetail> getProject(String id) async {
    final resp = await _client.get<Map<String, dynamic>>(Endpoints.project(id));
    final apiResponse = ApiResponse<ProjectDetail>.fromJson(
      resp,
      (json) => ProjectDetail.fromJson(json as Map<String, dynamic>),
    );
    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Proyecto no encontrado');
    }
    return apiResponse.data!;
  }

  // ── Create ──────────────────────────────────────────────────────────────────

  Future<ProjectListItem> createProject(ProjectFormData data) async {
    final resp = await _client.post<Map<String, dynamic>>(
      Endpoints.projects,
      data: data.toJson(),
    );
    final apiResponse = ApiResponse<ProjectListItem>.fromJson(
      resp,
      (json) => ProjectListItem.fromJson(json as Map<String, dynamic>),
    );
    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Error al crear proyecto');
    }
    return apiResponse.data!;
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  Future<ProjectDetail> updateProject(
    String id,
    Map<String, dynamic> changes,
  ) async {
    final resp = await _client.patch<Map<String, dynamic>>(
      Endpoints.project(id),
      data: changes,
    );
    final apiResponse = ApiResponse<ProjectDetail>.fromJson(
      resp,
      (json) => ProjectDetail.fromJson(json as Map<String, dynamic>),
    );
    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Error al actualizar proyecto');
    }
    return apiResponse.data!;
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  Future<void> deleteProject(String id) async {
    final resp = await _client.delete<Map<String, dynamic>>(
      Endpoints.project(id),
    );
    final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});
    if (!apiResponse.success) {
      throw Exception(apiResponse.error ?? 'Error al eliminar proyecto');
    }
  }

  // ── Reorder ─────────────────────────────────────────────────────────────────

  Future<void> reorderProjects(List<({String id, int sortOrder})> items) async {
    final resp = await _client.post<Map<String, dynamic>>(
      Endpoints.projectsReorder,
      data: {
        'items': items
            .map((e) => {'id': e.id, 'sortOrder': e.sortOrder})
            .toList(),
      },
    );
    final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});
    if (!apiResponse.success) {
      throw Exception(apiResponse.error ?? 'Error al reordenar proyectos');
    }
  }
  // ── Images

  /// Añade una imagen a la galería del proyecto.
  Future<void> addProjectImage(
    String projectId, {
    required String url,
    required String publicId,
    int order = 0,
    String? alt,
  }) async {
    final resp = await _client.post<Map<String, dynamic>>(
      Endpoints.projectImages(projectId),
      data: {
        'url': url,
        'publicId': publicId,
        'order': order,
        if (alt != null) 'alt': alt,
      },
    );
    final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});
    if (!apiResponse.success) {
      throw Exception(apiResponse.error ?? 'Error al añadir imagen');
    }
  }

  /// Elimina una imagen de la galería del proyecto.
  Future<void> removeProjectImage(String projectId, String imageId) async {
    final resp = await _client.delete<Map<String, dynamic>>(
      Endpoints.projectImage(projectId, imageId),
    );
    final apiResponse = ApiResponse<void>.fromJson(resp, (_) {});
    if (!apiResponse.success) {
      throw Exception(apiResponse.error ?? 'Error al eliminar imagen');
    }
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

@riverpod
ProjectsRepository projectsRepository(Ref ref) {
  return ProjectsRepository(ref.watch(apiClientProvider));
}
