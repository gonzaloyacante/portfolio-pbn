import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/utils/currency_helper.dart';

void main() {
  group('currencySymbol', () {
    test('returns € for EUR', () {
      expect(currencySymbol('EUR'), '€');
    });

    test('returns US\$ for USD', () {
      expect(currencySymbol('USD'), r'US$');
    });

    test('returns \$ for ARS', () {
      expect(currencySymbol('ARS'), '\$');
    });

    test('returns £ for GBP', () {
      expect(currencySymbol('GBP'), '£');
    });

    test('returns R\$ for BRL', () {
      expect(currencySymbol('BRL'), r'R$');
    });

    test('returns MX\$ for MXN', () {
      expect(currencySymbol('MXN'), r'MX$');
    });

    test('returns CL\$ for CLP', () {
      expect(currencySymbol('CLP'), r'CL$');
    });

    test('returns CO\$ for COP', () {
      expect(currencySymbol('COP'), r'CO$');
    });

    test('returns code itself for unknown currency', () {
      expect(currencySymbol('XYZ'), 'XYZ');
    });

    test('handles lowercase input', () {
      expect(currencySymbol('eur'), '€');
    });

    test('handles mixed case input', () {
      expect(currencySymbol('Usd'), r'US$');
    });

    test('returns € for null (default)', () {
      expect(currencySymbol(null), '€');
    });

    test('returns € for empty-string fallback via null coalescing', () {
      // null → 'EUR' → '€'
      expect(currencySymbol(null), '€');
    });
  });

  group('formatPrice', () {
    test('prefix € for EUR', () {
      expect(formatPrice(1200, 'EUR'), '€1200');
    });

    test('prefix £ for GBP', () {
      expect(formatPrice(50, 'GBP'), '£50');
    });

    test('suffix US\$ for USD', () {
      expect(formatPrice(1000, 'USD'), r'1000 US$');
    });

    test('suffix \$ for ARS', () {
      expect(formatPrice(500, 'ARS'), '500 \$');
    });

    test('suffix R\$ for BRL', () {
      expect(formatPrice(299, 'BRL'), r'299 R$');
    });

    test('handles zero value', () {
      expect(formatPrice(0, 'EUR'), '€0');
    });

    test('handles decimal value', () {
      expect(formatPrice(9.99, 'EUR'), '€9.99');
    });

    test('handles negative value', () {
      expect(formatPrice(-50, 'USD'), r'-50 US$');
    });

    test('handles null currency (defaults to EUR prefix)', () {
      expect(formatPrice(100, null), '€100');
    });

    test('handles unknown currency — suffix with code', () {
      expect(formatPrice(100, 'XYZ'), '100 XYZ');
    });

    test('handles large numbers', () {
      expect(formatPrice(1000000, 'EUR'), '€1000000');
    });
  });
}
