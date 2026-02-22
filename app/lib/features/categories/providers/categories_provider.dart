import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../data/categories_repository.dart';
import '../data/category_model.dart';
import '../../../shared/models/paginated_response.dart';

part 'categories_provider.g.dart';

@riverpod
Future<PaginatedResponse<CategoryItem>> categoriesList(
  Ref ref, {
  int page = 1,
  String? search,
  bool? isActive,
}) async {
  final repo = ref.watch(categoriesRepositoryProvider);
  return repo.getCategories(page: page, search: search, isActive: isActive);
}

@riverpod
Future<CategoryDetail> categoryDetail(Ref ref, String id) async {
  final repo = ref.watch(categoriesRepositoryProvider);
  return repo.getCategory(id);
}
