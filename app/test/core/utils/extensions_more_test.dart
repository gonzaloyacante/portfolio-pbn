import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/utils/extensions.dart';

void main() {
  // ── String.capitalize ─────────────────────────────────────────────────────

  group('String.capitalize — edge cases', () {
    test('empty string returns empty', () => expect(''.capitalize, ''));
    test('single lowercase char', () => expect('a'.capitalize, 'A'));
    test('single uppercase char', () => expect('A'.capitalize, 'A'));
    test('simple word', () => expect('hello'.capitalize, 'Hello'));
    test('already capitalized', () => expect('Hello'.capitalize, 'Hello'));
    test('all uppercase', () => expect('HELLO'.capitalize, 'HELLO'));
    test('number start', () => expect('1hello'.capitalize, '1hello'));
    test('space start preserved', () => expect(' hello'.capitalize, ' hello'));
    test('result has same length', () {
      expect('world'.capitalize.length, 'world'.length);
    });
  });

  // ── String.titleCase ──────────────────────────────────────────────────────

  group('String.titleCase — edge cases', () {
    test('two words first letter each uppercase', () {
      final result = 'hello world'.titleCase;
      expect(result[0], 'H');
      expect(result[6], 'W');
    });
    test('single word', () {
      final result = 'dart'.titleCase;
      expect(result[0], 'D');
    });
    test('empty string returns empty', () => expect(''.titleCase, ''));
    test('three words split correctly', () {
      final words = 'one two three'.titleCase.split(' ');
      expect(
        words.every((w) => w.isEmpty || w[0] == w[0].toUpperCase()),
        isTrue,
      );
    });
    test('already titleCase unchanged in case', () {
      expect('Hello World'.titleCase[0], 'H');
    });
    test('preserves space count', () {
      final r = 'a b c'.titleCase.split(' ');
      expect(r.length, 3);
    });
    test('single char words capitalized', () {
      final r = 'a b c'.titleCase;
      for (final word in r.split(' ')) {
        expect(word, word[0].toUpperCase() + word.substring(1));
      }
    });
  });

  // ── String.isValidEmail ───────────────────────────────────────────────────

  group('String.isValidEmail — extra cases', () {
    test(
      'valid standard email',
      () => expect('user@domain.com'.isValidEmail, isTrue),
    );
    test(
      'valid with plus',
      () => expect('user+tag@domain.com'.isValidEmail, isTrue),
    );
    test(
      'valid subdomain',
      () => expect('user@mail.domain.co'.isValidEmail, isTrue),
    );
    test(
      'no at sign invalid',
      () => expect('userdomain.com'.isValidEmail, isFalse),
    );
    test('no domain invalid', () => expect('user@'.isValidEmail, isFalse));
    test('empty invalid', () => expect(''.isValidEmail, isFalse));
    test(
      'spaces invalid',
      () => expect('user domain.com'.isValidEmail, isFalse),
    );
    test(
      'two ats invalid',
      () => expect('user@@domain.com'.isValidEmail, isFalse),
    );
    test('local only invalid', () => expect('user'.isValidEmail, isFalse));
    test('at start invalid', () => expect('@domain.com'.isValidEmail, isFalse));
  });

  // ── String.truncate ───────────────────────────────────────────────────────

  group('String.truncate — edge cases', () {
    test('shorter than max unchanged', () => expect('Hi'.truncate(10), 'Hi'));
    test('exactly max unchanged', () => expect('Hello'.truncate(5), 'Hello'));
    test('one over max truncated adds ellipsis', () {
      expect('Hello!'.truncate(5).contains('…'), isTrue);
    });
    test('truncated result length <= max + 1', () {
      expect('Hello World'.truncate(5).length, lessThanOrEqualTo(6));
    });
    test('empty string returns empty', () => expect(''.truncate(5), ''));
    test(
      'max=0 truncates all',
      () => expect('hi'.truncate(0).contains('…'), isTrue),
    );
    test('single char max', () {
      final r = 'hello'.truncate(1);
      expect(r.length, lessThanOrEqualTo(2));
    });
    test('unicode character safe', () => expect('Hé'.truncate(10), 'Hé'));
    test('long string result has ellipsis', () {
      expect(
        'The quick brown fox jumps over'.truncate(5).contains('…'),
        isTrue,
      );
    });
    test('max exactly length returns unchanged', () {
      const s = 'Dart';
      expect(s.truncate(4), 'Dart');
    });
  });

  // ── NullableStringExtensions ──────────────────────────────────────────────

  group('NullableStringExtensions.isNullOrEmpty', () {
    test(
      'null is null or empty',
      () => expect((null as String?).isNullOrEmpty, isTrue),
    );
    test('empty is null or empty', () => expect(''.isNullOrEmpty, isTrue));
    test(
      'space is not null or empty',
      () => expect(' '.isNullOrEmpty, isFalse),
    );
    test(
      'non-empty is not null or empty',
      () => expect('hello'.isNullOrEmpty, isFalse),
    );
  });

  group('NullableStringExtensions.isNotNullOrEmpty', () {
    test(
      'non-empty isNotNullOrEmpty',
      () => expect('hello'.isNotNullOrEmpty, isTrue),
    );
    test(
      'null isNotNullOrEmpty false',
      () => expect((null as String?).isNotNullOrEmpty, isFalse),
    );
    test(
      'empty isNotNullOrEmpty false',
      () => expect(''.isNotNullOrEmpty, isFalse),
    );
    test(
      'space is not null or empty',
      () => expect(' '.isNotNullOrEmpty, isTrue),
    );
  });

  // ── DateTimeExtensions ────────────────────────────────────────────────────

  group('DateTimeExtensions.isToday', () {
    test('now is today', () => expect(DateTime.now().isToday, isTrue));
    test('yesterday not today', () {
      expect(DateTime.now().subtract(const Duration(days: 1)).isToday, isFalse);
    });
    test('tomorrow not today', () {
      expect(DateTime.now().add(const Duration(days: 1)).isToday, isFalse);
    });
    test('same day different time is today', () {
      final d = DateTime(
        DateTime.now().year,
        DateTime.now().month,
        DateTime.now().day,
        6,
        0,
      );
      expect(d.isToday, isTrue);
    });
    test('2 days ago not today', () {
      expect(DateTime.now().subtract(const Duration(days: 2)).isToday, isFalse);
    });
  });

  group('DateTimeExtensions.isYesterday', () {
    test('yesterday is yesterday', () {
      expect(
        DateTime.now().subtract(const Duration(days: 1)).isYesterday,
        isTrue,
      );
    });
    test(
      'today not yesterday',
      () => expect(DateTime.now().isYesterday, isFalse),
    );
    test('2 days ago not yesterday', () {
      expect(
        DateTime.now().subtract(const Duration(days: 2)).isYesterday,
        isFalse,
      );
    });
    test('tomorrow not yesterday', () {
      expect(DateTime.now().add(const Duration(days: 1)).isYesterday, isFalse);
    });
  });

  group('DateTimeExtensions.startOfDay', () {
    test('hour is 0', () {
      expect(DateTime(2024, 6, 10, 15, 30).startOfDay.hour, 0);
    });
    test('minute is 0', () {
      expect(DateTime(2024, 6, 10, 15, 30).startOfDay.minute, 0);
    });
    test('day preserved', () {
      expect(DateTime(2024, 7, 15, 10, 0).startOfDay.day, 15);
    });
    test('month preserved', () {
      expect(DateTime(2024, 7, 15, 10, 0).startOfDay.month, 7);
    });
    test('year preserved', () {
      expect(DateTime(2024, 7, 15, 10, 0).startOfDay.year, 2024);
    });
  });

  group('DateTimeExtensions.endOfDay', () {
    test('hour is 23', () {
      expect(DateTime(2024, 6, 10, 3, 0).endOfDay.hour, 23);
    });
    test('minute is 59', () {
      expect(DateTime(2024, 6, 10, 3, 0).endOfDay.minute, 59);
    });
    test('day preserved', () {
      expect(DateTime(2024, 7, 15, 10, 0).endOfDay.day, 15);
    });
    test('endOfDay after startOfDay', () {
      final d = DateTime(2024, 5, 20, 12, 0);
      expect(d.endOfDay.isAfter(d.startOfDay), isTrue);
    });
  });

  // ── ListExtensions ────────────────────────────────────────────────────────

  group('ListExtensions.firstOrNull', () {
    test('non-empty returns first', () => expect([1, 2, 3].firstOrNull, 1));
    test('empty returns null', () => expect(<int>[].firstOrNull, isNull));
    test('single element returns it', () => expect(['a'].firstOrNull, 'a'));
    test('strings list', () => expect(['x', 'y'].firstOrNull, 'x'));
    test('bools list', () => expect([false, true].firstOrNull, isFalse));
    test(
      'nested list',
      () => expect(
        [
          [1, 2],
          [3],
        ].firstOrNull,
        [1, 2],
      ),
    );
  });

  group('ListExtensions.tryGet', () {
    test('valid index 0', () => expect([10, 20, 30].tryGet(0), 10));
    test('valid index 1', () => expect([10, 20, 30].tryGet(1), 20));
    test('valid last index', () => expect([10, 20, 30].tryGet(2), 30));
    test(
      'out of bounds returns null',
      () => expect([10, 20, 30].tryGet(5), isNull),
    );
    test(
      'negative index returns null',
      () => expect([10, 20, 30].tryGet(-1), isNull),
    );
    test('empty list any index null', () => expect(<int>[].tryGet(0), isNull));
    test('single element index 0', () => expect(['only'].tryGet(0), 'only'));
    test(
      'single element index 1 null',
      () => expect(['only'].tryGet(1), isNull),
    );
    test('string list', () => expect(['a', 'b', 'c'].tryGet(2), 'c'));
    test('exactly length-1 is last', () {
      final l = [1, 2, 3, 4, 5];
      expect(l.tryGet(l.length - 1), 5);
    });
    test('exactly length is null', () {
      final l = [1, 2, 3, 4, 5];
      expect(l.tryGet(l.length), isNull);
    });
  });
}
