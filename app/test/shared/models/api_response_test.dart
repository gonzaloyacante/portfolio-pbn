import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/models/api_response.dart';

void main() {
  group('ApiResponse — construction', () {
    test('creates with required success=true', () {
      const r = ApiResponse<String>(success: true);
      expect(r.success, true);
    });

    test('creates with success=false', () {
      const r = ApiResponse<String>(success: false);
      expect(r.success, false);
    });

    test('data defaults to null', () {
      const r = ApiResponse<String>(success: true);
      expect(r.data, isNull);
    });

    test('error defaults to null', () {
      const r = ApiResponse<String>(success: true);
      expect(r.error, isNull);
    });

    test('message defaults to null', () {
      const r = ApiResponse<String>(success: true);
      expect(r.message, isNull);
    });

    test('stores data correctly', () {
      const r = ApiResponse<String>(success: true, data: 'hello');
      expect(r.data, 'hello');
    });

    test('stores error correctly', () {
      const r = ApiResponse<String>(success: false, error: 'Not found');
      expect(r.error, 'Not found');
    });

    test('stores message correctly', () {
      const r = ApiResponse<String>(success: true, message: 'Created');
      expect(r.message, 'Created');
    });
  });

  group('ApiResponse — with integer data', () {
    test('data can be int', () {
      const r = ApiResponse<int>(success: true, data: 42);
      expect(r.data, 42);
    });
  });

  group('ApiResponse — with list data', () {
    test('data can be a list', () {
      const r = ApiResponse<List<String>>(success: true, data: ['a', 'b', 'c']);
      expect(r.data, ['a', 'b', 'c']);
    });
  });

  group('ApiResponse — error response', () {
    test('typical error response has success=false and error set', () {
      const r = ApiResponse<String?>(
        success: false,
        error: 'Unauthorized',
        message: 'You must log in first.',
      );
      expect(r.success, false);
      expect(r.error, 'Unauthorized');
      expect(r.message, 'You must log in first.');
      expect(r.data, isNull);
    });
  });

  group('ApiResponse — equality (Freezed)', () {
    test('two identical instances are equal', () {
      const r1 = ApiResponse<String>(success: true, data: 'x');
      const r2 = ApiResponse<String>(success: true, data: 'x');
      expect(r1, equals(r2));
    });

    test('instances with different data are not equal', () {
      const r1 = ApiResponse<String>(success: true, data: 'x');
      const r2 = ApiResponse<String>(success: true, data: 'y');
      expect(r1, isNot(equals(r2)));
    });
  });

  group('ApiResponse — copyWith (Freezed)', () {
    test('copyWith updates success', () {
      const r = ApiResponse<String>(success: true);
      final updated = r.copyWith(success: false);
      expect(updated.success, false);
    });

    test('copyWith updates data', () {
      const r = ApiResponse<String>(success: true, data: 'original');
      final updated = r.copyWith(data: 'changed');
      expect(updated.data, 'changed');
    });

    test('copyWith preserves unchanged fields', () {
      const r = ApiResponse<String>(success: true, data: 'x', error: 'err');
      final updated = r.copyWith(message: 'msg');
      expect(updated.success, true);
      expect(updated.data, 'x');
      expect(updated.error, 'err');
      expect(updated.message, 'msg');
    });
  });
}
