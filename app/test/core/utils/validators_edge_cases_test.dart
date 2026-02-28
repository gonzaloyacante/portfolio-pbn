import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/utils/validators.dart';

void main() {
  // ── AppValidators.required edge cases ─────────────────────────────────────

  group('AppValidators.required — edge cases', () {
    test(
      'null returns error',
      () => expect(AppValidators.required(null), isNotNull),
    );
    test(
      'empty string returns error',
      () => expect(AppValidators.required(''), isNotNull),
    );
    test(
      'only whitespace returns error',
      () => expect(AppValidators.required('   '), isNotNull),
    );
    test(
      'single character returns null',
      () => expect(AppValidators.required('a'), isNull),
    );
    test(
      'normal text returns null',
      () => expect(AppValidators.required('Hello World'), isNull),
    );
    test(
      'number string returns null',
      () => expect(AppValidators.required('123'), isNull),
    );
    test(
      'long string returns null',
      () => expect(AppValidators.required('x' * 500), isNull),
    );
    test(
      'tab character counts as empty',
      () => expect(AppValidators.required('\t'), isNotNull),
    );
    test(
      'newline counts as empty',
      () => expect(AppValidators.required('\n'), isNotNull),
    );
    test(
      'zero integer is NOT null → accepted',
      () => expect(AppValidators.required(0), isNull),
    );
    test(
      'false boolean is NOT null → accepted',
      () => expect(AppValidators.required(false), isNull),
    );
    test('error message is non-empty', () {
      expect(AppValidators.required(null)!.isNotEmpty, isTrue);
    });
  });

  // ── AppValidators.email edge cases ────────────────────────────────────────

  group('AppValidators.email — edge cases', () {
    test(
      'null returns error',
      () => expect(AppValidators.email(null), isNotNull),
    );
    test(
      'empty string returns error',
      () => expect(AppValidators.email(''), isNotNull),
    );
    test(
      'missing @ returns error',
      () => expect(AppValidators.email('userexample.com'), isNotNull),
    );
    test(
      'missing domain returns error',
      () => expect(AppValidators.email('user@'), isNotNull),
    );
    test(
      'missing TLD returns error',
      () => expect(AppValidators.email('user@domain'), isNotNull),
    );
    test(
      'double @ returns error',
      () => expect(AppValidators.email('a@@b.com'), isNotNull),
    );
    test(
      'spaces in email returns error',
      () => expect(AppValidators.email('user @domain.com'), isNotNull),
    );
    test(
      'valid email returns null',
      () => expect(AppValidators.email('user@example.com'), isNull),
    );
    test(
      'subdomain email is valid',
      () => expect(AppValidators.email('user@mail.example.com'), isNull),
    );
    test(
      'email with + is valid',
      () => expect(AppValidators.email('user+tag@example.com'), isNull),
    );
    test(
      'email with dots before @ is valid',
      () => expect(AppValidators.email('first.last@example.com'), isNull),
    );
    test('error message for null is non-empty', () {
      expect(AppValidators.email(null)!.isNotEmpty, isTrue);
    });
    test('error message for invalid is non-empty', () {
      expect(AppValidators.email('not-email')!.isNotEmpty, isTrue);
    });
  });

  // ── AppValidators.minLength factory edge cases ────────────────────────────

  group('AppValidators.minLength(int) factory — edge cases', () {
    test(
      'returns a function',
      () => expect(AppValidators.minLength(3), isA<Function>()),
    );

    test('null returns error when min > 0', () {
      expect(AppValidators.minLength(3)(null), isNotNull);
    });
    test('empty string returns error when min > 0', () {
      expect(AppValidators.minLength(1)(''), isNotNull);
    });
    test('string exactly at min returns null', () {
      expect(AppValidators.minLength(3)('abc'), isNull);
    });
    test('string above min returns null', () {
      expect(AppValidators.minLength(3)('abcd'), isNull);
    });
    test('string below min returns error', () {
      expect(AppValidators.minLength(3)('ab'), isNotNull);
    });
    test('min of 0 accepts empty string', () {
      expect(AppValidators.minLength(0)(''), isNull);
    });
    test('min of 0 accepts non-empty string', () {
      expect(AppValidators.minLength(0)('hello'), isNull);
    });
    test('error message is non-empty', () {
      expect(AppValidators.minLength(5)('ab')!.isNotEmpty, isTrue);
    });
    test('two separate instances are independent', () {
      final v3 = AppValidators.minLength(3);
      final v10 = AppValidators.minLength(10);
      expect(v3('abc'), isNull);
      expect(v10('abc'), isNotNull);
    });
  });

  // ── AppValidators.maxLength factory edge cases ────────────────────────────

  group('AppValidators.maxLength(int) factory — edge cases', () {
    test(
      'returns a function',
      () => expect(AppValidators.maxLength(5), isA<Function>()),
    );

    test('null returns null (optional field)', () {
      expect(AppValidators.maxLength(5)(null), isNull);
    });
    test('empty string returns null', () {
      expect(AppValidators.maxLength(5)(''), isNull);
    });
    test('string at exactly max returns null', () {
      expect(AppValidators.maxLength(5)('abcde'), isNull);
    });
    test('string below max returns null', () {
      expect(AppValidators.maxLength(5)('ab'), isNull);
    });
    test('string above max returns error', () {
      expect(AppValidators.maxLength(5)('abcdef'), isNotNull);
    });
    test('max 0: non-empty string returns error', () {
      expect(AppValidators.maxLength(0)('a'), isNotNull);
    });
    test('max 0: null returns null', () {
      expect(AppValidators.maxLength(0)(null), isNull);
    });
    test('error message is non-empty', () {
      expect(AppValidators.maxLength(2)('hello')!.isNotEmpty, isTrue);
    });
    test('large max accepts long string', () {
      expect(AppValidators.maxLength(1000)('x' * 999), isNull);
    });
    test('large max rejects string that exceeds it', () {
      expect(AppValidators.maxLength(1000)('x' * 1001), isNotNull);
    });
  });

  // ── AppValidators.phone edge cases ────────────────────────────────────────

  group('AppValidators.phone — edge cases', () {
    test(
      'null returns null (optional)',
      () => expect(AppValidators.phone(null), isNull),
    );
    test(
      'empty string returns null (optional)',
      () => expect(AppValidators.phone(''), isNull),
    );
    test(
      '9-char numeric phone is valid',
      () => expect(AppValidators.phone('600123456'), isNull),
    );
    test(
      'phone with country prefix is valid',
      () => expect(AppValidators.phone('+34 600 123 456'), isNull),
    );
    test('too short (< 9 after stripping spaces) returns error', () {
      expect(AppValidators.phone('12345'), isNotNull);
    });
    test('exactly 9 chars after stripping spaces is valid', () {
      expect(AppValidators.phone('123456789'), isNull);
    });
    test('phone with dashes is valid if length ok', () {
      // "600-123-456" stripped of spaces → "600-123-456" (10 chars) → valid
      expect(AppValidators.phone('600-123-456'), isNull);
    });
    test('error message is non-empty', () {
      expect(AppValidators.phone('123')!.isNotEmpty, isTrue);
    });
  });

  // ── AppValidators.url edge cases ──────────────────────────────────────────

  group('AppValidators.url — edge cases', () {
    test(
      'null returns null (optional)',
      () => expect(AppValidators.url(null), isNull),
    );
    test(
      'empty string returns null (optional)',
      () => expect(AppValidators.url(''), isNull),
    );
    test(
      'valid http URL returns null',
      () => expect(AppValidators.url('http://example.com'), isNull),
    );
    test(
      'valid https URL returns null',
      () => expect(AppValidators.url('https://example.com'), isNull),
    );
    test(
      'URL with path is valid',
      () =>
          expect(AppValidators.url('https://example.com/path/to/page'), isNull),
    );
    test(
      'URL with query is valid',
      () => expect(AppValidators.url('https://example.com?key=value'), isNull),
    );
    test(
      'bare word returns error',
      () => expect(AppValidators.url('notaurl'), isNotNull),
    );
    test(
      'missing scheme returns error',
      () => expect(AppValidators.url('example.com'), isNotNull),
    );
    test(
      'ftp scheme returns error',
      () => expect(AppValidators.url('ftp://example.com'), isNotNull),
    );
    test(
      'URL with subdomain is valid',
      () => expect(AppValidators.url('https://sub.domain.example.com'), isNull),
    );
    test('error message is non-empty', () {
      expect(AppValidators.url('not-a-url')!.isNotEmpty, isTrue);
    });
  });

  // ── AppValidators.compose edge cases ──────────────────────────────────────

  group('AppValidators.compose — edge cases', () {
    test('returns a function', () {
      final composed = AppValidators.compose([
        AppValidators.minLength(2),
        AppValidators.maxLength(10),
      ]);
      expect(composed, isA<Function>());
    });

    test('empty validators list always returns null', () {
      final composed = AppValidators.compose([]);
      expect(composed('anything'), isNull);
      expect(composed(null), isNull);
    });

    test('single validator passes through', () {
      final composed = AppValidators.compose([AppValidators.minLength(3)]);
      expect(composed('ab'), isNotNull);
      expect(composed('abc'), isNull);
    });

    test('first failing validator stops the chain', () {
      int callCount = 0;
      String v1(String? val) {
        callCount++;
        return 'Error from v1';
      }

      Null v2(String? val) {
        callCount++;
        return null;
      }

      final composed = AppValidators.compose([v1, v2]);
      composed('value');
      expect(callCount, 1); // v2 never called
    });

    test('all validators pass → returns null', () {
      final composed = AppValidators.compose([
        AppValidators.minLength(2),
        AppValidators.maxLength(10),
      ]);
      expect(composed('hello'), isNull);
    });

    test('first validator fails → returns first error', () {
      final composed = AppValidators.compose([
        AppValidators.minLength(10),
        AppValidators.maxLength(20),
      ]);
      expect(composed('hi'), isNotNull);
    });

    test('second validator fails → returns second error', () {
      final composed = AppValidators.compose([
        AppValidators.minLength(1),
        AppValidators.maxLength(3),
      ]);
      expect(composed('toolong'), isNotNull);
    });

    test('composed email + required works', () {
      String? emailValidator(String? val) => AppValidators.email(val);
      final composed = AppValidators.compose([emailValidator]);
      expect(composed(null), isNotNull);
      expect(composed('user@example.com'), isNull);
    });
  });
}
