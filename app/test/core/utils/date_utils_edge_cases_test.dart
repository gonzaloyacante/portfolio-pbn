import 'package:flutter_test/flutter_test.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:portfolio_pbn/core/utils/date_utils.dart';

void main() {
  setUpAll(() async {
    await initializeDateFormatting('es');
  });

  // ── toFullDate ────────────────────────────────────────────────────────────

  group('AppDateUtils.toFullDate — edge dates', () {
    test('first day of year', () {
      expect(
        AppDateUtils.toFullDate(DateTime(2024, 1, 1)),
        '1 de enero de 2024',
      );
    });
    test('last day of year', () {
      expect(
        AppDateUtils.toFullDate(DateTime(2024, 12, 31)),
        '31 de diciembre de 2024',
      );
    });
    test('leap day February 29', () {
      expect(
        AppDateUtils.toFullDate(DateTime(2024, 2, 29)),
        '29 de febrero de 2024',
      );
    });
    test('March 15', () {
      expect(
        AppDateUtils.toFullDate(DateTime(2023, 3, 15)),
        '15 de marzo de 2023',
      );
    });
    test('April 30', () {
      expect(
        AppDateUtils.toFullDate(DateTime(2025, 4, 30)),
        '30 de abril de 2025',
      );
    });
    test('May 1 labor day', () {
      expect(
        AppDateUtils.toFullDate(DateTime(2025, 5, 1)),
        '1 de mayo de 2025',
      );
    });
    test('June 15', () {
      expect(
        AppDateUtils.toFullDate(DateTime(2024, 6, 15)),
        '15 de junio de 2024',
      );
    });
    test('July 4', () {
      expect(
        AppDateUtils.toFullDate(DateTime(2024, 7, 4)),
        '4 de julio de 2024',
      );
    });
    test('August 31', () {
      expect(
        AppDateUtils.toFullDate(DateTime(2024, 8, 31)),
        '31 de agosto de 2024',
      );
    });
    test('September 10', () {
      expect(
        AppDateUtils.toFullDate(DateTime(2024, 9, 10)),
        '10 de septiembre de 2024',
      );
    });
    test('October 31 Halloween', () {
      expect(
        AppDateUtils.toFullDate(DateTime(2024, 10, 31)),
        '31 de octubre de 2024',
      );
    });
    test('November 11', () {
      expect(
        AppDateUtils.toFullDate(DateTime(2024, 11, 11)),
        '11 de noviembre de 2024',
      );
    });
    test('December 25 Christmas', () {
      expect(
        AppDateUtils.toFullDate(DateTime(2024, 12, 25)),
        '25 de diciembre de 2024',
      );
    });
  });

  // ── toShortDate ───────────────────────────────────────────────────────────

  group('AppDateUtils.toShortDate — edge dates', () {
    test('single digit day and month padded', () {
      expect(AppDateUtils.toShortDate(DateTime(2024, 1, 5)), '05/01/2024');
    });
    test('day 31', () {
      expect(AppDateUtils.toShortDate(DateTime(2024, 3, 31)), '31/03/2024');
    });
    test('last day of February', () {
      expect(AppDateUtils.toShortDate(DateTime(2023, 2, 28)), '28/02/2023');
    });
    test('millennium date', () {
      expect(AppDateUtils.toShortDate(DateTime(2000, 1, 1)), '01/01/2000');
    });
    test('format structure has slashes', () {
      final result = AppDateUtils.toShortDate(DateTime(2024, 6, 15));
      expect(result.contains('/'), isTrue);
    });
    test('length is always 10', () {
      expect(AppDateUtils.toShortDate(DateTime(2024, 12, 31)).length, 10);
    });
  });

  // ── toShortDateTime ───────────────────────────────────────────────────────

  group('AppDateUtils.toShortDateTime', () {
    test('midnight time', () {
      expect(
        AppDateUtils.toShortDateTime(DateTime(2024, 6, 1, 0, 0)),
        '01/06/2024 00:00',
      );
    });
    test('noon time', () {
      expect(
        AppDateUtils.toShortDateTime(DateTime(2024, 6, 1, 12, 0)),
        '01/06/2024 12:00',
      );
    });
    test('last minute of day', () {
      expect(
        AppDateUtils.toShortDateTime(DateTime(2024, 6, 1, 23, 59)),
        '01/06/2024 23:59',
      );
    });
    test('contains space between date and time', () {
      final result = AppDateUtils.toShortDateTime(DateTime(2024, 1, 1, 9, 30));
      expect(result.contains(' '), isTrue);
    });
    test('minutes are fixed two digits', () {
      expect(
        AppDateUtils.toShortDateTime(DateTime(2024, 1, 1, 10, 5)),
        '01/01/2024 10:05',
      );
    });
    test('hours are fixed two digits', () {
      expect(
        AppDateUtils.toShortDateTime(DateTime(2024, 1, 1, 9, 0)),
        '01/01/2024 09:00',
      );
    });
  });

  // ── toTimeOnly ────────────────────────────────────────────────────────────

  group('AppDateUtils.toTimeOnly', () {
    test('midnight is 00:00', () {
      expect(AppDateUtils.toTimeOnly(DateTime(2024, 1, 1, 0, 0)), '00:00');
    });
    test('noon is 12:00', () {
      expect(AppDateUtils.toTimeOnly(DateTime(2024, 1, 1, 12, 0)), '12:00');
    });
    test('23:59 last minute', () {
      expect(AppDateUtils.toTimeOnly(DateTime(2024, 1, 1, 23, 59)), '23:59');
    });
    test('single digit hour padded', () {
      expect(AppDateUtils.toTimeOnly(DateTime(2024, 1, 1, 9, 5)), '09:05');
    });
    test('contains colon', () {
      expect(
        AppDateUtils.toTimeOnly(DateTime(2024, 1, 1, 14, 30)).contains(':'),
        isTrue,
      );
    });
    test('length is exactly 5', () {
      expect(AppDateUtils.toTimeOnly(DateTime(2024, 1, 1, 14, 30)).length, 5);
    });
  });

  // ── toMonthYear ───────────────────────────────────────────────────────────

  group('AppDateUtils.toMonthYear', () {
    test('January 2024', () {
      expect(AppDateUtils.toMonthYear(DateTime(2024, 1, 15)), 'enero de 2024');
    });
    test('December 2023', () {
      expect(
        AppDateUtils.toMonthYear(DateTime(2023, 12, 1)),
        'diciembre de 2023',
      );
    });
    test('July 2025', () {
      expect(AppDateUtils.toMonthYear(DateTime(2025, 7, 20)), 'julio de 2025');
    });
    test('contains "de"', () {
      final result = AppDateUtils.toMonthYear(DateTime(2024, 4, 5));
      expect(result.contains(' de '), isTrue);
    });
  });

  // ── toTimeRange ───────────────────────────────────────────────────────────

  group('AppDateUtils.toTimeRange', () {
    test('basic range', () {
      final start = DateTime(2024, 1, 1, 9, 0);
      final end = DateTime(2024, 1, 1, 10, 30);
      expect(AppDateUtils.toTimeRange(start, end), '09:00 – 10:30');
    });
    test('same hour range', () {
      final start = DateTime(2024, 1, 1, 14, 0);
      final end = DateTime(2024, 1, 1, 14, 30);
      expect(AppDateUtils.toTimeRange(start, end), '14:00 – 14:30');
    });
    test('contains em-dash separator', () {
      final start = DateTime(2024, 1, 1, 8, 0);
      final end = DateTime(2024, 1, 1, 9, 0);
      expect(AppDateUtils.toTimeRange(start, end).contains('–'), isTrue);
    });
    test('midnight to midnight', () {
      final start = DateTime(2024, 1, 1, 0, 0);
      final end = DateTime(2024, 1, 1, 0, 0);
      expect(AppDateUtils.toTimeRange(start, end), '00:00 – 00:00');
    });
  });

  // ── toRelative ────────────────────────────────────────────────────────────

  group('AppDateUtils.toRelative — past', () {
    test('under 60 seconds is "hace un momento"', () {
      final now = DateTime.now().subtract(const Duration(seconds: 30));
      expect(AppDateUtils.toRelative(now), 'hace un momento');
    });
    test('1 minute ago', () {
      final t = DateTime.now().subtract(const Duration(minutes: 1));
      expect(AppDateUtils.toRelative(t), 'hace 1 minuto');
    });
    test('2 minutes ago', () {
      final t = DateTime.now().subtract(const Duration(minutes: 2));
      expect(AppDateUtils.toRelative(t), 'hace 2 minutos');
    });
    test('30 minutes ago', () {
      final t = DateTime.now().subtract(const Duration(minutes: 30));
      expect(AppDateUtils.toRelative(t), 'hace 30 minutos');
    });
    test('1 hour ago', () {
      final t = DateTime.now().subtract(const Duration(hours: 1));
      expect(AppDateUtils.toRelative(t), 'hace 1 hora');
    });
    test('3 hours ago', () {
      final t = DateTime.now().subtract(const Duration(hours: 3));
      expect(AppDateUtils.toRelative(t), 'hace 3 horas');
    });
    test('yesterday', () {
      final t = DateTime.now().subtract(const Duration(days: 1));
      expect(AppDateUtils.toRelative(t), 'ayer');
    });
    test('3 days ago', () {
      final t = DateTime.now().subtract(const Duration(days: 3));
      expect(AppDateUtils.toRelative(t), 'hace 3 días');
    });
    test('1 week ago', () {
      final t = DateTime.now().subtract(const Duration(days: 7));
      expect(AppDateUtils.toRelative(t), 'hace 1 semana');
    });
    test('2 weeks ago', () {
      final t = DateTime.now().subtract(const Duration(days: 14));
      expect(AppDateUtils.toRelative(t), 'hace 2 semanas');
    });
    test('1 month ago', () {
      final t = DateTime.now().subtract(const Duration(days: 30));
      expect(AppDateUtils.toRelative(t), 'hace 1 mes');
    });
    test('3 months ago', () {
      final t = DateTime.now().subtract(const Duration(days: 92));
      expect(AppDateUtils.toRelative(t), 'hace 3 meses');
    });
    test('1 year ago', () {
      final t = DateTime.now().subtract(const Duration(days: 370));
      expect(AppDateUtils.toRelative(t), 'hace 1 año');
    });
    test('2 years ago', () {
      final t = DateTime.now().subtract(const Duration(days: 730));
      expect(AppDateUtils.toRelative(t), 'hace 2 años');
    });
  });
}
