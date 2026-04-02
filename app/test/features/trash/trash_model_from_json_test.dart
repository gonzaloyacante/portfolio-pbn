import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/trash/data/trash_model.dart';

void main() {
  // ── TrashItem.fromMap ─────────────────────────────────────────────────────

  group('TrashItem.fromMap — using title field', () {
    Map<String, dynamic> category() => {
      'id': 'cat-1',
      'title': 'Wedding Shoot',
      'deletedAt': '2024-06-01T10:00:00Z',
    };

    test(
      'parses id',
      () => expect(TrashItem.fromMap('category', category()).id, 'cat-1'),
    );
    test(
      'parses type',
      () => expect(TrashItem.fromMap('category', category()).type, 'category'),
    );
    test(
      'displayName uses title',
      () => expect(
        TrashItem.fromMap('category', category()).displayName,
        'Wedding Shoot',
      ),
    );
    test(
      'deletedAt is DateTime',
      () => expect(
        TrashItem.fromMap('category', category()).deletedAt,
        isA<DateTime>(),
      ),
    );
    test('deletedAt parsed correctly', () {
      expect(TrashItem.fromMap('category', category()).deletedAt.year, 2024);
      expect(TrashItem.fromMap('category', category()).deletedAt.month, 6);
      expect(TrashItem.fromMap('category', category()).deletedAt.day, 1);
    });
  });

  group('TrashItem.fromMap — using name field', () {
    Map<String, dynamic> service() => {
      'id': 'srv-2',
      'name': 'Maquillaje novias',
      'deletedAt': '2024-07-15T08:30:00Z',
    };

    test('displayName uses name when no title', () {
      expect(
        TrashItem.fromMap('service', service()).displayName,
        'Maquillaje novias',
      );
    });
    test(
      'type is service',
      () => expect(TrashItem.fromMap('service', service()).type, 'service'),
    );
  });

  group('TrashItem.fromMap — using clientName field', () {
    Map<String, dynamic> booking() => {
      'id': 'bk-3',
      'clientName': 'Ana Martínez',
      'deletedAt': '2024-08-20T14:00:00Z',
    };

    test('displayName uses clientName', () {
      expect(
        TrashItem.fromMap('booking', booking()).displayName,
        'Ana Martínez',
      );
    });
    test(
      'type is booking',
      () => expect(TrashItem.fromMap('booking', booking()).type, 'booking'),
    );
  });

  group('TrashItem.fromMap — fallback to (sin nombre)', () {
    Map<String, dynamic> empty() => {
      'id': 'x-1',
      'deletedAt': '2024-09-01T00:00:00Z',
    };

    test('displayName fallback is "(sin nombre)"', () {
      expect(TrashItem.fromMap('contact', empty()).displayName, '(sin nombre)');
    });
    test(
      'id is parsed',
      () => expect(TrashItem.fromMap('contact', empty()).id, 'x-1'),
    );
  });

  group('TrashItem.fromMap — title takes priority over name', () {
    final both = {
      'id': 'dup-1',
      'title': 'Title Wins',
      'name': 'Name Loses',
      'deletedAt': '2024-09-05T00:00:00Z',
    };

    test('title takes priority over name', () {
      expect(TrashItem.fromMap('category', both).displayName, 'Title Wins');
    });
  });

  // ── TrashItem — equality and copyWith ─────────────────────────────────────

  group('TrashItem — equality', () {
    final json = {
      'id': 'e1',
      'name': 'Equal',
      'deletedAt': '2024-01-01T00:00:00Z',
    };

    test('same fromMap data is equal', () {
      expect(
        TrashItem.fromMap('service', json),
        TrashItem.fromMap('service', json),
      );
    });

    test('different id not equal', () {
      final a = TrashItem.fromMap('service', {
        'id': 'a',
        'name': 'Test',
        'deletedAt': '2024-01-01T00:00:00Z',
      });
      final b = TrashItem.fromMap('service', {
        'id': 'b',
        'name': 'Test',
        'deletedAt': '2024-01-01T00:00:00Z',
      });
      expect(a, isNot(b));
    });
  });

  group('TrashItem — copyWith', () {
    final base = TrashItem.fromMap('category', {
      'id': 'cp-1',
      'title': 'Original',
      'deletedAt': '2024-01-01T00:00:00Z',
    });

    test('copyWith type changes type', () {
      expect(base.copyWith(type: 'service').type, 'service');
    });

    test('copyWith displayName changes displayName', () {
      expect(base.copyWith(displayName: 'Updated').displayName, 'Updated');
    });

    test('original unchanged after copyWith', () {
      final _ = base.copyWith(type: 'other');
      expect(base.type, 'category');
    });
  });

  // ── trashTypeLabel ────────────────────────────────────────────────────────

  group('trashTypeLabel', () {
    test(
      'category → "Categoría"',
      () => expect(trashTypeLabel('category'), 'Categoría'),
    );
    test(
      'service → "Servicio"',
      () => expect(trashTypeLabel('service'), 'Servicio'),
    );
    test(
      'testimonial → "Testimonio"',
      () => expect(trashTypeLabel('testimonial'), 'Testimonio'),
    );
    test(
      'contact → "Contacto"',
      () => expect(trashTypeLabel('contact'), 'Contacto'),
    );
    test(
      'booking → "Reserva"',
      () => expect(trashTypeLabel('booking'), 'Reserva'),
    );
    test(
      'unknown type returns itself',
      () => expect(trashTypeLabel('unknown'), 'unknown'),
    );
    test('empty string returns empty', () => expect(trashTypeLabel(''), ''));
    test(
      'uppercase unknown returns itself',
      () => expect(trashTypeLabel('UNKNOWN_TYPE'), 'UNKNOWN_TYPE'),
    );
  });
}
