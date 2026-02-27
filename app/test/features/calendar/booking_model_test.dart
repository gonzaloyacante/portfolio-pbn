import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/calendar/data/booking_model.dart';

void main() {
  // ── BookingService ──────────────────────────────────────────────────────────

  group('BookingService — construction', () {
    test('creates with required name', () {
      const s = BookingService(name: 'Sesión de fotos');
      expect(s.name, 'Sesión de fotos');
    });

    test('two identical instances are equal (Freezed)', () {
      const a = BookingService(name: 'Retrato');
      const b = BookingService(name: 'Retrato');
      expect(a, equals(b));
    });

    test('instances with different names are not equal', () {
      const a = BookingService(name: 'A');
      const b = BookingService(name: 'B');
      expect(a, isNot(equals(b)));
    });

    test('copyWith updates name', () {
      const s = BookingService(name: 'Original');
      final updated = s.copyWith(name: 'Actualizado');
      expect(updated.name, 'Actualizado');
    });

    test('copyWith preserves unchanged fields', () {
      const s = BookingService(name: 'Nombre');
      final updated = s.copyWith();
      expect(updated.name, 'Nombre');
    });
  });

  // ── BookingItem ─────────────────────────────────────────────────────────────

  final testDate = DateTime(2026, 3, 15, 10, 0);
  final testCreated = DateTime(2026, 1, 1);

  group('BookingItem — construction', () {
    test('creates with all required fields', () {
      final item = BookingItem(
        id: 'booking-1',
        date: testDate,
        clientName: 'Ana García',
        clientEmail: 'ana@example.com',
        serviceId: 'svc-1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      expect(item.id, 'booking-1');
      expect(item.clientName, 'Ana García');
      expect(item.clientEmail, 'ana@example.com');
      expect(item.serviceId, 'svc-1');
    });

    test('status defaults to PENDING', () {
      final item = BookingItem(
        id: 'b1',
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      expect(item.status, 'PENDING');
    });

    test('optional fields default to null', () {
      final item = BookingItem(
        id: 'b1',
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      expect(item.endDate, isNull);
      expect(item.clientPhone, isNull);
      expect(item.guestCount, isNull);
      expect(item.totalAmount, isNull);
      expect(item.paymentStatus, isNull);
      expect(item.service, isNull);
    });

    test('stores optional fields when provided', () {
      final endDate = DateTime(2026, 3, 15, 12, 0);
      const service = BookingService(name: 'Retrato');
      final item = BookingItem(
        id: 'b2',
        date: testDate,
        endDate: endDate,
        clientName: 'Laura',
        clientEmail: 'laura@example.com',
        clientPhone: '+34 600 123 456',
        status: 'CONFIRMED',
        guestCount: 2,
        totalAmount: '150.00',
        paymentStatus: 'PAID',
        serviceId: 's2',
        service: service,
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      expect(item.endDate, endDate);
      expect(item.clientPhone, '+34 600 123 456');
      expect(item.status, 'CONFIRMED');
      expect(item.guestCount, 2);
      expect(item.totalAmount, '150.00');
      expect(item.paymentStatus, 'PAID');
      expect(item.service?.name, 'Retrato');
    });

    test('two identical instances are equal (Freezed)', () {
      final a = BookingItem(
        id: 'b1',
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      final b = BookingItem(
        id: 'b1',
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      expect(a, equals(b));
    });

    test('copyWith updates status', () {
      final item = BookingItem(
        id: 'b1',
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      final updated = item.copyWith(status: 'CONFIRMED');
      expect(updated.status, 'CONFIRMED');
      expect(updated.id, 'b1');
    });
  });

  // ── BookingDetail ───────────────────────────────────────────────────────────

  group('BookingDetail — construction', () {
    test('creates with all required fields', () {
      final detail = BookingDetail(
        id: 'detail-1',
        date: testDate,
        clientName: 'María López',
        clientEmail: 'maria@example.com',
        serviceId: 'svc-2',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      expect(detail.id, 'detail-1');
      expect(detail.clientName, 'María López');
    });

    test('status defaults to PENDING', () {
      final detail = BookingDetail(
        id: 'd1',
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      expect(detail.status, 'PENDING');
    });

    test('guestCount defaults to 1', () {
      final detail = BookingDetail(
        id: 'd1',
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      expect(detail.guestCount, 1);
    });

    test('reminderCount defaults to 0', () {
      final detail = BookingDetail(
        id: 'd1',
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      expect(detail.reminderCount, 0);
    });

    test('feedbackSent defaults to false', () {
      final detail = BookingDetail(
        id: 'd1',
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      expect(detail.feedbackSent, false);
    });

    test('optional audit fields default to null', () {
      final detail = BookingDetail(
        id: 'd1',
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      expect(detail.confirmedAt, isNull);
      expect(detail.confirmedBy, isNull);
      expect(detail.cancelledAt, isNull);
      expect(detail.cancelledBy, isNull);
      expect(detail.cancellationReason, isNull);
      expect(detail.paymentRef, isNull);
      expect(detail.feedbackRating, isNull);
      expect(detail.feedbackText, isNull);
    });

    test('two identical instances are equal (Freezed)', () {
      final a = BookingDetail(
        id: 'd1',
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      final b = BookingDetail(
        id: 'd1',
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      expect(a, equals(b));
    });

    test('copyWith updates adminNotes', () {
      final detail = BookingDetail(
        id: 'd1',
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
        createdAt: testCreated,
        updatedAt: testCreated,
      );
      final updated = detail.copyWith(adminNotes: 'Recordar traer equipo');
      expect(updated.adminNotes, 'Recordar traer equipo');
      expect(updated.id, 'd1');
    });
  });

  // ── BookingFormData ─────────────────────────────────────────────────────────

  group('BookingFormData — construction', () {
    test('creates with all required fields', () {
      final form = BookingFormData(
        date: testDate,
        clientName: 'Carlos',
        clientEmail: 'carlos@example.com',
        serviceId: 'svc-1',
      );
      expect(form.date, testDate);
      expect(form.clientName, 'Carlos');
      expect(form.clientEmail, 'carlos@example.com');
      expect(form.serviceId, 'svc-1');
    });

    test('guestCount defaults to 1', () {
      final form = BookingFormData(
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
      );
      expect(form.guestCount, 1);
    });

    test('status defaults to PENDING', () {
      final form = BookingFormData(
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
      );
      expect(form.status, 'PENDING');
    });

    test('optional fields default to null', () {
      final form = BookingFormData(
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
      );
      expect(form.endDate, isNull);
      expect(form.clientPhone, isNull);
      expect(form.clientNotes, isNull);
      expect(form.adminNotes, isNull);
      expect(form.totalAmount, isNull);
      expect(form.paymentMethod, isNull);
    });
  });

  group('BookingFormData — toJson', () {
    test('includes all required fields', () {
      final form = BookingFormData(
        date: testDate,
        clientName: 'Carlos',
        clientEmail: 'carlos@example.com',
        serviceId: 'svc-1',
      );
      final json = form.toJson();
      expect(json['date'], testDate.toIso8601String());
      expect(json['clientName'], 'Carlos');
      expect(json['clientEmail'], 'carlos@example.com');
      expect(json['serviceId'], 'svc-1');
      expect(json['guestCount'], 1);
      expect(json['status'], 'PENDING');
    });

    test('excludes null optional fields from toJson', () {
      final form = BookingFormData(
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
      );
      final json = form.toJson();
      expect(json.containsKey('endDate'), false);
      expect(json.containsKey('clientPhone'), false);
      expect(json.containsKey('clientNotes'), false);
      expect(json.containsKey('adminNotes'), false);
      expect(json.containsKey('totalAmount'), false);
      expect(json.containsKey('paymentMethod'), false);
    });

    test('includes optional fields when provided in toJson', () {
      final endDate = DateTime(2026, 3, 15, 12, 0);
      final form = BookingFormData(
        date: testDate,
        endDate: endDate,
        clientName: 'Laura',
        clientEmail: 'laura@example.com',
        clientPhone: '+34 600 000 001',
        clientNotes: 'Exterior',
        guestCount: 3,
        serviceId: 'svc-3',
        adminNotes: 'Llevar trípode',
        status: 'CONFIRMED',
        totalAmount: '200.00',
        paymentMethod: 'CARD',
      );
      final json = form.toJson();
      expect(json['endDate'], endDate.toIso8601String());
      expect(json['clientPhone'], '+34 600 000 001');
      expect(json['clientNotes'], 'Exterior');
      expect(json['guestCount'], 3);
      expect(json['adminNotes'], 'Llevar trípode');
      expect(json['status'], 'CONFIRMED');
      expect(json['totalAmount'], '200.00');
      expect(json['paymentMethod'], 'CARD');
    });

    test('toJson returns a Map', () {
      final form = BookingFormData(
        date: testDate,
        clientName: 'X',
        clientEmail: 'x@x.com',
        serviceId: 's1',
      );
      expect(form.toJson(), isA<Map<String, dynamic>>());
    });
  });
}
