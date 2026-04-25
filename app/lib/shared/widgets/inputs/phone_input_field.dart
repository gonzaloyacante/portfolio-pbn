import 'package:flutter/material.dart';
import 'package:intl_phone_field/intl_phone_field.dart';

/// Campo de teléfono internacional con selector de país y formateo automático.
///
/// Usa [IntlPhoneField] internamente. España (ES) se usa como país por defecto.
/// Persiste el número completo en formato E.164 en el [controller].
///
/// Uso:
/// ```dart
/// PhoneInputField(
///   controller: _phoneCtrl,
///   label: 'Teléfono',
///   helperText: 'Número de contacto público',
/// )
/// ```
class PhoneInputField extends StatefulWidget {
  const PhoneInputField({
    super.key,
    required this.controller,
    this.label = 'Teléfono',
    this.validator,
    this.defaultCountryCode = 'ES',
    this.helperText,
  });

  final TextEditingController controller;
  final String label;
  final String? Function(String?)? validator;
  final String defaultCountryCode;
  final String? helperText;

  @override
  State<PhoneInputField> createState() => _PhoneInputFieldState();
}

class _PhoneInputFieldState extends State<PhoneInputField> {
  // Dial-code → ISO-2 mapping for auto-detecting stored numbers (longest first for safe parsing)
  static const Map<String, String> _dialToIso = {
    '+593': 'EC',
    '+598': 'UY',
    '+595': 'PY',
    '+591': 'BO',
    '+34': 'ES',
    '+44': 'GB',
    '+33': 'FR',
    '+49': 'DE',
    '+39': 'IT',
    '+351': 'PT',
    '+32': 'BE',
    '+31': 'NL',
    '+41': 'CH',
    '+43': 'AT',
    '+45': 'DK',
    '+46': 'SE',
    '+47': 'NO',
    '+48': 'PL',
    '+54': 'AR',
    '+52': 'MX',
    '+55': 'BR',
    '+56': 'CL',
    '+57': 'CO',
    '+51': 'PE',
    '+58': 'VE',
    '+1': 'US',
  };

  late String _iso;
  late String _localNumber;

  @override
  void initState() {
    super.initState();
    _parse(widget.controller.text);
  }

  void _parse(String full) {
    final raw = full.trim();
    if (!raw.startsWith('+')) {
      _iso = widget.defaultCountryCode;
      _localNumber = raw;
      return;
    }
    // Sort by length descending to match longest dial code first
    final sorted = _dialToIso.keys.toList()
      ..sort((a, b) => b.length.compareTo(a.length));
    for (final dial in sorted) {
      if (raw.startsWith(dial)) {
        _iso = _dialToIso[dial]!;
        _localNumber = raw.substring(dial.length).trim();
        return;
      }
    }
    _iso = widget.defaultCountryCode;
    _localNumber = raw.replaceFirst(RegExp(r'^\+\d{1,4}\s?'), '');
  }

  @override
  Widget build(BuildContext context) {
    return IntlPhoneField(
      initialCountryCode: _iso,
      initialValue: _localNumber,
      decoration: InputDecoration(
        labelText: widget.label,
        helperText: widget.helperText,
        counterText: '',
      ),
      invalidNumberMessage: 'Número inválido para el país seleccionado',
      keyboardType: TextInputType.phone,
      onChanged: (phone) {
        final complete = phone.completeNumber;
        if (widget.controller.text != complete) {
          widget.controller.text = complete;
        }
      },
      validator: widget.validator != null
          ? (phone) => widget.validator!(phone?.completeNumber)
          : null,
    );
  }
}
