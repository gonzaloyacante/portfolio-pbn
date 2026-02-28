import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/dashboard/data/dashboard_repository.dart';

void main() {
  // ── DashboardStats ──────────────────────────────────────────────────────────

  group('DashboardStats — construction defaults', () {
    test('totalProjects defaults to 0', () {
      const s = DashboardStats();
      expect(s.totalProjects, 0);
    });

    test('totalCategories defaults to 0', () {
      const s = DashboardStats();
      expect(s.totalCategories, 0);
    });

    test('totalServices defaults to 0', () {
      const s = DashboardStats();
      expect(s.totalServices, 0);
    });

    test('totalTestimonials defaults to 0', () {
      const s = DashboardStats();
      expect(s.totalTestimonials, 0);
    });

    test('newContacts defaults to 0', () {
      const s = DashboardStats();
      expect(s.newContacts, 0);
    });

    test('pendingBookings defaults to 0', () {
      const s = DashboardStats();
      expect(s.pendingBookings, 0);
    });

    test('pageViews30d defaults to 0', () {
      const s = DashboardStats();
      expect(s.pageViews30d, 0);
    });
  });

  group('DashboardStats — custom values', () {
    test('stores totalProjects correctly', () {
      const s = DashboardStats(totalProjects: 12);
      expect(s.totalProjects, 12);
    });

    test('stores totalCategories correctly', () {
      const s = DashboardStats(totalCategories: 5);
      expect(s.totalCategories, 5);
    });

    test('stores totalServices correctly', () {
      const s = DashboardStats(totalServices: 8);
      expect(s.totalServices, 8);
    });

    test('stores totalTestimonials correctly', () {
      const s = DashboardStats(totalTestimonials: 30);
      expect(s.totalTestimonials, 30);
    });

    test('stores newContacts correctly', () {
      const s = DashboardStats(newContacts: 7);
      expect(s.newContacts, 7);
    });

    test('stores pendingBookings correctly', () {
      const s = DashboardStats(pendingBookings: 3);
      expect(s.pendingBookings, 3);
    });

    test('stores pageViews30d correctly', () {
      const s = DashboardStats(pageViews30d: 1500);
      expect(s.pageViews30d, 1500);
    });

    test('stores all fields simultaneously', () {
      const s = DashboardStats(
        totalProjects: 12,
        totalCategories: 5,
        totalServices: 8,
        totalTestimonials: 30,
        newContacts: 7,
        pendingBookings: 3,
        pageViews30d: 1500,
      );
      expect(s.totalProjects, 12);
      expect(s.totalCategories, 5);
      expect(s.totalServices, 8);
      expect(s.totalTestimonials, 30);
      expect(s.newContacts, 7);
      expect(s.pendingBookings, 3);
      expect(s.pageViews30d, 1500);
    });
  });

  group('DashboardStats — Freezed equality', () {
    test('two identical instances are equal', () {
      const a = DashboardStats(totalProjects: 5);
      const b = DashboardStats(totalProjects: 5);
      expect(a, equals(b));
    });

    test('two default instances are equal', () {
      const a = DashboardStats();
      const b = DashboardStats();
      expect(a, equals(b));
    });

    test('instances with different totalProjects are not equal', () {
      const a = DashboardStats(totalProjects: 5);
      const b = DashboardStats(totalProjects: 10);
      expect(a, isNot(equals(b)));
    });

    test('instances with different pendingBookings are not equal', () {
      const a = DashboardStats(pendingBookings: 1);
      const b = DashboardStats(pendingBookings: 2);
      expect(a, isNot(equals(b)));
    });
  });

  group('DashboardStats — copyWith', () {
    test('copyWith updates totalProjects', () {
      const s = DashboardStats(totalProjects: 5);
      expect(s.copyWith(totalProjects: 10).totalProjects, 10);
    });

    test('copyWith updates totalCategories', () {
      const s = DashboardStats(totalCategories: 3);
      expect(s.copyWith(totalCategories: 6).totalCategories, 6);
    });

    test('copyWith updates pendingBookings', () {
      const s = DashboardStats(pendingBookings: 1);
      expect(s.copyWith(pendingBookings: 5).pendingBookings, 5);
    });

    test('copyWith preserves unchanged fields', () {
      const s = DashboardStats(totalProjects: 10, newContacts: 3);
      final updated = s.copyWith(totalCategories: 5);
      expect(updated.totalProjects, 10);
      expect(updated.newContacts, 3);
      expect(updated.totalCategories, 5);
    });

    test('copyWith with no args returns identical', () {
      const s = DashboardStats(totalProjects: 7, pageViews30d: 200);
      final updated = s.copyWith();
      expect(updated, equals(s));
    });
  });

  group('DashboardStats — fromJson', () {
    test('parses all fields from json', () {
      final s = DashboardStats.fromJson({
        'totalProjects': 15,
        'totalCategories': 6,
        'totalServices': 9,
        'totalTestimonials': 25,
        'newContacts': 4,
        'pendingBookings': 2,
        'pageViews30d': 2000,
      });
      expect(s.totalProjects, 15);
      expect(s.totalCategories, 6);
      expect(s.totalServices, 9);
      expect(s.totalTestimonials, 25);
      expect(s.newContacts, 4);
      expect(s.pendingBookings, 2);
      expect(s.pageViews30d, 2000);
    });

    test('fromJson with empty map uses defaults', () {
      final s = DashboardStats.fromJson({});
      expect(s.totalProjects, 0);
      expect(s.pendingBookings, 0);
    });

    test('fromJson with zero values', () {
      final s = DashboardStats.fromJson({
        'totalProjects': 0,
        'pageViews30d': 0,
      });
      expect(s.totalProjects, 0);
      expect(s.pageViews30d, 0);
    });

    test('fromJson result equals constructed instance', () {
      final fromJson = DashboardStats.fromJson({
        'totalProjects': 5,
        'totalCategories': 2,
        'totalServices': 3,
        'totalTestimonials': 10,
        'newContacts': 1,
        'pendingBookings': 0,
        'pageViews30d': 500,
      });
      const constructed = DashboardStats(
        totalProjects: 5,
        totalCategories: 2,
        totalServices: 3,
        totalTestimonials: 10,
        newContacts: 1,
        pendingBookings: 0,
        pageViews30d: 500,
      );
      expect(fromJson, equals(constructed));
    });
  });

  // ── ChartDataPoint ──────────────────────────────────────────────────────────

  group('ChartDataPoint — construction', () {
    test('creates with label and count', () {
      const p = ChartDataPoint(label: 'Ene', count: 42);
      expect(p.label, 'Ene');
      expect(p.count, 42);
    });

    test('count can be 0', () {
      const p = ChartDataPoint(label: 'Feb', count: 0);
      expect(p.count, 0);
    });

    test('count can be large', () {
      const p = ChartDataPoint(label: 'Mar', count: 999999);
      expect(p.count, 999999);
    });

    test('label can contain spaces', () {
      const p = ChartDataPoint(label: 'enero 2026', count: 5);
      expect(p.label, 'enero 2026');
    });
  });

  group('ChartDataPoint — Freezed equality', () {
    test('two identical instances are equal', () {
      const a = ChartDataPoint(label: 'Abr', count: 10);
      const b = ChartDataPoint(label: 'Abr', count: 10);
      expect(a, equals(b));
    });

    test('different count → not equal', () {
      const a = ChartDataPoint(label: 'May', count: 5);
      const b = ChartDataPoint(label: 'May', count: 6);
      expect(a, isNot(equals(b)));
    });

    test('different label → not equal', () {
      const a = ChartDataPoint(label: 'Jun', count: 5);
      const b = ChartDataPoint(label: 'Jul', count: 5);
      expect(a, isNot(equals(b)));
    });
  });

  group('ChartDataPoint — copyWith', () {
    test('copyWith updates count', () {
      const p = ChartDataPoint(label: 'Ago', count: 10);
      expect(p.copyWith(count: 20).count, 20);
    });

    test('copyWith updates label', () {
      const p = ChartDataPoint(label: 'Sep', count: 100);
      expect(p.copyWith(label: 'Oct').label, 'Oct');
    });

    test('copyWith preserves label when updating count', () {
      const p = ChartDataPoint(label: 'Nov', count: 7);
      final updated = p.copyWith(count: 14);
      expect(updated.label, 'Nov');
    });

    test('copyWith preserves count when updating label', () {
      const p = ChartDataPoint(label: 'Dic', count: 99);
      final updated = p.copyWith(label: 'Ene+1');
      expect(updated.count, 99);
    });
  });

  group('ChartDataPoint — fromJson', () {
    test('fromJson parses label and count', () {
      final p = ChartDataPoint.fromJson({'label': 'Lun', 'count': 15});
      expect(p.label, 'Lun');
      expect(p.count, 15);
    });

    test('fromJson with count 0', () {
      final p = ChartDataPoint.fromJson({'label': 'Mar', 'count': 0});
      expect(p.count, 0);
    });
  });

  // ── DashboardCharts ─────────────────────────────────────────────────────────

  group('DashboardCharts — defaults', () {
    test('dailyPageViews defaults to empty list', () {
      const c = DashboardCharts();
      expect(c.dailyPageViews, isEmpty);
    });

    test('monthlyBookings defaults to empty list', () {
      const c = DashboardCharts();
      expect(c.monthlyBookings, isEmpty);
    });
  });

  group('DashboardCharts — custom values', () {
    test('stores dailyPageViews with 2 items', () {
      const c = DashboardCharts(
        dailyPageViews: [
          ChartDataPoint(label: 'Lun', count: 100),
          ChartDataPoint(label: 'Mar', count: 120),
        ],
      );
      expect(c.dailyPageViews.length, 2);
      expect(c.dailyPageViews[0].label, 'Lun');
      expect(c.dailyPageViews[1].count, 120);
    });

    test('stores monthlyBookings with 1 item', () {
      const c = DashboardCharts(
        monthlyBookings: [ChartDataPoint(label: 'Ene', count: 5)],
      );
      expect(c.monthlyBookings.length, 1);
    });

    test('both lists can have data simultaneously', () {
      const c = DashboardCharts(
        dailyPageViews: [ChartDataPoint(label: 'A', count: 1)],
        monthlyBookings: [ChartDataPoint(label: 'B', count: 2)],
      );
      expect(c.dailyPageViews.length, 1);
      expect(c.monthlyBookings.length, 1);
    });
  });

  group('DashboardCharts — Freezed equality', () {
    test('two empty instances are equal', () {
      const a = DashboardCharts();
      const b = DashboardCharts();
      expect(a, equals(b));
    });

    test('instances with different dailyPageViews are not equal', () {
      const a = DashboardCharts(
        dailyPageViews: [ChartDataPoint(label: 'X', count: 1)],
      );
      const b = DashboardCharts();
      expect(a, isNot(equals(b)));
    });
  });

  group('DashboardCharts — copyWith', () {
    test('copyWith updates dailyPageViews', () {
      const c = DashboardCharts();
      final updated = c.copyWith(
        dailyPageViews: [const ChartDataPoint(label: 'X', count: 1)],
      );
      expect(updated.dailyPageViews.length, 1);
    });

    test('copyWith preserves monthlyBookings when updating dailyPageViews', () {
      const c = DashboardCharts(
        monthlyBookings: [ChartDataPoint(label: 'Ene', count: 3)],
      );
      final updated = c.copyWith(
        dailyPageViews: [const ChartDataPoint(label: 'Y', count: 5)],
      );
      expect(updated.monthlyBookings.length, 1);
      expect(updated.dailyPageViews.length, 1);
    });
  });

  group('DashboardCharts — fromJson', () {
    test('fromJson with empty lists', () {
      final c = DashboardCharts.fromJson({
        'dailyPageViews': <Map<String, dynamic>>[],
        'monthlyBookings': <Map<String, dynamic>>[],
      });
      expect(c.dailyPageViews, isEmpty);
      expect(c.monthlyBookings, isEmpty);
    });

    test('fromJson parses data correctly', () {
      final c = DashboardCharts.fromJson({
        'dailyPageViews': [
          {'label': 'Lun', 'count': 50},
          {'label': 'Mar', 'count': 60},
        ],
        'monthlyBookings': [
          {'label': 'Ene', 'count': 3},
        ],
      });
      expect(c.dailyPageViews.length, 2);
      expect(c.dailyPageViews[0].label, 'Lun');
      expect(c.dailyPageViews[1].count, 60);
      expect(c.monthlyBookings.length, 1);
      expect(c.monthlyBookings[0].count, 3);
    });

    test('fromJson with missing keys uses defaults', () {
      final c = DashboardCharts.fromJson({});
      expect(c.dailyPageViews, isEmpty);
      expect(c.monthlyBookings, isEmpty);
    });
  });
}
