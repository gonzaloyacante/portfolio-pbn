import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../shared/models/paginated_response.dart';
import '../data/project_model.dart';
import '../data/projects_repository.dart';

part 'projects_provider.g.dart';

// ── projectsListProvider ──────────────────────────────────────────────────────

/// Lista paginada de proyectos con parámetros de filtro.
@riverpod
Future<PaginatedResponse<ProjectListItem>> projectsList(Ref ref, {int page = 1, String? search, String? categoryId}) {
  return ref.watch(projectsRepositoryProvider).getProjects(page: page, search: search, categoryId: categoryId);
}

// ── projectDetailProvider ─────────────────────────────────────────────────────

/// Detalle completo de un proyecto.
@riverpod
Future<ProjectDetail> projectDetail(Ref ref, String id) {
  return ref.watch(projectsRepositoryProvider).getProject(id);
}
