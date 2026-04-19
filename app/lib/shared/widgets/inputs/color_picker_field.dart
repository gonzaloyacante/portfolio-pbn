import 'package:flutter/material.dart';

import '../../../core/theme/app_spacing.dart';
import 'color_preset_grid.dart';

/// Campo de color visual con grid de presets y editor hex.
///
/// Reemplaza al antiguo [ColorField] que solo mostraba un TextFormField.
/// Ahora ofrece una cuadrícula de colores clickeables + input hex + preview.
///
/// Uso:
/// ```dart
/// ColorPickerField(
///   controller: _colorCtrl,
///   label: 'Color principal',
/// )
/// ```
class ColorPickerField extends StatelessWidget {
  const ColorPickerField({
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
      final h = hex.replaceAll('#', '').trim();
      if (h.length != 6 && h.length != 8) return null;
      if (h.length == 6) return Color(int.parse('FF$h', radix: 16));
      return Color(int.parse(h, radix: 16));
    } catch (_) {
      return null;
    }
  }

  String _colorToHex(Color c) =>
      '#${c.toARGB32().toRadixString(16).substring(2).toUpperCase()}';

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return ValueListenableBuilder<TextEditingValue>(
      valueListenable: controller,
      builder: (_, value, _) {
        final currentColor = _parseColor(value.text);

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Label ──────────────────────────────────────────────────
            if (label.isNotEmpty) ...[
              Text(
                label,
                style: textTheme.labelLarge?.copyWith(
                  color: colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
            ],

            // ── Grid de presets ────────────────────────────────────────
            ColorPresetGrid(
              currentColor: currentColor,
              onColorSelected: (color) => controller.text = _colorToHex(color),
              colorScheme: colorScheme,
            ),
            const SizedBox(height: AppSpacing.md),

            // ── Input hex + preview ───────────────────────────────────
            TextFormField(
              controller: controller,
              decoration: InputDecoration(
                hintText: '#6C0A0A',
                helperText: helperText,
                prefixIcon: currentColor != null
                    ? Padding(
                        padding: const EdgeInsets.all(12),
                        child: Container(
                          width: 24,
                          height: 24,
                          decoration: BoxDecoration(
                            color: currentColor,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: colorScheme.outline,
                              width: 0.5,
                            ),
                          ),
                        ),
                      )
                    : const Icon(Icons.color_lens_outlined),
              ),
              validator: validator,
            ),
          ],
        );
      },
    );
  }
}
