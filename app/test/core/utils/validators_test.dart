import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/utils/validators.dart';

void main() {
  group('AppValidators.required', () {
    test('returns error for null', () {
      expect(AppValidators.required(null), 'Campo requerido');
    });

    test('returns error for empty string', () {
      expect(AppValidators.required(''), 'Campo requerido');
    });

    test('returns error for whitespace-only string', () {
      expect(AppValidators.required('   '), 'Campo requerido');
    });

    test('returns null for non-empty string', () {
      expect(AppValidators.required('hello'), isNull);
    });

    test('returns null for single character', () {
      expect(AppValidators.required('a'), isNull);
    });

    test('returns null for whitespace + content', () {
      expect(AppValidators.required(' hello '), isNull);
    });

    test('returns error for tab-only string', () {
      expect(AppValidators.required('\t'), 'Campo requerido');
    });

    test('returns error for newline-only string', () {
      expect(AppValidators.required('\n'), 'Campo requerido');
    });

    test('returns null for integer value', () {
      expect(AppValidators.required(42), isNull);
    });

    test('returns null for zero integer', () {
      expect(AppValidators.required(0), isNull);
    });
  });

  group('AppValidators.email', () {
    test('returns error for null', () {
      expect(AppValidators.email(null), 'Email requerido');
    });

    test('returns error for empty string', () {
      expect(AppValidators.email(''), 'Email requerido');
    });

    test('returns error for invalid email (no @)', () {
      expect(AppValidators.email('notanemail'), 'Email inválido');
    });

    test('returns error for invalid email (no domain)', () {
      expect(AppValidators.email('user@'), 'Email inválido');
    });

    test('returns error for invalid email (no TLD)', () {
      expect(AppValidators.email('user@domain'), 'Email inválido');
    });

    test('returns null for valid email', () {
      expect(AppValidators.email('user@example.com'), isNull);
    });

    test('returns null for email with subdomain', () {
      expect(AppValidators.email('user@mail.example.com'), isNull);
    });

    test('returns null for email with plus sign', () {
      expect(AppValidators.email('user+tag@example.com'), isNull);
    });

    test('returns null for uppercase email', () {
      expect(AppValidators.email('USER@EXAMPLE.COM'), isNull);
    });

    test('returns error for email with spaces', () {
      expect(AppValidators.email('user @example.com'), 'Email inválido');
    });

    test('returns error for email starting with whitespace', () {
      expect(AppValidators.email(' user@example.com'), 'Email inválido');
    });
  });

  group('AppValidators.minLength', () {
    test('returns error when below min', () {
      final validator = AppValidators.minLength(5);
      expect(validator('abc'), 'Mínimo 5 caracteres');
    });

    test('returns error for null value', () {
      final validator = AppValidators.minLength(3);
      expect(validator(null), 'Mínimo 3 caracteres');
    });

    test('returns null when exactly at min', () {
      final validator = AppValidators.minLength(4);
      expect(validator('abcd'), isNull);
    });

    test('returns null when above min', () {
      final validator = AppValidators.minLength(2);
      expect(validator('hello world'), isNull);
    });

    test('min of 1 returns error for empty string', () {
      final validator = AppValidators.minLength(1);
      expect(validator(''), 'Mínimo 1 caracteres');
    });

    test('min of 0 never returns error', () {
      final validator = AppValidators.minLength(0);
      expect(validator(''), isNull);
    });

    test('error message includes min count', () {
      final validator = AppValidators.minLength(10);
      expect(validator('short'), 'Mínimo 10 caracteres');
    });
  });

  group('AppValidators.maxLength', () {
    test('returns error when above max', () {
      final validator = AppValidators.maxLength(3);
      expect(validator('abcde'), 'Máximo 3 caracteres');
    });

    test('returns null for null value', () {
      final validator = AppValidators.maxLength(5);
      expect(validator(null), isNull);
    });

    test('returns null when exactly at max', () {
      final validator = AppValidators.maxLength(5);
      expect(validator('hello'), isNull);
    });

    test('returns null when below max', () {
      final validator = AppValidators.maxLength(10);
      expect(validator('hi'), isNull);
    });

    test('returns null for empty string', () {
      final validator = AppValidators.maxLength(5);
      expect(validator(''), isNull);
    });

    test('error message includes max count', () {
      final validator = AppValidators.maxLength(8);
      expect(validator('0123456789'), 'Máximo 8 caracteres');
    });
  });

  group('AppValidators.phone', () {
    test('returns null for null (optional field)', () {
      expect(AppValidators.phone(null), isNull);
    });

    test('returns null for empty string (optional)', () {
      expect(AppValidators.phone(''), isNull);
    });

    test('returns error for too-short number', () {
      expect(AppValidators.phone('12345678'), 'Teléfono inválido');
    });

    test('returns null for exactly 9 digits', () {
      expect(AppValidators.phone('666777888'), isNull);
    });

    test('returns null for phone with spaces (normalised)', () {
      expect(AppValidators.phone('666 777 888'), isNull);
    });

    test('returns null for international format', () {
      expect(AppValidators.phone('+34 666 777 888'), isNull);
    });

    test('returns error for only spaces giving < 9 chars', () {
      expect(AppValidators.phone('   123  '), 'Teléfono inválido');
    });
  });

  group('AppValidators.url', () {
    test('returns null for null (optional)', () {
      expect(AppValidators.url(null), isNull);
    });

    test('returns null for empty string (optional)', () {
      expect(AppValidators.url(''), isNull);
    });

    test('returns null for valid http URL', () {
      expect(AppValidators.url('http://example.com'), isNull);
    });

    test('returns null for valid https URL', () {
      expect(AppValidators.url('https://www.example.com/path'), isNull);
    });

    test('returns error for URL without scheme', () {
      expect(AppValidators.url('www.example.com'), isNotNull);
    });

    test('returns error for ftp URL', () {
      expect(AppValidators.url('ftp://files.example.com'), isNotNull);
    });

    test('returns error for invalid string', () {
      expect(AppValidators.url('not a url'), isNotNull);
    });

    test('returns null for https URL with query params', () {
      expect(AppValidators.url('https://example.com?q=test&page=1'), isNull);
    });
  });

  group('AppValidators.compose', () {
    test('passes all validators for valid input', () {
      final validator = AppValidators.compose([
        AppValidators.minLength(3),
        AppValidators.maxLength(10),
      ]);
      expect(validator('hello'), isNull);
    });

    test('returns first error when first validator fails', () {
      final validator = AppValidators.compose([
        AppValidators.minLength(5),
        AppValidators.maxLength(10),
      ]);
      expect(validator('ab'), 'Mínimo 5 caracteres');
    });

    test('returns second error when first passes but second fails', () {
      final validator = AppValidators.compose([
        AppValidators.minLength(2),
        AppValidators.maxLength(5),
      ]);
      expect(validator('toolongstring'), 'Máximo 5 caracteres');
    });

    test('returns null for empty list of validators', () {
      final validator = AppValidators.compose([]);
      expect(validator('any'), isNull);
    });

    test('works with single validator', () {
      final validator = AppValidators.compose([AppValidators.minLength(1)]);
      expect(validator(''), 'Mínimo 1 caracteres');
    });
  });
}
