import 'package:flutter_test/flutter_test.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:portfolio_pbn/core/utils/date_utils.dart';

void main() {
  setUpAll(() async {
    await initializeDateFormatting('es');
  });

  group('AppDateUtils.toFullDate', () {
    test('formats a date in Spanish full format', () {
      final date = DateTime(2026, 2, 22);
      expect(AppDateUtils.toFullDate(date), contains('2026'));
    });

    test('includes day number', () {
      final date = DateTime(2026, 2, 22);
      expect(AppDateUtils.toFullDate(date), contains('22'));
    });

    test('includes "de" particles', () {
      final date = DateTime(2026, 2, 22);
      expect(AppDateUtils.toFullDate(date), contains('de'));
    });

    test('formats January correctly', () {
      final date = DateTime(2025, 1, 1);
      final result = AppDateUtils.toFullDate(date);
      expect(result, contains('2025'));
      expect(result, contains('1'));
    });

    test('formats December correctly', () {
      final date = DateTime(2024, 12, 25);
      final result = AppDateUtils.toFullDate(date);
      expect(result, contains('2024'));
    });

    test('formats single-digit day', () {
      final date = DateTime(2026, 3, 5);
      expect(AppDateUtils.toFullDate(date), contains('5'));
    });
  });

  group('AppDateUtils.toShortDate', () {
    test('formats date as dd/MM/yyyy', () {
      final date = DateTime(2026, 2, 22);
      expect(AppDateUtils.toShortDate(date), '22/02/2026');
    });

    test('pads single-digit day with zero', () {
      final date = DateTime(2026, 3, 5);
      expect(AppDateUtils.toShortDate(date), '05/03/2026');
    });

    test('pads single-digit month with zero', () {
      final date = DateTime(2026, 1, 15);
      expect(AppDateUtils.toShortDate(date), '15/01/2026');
    });

    test('formats December correctly', () {
      final date = DateTime(2024, 12, 31);
      expect(AppDateUtils.toShortDate(date), '31/12/2024');
    });
  });

  group('AppDateUtils.toShortDateTime', () {
    test('formats date and time', () {
      final date = DateTime(2026, 2, 22, 14, 30);
      expect(AppDateUtils.toShortDateTime(date), '22/02/2026 14:30');
    });

    test('pads hours with zero when needed', () {
      final date = DateTime(2026, 2, 22, 9, 5);
      expect(AppDateUtils.toShortDateTime(date), '22/02/2026 09:05');
    });

    test('handles midnight', () {
      final date = DateTime(2026, 2, 22, 0, 0);
      expect(AppDateUtils.toShortDateTime(date), '22/02/2026 00:00');
    });
  });

  group('AppDateUtils.toTimeOnly', () {
    test('formats time as HH:mm', () {
      final date = DateTime(2026, 1, 1, 14, 30);
      expect(AppDateUtils.toTimeOnly(date), '14:30');
    });

    test('pads single-digit hour', () {
      final date = DateTime(2026, 1, 1, 9, 5);
      expect(AppDateUtils.toTimeOnly(date), '09:05');
    });

    test('handles midnight', () {
      final date = DateTime(2026, 1, 1, 0, 0);
      expect(AppDateUtils.toTimeOnly(date), '00:00');
    });

    test('handles end of day', () {
      final date = DateTime(2026, 1, 1, 23, 59);
      expect(AppDateUtils.toTimeOnly(date), '23:59');
    });
  });

  group('AppDateUtils.toMonthYear', () {
    test('formats month and year', () {
      final date = DateTime(2026, 2, 1);
      final result = AppDateUtils.toMonthYear(date);
      expect(result, contains('2026'));
    });

    test('includes "de" particle', () {
      final date = DateTime(2026, 6, 15);
      expect(AppDateUtils.toMonthYear(date), contains('de'));
    });
  });

  group('AppDateUtils.toRelative', () {
    test('returns "hace un momento" for recent past', () {
      final now = DateTime.now().subtract(const Duration(seconds: 30));
      expect(AppDateUtils.toRelative(now), 'hace un momento');
    });

    test('returns minutes for < 1 hour ago', () {
      final now = DateTime.now().subtract(const Duration(minutes: 5));
      expect(AppDateUtils.toRelative(now), 'hace 5 minutos');
    });

    test('returns singular minute for 1 minute ago', () {
      final date = DateTime.now().subtract(const Duration(minutes: 1));
      expect(AppDateUtils.toRelative(date), 'hace 1 minuto');
    });

    test('returns hours for < 24 hours ago', () {
      final date = DateTime.now().subtract(const Duration(hours: 3));
      expect(AppDateUtils.toRelative(date), 'hace 3 horas');
    });

    test('returns "ayer" for yesterday', () {
      final date = DateTime.now().subtract(const Duration(days: 1));
      expect(AppDateUtils.toRelative(date), 'ayer');
    });

    test('returns days for < 1 week ago', () {
      final date = DateTime.now().subtract(const Duration(days: 5));
      expect(AppDateUtils.toRelative(date), 'hace 5 días');
    });

    test('returns weeks for < 1 month ago', () {
      final date = DateTime.now().subtract(const Duration(days: 14));
      expect(AppDateUtils.toRelative(date), 'hace 2 semanas');
    });

    test('returns months for < 1 year ago', () {
      final date = DateTime.now().subtract(const Duration(days: 60));
      expect(AppDateUtils.toRelative(date), 'hace 2 meses');
    });

    test('returns years for >= 1 year ago', () {
      final date = DateTime.now().subtract(const Duration(days: 400));
      expect(AppDateUtils.toRelative(date), 'hace 1 año');
    });

    test('returns plural años for > 1 year', () {
      final date = DateTime.now().subtract(const Duration(days: 800));
      expect(AppDateUtils.toRelative(date), 'hace 2 años');
    });
  });

  group('AppDateUtils.toTimeRange', () {
    test('formats start and end time', () {
      final start = DateTime(2026, 1, 1, 14, 0);
      final end = DateTime(2026, 1, 1, 15, 30);
      expect(AppDateUtils.toTimeRange(start, end), '14:00 – 15:30');
    });

    test('handles same start and end time', () {
      final time = DateTime(2026, 1, 1, 10, 0);
      expect(AppDateUtils.toTimeRange(time, time), '10:00 – 10:00');
    });

    test('handles midnight start', () {
      final start = DateTime(2026, 1, 1, 0, 0);
      final end = DateTime(2026, 1, 1, 1, 30);
      expect(AppDateUtils.toTimeRange(start, end), '00:00 – 01:30');
    });
  });
}
