import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../core/theme/app_spacing.dart';

/// Campo de teléfono simple para la app de administración.
///
/// Muestra el número completo tal como está guardado (ej: +34 612345678).
/// No tiene selector de país — el administrador ve y edita el número directamente.
///
/// Uso:
/// ```dart
/// PhoneInputField(
///   controller: _phoneCtrl,
///   label: 'Teléfono',
/// )
/// ```
class PhoneInputField extends StatelessWidget {
  const PhoneInputField({
    super.key,
    required this.controller,
    this.label = 'Teléfono',
    this.validator,
    this.defaultCountryCode = 'ES',
  });

  final TextEditingController controller;
  final String label;
  final String? Function(String?)? validator;

  /// Unused — kept for API compatibility.
  // ignore: unused_field
  final String defaultCountryCode;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        hintText: '+34 612 345 678',
        prefixIcon: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
          child: Icon(
            Icons.phone_outlined,
            color: Theme.of(context).colorScheme.onSurfaceVariant,
            size: 20,
          ),
        ),
        prefixIconConstraints: const BoxConstraints(
          minWidth: 44,
          minHeight: 44,
        ),
      ),
      keyboardType: TextInputType.phone,
      inputFormatters: [
        FilteringTextInputFormatter.allow(RegExp(r'[\d\s\+\-\(\)]')),
      ],
      validator: validator,
    );
  }
}
