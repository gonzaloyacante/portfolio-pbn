import 'package:flutter/material.dart';

import '../../../core/theme/app_spacing.dart';

/// Paleta de colores preestablecidos para el selector visual.
const _presetColors = <Color>[
  Color(0xFF6C0A0A),
  Color(0xFFFB7185),
  Color(0xFFEF4444),
  Color(0xFFF97316),
  Color(0xFFF59E0B),
  Color(0xFF84CC16),
  Color(0xFF10B981),
  Color(0xFF06B6D4),
  Color(0xFF3B82F6),
  Color(0xFF6366F1),
  Color(0xFF8B5CF6),
  Color(0xFFEC4899),
  Color(0xFF881337),
  Color(0xFF1A050A),
  Color(0xFF374151),
  Color(0xFF6B7280),
  Color(0xFF9CA3AF),
  Color(0xFFFFFFFF),
];

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
            Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: _presetColors.map((color) {
                final isSelected =
                    currentColor != null &&
                    currentColor.toARGB32() == color.toARGB32();
                return GestureDetector(
                  onTap: () => controller.text = _colorToHex(color),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: color,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: isSelected
                            ? colorScheme.primary
                            : colorScheme.outline.withValues(alpha: 60 / 255),
                        width: isSelected ? 2.5 : 1,
                      ),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: color.withValues(alpha: 100 / 255),
                                blurRadius: 8,
                                spreadRadius: 1,
                              ),
                            ]
                          : null,
                    ),
                    child: isSelected
                        ? Icon(
                            Icons.check_rounded,
                            size: 18,
                            color: _isLightColor(color)
                                ? Colors.black87
                                : Colors.white,
                          )
                        : null,
                  ),
                );
              }).toList(),
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

  bool _isLightColor(Color color) {
    final luminance = color.computeLuminance();
    return luminance > 0.5;
  }
}
