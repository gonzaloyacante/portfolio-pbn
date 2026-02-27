import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/trash/data/trash_model.dart';

void main() {
  // ── TrashItem ───────────────────────────────────────────────────────────

  group('TrashItem — construction', () {
    final deletedAt = DateTime(2024, 6, 15, 12, 0);
    final item = TrashItem(
      id: 'tr1',
      type: 'project',
      displayName: 'Mi Proyecto',
      deletedAt: deletedAt,
    );

    test('stores id', () => expect(item.id, 'tr1'));
    test('stores type', () => expect(item.type, 'project'));
    test('stores displayName', () => expect(item.displayName, 'Mi Proyecto'));
    test('stores deletedAt', () => expect(item.deletedAt, deletedAt));
  });

  group('TrashItem — fromMap with title', () {
    final json = {
      'id': 'p1',
      'title': 'Retrato 2024',
      'deletedAt': '2024-06-01T10:00:00.000Z',
    };

    test('uses title as displayName', () {
      final item = TrashItem.fromMap('project', json);
      expect(item.displayName, 'Retrato 2024');
    });

    test('stores correct type', () {
      final item = TrashItem.fromMap('project', json);
      expect(item.type, 'project');
    });

    test('stores correct id', () {
      final item = TrashItem.fromMap('project', json);
      expect(item.id, 'p1');
    });

    test('parses deletedAt', () {
      final item = TrashItem.fromMap('project', json);
      expect(item.deletedAt.year, 2024);
      expect(item.deletedAt.month, 6);
    });
  });

  group('TrashItem — fromMap with name', () {
    final json = {
      'id': 'c1',
      'name': 'Fotografía',
      'deletedAt': '2024-05-10T08:00:00.000Z',
    };

    test('uses name as displayName when title is absent', () {
      final item = TrashItem.fromMap('category', json);
      expect(item.displayName, 'Fotografía');
    });
  });

  group('TrashItem — fromMap with clientName', () {
    final json = {
      'id': 'b1',
      'clientName': 'María López',
      'deletedAt': '2024-04-20T09:00:00.000Z',
    };

    test('uses clientName as displayName', () {
      final item = TrashItem.fromMap('booking', json);
      expect(item.displayName, 'María López');
    });
  });

  group('TrashItem — fromMap fallback', () {
    final json = {'id': 'x1', 'deletedAt': '2024-03-01T00:00:00.000Z'};

    test('falls back to (sin nombre) when no name field present', () {
      final item = TrashItem.fromMap('unknown', json);
      expect(item.displayName, '(sin nombre)');
    });
  });

  group('TrashItem — equality (Freezed)', () {
    final deleted = DateTime(2024, 1, 1);

    test('same values are equal', () {
      final a = TrashItem(
        id: 't1',
        type: 'project',
        displayName: 'P',
        deletedAt: deleted,
      );
      final b = TrashItem(
        id: 't1',
        type: 'project',
        displayName: 'P',
        deletedAt: deleted,
      );
      expect(a, equals(b));
    });

    test('different id makes not equal', () {
      final a = TrashItem(
        id: 't1',
        type: 'project',
        displayName: 'P',
        deletedAt: deleted,
      );
      final b = TrashItem(
        id: 't2',
        type: 'project',
        displayName: 'P',
        deletedAt: deleted,
      );
      expect(a, isNot(equals(b)));
    });
  });

  // ── trashTypeLabel ──────────────────────────────────────────────────────

  group('trashTypeLabel', () {
    test(
      'project → Proyecto',
      () => expect(trashTypeLabel('project'), 'Proyecto'),
    );
    test(
      'category → Categoría',
      () => expect(trashTypeLabel('category'), 'Categoría'),
    );
    test(
      'service → Servicio',
      () => expect(trashTypeLabel('service'), 'Servicio'),
    );
    test(
      'testimonial → Testimonio',
      () => expect(trashTypeLabel('testimonial'), 'Testimonio'),
    );
    test(
      'contact → Contacto',
      () => expect(trashTypeLabel('contact'), 'Contacto'),
    );
    test(
      'booking → Reserva',
      () => expect(trashTypeLabel('booking'), 'Reserva'),
    );
    test(
      'unknown type returns the type itself',
      () => expect(trashTypeLabel('xyz'), 'xyz'),
    );
    test(
      'empty string returns empty string',
      () => expect(trashTypeLabel(''), ''),
    );
  });
}
