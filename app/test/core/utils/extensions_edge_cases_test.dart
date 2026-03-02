import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/utils/extensions.dart';

void main() {
  // ── String.capitalize edge cases ──────────────────────────────────────────

  group('String.capitalize — edge cases', () {
    test('empty string returns empty', () => expect(''.capitalize, ''));
    test(
      'single lowercase char becomes uppercase',
      () => expect('a'.capitalize, 'A'),
    );
    test('already uppercase char unchanged', () => expect('A'.capitalize, 'A'));
    test('first char uppercased, rest unchanged', () {
      expect('hELLO'.capitalize, 'HELLO');
    });
    test(
      'digit as first char stays same',
      () => expect('1hello'.capitalize, '1hello'),
    );
    test(
      'special char stays same',
      () => expect('!hello'.capitalize, '!hello'),
    );
    test('multi-word: only first char of string affected', () {
      expect('hello world'.capitalize, 'Hello world');
    });
  });

  // ── String.titleCase edge cases ───────────────────────────────────────────

  group('String.titleCase — edge cases', () {
    test('empty string returns empty', () => expect(''.titleCase, ''));
    test('single word capitalizes first letter', () {
      expect('hello'.titleCase, 'Hello');
    });
    test('multiple words each capitalize first letter only', () {
      final result = 'hello world foo'.titleCase;
      final words = result.split(' ');
      for (final word in words) {
        if (word.isNotEmpty) {
          expect(word[0], word[0].toUpperCase());
        }
      }
    });
    test(
      'does NOT downcase the rest (title case only uppercases first char)',
      () {
        // 'hElLo'.capitalize → 'HElLo' (rest unchanged)
        expect('hElLo wOrLd'.titleCase, 'HElLo WOrLd');
      },
    );
    test('single-character words are capitalized', () {
      final result = 'a b c'.titleCase;
      expect(result, 'A B C');
    });
    test('numbers are not changed', () {
      final result = '1st 2nd'.titleCase;
      expect(result, '1st 2nd');
    });
    test('already titlecased stays same', () {
      expect('Hello World'.titleCase, 'Hello World');
    });
  });

  // ── String.isValidEmail edge cases ────────────────────────────────────────

  group('String.isValidEmail — edge cases', () {
    test('empty string is not valid', () => expect(''.isValidEmail, isFalse));
    test(
      'valid email returns true',
      () => expect('user@example.com'.isValidEmail, isTrue),
    );
    test(
      'email without @ is false',
      () => expect('userexample.com'.isValidEmail, isFalse),
    );
    test(
      'email without domain is false',
      () => expect('user@'.isValidEmail, isFalse),
    );
    test(
      'email without TLD is false',
      () => expect('user@domain'.isValidEmail, isFalse),
    );
    test(
      'email with subdomain is true',
      () => expect('user@sub.example.com'.isValidEmail, isTrue),
    );
    test(
      'email with + alias is true',
      () => expect('user+tag@example.com'.isValidEmail, isTrue),
    );
    test(
      'multiple @ signs is false',
      () => expect('a@@b.com'.isValidEmail, isFalse),
    );
    test(
      'spaces in email is false',
      () => expect('user @example.com'.isValidEmail, isFalse),
    );
    test('whitespace-only is false', () => expect('   '.isValidEmail, isFalse));
  });

  // ── String.truncate edge cases ────────────────────────────────────────────

  group('String.truncate — edge cases', () {
    test('string shorter than max returns unchanged', () {
      expect('Hello'.truncate(10), 'Hello');
    });
    test('string equal to max returns unchanged', () {
      expect('Hello'.truncate(5), 'Hello');
    });
    test('string longer than max is truncated with ellipsis char', () {
      final result = 'Hello World'.truncate(5);
      expect(result, startsWith('Hello'));
      expect(result.endsWith('…'), isTrue); // single ellipsis char
    });
    test('truncated string has max+1 chars (content + …)', () {
      final result = 'Hello World'.truncate(5);
      expect(result.length, 6); // 5 + '…'
    });
    test('max 0 returns just ellipsis char', () {
      final result = 'Hello'.truncate(0);
      expect(result, '…');
    });
    test('empty string is unchanged', () => expect(''.truncate(5), ''));
    test('truncate with max == length: no truncation', () {
      const s = 'exact';
      expect(s.truncate(5), 'exact');
    });
  });

  // ── NullableStringExtensions ─────────────────────────────────────────────

  group('NullableStringExtensions.isNullOrEmpty', () {
    test(
      'null is null or empty',
      () => expect((null as String?).isNullOrEmpty, isTrue),
    );
    test(
      'empty string is null or empty',
      () => expect(''.isNullOrEmpty, isTrue),
    );
    test(
      'non-empty string is NOT null or empty',
      () => expect('hello'.isNullOrEmpty, isFalse),
    );
    test(
      'space is NOT null or empty',
      () => expect(' '.isNullOrEmpty, isFalse),
    );
  });

  group('NullableStringExtensions.isNotNullOrEmpty', () {
    test(
      'null is NOT "not null or empty"',
      () => expect((null as String?).isNotNullOrEmpty, isFalse),
    );
    test(
      'empty is NOT "not null or empty"',
      () => expect(''.isNotNullOrEmpty, isFalse),
    );
    test(
      'non-empty returns true',
      () => expect('hello'.isNotNullOrEmpty, isTrue),
    );
    test(
      'space is "not null or empty"',
      () => expect(' '.isNotNullOrEmpty, isTrue),
    );
  });

  // ── DateTimeExtensions ────────────────────────────────────────────────────

  group('DateTime.isToday — edge cases', () {
    test('now is today', () => expect(DateTime.now().isToday, isTrue));
    test('yesterday is not today', () {
      expect(DateTime.now().subtract(const Duration(days: 1)).isToday, isFalse);
    });
    test('tomorrow is not today', () {
      expect(DateTime.now().add(const Duration(days: 1)).isToday, isFalse);
    });
    test(
      'start of today is today',
      () => expect(DateTime.now().startOfDay.isToday, isTrue),
    );
    test(
      'end of today is today',
      () => expect(DateTime.now().endOfDay.isToday, isTrue),
    );
  });

  group('DateTime.isYesterday — edge cases', () {
    test('yesterday is yesterday', () {
      expect(
        DateTime.now().subtract(const Duration(days: 1)).isYesterday,
        isTrue,
      );
    });
    test(
      'today is not yesterday',
      () => expect(DateTime.now().isYesterday, isFalse),
    );
    test('two days ago is not yesterday', () {
      expect(
        DateTime.now().subtract(const Duration(days: 2)).isYesterday,
        isFalse,
      );
    });
    test('tomorrow is not yesterday', () {
      expect(DateTime.now().add(const Duration(days: 1)).isYesterday, isFalse);
    });
  });

  group('DateTime.startOfDay — edge cases', () {
    test('returns same date', () {
      final now = DateTime.now();
      final sod = now.startOfDay;
      expect(sod.year, now.year);
      expect(sod.month, now.month);
      expect(sod.day, now.day);
    });
    test('hour is 0', () => expect(DateTime.now().startOfDay.hour, 0));
    test('minute is 0', () => expect(DateTime.now().startOfDay.minute, 0));
    test('second is 0', () => expect(DateTime.now().startOfDay.second, 0));
    test(
      'millisecond is 0',
      () => expect(DateTime.now().startOfDay.millisecond, 0),
    );
  });

  group('DateTime.endOfDay — edge cases', () {
    test('returns same date', () {
      final now = DateTime.now();
      final eod = now.endOfDay;
      expect(eod.year, now.year);
      expect(eod.month, now.month);
      expect(eod.day, now.day);
    });
    test('hour is 23', () => expect(DateTime.now().endOfDay.hour, 23));
    test('minute is 59', () => expect(DateTime.now().endOfDay.minute, 59));
    test('second is 59', () => expect(DateTime.now().endOfDay.second, 59));
    test(
      'millisecond is 999',
      () => expect(DateTime.now().endOfDay.millisecond, 999),
    );
    test('startOfDay < endOfDay', () {
      final now = DateTime.now();
      expect(now.startOfDay.isBefore(now.endOfDay), isTrue);
    });
  });

  // ── ListExtensions ────────────────────────────────────────────────────────

  group('ListExtensions.firstOrNull — edge cases', () {
    test('empty list returns null', () => expect(<int>[].firstOrNull, isNull));
    test(
      'single element returns that element',
      () => expect([42].firstOrNull, 42),
    );
    test(
      'multi-element list returns first',
      () => expect([1, 2, 3].firstOrNull, 1),
    );
    test(
      'null element list returns null (first element)',
      () => expect([null, 'a'].firstOrNull, isNull),
    );
    test(
      'string list returns first string',
      () => expect(['alpha', 'beta'].firstOrNull, 'alpha'),
    );
  });

  group('ListExtensions.tryGet — edge cases', () {
    final list = [10, 20, 30];
    test('index 0 returns first element', () => expect(list.tryGet(0), 10));
    test(
      'last valid index returns last element',
      () => expect(list.tryGet(2), 30),
    );
    test(
      'out-of-bounds index returns null',
      () => expect(list.tryGet(5), isNull),
    );
    test('negative index returns null', () => expect(list.tryGet(-1), isNull));
    test('index 1 returns middle element', () => expect(list.tryGet(1), 20));
    test(
      'empty list always returns null',
      () => expect(<int>[].tryGet(0), isNull),
    );
  });
}
