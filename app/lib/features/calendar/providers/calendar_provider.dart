import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'package:portfolio_pbn/core/api/api_client.dart';
import 'package:portfolio_pbn/shared/models/paginated_response.dart';

import '../data/booking_model.dart';
import '../data/bookings_repository.dart';

part 'calendar_provider.g.dart';

// ── Repositorio ───────────────────────────────────────────────────────────────

@Riverpod(keepAlive: true)
BookingsRepository bookingsRepository(Ref ref) {
  return BookingsRepository(ref.watch(apiClientProvider));
}

// ── Lista mensual (carga el mes cargado en el calendario) ─────────────────────

@riverpod
Future<PaginatedResponse<BookingItem>> bookingsList(
  Ref ref, {
  int page = 1,
  String? search,
  String? status,
  DateTime? dateFrom,
  DateTime? dateTo,
}) async {
  ref.keepAlive();
  return ref
      .watch(bookingsRepositoryProvider)
      .getBookings(
        page: page,
        search: search,
        status: status,
        dateFrom: dateFrom,
        dateTo: dateTo,
      );
}

// ── Detalle ───────────────────────────────────────────────────────────────────

@riverpod
Future<BookingDetail> bookingDetail(Ref ref, String id) async {
  ref.keepAlive();
  return ref.watch(bookingsRepositoryProvider).getBooking(id);
}
