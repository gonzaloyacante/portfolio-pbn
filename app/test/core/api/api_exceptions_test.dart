import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/api/api_exceptions.dart';

void main() {
  group('AppException.toString', () {
    test('NetworkException toString includes class name and message', () {
      const e = NetworkException();
      expect(e.toString(), contains('NetworkException'));
      expect(e.toString(), contains('Sin conexión a internet'));
    });

    test('ServerException toString includes class name and message', () {
      const e = ServerException();
      expect(e.toString(), contains('ServerException'));
      expect(e.toString(), contains('Error interno del servidor'));
    });
  });

  group('NetworkException', () {
    test('has default message', () {
      const e = NetworkException();
      expect(e.message, 'Sin conexión a internet');
    });

    test('accepts custom message', () {
      const e = NetworkException(message: 'Offline');
      expect(e.message, 'Offline');
    });

    test('is an AppException', () {
      const e = NetworkException();
      expect(e, isA<AppException>());
    });

    test('is an Exception', () {
      const e = NetworkException();
      expect(e, isA<Exception>());
    });
  });

  group('TimeoutException', () {
    test('has default message', () {
      const e = TimeoutException();
      expect(e.message, 'La solicitud tardó demasiado');
    });

    test('accepts custom message', () {
      const e = TimeoutException(message: 'Custom timeout');
      expect(e.message, 'Custom timeout');
    });
  });

  group('HttpException', () {
    test('has default message', () {
      const e = HttpException(statusCode: 400);
      expect(e.message, 'Error HTTP');
    });

    test('stores statusCode', () {
      const e = HttpException(statusCode: 404);
      expect(e.statusCode, 404);
    });

    test('isClientError true for 400-499', () {
      expect(const HttpException(statusCode: 400).isClientError, true);
      expect(const HttpException(statusCode: 404).isClientError, true);
      expect(const HttpException(statusCode: 499).isClientError, true);
    });

    test('isClientError false for 500', () {
      expect(const HttpException(statusCode: 500).isClientError, false);
    });

    test('isServerError true for 500+', () {
      expect(const HttpException(statusCode: 500).isServerError, true);
      expect(const HttpException(statusCode: 503).isServerError, true);
    });

    test('isServerError false for 400', () {
      expect(const HttpException(statusCode: 400).isServerError, false);
    });

    test('errors defaults to null', () {
      const e = HttpException(statusCode: 400);
      expect(e.errors, isNull);
    });

    test('stores errors map', () {
      const e = HttpException(statusCode: 422, errors: {'field': 'error'});
      expect(e.errors, {'field': 'error'});
    });
  });

  group('UnauthorizedException', () {
    test('default message is No autorizado', () {
      const e = UnauthorizedException();
      expect(e.message, 'No autorizado');
    });

    test('accepts custom message', () {
      const e = UnauthorizedException(message: 'Token invalid');
      expect(e.message, 'Token invalid');
    });
  });

  group('TokenExpiredException', () {
    test('default message', () {
      const e = TokenExpiredException();
      expect(e.message, 'Sesión expirada');
    });
  });

  group('SessionExpiredException', () {
    test('default message mentions sesión', () {
      const e = SessionExpiredException();
      expect(e.message, contains('sesión'));
    });
  });

  group('ForbiddenException', () {
    test('default message is Sin permisos', () {
      const e = ForbiddenException();
      expect(e.message, 'Sin permisos');
    });
  });

  group('NotFoundException', () {
    test('default message', () {
      const e = NotFoundException();
      expect(e.message, 'Recurso no encontrado');
    });
  });

  group('ConflictException', () {
    test('default message', () {
      const e = ConflictException();
      expect(e.message, 'Conflicto con el estado actual');
    });
  });

  group('ValidationException', () {
    test('default message is Datos inválidos', () {
      const e = ValidationException();
      expect(e.message, 'Datos inválidos');
    });

    test('fieldErrors defaults to empty map', () {
      const e = ValidationException();
      expect(e.fieldErrors, isEmpty);
    });

    test('stores fieldErrors', () {
      const e = ValidationException(fieldErrors: {'email': 'Invalid email'});
      expect(e.fieldErrors, {'email': 'Invalid email'});
    });
  });

  group('RateLimitException', () {
    test('default message mentions solicitudes', () {
      const e = RateLimitException();
      expect(e.message, contains('solicitudes'));
    });
  });

  group('ServerException', () {
    test('default message is Error interno del servidor', () {
      const e = ServerException();
      expect(e.message, 'Error interno del servidor');
    });
  });

  group('StorageException', () {
    test('default message mentions locales', () {
      const e = StorageException();
      expect(e.message, contains('locales'));
    });
  });

  group('ParseException', () {
    test('default message mentions respuesta', () {
      const e = ParseException();
      expect(e.message, contains('respuesta'));
    });
  });

  group('AppException polymorphism', () {
    test('can catch specific exception as AppException', () {
      expect(
        () => throw const NetworkException(),
        throwsA(isA<AppException>()),
      );
    });

    test('HttpException is AppException', () {
      const e = HttpException(statusCode: 500);
      expect(e, isA<AppException>());
    });

    test('ValidationException is AppException', () {
      const e = ValidationException();
      expect(e, isA<AppException>());
    });
  });
}
