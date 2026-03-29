// ignore_for_file: use_null_aware_elements

import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';
import 'package:portfolio_pbn/core/sync/offline_first_mixin.dart';
import 'package:portfolio_pbn/core/sync/sync_queue.dart';
import 'package:portfolio_pbn/shared/models/api_response.dart';
import 'package:portfolio_pbn/shared/models/offline_result.dart';
import 'package:portfolio_pbn/shared/models/paginated_response.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'contact_model.dart';

part 'contacts_repository.g.dart';

class ContactsRepository with OfflineFirstMixin {
  ContactsRepository({required this.ref, required ApiClient client})
    : _client = client;

  @override
  final Ref ref;

  final ApiClient _client;

  Future<PaginatedResponse<ContactItem>> getContacts({
    int page = 1,
    int limit = 50,
    String? search,
    String? status,
    String? priority,
    bool? unreadOnly,
  }) async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.contacts,
      queryParams: {
        'page': page.toString(),
        'limit': limit.toString(),
        if (search != null && search.isNotEmpty) 'search': search,
        if (status != null) 'status': status,
        if (priority != null) 'priority': priority,
        if (unreadOnly == true) 'unread': 'true',
      },
    );

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(
      resp,
      (d) => d as Map<String, dynamic>,
    );

    if (!apiResp.success || apiResp.data == null) {
      throw Exception(apiResp.error ?? 'Error al obtener contactos');
    }
    return PaginatedResponse<ContactItem>.fromJson(
      apiResp.data!,
      (e) => ContactItem.fromJson(e as Map<String, dynamic>),
    );
  }

  Future<ContactDetail> getContact(String id) async {
    final resp = await _client.get<Map<String, dynamic>>(Endpoints.contact(id));

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(
      resp,
      (d) => d as Map<String, dynamic>,
    );

    if (!apiResp.success || apiResp.data == null) {
      throw Exception(apiResp.error ?? 'Contacto no encontrado');
    }
    return ContactDetail.fromJson(apiResp.data!);
  }

  /// Contacts son enviados por usuarios públicos — no se crean desde el panel.
  /// Solo se actualizan (status, notes, respuesta).
  Future<MutationResult<ContactDetail>> updateContact(
    String id,
    Map<String, dynamic> updates,
  ) => mutateOnlineOrEnqueue(
    operation: SyncOperationType.update,
    resource: 'contacts',
    resourceId: id,
    payload: updates,
    onOnline: () async {
      final resp = await _client.patch<Map<String, dynamic>>(
        Endpoints.contact(id),
        data: updates,
      );
      final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(
        resp,
        (d) => d as Map<String, dynamic>,
      );
      if (!apiResp.success || apiResp.data == null) {
        throw Exception(apiResp.error ?? 'Error al actualizar contacto');
      }
      return ContactDetail.fromJson(apiResp.data!);
    },
  );

  Future<MutationResult<void>> deleteContact(String id) =>
      mutateOnlineOrEnqueue(
        operation: SyncOperationType.delete,
        resource: 'contacts',
        resourceId: id,
        payload: {},
        onOnline: () async {
          final resp = await _client.delete<Map<String, dynamic>>(
            Endpoints.contact(id),
          );
          final apiResp = ApiResponse<void>.fromJson(resp, (_) {});
          if (!apiResp.success) {
            throw Exception(apiResp.error ?? 'Error al eliminar contacto');
          }
        },
      );
}

@Riverpod(keepAlive: true)
ContactsRepository contactsRepository(Ref ref) {
  return ContactsRepository(ref: ref, client: ref.watch(apiClientProvider));
}
