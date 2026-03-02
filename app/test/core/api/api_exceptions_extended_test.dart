import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/api/api_exceptions.dart';

void main() {
  // ── AppException (base) ───────────────────────────────────────────────────

  group('AppException — base properties', () {
    test('NetworkException is AppException', () {
      expect(const NetworkException(), isA<AppException>());
    });
    test('TimeoutException is AppException', () {
      expect(const TimeoutException(), isA<AppException>());
    });
    test('HttpException is AppException', () {
      expect(const HttpException(statusCode: 404), isA<AppException>());
    });
    test('UnauthorizedException is AppException', () {
      expect(const UnauthorizedException(), isA<AppException>());
    });
    test('ServerException is AppException', () {
      expect(const ServerException(), isA<AppException>());
    });
    test('StorageException is AppException', () {
      expect(const StorageException(), isA<AppException>());
    });
    test('ParseException is AppException', () {
      expect(const ParseException(), isA<AppException>());
    });
  });

  // ── NetworkException ──────────────────────────────────────────────────────

  group('NetworkException', () {
    test('default message', () {
      expect(const NetworkException().message, 'Sin conexión a internet');
    });
    test('custom message', () {
      expect(
        const NetworkException(message: 'No hay red').message,
        'No hay red',
      );
    });
    test('toString includes type', () {
      expect(const NetworkException().toString(), contains('NetworkException'));
    });
    test('toString includes message', () {
      expect(const NetworkException().toString(), contains('Sin conexión'));
    });
    test('is Exception', () {
      expect(const NetworkException(), isA<Exception>());
    });
  });

  // ── TimeoutException ──────────────────────────────────────────────────────

  group('TimeoutException', () {
    test('default message', () {
      expect(const TimeoutException().message, 'La solicitud tardó demasiado');
    });
    test('custom message', () {
      expect(
        const TimeoutException(message: 'Timeout 30s').message,
        'Timeout 30s',
      );
    });
    test('toString includes type', () {
      expect(const TimeoutException().toString(), contains('TimeoutException'));
    });
  });

  // ── HttpException ─────────────────────────────────────────────────────────

  group('HttpException — status codes', () {
    test('statusCode is stored', () {
      expect(const HttpException(statusCode: 400).statusCode, 400);
    });
    test('default message', () {
      expect(const HttpException(statusCode: 500).message, 'Error HTTP');
    });
    test('custom message', () {
      expect(
        const HttpException(statusCode: 403, message: 'Forbidden').message,
        'Forbidden',
      );
    });
    test('errors default to null', () {
      expect(const HttpException(statusCode: 400).errors, isNull);
    });
    test('errors can be set', () {
      final e = const HttpException(
        statusCode: 422,
        errors: {'field': 'required'},
      );
      expect(e.errors!['field'], 'required');
    });
  });

  group('HttpException — isClientError', () {
    test(
      '400 is client error',
      () => expect(const HttpException(statusCode: 400).isClientError, isTrue),
    );
    test(
      '401 is client error',
      () => expect(const HttpException(statusCode: 401).isClientError, isTrue),
    );
    test(
      '404 is client error',
      () => expect(const HttpException(statusCode: 404).isClientError, isTrue),
    );
    test(
      '499 is client error',
      () => expect(const HttpException(statusCode: 499).isClientError, isTrue),
    );
    test(
      '500 is NOT client error',
      () => expect(const HttpException(statusCode: 500).isClientError, isFalse),
    );
    test(
      '200 is NOT client error',
      () => expect(const HttpException(statusCode: 200).isClientError, isFalse),
    );
  });

  group('HttpException — isServerError', () {
    test(
      '500 is server error',
      () => expect(const HttpException(statusCode: 500).isServerError, isTrue),
    );
    test(
      '503 is server error',
      () => expect(const HttpException(statusCode: 503).isServerError, isTrue),
    );
    test(
      '599 is server error',
      () => expect(const HttpException(statusCode: 599).isServerError, isTrue),
    );
    test(
      '400 is NOT server error',
      () => expect(const HttpException(statusCode: 400).isServerError, isFalse),
    );
    test(
      '200 is NOT server error',
      () => expect(const HttpException(statusCode: 200).isServerError, isFalse),
    );
  });

  // ── Auth exceptions ───────────────────────────────────────────────────────

  group('UnauthorizedException', () {
    test(
      'default message',
      () => expect(const UnauthorizedException().message, 'No autorizado'),
    );
    test('custom message', () {
      expect(
        const UnauthorizedException(message: 'Invalid token').message,
        'Invalid token',
      );
    });
    test('toString', () {
      expect(
        const UnauthorizedException().toString(),
        contains('UnauthorizedException'),
      );
    });
  });

  group('TokenExpiredException', () {
    test(
      'default message',
      () => expect(const TokenExpiredException().message, 'Sesión expirada'),
    );
    test('custom message', () {
      expect(
        const TokenExpiredException(message: 'JWT expired').message,
        'JWT expired',
      );
    });
  });

  group('SessionExpiredException', () {
    test('default message contains "caducado"', () {
      expect(const SessionExpiredException().message, contains('caducado'));
    });
    test('custom message', () {
      expect(
        const SessionExpiredException(message: 'Expired').message,
        'Expired',
      );
    });
  });

  group('ForbiddenException', () {
    test(
      'default message',
      () => expect(const ForbiddenException().message, 'Sin permisos'),
    );
    test('custom message', () {
      expect(
        const ForbiddenException(message: 'Admin only').message,
        'Admin only',
      );
    });
  });

  // ── Business exceptions ───────────────────────────────────────────────────

  group('NotFoundException', () {
    test(
      'default message',
      () => expect(const NotFoundException().message, 'Recurso no encontrado'),
    );
    test('custom message', () {
      expect(
        const NotFoundException(message: 'Project not found').message,
        'Project not found',
      );
    });
    test('toString includes type', () {
      expect(
        const NotFoundException().toString(),
        contains('NotFoundException'),
      );
    });
  });

  group('ConflictException', () {
    test('default message', () {
      expect(
        const ConflictException().message,
        'Conflicto con el estado actual',
      );
    });
    test('custom message', () {
      expect(
        const ConflictException(message: 'Duplicate slug').message,
        'Duplicate slug',
      );
    });
  });

  group('ValidationException', () {
    test(
      'default message',
      () => expect(const ValidationException().message, 'Datos inválidos'),
    );
    test('fieldErrors defaults to empty map', () {
      expect(const ValidationException().fieldErrors, isEmpty);
    });
    test('fieldErrors can be set', () {
      const e = ValidationException(
        fieldErrors: {'email': 'Invalid email', 'name': 'Required'},
      );
      expect(e.fieldErrors['email'], 'Invalid email');
      expect(e.fieldErrors['name'], 'Required');
    });
    test('custom message', () {
      expect(
        const ValidationException(message: 'Form error').message,
        'Form error',
      );
    });
  });

  group('RateLimitException', () {
    test('default message contains "solicitudes"', () {
      expect(const RateLimitException().message, contains('solicitudes'));
    });
    test('custom message', () {
      expect(const RateLimitException(message: 'Too many').message, 'Too many');
    });
  });

  // ── Server/Local exceptions ───────────────────────────────────────────────

  group('ServerException', () {
    test(
      'default message',
      () =>
          expect(const ServerException().message, 'Error interno del servidor'),
    );
    test('custom message', () {
      expect(
        const ServerException(message: 'DB connection failed').message,
        'DB connection failed',
      );
    });
  });

  group('StorageException', () {
    test('default message', () {
      expect(
        const StorageException().message,
        'Error al acceder a datos locales',
      );
    });
    test('custom message', () {
      expect(
        const StorageException(message: 'SQLite error').message,
        'SQLite error',
      );
    });
  });

  group('ParseException', () {
    test('default message', () {
      expect(const ParseException().message, 'Error al procesar la respuesta');
    });
    test('custom message', () {
      expect(
        const ParseException(message: 'JSON parse error').message,
        'JSON parse error',
      );
    });
  });

  // ── Exception throwing behavior ───────────────────────────────────────────

  group('Exceptions — can be thrown and caught', () {
    test('NetworkException can be thrown and caught as Exception', () {
      expect(
        () => throw const NetworkException(),
        throwsA(isA<NetworkException>()),
      );
    });
    test('HttpException can be thrown and caught', () {
      expect(
        () => throw const HttpException(statusCode: 404),
        throwsA(isA<HttpException>()),
      );
    });
    test('ValidationException can be thrown and caught', () {
      expect(
        () => throw const ValidationException(),
        throwsA(isA<ValidationException>()),
      );
    });
    test('All AppExceptions caught as AppException', () {
      void throwIt() => throw const ServerException();
      expect(() => throwIt(), throwsA(isA<AppException>()));
    });
  });
}
