import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/dashboard/data/dashboard_repository.dart';

void main() {
  // ── DashboardStats fromJson ───────────────────────────────────────────────

  group('DashboardStats.fromJson — defaults', () {
    test('empty json gives all zeros', () {
      final s = DashboardStats.fromJson({});
      expect(s.totalProjects, 0);
      expect(s.totalCategories, 0);
      expect(s.totalServices, 0);
      expect(s.totalTestimonials, 0);
      expect(s.newContacts, 0);
      expect(s.pendingBookings, 0);
      expect(s.pageViews30d, 0);
    });
  });

  group('DashboardStats.fromJson — full data', () {
    Map<String, dynamic> full() => {
      'totalProjects': 25,
      'totalCategories': 8,
      'totalServices': 12,
      'totalTestimonials': 50,
      'newContacts': 7,
      'pendingBookings': 3,
      'pageViews30d': 1500,
    };

    test(
      'parses totalProjects',
      () => expect(DashboardStats.fromJson(full()).totalProjects, 25),
    );
    test(
      'parses totalCategories',
      () => expect(DashboardStats.fromJson(full()).totalCategories, 8),
    );
    test(
      'parses totalServices',
      () => expect(DashboardStats.fromJson(full()).totalServices, 12),
    );
    test(
      'parses totalTestimonials',
      () => expect(DashboardStats.fromJson(full()).totalTestimonials, 50),
    );
    test(
      'parses newContacts',
      () => expect(DashboardStats.fromJson(full()).newContacts, 7),
    );
    test(
      'parses pendingBookings',
      () => expect(DashboardStats.fromJson(full()).pendingBookings, 3),
    );
    test(
      'parses pageViews30d',
      () => expect(DashboardStats.fromJson(full()).pageViews30d, 1500),
    );
  });

  group('DashboardStats — equality and copyWith', () {
    test('two empty stats are equal', () {
      expect(DashboardStats.fromJson({}), DashboardStats.fromJson({}));
    });

    test('copyWith totalProjects', () {
      final s = DashboardStats.fromJson({});
      expect(s.copyWith(totalProjects: 10).totalProjects, 10);
    });

    test('copyWith newContacts', () {
      final s = DashboardStats.fromJson({});
      expect(s.copyWith(newContacts: 5).newContacts, 5);
    });

    test('copyWith leaves other fields unchanged', () {
      final s = DashboardStats.fromJson({
        'totalProjects': 5,
        'totalServices': 3,
      });
      final updated = s.copyWith(newContacts: 2);
      expect(updated.totalProjects, 5);
      expect(updated.totalServices, 3);
    });

    test('different values not equal', () {
      final a = DashboardStats.fromJson({'totalProjects': 1});
      final b = DashboardStats.fromJson({'totalProjects': 2});
      expect(a, isNot(b));
    });
  });

  group('DashboardStats.toJson', () {
    test('toJson has totalProjects key', () {
      final j = DashboardStats.fromJson({'totalProjects': 5}).toJson();
      expect(j['totalProjects'], 5);
    });
    test('toJson round-trips totalCategories', () {
      final j = DashboardStats.fromJson({'totalCategories': 3}).toJson();
      expect(j['totalCategories'], 3);
    });
    test('all keys present in toJson', () {
      final j = DashboardStats.fromJson({}).toJson();
      expect(j.containsKey('totalProjects'), isTrue);
      expect(j.containsKey('newContacts'), isTrue);
      expect(j.containsKey('pendingBookings'), isTrue);
    });
  });

  // ── ChartDataPoint fromJson ───────────────────────────────────────────────

  group('ChartDataPoint.fromJson — required fields', () {
    test('parses label', () {
      expect(
        ChartDataPoint.fromJson({'label': 'Jan', 'count': 10}).label,
        'Jan',
      );
    });
    test('parses count', () {
      expect(ChartDataPoint.fromJson({'label': 'Feb', 'count': 25}).count, 25);
    });
    test('label can be Spanish month', () {
      expect(
        ChartDataPoint.fromJson({'label': 'Enero', 'count': 5}).label,
        'Enero',
      );
    });
    test('count can be zero', () {
      expect(ChartDataPoint.fromJson({'label': 'Mar', 'count': 0}).count, 0);
    });
    test('count can be large', () {
      expect(
        ChartDataPoint.fromJson({'label': 'Big', 'count': 99999}).count,
        99999,
      );
    });
  });

  group('ChartDataPoint — equality and copyWith', () {
    test('same values are equal', () {
      expect(
        ChartDataPoint.fromJson({'label': 'A', 'count': 1}),
        ChartDataPoint.fromJson({'label': 'A', 'count': 1}),
      );
    });
    test('different label not equal', () {
      expect(
        ChartDataPoint.fromJson({'label': 'A', 'count': 1}),
        isNot(ChartDataPoint.fromJson({'label': 'B', 'count': 1})),
      );
    });
    test('different count not equal', () {
      expect(
        ChartDataPoint.fromJson({'label': 'A', 'count': 1}),
        isNot(ChartDataPoint.fromJson({'label': 'A', 'count': 2})),
      );
    });
    test('copyWith label', () {
      const p = ChartDataPoint(label: 'A', count: 5);
      expect(p.copyWith(label: 'B').label, 'B');
    });
    test('copyWith count', () {
      const p = ChartDataPoint(label: 'A', count: 5);
      expect(p.copyWith(count: 10).count, 10);
    });
    test('copyWith preserves unchanged', () {
      const p = ChartDataPoint(label: 'X', count: 7);
      expect(p.copyWith(count: 8).label, 'X');
    });
  });

  group('ChartDataPoint.toJson', () {
    test('label is serialized', () {
      final j = const ChartDataPoint(label: 'Mon', count: 3).toJson();
      expect(j['label'], 'Mon');
    });
    test('count is serialized', () {
      final j = const ChartDataPoint(label: 'Mon', count: 12).toJson();
      expect(j['count'], 12);
    });
  });

  group('ChartDataPoint — list operations', () {
    final points = [
      const ChartDataPoint(label: 'A', count: 10),
      const ChartDataPoint(label: 'B', count: 5),
      const ChartDataPoint(label: 'C', count: 20),
    ];

    test('can sort by count descending', () {
      final sorted = [...points]..sort((a, b) => b.count.compareTo(a.count));
      expect(sorted.first.label, 'C');
      expect(sorted.last.label, 'B');
    });

    test('can filter by minimum count', () {
      final filtered = points.where((p) => p.count >= 10).toList();
      expect(filtered.length, 2);
    });

    test('can map to labels', () {
      final labels = points.map((p) => p.label).toList();
      expect(labels, ['A', 'B', 'C']);
    });

    test('can sum total count', () {
      final total = points.fold<int>(0, (sum, p) => sum + p.count);
      expect(total, 35);
    });
  });
}
