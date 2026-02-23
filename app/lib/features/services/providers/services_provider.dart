import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../data/service_model.dart';
import '../data/services_repository.dart';
import '../../../shared/models/paginated_response.dart';

part 'services_provider.g.dart';

@riverpod
Future<PaginatedResponse<ServiceItem>> servicesList(
  Ref ref, {
  int page = 1,
  String? search,
  bool? isActive,
  bool? isFeatured,
}) async {
  final repo = ref.watch(servicesRepositoryProvider);
  return repo.getServices(
    page: page,
    search: search,
    isActive: isActive,
    isFeatured: isFeatured,
  );
}

@riverpod
Future<ServiceDetail> serviceDetail(Ref ref, String id) async {
  final repo = ref.watch(servicesRepositoryProvider);
  return repo.getService(id);
}
