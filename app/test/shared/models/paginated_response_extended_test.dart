import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/models/paginated_response.dart';

void main() {
  // ── PaginationMeta.fromJson ───────────────────────────────────────────────

  group('PaginationMeta.fromJson — required fields', () {
    Map<String, dynamic> _meta({
      int page = 1,
      int limit = 10,
      int total = 50,
      int totalPages = 5,
    }) =>
        {'page': page, 'limit': limit, 'total': total, 'totalPages': totalPages};

    test('parses page', () => expect(PaginationMeta.fromJson(_meta()).page, 1));
    test('parses limit', () => expect(PaginationMeta.fromJson(_meta()).limit, 10));
    test('parses total', () => expect(PaginationMeta.fromJson(_meta()).total, 50));
    test('parses totalPages', () => expect(PaginationMeta.fromJson(_meta()).totalPages, 5));
    test('hasNext defaults false', () => expect(PaginationMeta.fromJson(_meta()).hasNext, isFalse));
    test('hasPrev defaults false', () => expect(PaginationMeta.fromJson(_meta()).hasPrev, isFalse));
  });

  group('PaginationMeta.fromJson — optional flags', () {
    test('hasNext=true parses', () {
      expect(
        PaginationMeta.fromJson({'page': 2, 'limit': 10, 'total': 30, 'totalPages': 3, 'hasNext': true}).hasNext,
        isTrue,
      );
    });
    test('hasPrev=true parses', () {
      expect(
        PaginationMeta.fromJson({'page': 2, 'limit': 10, 'total': 30, 'totalPages': 3, 'hasPrev': true}).hasPrev,
        isTrue,
      );
    });
    test('both flags true on middle page', () {
      final m = PaginationMeta.fromJson({
        'page': 3,
        'limit': 10,
        'total': 60,
        'totalPages': 6,
        'hasNext': true,
        'hasPrev': true,
      });
      expect(m.hasNext, isTrue);
      expect(m.hasPrev, isTrue);
    });
  });

  group('PaginationMeta.fromJson — page values', () {
    test('page=1 first page', () {
      final m = PaginationMeta.fromJson({'page': 1, 'limit': 10, 'total': 100, 'totalPages': 10});
      expect(m.page, 1);
    });
    test('last page', () {
      final m = PaginationMeta.fromJson({'page': 5, 'limit': 10, 'total': 50, 'totalPages': 5});
      expect(m.page, 5);
    });
    test('limit=5 small page', () {
      final m = PaginationMeta.fromJson({'page': 1, 'limit': 5, 'total': 25, 'totalPages': 5});
      expect(m.limit, 5);
    });
    test('limit=100 big page', () {
      final m = PaginationMeta.fromJson({'page': 1, 'limit': 100, 'total': 300, 'totalPages': 3});
      expect(m.limit, 100);
    });
    test('total=0 empty result', () {
      final m = PaginationMeta.fromJson({'page': 1, 'limit': 10, 'total': 0, 'totalPages': 0});
      expect(m.total, 0);
    });
    test('totalPages=1 single page', () {
      final m = PaginationMeta.fromJson({'page': 1, 'limit': 10, 'total': 5, 'totalPages': 1});
      expect(m.totalPages, 1);
    });
  });

  group('PaginationMeta — equality', () {
    test('same values are equal', () {
      final a = PaginationMeta.fromJson({'page': 1, 'limit': 10, 'total': 100, 'totalPages': 10});
      final b = PaginationMeta.fromJson({'page': 1, 'limit': 10, 'total': 100, 'totalPages': 10});
      expect(a, b);
    });
    test('different page not equal', () {
      final a = PaginationMeta.fromJson({'page': 1, 'limit': 10, 'total': 100, 'totalPages': 10});
      final b = PaginationMeta.fromJson({'page': 2, 'limit': 10, 'total': 100, 'totalPages': 10});
      expect(a, isNot(b));
    });
  });

  group('PaginationMeta — copyWith', () {
    final base = PaginationMeta.fromJson({'page': 1, 'limit': 10, 'total': 100, 'totalPages': 10});

    test('copyWith page', () => expect(base.copyWith(page: 2).page, 2));
    test('copyWith limit', () => expect(base.copyWith(limit: 20).limit, 20));
    test('copyWith total', () => expect(base.copyWith(total: 200).total, 200));
    test('copyWith hasNext', () => expect(base.copyWith(hasNext: true).hasNext, isTrue));
    test('copyWith hasPrev', () => expect(base.copyWith(hasPrev: true).hasPrev, isTrue));
    test('original unchanged after copyWith', () {
      base.copyWith(page: 99);
      expect(base.page, 1);
    });
  });

  group('PaginationMeta.toJson', () {
    final m = PaginationMeta.fromJson({'page': 2, 'limit': 15, 'total': 75, 'totalPages': 5});

    test('page round-trips', () => expect(m.toJson()['page'], 2));
    test('limit round-trips', () => expect(m.toJson()['limit'], 15));
    test('total round-trips', () => expect(m.toJson()['total'], 75));
    test('totalPages round-trips', () => expect(m.toJson()['totalPages'], 5));
  });

  // ── PaginatedResponse<String> ─────────────────────────────────────────────

  group('PaginatedResponse<String>.fromJson', () {
    Map<String, dynamic> _resp(List<String> items) => {
          'data': items,
          'pagination': {'page': 1, 'limit': 10, 'total': items.length, 'totalPages': 1},
        };

    test('parses data list', () {
      final r = PaginatedResponse<String>.fromJson(_resp(['a', 'b', 'c']), (e) => e as String);
      expect(r.data, ['a', 'b', 'c']);
    });
    test('parses empty data', () {
      final r = PaginatedResponse<String>.fromJson(_resp([]), (e) => e as String);
      expect(r.data, isEmpty);
    });
    test('parses pagination', () {
      final r = PaginatedResponse<String>.fromJson(_resp(['x']), (e) => e as String);
      expect(r.pagination.total, 1);
    });
  });

  group('PaginatedResponse<int>.fromJson', () {
    test('parses int list', () {
      final r = PaginatedResponse<int>.fromJson(
        {
          'data': [1, 2, 3, 4, 5],
          'pagination': {'page': 1, 'limit': 5, 'total': 5, 'totalPages': 1},
        },
        (e) => e as int,
      );
      expect(r.data, [1, 2, 3, 4, 5]);
      expect(r.data.length, 5);
    });
  });

  group('PaginatedResponse<Map>.fromJson', () {
    test('parses map list', () {
      final r = PaginatedResponse<Map>.fromJson(
        {
          'data': [
            {'id': '1', 'name': 'Alice'},
            {'id': '2', 'name': 'Bob'},
          ],
          'pagination': {'page': 1, 'limit': 10, 'total': 2, 'totalPages': 1},
        },
        (e) => e as Map,
      );
      expect(r.data.length, 2);
      expect(r.data.first['name'], 'Alice');
    });
  });

  // ── PaginationParams ──────────────────────────────────────────────────────

  group('PaginationParams', () {
    test('default page=1, limit=10', () {
      const p = PaginationParams();
      expect(p.page, 1);
      expect(p.limit, 10);
    });
    test('custom values', () {
      const p = PaginationParams(page: 3, limit: 25);
      expect(p.page, 3);
      expect(p.limit, 25);
    });
    test('toQueryParams page', () {
      const p = PaginationParams(page: 2, limit: 20);
      expect(p.toQueryParams()['page'], '2');
    });
    test('toQueryParams limit', () {
      const p = PaginationParams(page: 2, limit: 20);
      expect(p.toQueryParams()['limit'], '20');
    });
    test('toQueryParams default values', () {
      const p = PaginationParams();
      expect(p.toQueryParams(), {'page': '1', 'limit': '10'});
    });
    test('page=1 first page', () {
      const p = PaginationParams(page: 1);
      expect(p.toQueryParams()['page'], '1');
    });
    test('large page number', () {
      const p = PaginationParams(page: 999, limit: 5);
      expect(p.toQueryParams()['page'], '999');
    });
    test('limit=1 single item per page', () {
      const p = PaginationParams(page: 1, limit: 1);
      expect(p.toQueryParams()['limit'], '1');
    });
    test('limit=100 max items', () {
      const p = PaginationParams(page: 1, limit: 100);
      expect(p.toQueryParams()['limit'], '100');
    });
  });
}
