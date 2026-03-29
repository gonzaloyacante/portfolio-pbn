// ignore_for_file: use_null_aware_elements

import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';
import 'package:portfolio_pbn/core/sync/offline_first_mixin.dart';
import 'package:portfolio_pbn/core/sync/sync_queue.dart';
import 'package:portfolio_pbn/shared/models/api_response.dart';
import 'package:portfolio_pbn/shared/models/offline_result.dart';
import 'package:portfolio_pbn/shared/models/paginated_response.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'booking_model.dart';

part 'bookings_repository.g.dart';

class BookingsRepository with OfflineFirstMixin {
  BookingsRepository({required this.ref, required ApiClient client})
    : _client = client;

  @override
  final Ref ref;

  final ApiClient _client;

  Future<PaginatedResponse<BookingItem>> getBookings({
    int page = 1,
    int limit = 100,
    String? search,
    String? status,
    String? serviceId,
    DateTime? dateFrom,
    DateTime? dateTo,
  }) async {
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
    return PaginatedResponse<BookingItem>.fromJson(
      apiResp.data!,
      (e) => BookingItem.fromJson(e as Map<String, dynamic>),
    );
  }

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

  Future<MutationResult<BookingDetail>> createBooking(BookingFormData data) =>
      mutateOnlineOrEnqueue(
        operation: SyncOperationType.create,
        resource: 'bookings',
        payload: data.toJson(),
        onOnline: () async {
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
        },
      );

  Future<MutationResult<BookingDetail>> updateBooking(
    String id,
    Map<String, dynamic> updates,
  ) => mutateOnlineOrEnqueue(
    operation: SyncOperationType.update,
    resource: 'bookings',
    resourceId: id,
    payload: updates,
    onOnline: () async {
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
    },
  );

  Future<MutationResult<void>> deleteBooking(String id) =>
      mutateOnlineOrEnqueue(
        operation: SyncOperationType.delete,
        resource: 'bookings',
        resourceId: id,
        payload: {},
        onOnline: () async {
          final resp = await _client.delete<Map<String, dynamic>>(
            Endpoints.booking(id),
          );
          final apiResp = ApiResponse<void>.fromJson(resp, (_) {});
          if (!apiResp.success) {
            throw Exception(apiResp.error ?? 'Error al eliminar reserva');
          }
        },
      );
}

@Riverpod(keepAlive: true)
BookingsRepository bookingsRepository(Ref ref) {
  return BookingsRepository(ref: ref, client: ref.watch(apiClientProvider));
}
