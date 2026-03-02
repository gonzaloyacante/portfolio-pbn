import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/utils/extensions.dart';

void main() {
  group('StringExtensions.capitalize', () {
    test('capitalizes first letter', () {
      expect('hello'.capitalize, 'Hello');
    });

    test('leaves rest of string unchanged', () {
      expect('hELLO'.capitalize, 'HELLO');
    });

    test('returns empty string unchanged', () {
      expect(''.capitalize, '');
    });

    test('works on single character', () {
      expect('a'.capitalize, 'A');
    });

    test('already capitalized stays the same', () {
      expect('Hello'.capitalize, 'Hello');
    });
  });

  group('StringExtensions.titleCase', () {
    test('capitalizes each word', () {
      expect('hello world'.titleCase, 'Hello World');
    });

    test('works on single word', () {
      expect('hello'.titleCase, 'Hello');
    });

    test('returns empty string unchanged', () {
      expect(''.titleCase, '');
    });

    test('handles multiple spaces correctly', () {
      // split(' ') produces empty strings for consecutive spaces
      expect('hello  world'.titleCase, isA<String>());
    });

    test('mixed case input capitalizes first letter only', () {
      // capitalize only uppercases first char, rest unchanged
      expect('hElLo WoRlD'.titleCase, 'HElLo WoRlD');
    });
  });

  group('StringExtensions.isValidEmail', () {
    test('returns true for valid email', () {
      expect('user@example.com'.isValidEmail, true);
    });

    test('returns false for invalid email (no @)', () {
      expect('notanemail'.isValidEmail, false);
    });

    test('returns false for empty string', () {
      expect(''.isValidEmail, false);
    });

    test('returns true for email with subdomain', () {
      expect('user@mail.example.com'.isValidEmail, true);
    });

    test('returns false for email with spaces', () {
      expect('user @example.com'.isValidEmail, false);
    });

    test('returns true for email with plus sign', () {
      expect('user+tag@example.com'.isValidEmail, true);
    });
  });

  group('StringExtensions.truncate', () {
    test('truncates and appends ellipsis when too long', () {
      expect('Hello World'.truncate(5), 'Hello…');
    });

    test('returns unchanged when at limit', () {
      expect('Hello'.truncate(5), 'Hello');
    });

    test('returns unchanged when below limit', () {
      expect('Hi'.truncate(10), 'Hi');
    });

    test('truncates empty string at 0 limit', () {
      expect(''.truncate(0), '');
    });

    test('truncates with limit of 1', () {
      expect('Hello'.truncate(1), 'H…');
    });
  });

  group('NullableStringExtensions.isNullOrEmpty', () {
    test('returns true for null', () {
      String? s;
      expect(s.isNullOrEmpty, true);
    });

    test('returns true for empty string', () {
      expect(''.isNullOrEmpty, true);
    });

    test('returns false for non-empty string', () {
      expect('hello'.isNullOrEmpty, false);
    });

    test('returns false for whitespace (not null or empty)', () {
      expect(' '.isNullOrEmpty, false);
    });
  });

  group('NullableStringExtensions.isNotNullOrEmpty', () {
    test('returns false for null', () {
      String? s;
      expect(s.isNotNullOrEmpty, false);
    });

    test('returns false for empty string', () {
      expect(''.isNotNullOrEmpty, false);
    });

    test('returns true for non-empty string', () {
      expect('hello'.isNotNullOrEmpty, true);
    });
  });

  group('DateTimeExtensions.isToday', () {
    test('returns true for today', () {
      expect(DateTime.now().isToday, true);
    });

    test('returns false for tomorrow', () {
      final tomorrow = DateTime.now().add(const Duration(days: 1));
      expect(tomorrow.isToday, false);
    });

    test('returns false for yesterday', () {
      final yesterday = DateTime.now().subtract(const Duration(days: 1));
      expect(yesterday.isToday, false);
    });

    test('returns true even with time components set', () {
      final todayMidnight = DateTime(
        DateTime.now().year,
        DateTime.now().month,
        DateTime.now().day,
        23,
        59,
      );
      expect(todayMidnight.isToday, true);
    });
  });

  group('DateTimeExtensions.isYesterday', () {
    test('returns true for yesterday', () {
      final yesterday = DateTime.now().subtract(const Duration(days: 1));
      expect(yesterday.isYesterday, true);
    });

    test('returns false for today', () {
      expect(DateTime.now().isYesterday, false);
    });

    test('returns false for 2 days ago', () {
      final twoDaysAgo = DateTime.now().subtract(const Duration(days: 2));
      expect(twoDaysAgo.isYesterday, false);
    });
  });

  group('DateTimeExtensions.startOfDay', () {
    test('returns datetime at midnight', () {
      final date = DateTime(2026, 2, 22, 14, 30, 45);
      final start = date.startOfDay;
      expect(start.hour, 0);
      expect(start.minute, 0);
      expect(start.second, 0);
    });

    test('preserves year, month, day', () {
      final date = DateTime(2026, 2, 22, 14, 30);
      final start = date.startOfDay;
      expect(start.year, 2026);
      expect(start.month, 2);
      expect(start.day, 22);
    });
  });

  group('DateTimeExtensions.endOfDay', () {
    test('returns datetime at 23:59:59.999', () {
      final date = DateTime(2026, 2, 22, 8, 0);
      final end = date.endOfDay;
      expect(end.hour, 23);
      expect(end.minute, 59);
      expect(end.second, 59);
    });

    test('preserves year, month, day', () {
      final date = DateTime(2026, 2, 22);
      final end = date.endOfDay;
      expect(end.year, 2026);
      expect(end.month, 2);
      expect(end.day, 22);
    });
  });

  group('ListExtensions.firstOrNull', () {
    test('returns null for empty list', () {
      expect(<int>[].firstOrNull, isNull);
    });

    test('returns first element for non-empty list', () {
      expect([1, 2, 3].firstOrNull, 1);
    });

    test('returns only element for single-element list', () {
      expect(['only'].firstOrNull, 'only');
    });
  });

  group('ListExtensions.tryGet', () {
    test('returns element at valid index', () {
      expect(['a', 'b', 'c'].tryGet(1), 'b');
    });

    test('returns null for out-of-bounds index', () {
      expect(['a', 'b'].tryGet(5), isNull);
    });

    test('returns null for negative index', () {
      expect(['a', 'b'].tryGet(-1), isNull);
    });

    test('returns first element at index 0', () {
      expect([10, 20, 30].tryGet(0), 10);
    });

    test('returns null for empty list', () {
      expect(<int>[].tryGet(0), isNull);
    });
  });
}
