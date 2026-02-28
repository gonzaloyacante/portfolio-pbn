import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/models/api_response.dart';

void main() {
  // ── ApiResponse<String> ───────────────────────────────────────────────────

  group('ApiResponse<String> — fromJson', () {
    test('success with string data', () {
      final r = ApiResponse<String>.fromJson({
        'success': true,
        'data': 'hello',
      }, (e) => e as String);
      expect(r.success, isTrue);
      expect(r.data, 'hello');
    });
    test('failure with error message', () {
      final r = ApiResponse<String>.fromJson({
        'success': false,
        'error': 'Not found',
      }, (e) => e as String);
      expect(r.success, isFalse);
      expect(r.error, 'Not found');
    });
    test('success with message', () {
      final r = ApiResponse<String>.fromJson({
        'success': true,
        'data': 'ok',
        'message': 'Created',
      }, (e) => e as String);
      expect(r.message, 'Created');
    });
    test('null data field', () {
      final r = ApiResponse<String?>.fromJson({
        'success': true,
      }, (e) => e as String?);
      expect(r.data, isNull);
    });
  });

  group('ApiResponse<int> — fromJson', () {
    test('success with int data', () {
      final r = ApiResponse<int>.fromJson({
        'success': true,
        'data': 42,
      }, (e) => e as int);
      expect(r.data, 42);
    });
    test('int 0 is valid data', () {
      final r = ApiResponse<int>.fromJson({
        'success': true,
        'data': 0,
      }, (e) => e as int);
      expect(r.data, 0);
    });
  });

  group('ApiResponse<bool> — fromJson', () {
    test('success with bool data', () {
      final r = ApiResponse<bool>.fromJson({
        'success': true,
        'data': true,
      }, (e) => e as bool);
      expect(r.data, isTrue);
    });
    test('false is valid bool data', () {
      final r = ApiResponse<bool>.fromJson({
        'success': true,
        'data': false,
      }, (e) => e as bool);
      expect(r.data, isFalse);
    });
  });

  group('ApiResponse<List<dynamic>> — fromJson', () {
    test('success with list data', () {
      final r = ApiResponse<List<dynamic>>.fromJson({
        'success': true,
        'data': [1, 2, 3],
      }, (e) => e as List<dynamic>);
      expect(r.data, [1, 2, 3]);
    });
    test('empty list is valid', () {
      final r = ApiResponse<List<dynamic>>.fromJson({
        'success': true,
        'data': <dynamic>[],
      }, (e) => e as List<dynamic>);
      expect(r.data, isEmpty);
    });
  });

  // ── ApiResponse — construction ────────────────────────────────────────────

  group('ApiResponse — direct construction', () {
    test('success response has success=true', () {
      const r = ApiResponse<String>(success: true, data: 'value');
      expect(r.success, isTrue);
      expect(r.data, 'value');
    });
    test('error response has success=false', () {
      const r = ApiResponse<String>(success: false, error: 'Oops');
      expect(r.success, isFalse);
      expect(r.error, 'Oops');
    });
    test('can have both message and data', () {
      const r = ApiResponse<int>(success: true, data: 5, message: 'Done');
      expect(r.data, 5);
      expect(r.message, 'Done');
    });
    test('error and message can coexist', () {
      const r = ApiResponse<String>(
        success: false,
        error: 'Error',
        message: 'Try again',
      );
      expect(r.error, 'Error');
      expect(r.message, 'Try again');
    });
  });

  // ── ApiResponse — copyWith ────────────────────────────────────────────────

  group('ApiResponse — copyWith', () {
    const base = ApiResponse<String>(success: true, data: 'original');

    test('copyWith success', () {
      expect(base.copyWith(success: false).success, isFalse);
    });
    test('copyWith data', () {
      expect(base.copyWith(data: 'new').data, 'new');
    });
    test('copyWith error', () {
      expect(base.copyWith(error: 'new error').error, 'new error');
    });
    test('original unchanged', () {
      final _ = base.copyWith(data: 'changed');
      expect(base.data, 'original');
    });
  });

  // ── ApiResponse — equality ────────────────────────────────────────────────

  group('ApiResponse — equality', () {
    test('identical construction is equal', () {
      expect(
        const ApiResponse<String>(success: true, data: 'test'),
        const ApiResponse<String>(success: true, data: 'test'),
      );
    });
    test('different data is not equal', () {
      expect(
        const ApiResponse<String>(success: true, data: 'a'),
        isNot(const ApiResponse<String>(success: true, data: 'b')),
      );
    });
    test('different success is not equal', () {
      expect(
        const ApiResponse<String>(success: true),
        isNot(const ApiResponse<String>(success: false)),
      );
    });
  });

  // ── ApiResponse — practical scenarios ────────────────────────────────────

  group('ApiResponse — practical scenarios', () {
    test('create success from data', () {
      const resp = ApiResponse<Map<String, dynamic>>(
        success: true,
        data: {'id': '1', 'name': 'Test'},
      );
      expect(resp.success, isTrue);
      expect(resp.data?['id'], '1');
    });
    test('error with no data', () {
      const resp = ApiResponse<String>(
        success: false,
        error: 'Unauthorized',
        message: 'Login required',
      );
      expect(resp.data, isNull);
      expect(resp.error, 'Unauthorized');
    });
    test('null? data is valid for nullable generic', () {
      const resp = ApiResponse<String?>(success: true);
      expect(resp.success, isTrue);
      expect(resp.data, isNull);
    });
  });
}
