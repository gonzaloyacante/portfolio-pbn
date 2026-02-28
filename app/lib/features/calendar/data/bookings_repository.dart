// ignore_for_file: use_null_aware_elements

import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';
import 'package:portfolio_pbn/shared/models/api_response.dart';
import 'package:portfolio_pbn/shared/models/paginated_response.dart';

import 'booking_model.dart';

class BookingsRepository {
  final ApiClient _client;

  const BookingsRepository(this._client);

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

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(resp, (d) => d as Map<String, dynamic>);

    return PaginatedResponse<BookingItem>.fromJson(
      apiResp.data!,
      (e) => BookingItem.fromJson(e as Map<String, dynamic>),
    );
  }

  Future<BookingDetail> getBooking(String id) async {
    final resp = await _client.get<Map<String, dynamic>>(Endpoints.booking(id));

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(resp, (d) => d as Map<String, dynamic>);

    return BookingDetail.fromJson(apiResp.data!);
  }

  Future<BookingDetail> createBooking(BookingFormData data) async {
    final resp = await _client.post<Map<String, dynamic>>(Endpoints.bookings, data: data.toJson());

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(resp, (d) => d as Map<String, dynamic>);

    return BookingDetail.fromJson(apiResp.data!);
  }

  Future<BookingDetail> updateBooking(String id, Map<String, dynamic> updates) async {
    final resp = await _client.patch<Map<String, dynamic>>(Endpoints.booking(id), data: updates);

    final apiResp = ApiResponse<Map<String, dynamic>>.fromJson(resp, (d) => d as Map<String, dynamic>);

    return BookingDetail.fromJson(apiResp.data!);
  }

  Future<void> deleteBooking(String id) async {
    await _client.delete<Map<String, dynamic>>(Endpoints.booking(id));
  }
}
