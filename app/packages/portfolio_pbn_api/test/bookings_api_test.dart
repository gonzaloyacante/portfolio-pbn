import 'package:test/test.dart';
import 'package:portfolio_pbn_api/portfolio_pbn_api.dart';


/// tests for BookingsApi
void main() {
  final instance = PortfolioPbnApi().getBookingsApi();

  group(BookingsApi, () {
    // Crea una reserva (admin)
    //
    //Future<Booking> createBooking({ CreateBookingRequest createBookingRequest }) async
    test('test createBooking', () async {
      // TODO
    });

    // Elimina una reserva
    //
    //Future<DeleteResponse> deleteBooking(String id) async
    test('test deleteBooking', () async {
      // TODO
    });

    // Obtiene una reserva por ID
    //
    //Future<Booking> getBooking(String id) async
    test('test getBooking', () async {
      // TODO
    });

    // Lista reservas (admin)
    //
    //Future<BookingList> listBookings({ String status, int page, int limit }) async
    test('test listBookings', () async {
      // TODO
    });

    // Actualiza una reserva
    //
    //Future<Booking> updateBooking(String id, { UpdateBookingRequest updateBookingRequest }) async
    test('test updateBooking', () async {
      // TODO
    });

  });
}
