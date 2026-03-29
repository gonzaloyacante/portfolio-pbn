import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../data/trash_model.dart';
import '../data/trash_repository.dart';

// Re-export the repository provider so pages that import this file can access
// trashRepositoryProvider without an additional import.
export '../data/trash_repository.dart' show trashRepositoryProvider;

part 'trash_provider.g.dart';

@riverpod
Future<Map<String, List<TrashItem>>> trashItems(Ref ref) async {
  ref.keepAlive();
  return ref.watch(trashRepositoryProvider).getTrash();
}
