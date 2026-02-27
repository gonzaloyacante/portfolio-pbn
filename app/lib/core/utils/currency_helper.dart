/// Helpers para mostrar moneda/precio de forma uniforme en toda la app.
/// El símbolo se deriva del código ISO 4217 (EUR, USD, ARS…).
library;

/// Devuelve el símbolo de moneda para un código ISO 4217.
/// Si el código no es reconocido, devuelve el propio código como fallback.
String currencySymbol(String? code) {
  switch ((code ?? 'EUR').toUpperCase()) {
    case 'EUR':
      return '€';
    case 'USD':
      return 'US\$';
    case 'ARS':
      return '\$';
    case 'GBP':
      return '£';
    case 'BRL':
      return 'R\$';
    case 'MXN':
      return 'MX\$';
    case 'CLP':
      return 'CL\$';
    case 'COP':
      return 'CO\$';
    default:
      return code ?? '€';
  }
}

/// Formatea un precio con su símbolo de moneda.
/// Ejemplo: `formatPrice(1200, 'EUR')` → `"€1200"`.
String formatPrice(num price, String? currency) {
  final sym = currencySymbol(currency);
  // Símbolo delante para monedas europeas, detrás para otras (simplificado)
  final prefix = ['€', '£'].contains(sym) ? sym : '';
  final suffix = ['€', '£'].contains(sym) ? '' : ' $sym';
  return '$prefix$price$suffix';
}
