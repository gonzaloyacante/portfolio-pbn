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

import 'booking_model.dart';

part 'bookings_repository.g.dart';

class BookingsRepository {
  BookingsRepository({
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

  Future<PaginatedResponse<BookingItem>> getBookings({
    int page = 1,
    int limit = 100,
    String? search,
    String? status,
    String? serviceId,
    DateTime? dateFrom,
    DateTime? dateTo,
  }) async {
    try {
      final resp = await _client.get<Map<String, dynamic>>(
        Endpoints.bookings,
        queryParams: {
          'page': page.toString(),
          'limit': limit.toString(),
          if (search != null && search.isNotEmpty) 'search': search,
          if (status != null) 'status': status,
          if (serviceId != null) 'serviceId': serviceId,
          if (dateFrom != null) 'dateFrom': dateFrom.toIso8601String(),
          if (dateTo != null) 'dateTo': dateTo.toIso8601String(),
        },
      );

      final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(
        resp,
        (d) => d as Map<String, dynamic>,
      );

      if (!apiResp.success || apiResp.data == null) {
        throw Exception(apiResp.error ?? 'Error al obtener reservas');
      }

      final result = PaginatedResponse<BookingItem>.fromJson(
        apiResp.data!,
        (e) => BookingItem.fromJson(e as Map<String, dynamic>),
      );

      unawaited(_populateCache(result.data));
      return result;
    } on NetworkException {
      return _fromCache(
        status: status,
        serviceId: serviceId,
        dateFrom: dateFrom,
        dateTo: dateTo,
      );
    }
  }

  Future<PaginatedResponse<BookingItem>> _fromCache({
    String? status,
    String? serviceId,
    DateTime? dateFrom,
    DateTime? dateTo,
  }) async {
    final rows = await _db.bookingsDao.getAll();
    if (rows.isEmpty) throw const NetworkException();

    final items = rows
        .where((r) => status == null || r.status == status)
        .where((r) => dateFrom == null || !r.date.isBefore(dateFrom))
        .where((r) => dateTo == null || !r.date.isAfter(dateTo))
        .map(
          (r) => BookingItem.fromJson(
            jsonDecode(r.dataJson) as Map<String, dynamic>,
          ),
        )
        .where((item) => serviceId == null || item.serviceId == serviceId)
        .toList();

    AppLogger.info('[Bookings] serving ${items.length} items from cache');
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

  Future<void> _populateCache(List<BookingItem> items) async {
    try {
      final rows = items
          .map(
            (item) => BookingsCacheCompanion.insert(
              id: item.id,
              dataJson: jsonEncode(item.toJson()),
              status: Value(item.status),
              date: item.date,
              endDate: Value(item.endDate),
              clientName: item.clientName,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              syncedAt: Value(DateTime.now()),
            ),
          )
          .toList();
      await _db.bookingsDao.upsertMany(rows);
      await _db.syncMetadataDao.upsert(
        'bookings',
        DateTime.now(),
        count: items.length,
      );
    } catch (e) {
      AppLogger.warn('[Bookings] cache write failed: $e');
    }
  }

  // ── Detail ────────────────────────────────────────────────────────────────

  Future<BookingDetail> getBooking(String id) async {
    final resp = await _client.get<Map<String, dynamic>>(Endpoints.booking(id));

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(
      resp,
      (d) => d as Map<String, dynamic>,
    );

    if (!apiResp.success || apiResp.data == null) {
      throw Exception(apiResp.error ?? 'Reserva no encontrada');
    }
    return BookingDetail.fromJson(apiResp.data!);
  }

  // ── Create ────────────────────────────────────────────────────────────────

  Future<BookingDetail> createBooking(BookingFormData data) async {
    try {
      final resp = await _client.post<Map<String, dynamic>>(
        Endpoints.bookings,
        data: data.toJson(),
      );
      final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(
        resp,
        (d) => d as Map<String, dynamic>,
      );
      if (!apiResp.success || apiResp.data == null) {
        throw Exception(apiResp.error ?? 'Error al crear reserva');
      }
      return BookingDetail.fromJson(apiResp.data!);
    } on NetworkException {
      await _outbox.enqueueOrThrow(
        method: 'POST',
        endpoint: Endpoints.bookings,
        body: data.toJson(),
      );
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────

  Future<BookingDetail> updateBooking(
    String id,
    Map<String, dynamic> updates,
  ) async {
    try {
      final resp = await _client.patch<Map<String, dynamic>>(
        Endpoints.booking(id),
        data: updates,
      );
      final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(
        resp,
        (d) => d as Map<String, dynamic>,
      );
      if (!apiResp.success || apiResp.data == null) {
        throw Exception(apiResp.error ?? 'Error al actualizar reserva');
      }
      return BookingDetail.fromJson(apiResp.data!);
    } on NetworkException {
      await _outbox.enqueueOrThrow(
        method: 'PATCH',
        endpoint: Endpoints.booking(id),
        body: updates,
      );
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  Future<void> deleteBooking(String id) async {
    try {
      final resp = await _client.delete<Map<String, dynamic>>(
        Endpoints.booking(id),
      );
      final apiResp = ApiResponse<void>.fromJson(resp, (_) {});
      if (!apiResp.success) {
        throw Exception(apiResp.error ?? 'Error al eliminar reserva');
      }
    } on NetworkException {
      await _outbox.enqueueOrThrow(
        method: 'DELETE',
        endpoint: Endpoints.booking(id),
      );
    }
  }
}

@Riverpod(keepAlive: true)
BookingsRepository bookingsRepository(Ref ref) {
  return BookingsRepository(
    client: ref.watch(apiClientProvider),
    db: ref.watch(appDatabaseProvider),
    outbox: ref.watch(outboxServiceProvider),
  );
}
