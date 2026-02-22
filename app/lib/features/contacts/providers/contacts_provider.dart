import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/shared/models/paginated_response.dart';

import '../data/contact_model.dart';
import '../data/contacts_repository.dart';

part 'contacts_provider.g.dart';

// ── Repositorio ───────────────────────────────────────────────────────────────

@riverpod
ContactsRepository contactsRepository(Ref ref) {
  return ContactsRepository(ref.watch(apiClientProvider));
}

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
  return ref.watch(contactsRepositoryProvider).getContact(id);
}
