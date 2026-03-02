import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/models/paginated_response.dart';

void main() {
  // ── PaginationMeta ──────────────────────────────────────────────────────

  group('PaginationMeta — construction', () {
    const meta = PaginationMeta(page: 1, limit: 10, total: 50, totalPages: 5);

    test('stores page', () => expect(meta.page, 1));
    test('stores limit', () => expect(meta.limit, 10));
    test('stores total', () => expect(meta.total, 50));
    test('stores totalPages', () => expect(meta.totalPages, 5));
    test('hasNext defaults to false', () => expect(meta.hasNext, false));
    test('hasPrev defaults to false', () => expect(meta.hasPrev, false));
  });

  group('PaginationMeta — with next/prev', () {
    test('hasNext can be true', () {
      const m = PaginationMeta(
        page: 1,
        limit: 10,
        total: 30,
        totalPages: 3,
        hasNext: true,
      );
      expect(m.hasNext, true);
    });

    test('hasPrev can be true', () {
      const m = PaginationMeta(
        page: 2,
        limit: 10,
        total: 30,
        totalPages: 3,
        hasPrev: true,
      );
      expect(m.hasPrev, true);
    });

    test('page 2 of 3 has both hasNext and hasPrev', () {
      const m = PaginationMeta(
        page: 2,
        limit: 10,
        total: 30,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      );
      expect(m.hasNext, true);
      expect(m.hasPrev, true);
    });
  });

  group('PaginationMeta — equality (Freezed)', () {
    test('same values are equal', () {
      const m1 = PaginationMeta(page: 1, limit: 10, total: 50, totalPages: 5);
      const m2 = PaginationMeta(page: 1, limit: 10, total: 50, totalPages: 5);
      expect(m1, equals(m2));
    });

    test('different page makes them not equal', () {
      const m1 = PaginationMeta(page: 1, limit: 10, total: 50, totalPages: 5);
      const m2 = PaginationMeta(page: 2, limit: 10, total: 50, totalPages: 5);
      expect(m1, isNot(equals(m2)));
    });
  });

  group('PaginationMeta — copyWith', () {
    test('copyWith updates page', () {
      const m = PaginationMeta(page: 1, limit: 10, total: 50, totalPages: 5);
      final updated = m.copyWith(page: 2, hasPrev: true);
      expect(updated.page, 2);
      expect(updated.hasPrev, true);
      expect(updated.limit, 10);
    });
  });

  // ── PaginationParams ────────────────────────────────────────────────────

  group('PaginationParams — defaults', () {
    test('default page is 1', () {
      const p = PaginationParams();
      expect(p.page, 1);
    });

    test('default limit is 10', () {
      const p = PaginationParams();
      expect(p.limit, 10);
    });
  });

  group('PaginationParams — custom values', () {
    test('custom page and limit', () {
      const p = PaginationParams(page: 3, limit: 20);
      expect(p.page, 3);
      expect(p.limit, 20);
    });
  });

  group('PaginationParams.toQueryParams', () {
    test('returns map with page and limit as strings', () {
      const p = PaginationParams(page: 2, limit: 15);
      final q = p.toQueryParams();
      expect(q['page'], '2');
      expect(q['limit'], '15');
    });

    test('default params produce page=1 limit=10', () {
      const p = PaginationParams();
      final q = p.toQueryParams();
      expect(q['page'], '1');
      expect(q['limit'], '10');
    });

    test('returns exactly 2 keys', () {
      const p = PaginationParams();
      expect(p.toQueryParams().length, 2);
    });
  });

  // ── PaginatedResponse ───────────────────────────────────────────────────

  group('PaginatedResponse — construction', () {
    const meta = PaginationMeta(page: 1, limit: 10, total: 2, totalPages: 1);

    test('stores data list', () {
      const r = PaginatedResponse<String>(data: ['a', 'b'], pagination: meta);
      expect(r.data, ['a', 'b']);
    });

    test('stores pagination meta', () {
      const r = PaginatedResponse<String>(data: [], pagination: meta);
      expect(r.pagination, meta);
    });

    test('empty data is valid', () {
      const r = PaginatedResponse<int>(data: [], pagination: meta);
      expect(r.data, isEmpty);
    });
  });

  group('PaginatedResponse — equality (Freezed)', () {
    const meta = PaginationMeta(page: 1, limit: 10, total: 1, totalPages: 1);

    test('same instances are equal', () {
      const r1 = PaginatedResponse<String>(data: ['x'], pagination: meta);
      const r2 = PaginatedResponse<String>(data: ['x'], pagination: meta);
      expect(r1, equals(r2));
    });

    test('different data makes them not equal', () {
      const r1 = PaginatedResponse<String>(data: ['x'], pagination: meta);
      const r2 = PaginatedResponse<String>(data: ['y'], pagination: meta);
      expect(r1, isNot(equals(r2)));
    });
  });
}
