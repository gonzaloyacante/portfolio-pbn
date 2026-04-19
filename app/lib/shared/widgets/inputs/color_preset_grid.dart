import 'package:flutter/material.dart';

import '../../../core/theme/app_spacing.dart';

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

/// Grid de círculos de colores preestablecidos para [ColorPickerField].
class ColorPresetGrid extends StatelessWidget {
  const ColorPresetGrid({
    super.key,
    required this.currentColor,
    required this.onColorSelected,
    required this.colorScheme,
  });

  final Color? currentColor;
  final void Function(Color) onColorSelected;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: AppSpacing.sm,
      runSpacing: AppSpacing.sm,
      children: _presetColors.map((color) {
        final isSelected =
            currentColor != null &&
            currentColor!.toARGB32() == color.toARGB32();
        return GestureDetector(
          onTap: () => onColorSelected(color),
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
                    color: _isLightColor(color) ? Colors.black87 : Colors.white,
                  )
                : null,
          ),
        );
      }).toList(),
    );
  }

  bool _isLightColor(Color color) => color.computeLuminance() > 0.5;
}
