import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'package:portfolio_pbn/shared/models/paginated_response.dart';

import '../data/contact_model.dart';
import '../data/contacts_repository.dart';

// Re-export the repository provider so pages that import this file can access
// contactsRepositoryProvider without an additional import.
export '../data/contacts_repository.dart' show contactsRepositoryProvider;

part 'contacts_provider.g.dart';

// ── Lista ─────────────────────────────────────────────────────────────────────

@riverpod
Future<PaginatedResponse<ContactItem>> contactsList(
  Ref ref, {
  int page = 1,
  String? search,
  String? status,
  String? priority,
  bool? unreadOnly,
}) async {
  ref.keepAlive();
  return ref
      .watch(contactsRepositoryProvider)
      .getContacts(
        page: page,
        search: search,
        status: status,
        priority: priority,
        unreadOnly: unreadOnly,
      );
}

// ── Detalle ───────────────────────────────────────────────────────────────────

@riverpod
Future<ContactDetail> contactDetail(Ref ref, String id) async {
  ref.keepAlive();
  return ref.watch(contactsRepositoryProvider).getContact(id);
}
