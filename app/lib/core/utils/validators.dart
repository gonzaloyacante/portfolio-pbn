/// Validadores de formulario alineados con los Zod schemas del backend.
/// Compatible con flutter_form_builder validators.
class AppValidators {
  AppValidators._();

  static String? required(Object? value) {
    if (value == null) return 'Campo requerido';
    if (value is String && value.trim().isEmpty) return 'Campo requerido';
    return null;
  }

  static String? email(String? value) {
    if (value == null || value.isEmpty) return 'Email requerido';
    final regex = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
    if (!regex.hasMatch(value)) return 'Email inválido';
    return null;
  }

  static String? Function(String?) minLength(int min) {
    return (value) {
      if (value == null || value.length < min) {
        return 'Mínimo $min caracteres';
      }
      return null;
    };
  }

  static String? Function(String?) maxLength(int max) {
    return (value) {
      if (value != null && value.length > max) {
        return 'Máximo $max caracteres';
      }
      return null;
    };
  }

  static String? phone(String? value) {
    if (value == null || value.isEmpty) return null; // Opcional
    final cleaned = value.replaceAll(RegExp(r'\s+'), '');
    if (cleaned.length < 9) return 'Teléfono inválido';
    return null;
  }

  static String? url(String? value) {
    if (value == null || value.isEmpty) return null; // Opcional
    final uri = Uri.tryParse(value);
    if (uri == null || (!uri.isScheme('http') && !uri.isScheme('https'))) {
      return 'URL inválida (debe empezar con http:// o https://)';
    }
    return null;
  }

  /// Combina múltiples validadores en uno.
  static String? Function(String?) compose(
    List<String? Function(String?)> validators,
  ) {
    return (value) {
      for (final v in validators) {
        final error = v(value);
        if (error != null) return error;
      }
      return null;
    };
  }
}
