import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../data/trash_model.dart';
import '../data/trash_repository.dart';

part 'trash_provider.g.dart';

@riverpod
TrashRepository trashRepository(Ref ref) {
  return TrashRepository(ref.watch(apiClientProvider));
}

@riverpod
Future<Map<String, List<TrashItem>>> trashItems(Ref ref) async {
  return ref.watch(trashRepositoryProvider).getTrash();
}
