// ignore_for_file: use_null_aware_elements

import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';
import 'package:portfolio_pbn/shared/models/api_response.dart';
import 'package:portfolio_pbn/shared/models/paginated_response.dart';

import 'contact_model.dart';

class ContactsRepository {
  final ApiClient _client;

  const ContactsRepository(this._client);

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

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(resp, (d) => d as Map<String, dynamic>);

    return PaginatedResponse<ContactItem>.fromJson(
      apiResp.data!,
      (e) => ContactItem.fromJson(e as Map<String, dynamic>),
    );
  }

  Future<ContactDetail> getContact(String id) async {
    final resp = await _client.get<Map<String, dynamic>>(Endpoints.contact(id));

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(resp, (d) => d as Map<String, dynamic>);

    return ContactDetail.fromJson(apiResp.data!);
  }

  Future<ContactDetail> updateContact(String id, Map<String, dynamic> updates) async {
    final resp = await _client.patch<Map<String, dynamic>>(Endpoints.contact(id), data: updates);

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(resp, (d) => d as Map<String, dynamic>);

    return ContactDetail.fromJson(apiResp.data!);
  }

  Future<void> deleteContact(String id) async {
    await _client.delete<Map<String, dynamic>>(Endpoints.contact(id));
  }
}
