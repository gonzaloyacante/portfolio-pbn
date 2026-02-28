import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/utils/validators.dart';

void main() {
  // ── required ──────────────────────────────────────────────────────────────

  group('AppValidators.required — more cases', () {
    test(
      'non-empty string passes',
      () => expect(AppValidators.required('value'), isNull),
    );
    test(
      'whitespace-only fails',
      () => expect(AppValidators.required('   '), isNotNull),
    );
    test('null fails', () => expect(AppValidators.required(null), isNotNull));
    test('empty fails', () => expect(AppValidators.required(''), isNotNull));
    test(
      'single char passes',
      () => expect(AppValidators.required('x'), isNull),
    );
    test(
      'unicode passes',
      () => expect(AppValidators.required('ñoño'), isNull),
    );
    test('numbers pass', () => expect(AppValidators.required('42'), isNull));
    test(
      'multi-word passes',
      () => expect(AppValidators.required('hello world'), isNull),
    );
  });

  // ── email ─────────────────────────────────────────────────────────────────

  group('AppValidators.email — more cases', () {
    test(
      'valid email passes',
      () => expect(AppValidators.email('a@b.com'), isNull),
    );
    test(
      'null returns required error',
      () => expect(AppValidators.email(null), isNotNull),
    );
    test(
      'empty returns required error',
      () => expect(AppValidators.email(''), isNotNull),
    );
    test(
      'invalid no-at fails',
      () => expect(AppValidators.email('nodomain'), isNotNull),
    );
    test(
      'invalid missing TLD fails',
      () => expect(AppValidators.email('user@'), isNotNull),
    );
    test(
      'spaces fail',
      () => expect(AppValidators.email('u s@a.com'), isNotNull),
    );
    test(
      'email with subdomain passes',
      () => expect(AppValidators.email('user@mail.example.com'), isNull),
    );
    test(
      'email with plus tag passes',
      () => expect(AppValidators.email('user+tag@example.com'), isNull),
    );
  });

  // ── minLength ─────────────────────────────────────────────────────────────

  group('AppValidators.minLength — more cases', () {
    test(
      '3 chars vs min=3 passes',
      () => expect(AppValidators.minLength(3)('abc'), isNull),
    );
    test(
      '2 chars vs min=3 fails',
      () => expect(AppValidators.minLength(3)('ab'), isNotNull),
    );
    test(
      'null returns error',
      () => expect(AppValidators.minLength(5)(null), isNotNull),
    );
    test(
      'empty string shorter than min fails',
      () => expect(AppValidators.minLength(5)(''), isNotNull),
    );
    test(
      'min=1 with single char passes',
      () => expect(AppValidators.minLength(1)('x'), isNull),
    );
    test(
      'min=1 with long string passes',
      () => expect(AppValidators.minLength(1)('hello'), isNull),
    );
    test('min=10 with 10 chars passes', () {
      expect(AppValidators.minLength(10)('0123456789'), isNull);
    });
    test('min=10 with 9 chars fails', () {
      expect(AppValidators.minLength(10)('012345678'), isNotNull);
    });
    test('unicode chars count', () {
      expect(AppValidators.minLength(3)('ñoó'), isNull);
    });
  });

  // ── maxLength ─────────────────────────────────────────────────────────────

  group('AppValidators.maxLength — more cases', () {
    test(
      '5 chars vs max=10 passes',
      () => expect(AppValidators.maxLength(10)('hello'), isNull),
    );
    test(
      '10 chars vs max=10 passes',
      () => expect(AppValidators.maxLength(10)('0123456789'), isNull),
    );
    test(
      '11 chars vs max=10 fails',
      () => expect(AppValidators.maxLength(10)('01234567890'), isNotNull),
    );
    test(
      'null passes (optional)',
      () => expect(AppValidators.maxLength(5)(null), isNull),
    );
    test('empty passes', () => expect(AppValidators.maxLength(5)(''), isNull));
    test('max=150 long text passes', () {
      final s = 'a' * 150;
      expect(AppValidators.maxLength(150)(s), isNull);
    });
    test('max=150 over limit fails', () {
      final s = 'a' * 151;
      expect(AppValidators.maxLength(150)(s), isNotNull);
    });
    test('max=500 description passes', () {
      final s = 'a' * 499;
      expect(AppValidators.maxLength(500)(s), isNull);
    });
  });

  // ── url ───────────────────────────────────────────────────────────────────

  group('AppValidators.url — more cases', () {
    test(
      'http url passes',
      () => expect(AppValidators.url('http://example.com'), isNull),
    );
    test(
      'https url passes',
      () => expect(AppValidators.url('https://example.com'), isNull),
    );
    test(
      'null passes (optional)',
      () => expect(AppValidators.url(null), isNull),
    );
    test(
      'empty passes (optional)',
      () => expect(AppValidators.url(''), isNull),
    );
    test(
      'no protocol fails',
      () => expect(AppValidators.url('example.com'), isNotNull),
    );
    test(
      'ftp invalid',
      () => expect(AppValidators.url('ftp://example.com'), isNotNull),
    );
    test(
      'https with path passes',
      () => expect(AppValidators.url('https://example.com/path'), isNull),
    );
    test('https with subdomain passes', () {
      expect(AppValidators.url('https://sub.example.com'), isNull);
    });
  });

  // ── phone ─────────────────────────────────────────────────────────────────

  group('AppValidators.phone — more cases', () {
    test(
      'null passes (optional)',
      () => expect(AppValidators.phone(null), isNull),
    );
    test(
      'empty passes (optional)',
      () => expect(AppValidators.phone(''), isNull),
    );
    test(
      'international format passes',
      () => expect(AppValidators.phone('+34600000000'), isNull),
    );
    test(
      'local 9-digit passes',
      () => expect(AppValidators.phone('600000000'), isNull),
    );
    test(
      '8-digit string fails',
      () => expect(AppValidators.phone('12345678'), isNotNull),
    );
    test(
      'short 3-digit fails',
      () => expect(AppValidators.phone('123'), isNotNull),
    );
    test('spaces in number fails or passes based on impl', () {
      // just check it doesn't throw
      AppValidators.phone('600 000 000');
    });
  });

  // ── compose ───────────────────────────────────────────────────────────────

  group('AppValidators.compose — chaining validators', () {
    test('empty validators returns null', () {
      final v = AppValidators.compose([]);
      expect(v('anything'), isNull);
    });
    test('single minLength in compose passes', () {
      final v = AppValidators.compose([AppValidators.minLength(3)]);
      expect(v('hello'), isNull);
    });
    test('single minLength in compose fails', () {
      final v = AppValidators.compose([AppValidators.minLength(3)]);
      expect(v('hi'), isNotNull);
    });
    test('minLength + maxLength both pass', () {
      final v = AppValidators.compose([
        AppValidators.minLength(3),
        AppValidators.maxLength(20),
      ]);
      expect(v('hello'), isNull);
    });
    test('minLength fails first in compose', () {
      final v = AppValidators.compose([
        AppValidators.minLength(5),
        AppValidators.maxLength(20),
      ]);
      expect(v('hi'), isNotNull);
    });
    test('maxLength fails in compose', () {
      final v = AppValidators.compose([
        AppValidators.minLength(3),
        AppValidators.maxLength(5),
      ]);
      expect(v('toolongstring'), isNotNull);
    });
    test('null fails through minLength', () {
      final v = AppValidators.compose([AppValidators.minLength(3)]);
      expect(v(null), isNotNull);
    });
    test('empty fails through minLength', () {
      final v = AppValidators.compose([AppValidators.minLength(3)]);
      expect(v(''), isNotNull);
    });
  });

  group('AppValidators — range via compose', () {
    final rangeValidator = AppValidators.compose([
      AppValidators.minLength(3),
      AppValidators.maxLength(20),
    ]);
    test('within range passes', () => expect(rangeValidator('hello'), isNull));
    test('below range fails', () => expect(rangeValidator('ab'), isNotNull));
    test(
      'above range fails',
      () => expect(rangeValidator('a' * 21), isNotNull),
    );
    test('exactly min passes', () => expect(rangeValidator('abc'), isNull));
    test('exactly max passes', () => expect(rangeValidator('a' * 20), isNull));
    test(
      'null returns error from minLength',
      () => expect(rangeValidator(null), isNotNull),
    );
  });
}
