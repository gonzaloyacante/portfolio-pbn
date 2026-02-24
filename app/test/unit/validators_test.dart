import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/utils/validators.dart';

void main() {
  group('AppValidators.required', () {
    test('retorna error para null', () {
      expect(AppValidators.required(null), isNotNull);
    });

    test('retorna error para string vacío', () {
      expect(AppValidators.required(''), isNotNull);
    });

    test('retorna error para string con solo espacios', () {
      expect(AppValidators.required('   '), isNotNull);
    });

    test('retorna null para string con contenido', () {
      expect(AppValidators.required('hola'), isNull);
    });

    test('retorna null para valor no-string no-null', () {
      expect(AppValidators.required(42), isNull);
    });
  });

  group('AppValidators.email', () {
    test('retorna error para email nulo', () {
      expect(AppValidators.email(null), isNotNull);
    });

    test('retorna error para email vacío', () {
      expect(AppValidators.email(''), isNotNull);
    });

    test('retorna error para email sin @', () {
      expect(AppValidators.email('noatsign.com'), isNotNull);
    });

    test('retorna error para email sin dominio', () {
      expect(AppValidators.email('user@'), isNotNull);
    });

    test('retorna null para email válido', () {
      expect(AppValidators.email('paola@example.com'), isNull);
    });

    test('retorna null con subdominio', () {
      expect(AppValidators.email('admin@mail.portfolio.com'), isNull);
    });
  });

  group('AppValidators.minLength', () {
    test('retorna error cuando valor es menor al mínimo', () {
      expect(AppValidators.minLength(5)('abc'), isNotNull);
    });

    test('retorna error cuando valor es null', () {
      expect(AppValidators.minLength(5)(null), isNotNull);
    });

    test('retorna null cuando valor cumple el mínimo exactamente', () {
      expect(AppValidators.minLength(3)('abc'), isNull);
    });

    test('retorna null cuando valor supera el mínimo', () {
      expect(AppValidators.minLength(3)('abcdef'), isNull);
    });
  });

  group('AppValidators.maxLength', () {
    test('retorna error cuando valor supera el máximo', () {
      expect(AppValidators.maxLength(5)('123456'), isNotNull);
    });

    test('retorna null cuando valor está dentro del límite', () {
      expect(AppValidators.maxLength(10)('hola'), isNull);
    });

    test('retorna null para null', () {
      expect(AppValidators.maxLength(5)(null), isNull);
    });
  });

  group('AppValidators.phone', () {
    test('retorna null para vacío (campo opcional)', () {
      expect(AppValidators.phone(''), isNull);
    });

    test('retorna null para null (campo opcional)', () {
      expect(AppValidators.phone(null), isNull);
    });

    test('retorna error para número demasiado corto', () {
      expect(AppValidators.phone('12345'), isNotNull);
    });

    test('retorna null para número válido', () {
      expect(AppValidators.phone('+34 600 123 456'), isNull);
    });
  });

  group('AppValidators.url', () {
    test('retorna null para vacío (campo opcional)', () {
      expect(AppValidators.url(''), isNull);
    });

    test('retorna null para null (campo opcional)', () {
      expect(AppValidators.url(null), isNull);
    });

    test('retorna error para URL sin esquema', () {
      expect(AppValidators.url('portfolio.com'), isNotNull);
    });

    test('retorna error para esquema inválido', () {
      expect(AppValidators.url('ftp://portfolio.com'), isNotNull);
    });

    test('retorna null para URL https válida', () {
      expect(AppValidators.url('https://paolabolivar.com'), isNull);
    });

    test('retorna null para URL http válida', () {
      expect(AppValidators.url('http://localhost:3000'), isNull);
    });
  });

  group('AppValidators.compose', () {
    test('retorna el primer error encontrado', () {
      final validator = AppValidators.compose([
        AppValidators.required,
        AppValidators.email,
      ]);
      // Vacío → falla en required
      expect(validator(''), isNotNull);
      // Inválido → pasa required, falla en email
      expect(validator('nota-un-email'), isNotNull);
      // Válido → pasa ambos
      expect(validator('user@test.com'), isNull);
    });
  });
}
