import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/calendar/data/booking_model.dart';

void main() {
  // ── BookingItem fromJson ──────────────────────────────────────────────────

  group('BookingItem.fromJson — required fields', () {
    Map<String, dynamic> base0() => {
      'id': 'bk-1',
      'date': '2024-09-15T10:00:00Z',
      'clientName': 'Patricia García',
      'clientEmail': 'patricia@test.com',
      'serviceId': 'srv-1',
      'createdAt': '2024-08-01T00:00:00Z',
      'updatedAt': '2024-08-01T00:00:00Z',
    };

    test('parses id', () => expect(BookingItem.fromJson(base0()).id, 'bk-1'));
    test(
      'parses clientName',
      () => expect(BookingItem.fromJson(base0()).clientName, 'Patricia García'),
    );
    test(
      'parses clientEmail',
      () => expect(
        BookingItem.fromJson(base0()).clientEmail,
        'patricia@test.com',
      ),
    );
    test(
      'parses serviceId',
      () => expect(BookingItem.fromJson(base0()).serviceId, 'srv-1'),
    );
    test(
      'date is DateTime',
      () => expect(BookingItem.fromJson(base0()).date, isA<DateTime>()),
    );
    test(
      'createdAt is DateTime',
      () => expect(BookingItem.fromJson(base0()).createdAt, isA<DateTime>()),
    );
  });

  group('BookingItem.fromJson — defaults', () {
    final base = {
      'id': 'bk-1',
      'date': '2024-09-15T10:00:00Z',
      'clientName': 'Test',
      'clientEmail': 'test@test.com',
      'serviceId': 'srv-1',
      'createdAt': '2024-08-01T00:00:00Z',
      'updatedAt': '2024-08-01T00:00:00Z',
    };

    test(
      'status defaults to "PENDING"',
      () => expect(BookingItem.fromJson(base).status, 'PENDING'),
    );
    test(
      'endDate is null',
      () => expect(BookingItem.fromJson(base).endDate, isNull),
    );
    test(
      'clientPhone is null',
      () => expect(BookingItem.fromJson(base).clientPhone, isNull),
    );
    test(
      'guestCount is null',
      () => expect(BookingItem.fromJson(base).guestCount, isNull),
    );
    test(
      'totalAmount is null',
      () => expect(BookingItem.fromJson(base).totalAmount, isNull),
    );
    test(
      'paymentStatus is null',
      () => expect(BookingItem.fromJson(base).paymentStatus, isNull),
    );
    test(
      'service is null',
      () => expect(BookingItem.fromJson(base).service, isNull),
    );
  });

  group('BookingItem.fromJson — optional fields', () {
    Map<String, dynamic> full() => {
      'id': 'bk-2',
      'date': '2024-10-20T11:00:00Z',
      'endDate': '2024-10-20T13:00:00Z',
      'status': 'CONFIRMED',
      'clientName': 'Beatriz López',
      'clientEmail': 'bea@test.com',
      'clientPhone': '+34 699 999 999',
      'guestCount': 3,
      'totalAmount': '350.00',
      'paymentStatus': 'PAID',
      'serviceId': 'srv-2',
      'service': {'name': 'Maquillaje novia'},
      'createdAt': '2024-09-01T00:00:00Z',
      'updatedAt': '2024-09-10T00:00:00Z',
    };

    test(
      'parses status',
      () => expect(BookingItem.fromJson(full()).status, 'CONFIRMED'),
    );
    test(
      'parses endDate',
      () => expect(BookingItem.fromJson(full()).endDate, isA<DateTime>()),
    );
    test(
      'parses clientPhone',
      () => expect(BookingItem.fromJson(full()).clientPhone, '+34 699 999 999'),
    );
    test(
      'parses guestCount',
      () => expect(BookingItem.fromJson(full()).guestCount, 3),
    );
    test(
      'parses totalAmount',
      () => expect(BookingItem.fromJson(full()).totalAmount, '350.00'),
    );
    test(
      'parses paymentStatus',
      () => expect(BookingItem.fromJson(full()).paymentStatus, 'PAID'),
    );
    test(
      'parses service',
      () => expect(BookingItem.fromJson(full()).service, isNotNull),
    );
    test(
      'service name is correct',
      () => expect(
        BookingItem.fromJson(full()).service?.name,
        'Maquillaje novia',
      ),
    );
    test('date parsed correctly (year)', () {
      expect(BookingItem.fromJson(full()).date.year, 2024);
    });
    test('date parsed correctly (month)', () {
      expect(BookingItem.fromJson(full()).date.month, 10);
    });
  });

  group('BookingItem — equality and copyWith', () {
    final base = {
      'id': 'bk-1',
      'date': '2024-09-15T10:00:00Z',
      'clientName': 'Test',
      'clientEmail': 'test@test.com',
      'serviceId': 'srv-1',
      'createdAt': '2024-08-01T00:00:00Z',
      'updatedAt': '2024-08-01T00:00:00Z',
    };

    test('two equal instances', () {
      expect(BookingItem.fromJson(base), BookingItem.fromJson(base));
    });

    test('copyWith status', () {
      final b = BookingItem.fromJson(base);
      expect(b.copyWith(status: 'CONFIRMED').status, 'CONFIRMED');
    });

    test('copyWith paymentStatus', () {
      final b = BookingItem.fromJson(base);
      expect(b.copyWith(paymentStatus: 'PAID').paymentStatus, 'PAID');
    });
  });

  // ── BookingDetail fromJson ────────────────────────────────────────────────

  group('BookingDetail.fromJson — required fields', () {
    Map<String, dynamic> base0() => {
      'id': 'bd-1',
      'date': '2024-11-05T09:00:00Z',
      'clientName': 'Carmen Ruiz',
      'clientEmail': 'carmen@test.com',
      'serviceId': 'srv-3',
      'createdAt': '2024-10-01T00:00:00Z',
      'updatedAt': '2024-10-01T00:00:00Z',
    };

    test('parses id', () => expect(BookingDetail.fromJson(base0()).id, 'bd-1'));
    test(
      'parses clientName',
      () => expect(BookingDetail.fromJson(base0()).clientName, 'Carmen Ruiz'),
    );
    test(
      'parses serviceId',
      () => expect(BookingDetail.fromJson(base0()).serviceId, 'srv-3'),
    );
  });

  group('BookingDetail.fromJson — defaults', () {
    final base = {
      'id': 'bd-1',
      'date': '2024-11-05T09:00:00Z',
      'clientName': 'Test',
      'clientEmail': 'test@test.com',
      'serviceId': 'srv-1',
      'createdAt': '2024-10-01T00:00:00Z',
      'updatedAt': '2024-10-01T00:00:00Z',
    };

    test(
      'status defaults to "PENDING"',
      () => expect(BookingDetail.fromJson(base).status, 'PENDING'),
    );
    test(
      'guestCount defaults to 1',
      () => expect(BookingDetail.fromJson(base).guestCount, 1),
    );
    test(
      'reminderCount defaults to 0',
      () => expect(BookingDetail.fromJson(base).reminderCount, 0),
    );
    test(
      'feedbackSent defaults to false',
      () => expect(BookingDetail.fromJson(base).feedbackSent, isFalse),
    );
    test(
      'clientNotes is null',
      () => expect(BookingDetail.fromJson(base).clientNotes, isNull),
    );
    test(
      'adminNotes is null',
      () => expect(BookingDetail.fromJson(base).adminNotes, isNull),
    );
    test(
      'cancellationReason is null',
      () => expect(BookingDetail.fromJson(base).cancellationReason, isNull),
    );
    test(
      'paymentMethod is null',
      () => expect(BookingDetail.fromJson(base).paymentMethod, isNull),
    );
    test(
      'feedbackRating is null',
      () => expect(BookingDetail.fromJson(base).feedbackRating, isNull),
    );
    test(
      'feedbackText is null',
      () => expect(BookingDetail.fromJson(base).feedbackText, isNull),
    );
  });

  group('BookingDetail.fromJson — optional fields', () {
    Map<String, dynamic> full() => {
      'id': 'bd-2',
      'date': '2024-12-15T10:00:00Z',
      'status': 'COMPLETED',
      'clientName': 'Full Client',
      'clientEmail': 'full@test.com',
      'clientNotes': 'Sesión matutina',
      'guestCount': 2,
      'adminNotes': 'Cliente VIP',
      'cancellationReason': null,
      'totalAmount': '200.00',
      'paidAmount': '200.00',
      'paymentStatus': 'PAID',
      'paymentMethod': 'card',
      'paymentRef': 'STRIPE_REF_001',
      'feedbackSent': true,
      'feedbackRating': 5,
      'feedbackText': 'Excelente',
      'serviceId': 'srv-1',
      'createdAt': '2024-11-01T00:00:00Z',
      'updatedAt': '2024-12-16T00:00:00Z',
    };

    test(
      'parses clientNotes',
      () =>
          expect(BookingDetail.fromJson(full()).clientNotes, 'Sesión matutina'),
    );
    test(
      'parses adminNotes',
      () => expect(BookingDetail.fromJson(full()).adminNotes, 'Cliente VIP'),
    );
    test(
      'parses guestCount',
      () => expect(BookingDetail.fromJson(full()).guestCount, 2),
    );
    test(
      'parses totalAmount',
      () => expect(BookingDetail.fromJson(full()).totalAmount, '200.00'),
    );
    test(
      'parses paidAmount',
      () => expect(BookingDetail.fromJson(full()).paidAmount, '200.00'),
    );
    test(
      'parses paymentStatus',
      () => expect(BookingDetail.fromJson(full()).paymentStatus, 'PAID'),
    );
    test(
      'parses paymentMethod',
      () => expect(BookingDetail.fromJson(full()).paymentMethod, 'card'),
    );
    test(
      'parses paymentRef',
      () => expect(BookingDetail.fromJson(full()).paymentRef, 'STRIPE_REF_001'),
    );
    test(
      'parses feedbackSent = true',
      () => expect(BookingDetail.fromJson(full()).feedbackSent, isTrue),
    );
    test(
      'parses feedbackRating',
      () => expect(BookingDetail.fromJson(full()).feedbackRating, 5),
    );
    test(
      'parses feedbackText',
      () => expect(BookingDetail.fromJson(full()).feedbackText, 'Excelente'),
    );
    test(
      'status is COMPLETED',
      () => expect(BookingDetail.fromJson(full()).status, 'COMPLETED'),
    );
  });

  // ── BookingService ────────────────────────────────────────────────────────

  group('BookingService.fromJson', () {
    test('parses name', () {
      expect(
        BookingService.fromJson({'name': 'Maquillaje novia'}).name,
        'Maquillaje novia',
      );
    });
    test('parses empty name', () {
      expect(BookingService.fromJson({'name': ''}).name, '');
    });
    test('two equal services', () {
      expect(
        BookingService.fromJson({'name': 'Test'}),
        BookingService.fromJson({'name': 'Test'}),
      );
    });
    test('copyWith name', () {
      const s = BookingService(name: 'Original');
      expect(s.copyWith(name: 'Updated').name, 'Updated');
    });
  });
}
