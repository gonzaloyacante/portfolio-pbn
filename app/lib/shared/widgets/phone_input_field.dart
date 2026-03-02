import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../core/theme/app_spacing.dart';

/// Código de país con indicativo.
class CountryCode {
  const CountryCode({
    required this.name,
    required this.code,
    required this.dialCode,
    this.flag,
  });

  final String name;
  final String code;
  final String dialCode;
  final String? flag;

  @override
  String toString() => '$flag $dialCode';
}

/// Países más comunes para la app (Argentina, España, etc.)
const _countryCodes = <CountryCode>[
  CountryCode(name: 'España', code: 'ES', dialCode: '+34', flag: '🇪🇸'),
  CountryCode(name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷'),
  CountryCode(name: 'México', code: 'MX', dialCode: '+52', flag: '🇲🇽'),
  CountryCode(name: 'Colombia', code: 'CO', dialCode: '+57', flag: '🇨🇴'),
  CountryCode(name: 'Chile', code: 'CL', dialCode: '+56', flag: '🇨🇱'),
  CountryCode(name: 'Perú', code: 'PE', dialCode: '+51', flag: '🇵🇪'),
  CountryCode(name: 'Uruguay', code: 'UY', dialCode: '+598', flag: '🇺🇾'),
  CountryCode(name: 'Estados Unidos', code: 'US', dialCode: '+1', flag: '🇺🇸'),
  CountryCode(name: 'Brasil', code: 'BR', dialCode: '+55', flag: '🇧🇷'),
  CountryCode(name: 'Venezuela', code: 'VE', dialCode: '+58', flag: '🇻🇪'),
  CountryCode(name: 'Ecuador', code: 'EC', dialCode: '+593', flag: '🇪🇨'),
  CountryCode(name: 'Bolivia', code: 'BO', dialCode: '+591', flag: '🇧🇴'),
  CountryCode(name: 'Paraguay', code: 'PY', dialCode: '+595', flag: '🇵🇾'),
  CountryCode(name: 'Costa Rica', code: 'CR', dialCode: '+506', flag: '🇨🇷'),
  CountryCode(name: 'Panamá', code: 'PA', dialCode: '+507', flag: '🇵🇦'),
  CountryCode(name: 'Francia', code: 'FR', dialCode: '+33', flag: '🇫🇷'),
  CountryCode(name: 'Italia', code: 'IT', dialCode: '+39', flag: '🇮🇹'),
  CountryCode(name: 'Alemania', code: 'DE', dialCode: '+49', flag: '🇩🇪'),
  CountryCode(name: 'Reino Unido', code: 'GB', dialCode: '+44', flag: '🇬🇧'),
  CountryCode(name: 'Portugal', code: 'PT', dialCode: '+351', flag: '🇵🇹'),
];

/// Campo de teléfono con selector de código de país.
///
/// El valor final se guarda como `+34 612345678` (indicativo + número).
///
/// Uso:
/// ```dart
/// PhoneInputField(
///   controller: _phoneCtrl,
///   label: 'Teléfono',
/// )
/// ```
class PhoneInputField extends StatefulWidget {
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
  final String defaultCountryCode;

  @override
  State<PhoneInputField> createState() => _PhoneInputFieldState();
}

class _PhoneInputFieldState extends State<PhoneInputField> {
  late CountryCode _selectedCountry;
  late TextEditingController _numberCtrl;
  bool _didInit = false;

  @override
  void initState() {
    super.initState();
    _selectedCountry = _countryCodes.firstWhere(
      (c) => c.code == widget.defaultCountryCode,
      orElse: () => _countryCodes.first,
    );
    _numberCtrl = TextEditingController();
    _parseInitialValue();
    _numberCtrl.addListener(_syncToParent);
  }

  void _parseInitialValue() {
    final text = widget.controller.text.trim();
    if (text.isEmpty) return;

    // Intenta extraer el código de país del valor existente
    for (final country in _countryCodes) {
      if (text.startsWith(country.dialCode)) {
        _selectedCountry = country;
        _numberCtrl.text = text.substring(country.dialCode.length).trim();
        _didInit = true;
        return;
      }
    }

    // Si no tiene código, asumir que es solo el número
    if (text.startsWith('+')) {
      // Tiene algún código desconocido, dejarlo como está
      _numberCtrl.text = text;
    } else {
      _numberCtrl.text = text;
    }
    _didInit = true;
  }

  void _syncToParent() {
    final number = _numberCtrl.text.trim();
    if (number.isEmpty) {
      widget.controller.text = '';
    } else {
      widget.controller.text = '${_selectedCountry.dialCode} $number';
    }
  }

  @override
  void didUpdateWidget(covariant PhoneInputField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!_didInit) _parseInitialValue();
  }

  @override
  void dispose() {
    _numberCtrl.removeListener(_syncToParent);
    _numberCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return TextFormField(
      controller: _numberCtrl,
      decoration: InputDecoration(
        labelText: widget.label,
        hintText: '612 345 678',
        prefixIcon: GestureDetector(
          onTap: () => _showCountryPicker(context),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  _selectedCountry.flag ?? '',
                  style: const TextStyle(fontSize: 20),
                ),
                const SizedBox(width: 4),
                Text(
                  _selectedCountry.dialCode,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: colorScheme.onSurface,
                    fontSize: 14,
                  ),
                ),
                Icon(
                  Icons.arrow_drop_down,
                  size: 18,
                  color: colorScheme.outline,
                ),
              ],
            ),
          ),
        ),
      ),
      keyboardType: TextInputType.phone,
      inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[\d\s\-]'))],
      validator: widget.validator,
    );
  }

  Future<void> _showCountryPicker(BuildContext context) async {
    final result = await showModalBottomSheet<CountryCode>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => _CountryPickerSheet(selected: _selectedCountry),
    );

    if (result != null) {
      setState(() => _selectedCountry = result);
      _syncToParent();
    }
  }
}

// ── _CountryPickerSheet ───────────────────────────────────────────────────────

class _CountryPickerSheet extends StatefulWidget {
  const _CountryPickerSheet({required this.selected});

  final CountryCode selected;

  @override
  State<_CountryPickerSheet> createState() => _CountryPickerSheetState();
}

class _CountryPickerSheetState extends State<_CountryPickerSheet> {
  String _search = '';

  List<CountryCode> get _filtered => _search.isEmpty
      ? _countryCodes
      : _countryCodes
            .where(
              (c) =>
                  c.name.toLowerCase().contains(_search.toLowerCase()) ||
                  c.dialCode.contains(_search) ||
                  c.code.toLowerCase().contains(_search.toLowerCase()),
            )
            .toList();

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: DraggableScrollableSheet(
        initialChildSize: 0.6,
        minChildSize: 0.4,
        maxChildSize: 0.85,
        expand: false,
        builder: (_, scrollController) => Column(
          children: [
            const SizedBox(height: AppSpacing.sm),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.outline.withAlpha(80),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: TextField(
                autofocus: true,
                decoration: const InputDecoration(
                  hintText: 'Buscar país...',
                  prefixIcon: Icon(Icons.search),
                  isDense: true,
                ),
                onChanged: (v) => setState(() => _search = v),
              ),
            ),
            Expanded(
              child: ListView.builder(
                controller: scrollController,
                itemCount: _filtered.length,
                itemBuilder: (_, i) {
                  final country = _filtered[i];
                  final isSelected = country.code == widget.selected.code;
                  return ListTile(
                    leading: Text(
                      country.flag ?? '',
                      style: const TextStyle(fontSize: 24),
                    ),
                    title: Text(country.name),
                    trailing: Text(
                      country.dialCode,
                      style: TextStyle(
                        fontWeight: isSelected
                            ? FontWeight.bold
                            : FontWeight.normal,
                        color: isSelected
                            ? Theme.of(context).colorScheme.primary
                            : null,
                      ),
                    ),
                    selected: isSelected,
                    onTap: () => Navigator.of(context).pop(country),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
