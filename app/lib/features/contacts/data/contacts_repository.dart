// ignore_for_file: use_null_aware_elements

import 'dart:async';
import 'dart:convert';

import 'package:drift/drift.dart';
import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/api_exceptions.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';
import 'package:portfolio_pbn/core/database/app_database.dart';
import 'package:portfolio_pbn/core/sync/outbox_service.dart';
import 'package:portfolio_pbn/core/utils/app_logger.dart';
import 'package:portfolio_pbn/shared/models/api_response.dart';
import 'package:portfolio_pbn/shared/models/paginated_response.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'contact_model.dart';

part 'contacts_repository.g.dart';

class ContactsRepository {
  ContactsRepository({
    required ApiClient client,
    required AppDatabase db,
    required OutboxService outbox,
  }) : _client = client,
       _db = db,
       _outbox = outbox;

  final ApiClient _client;
  final AppDatabase _db;
  final OutboxService _outbox;

  // ── List ──────────────────────────────────────────────────────────────────

  Future<PaginatedResponse<ContactItem>> getContacts({
    int page = 1,
    int limit = 50,
    String? search,
    String? status,
    String? priority,
    bool? unreadOnly,
  }) async {
    try {
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

      final result = PaginatedResponse<ContactItem>.fromJson(
        apiResp.data!,
        (e) => ContactItem.fromJson(e as Map<String, dynamic>),
      );

      unawaited(_populateCache(result.data));
      return result;
    } on NetworkException {
      return _fromCache(status: status, priority: priority);
    }
  }

  Future<PaginatedResponse<ContactItem>> _fromCache({
    String? status,
    String? priority,
  }) async {
    final rows = await _db.contactsDao.getAll();
    if (rows.isEmpty) throw const NetworkException();

    final items = rows
        .where((r) => status == null || r.status == status)
        .where((r) => priority == null || r.priority == priority)
        .map(
          (r) => ContactItem.fromJson(
            jsonDecode(r.dataJson) as Map<String, dynamic>,
          ),
        )
        .toList();

    AppLogger.info('[Contacts] serving ${items.length} items from cache');
    return PaginatedResponse(
      data: items,
      pagination: PaginationMeta(
        page: 1,
        limit: items.length,
        total: items.length,
        totalPages: 1,
      ),
    );
  }

  Future<void> _populateCache(List<ContactItem> items) async {
    try {
      final rows = items
          .map(
            (item) => ContactsCacheCompanion.insert(
              id: item.id,
              dataJson: jsonEncode(item.toJson()),
              status: Value(item.status),
              priority: Value(item.priority),
              isRead: Value(item.isRead),
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              syncedAt: Value(DateTime.now()),
            ),
          )
          .toList();
      await _db.contactsDao.upsertMany(rows);
      await _db.syncMetadataDao.upsert(
        'contacts',
        DateTime.now(),
        count: items.length,
      );
    } catch (e) {
      AppLogger.warn('[Contacts] cache write failed: $e');
    }
  }

  // ── Detail ────────────────────────────────────────────────────────────────

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

  // ── Update ────────────────────────────────────────────────────────────────

  Future<ContactDetail> updateContact(
    String id,
    Map<String, dynamic> updates,
  ) async {
    try {
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
    } on NetworkException {
      await _outbox.enqueue(
        method: 'PATCH',
        endpoint: Endpoints.contact(id),
        body: updates,
      );
      throw const OfflineMutationException();
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  Future<void> deleteContact(String id) async {
    try {
      final resp = await _client.delete<Map<String, dynamic>>(
        Endpoints.contact(id),
      );
      final apiResp = ApiResponse<void>.fromJson(resp, (_) {});
      if (!apiResp.success) {
        throw Exception(apiResp.error ?? 'Error al eliminar contacto');
      }
    } on NetworkException {
      await _outbox.enqueue(method: 'DELETE', endpoint: Endpoints.contact(id));
      throw const OfflineMutationException();
    }
  }
}

@Riverpod(keepAlive: true)
ContactsRepository contactsRepository(Ref ref) {
  return ContactsRepository(
    client: ref.watch(apiClientProvider),
    db: ref.watch(appDatabaseProvider),
    outbox: ref.watch(outboxServiceProvider),
  );
}
