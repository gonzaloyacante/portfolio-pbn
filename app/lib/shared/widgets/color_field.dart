import 'package:flutter/material.dart';

/// A [TextFormField] that shows a live color preview circle
/// when the user types a valid hex color like `#6C0A0A`.
class ColorField extends StatelessWidget {
  const ColorField({
    super.key,
    required this.controller,
    required this.label,
    this.helperText,
    this.validator,
  });

  final TextEditingController controller;
  final String label;
  final String? helperText;
  final String? Function(String?)? validator;

  Color? _parseColor(String hex) {
    try {
      final h = hex.replaceAll('#', '');
      if (h.isEmpty) return null;
      return Color(int.parse('FF$h', radix: 16));
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder(
      valueListenable: controller,
      builder: (_, value, _) {
        final color = _parseColor(value.text);
        return TextFormField(
          controller: controller,
          decoration: InputDecoration(
            labelText: label,
            hintText: '#6C0A0A',
            helperText: helperText,
            prefixIcon: color != null
                ? Padding(
                    padding: const EdgeInsets.all(12),
                    child: Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        color: color,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: Theme.of(context).colorScheme.outline,
                          width: 0.5,
                        ),
                      ),
                    ),
                  )
                : const Icon(Icons.color_lens_outlined),
          ),
          validator: validator,
        );
      },
    );
  }
}
