import 'package:flutter/material.dart';

import '../../../core/theme/app_spacing.dart';

/// Opciones predefinidas de duración en minutos.
const _durationPresets = <int>[15, 30, 45, 60, 90, 120, 150, 180, 240];

/// Campo selector de duración con chips predefinidos y opción personalizada.
///
/// Muestra la duración actual formateada (ej: "1h 30m") y permite seleccionarla
/// desde una lista de opciones rápidas o un CupertinoPicker personalizado.
///
/// Uso:
/// ```dart
/// DurationPickerField(
///   controller: _durationCtrl,
///   label: 'Duración estimada',
/// )
/// ```
class DurationPickerField extends StatelessWidget {
  const DurationPickerField({
    super.key,
    required this.controller,
    this.label = 'Duración estimada',
    this.validator,
  });

  final TextEditingController controller;
  final String label;
  final String? Function(String?)? validator;

  /// Intenta parsear el valor del controller como minutos.
  int? _parseMinutes(String text) {
    final trimmed = text.trim();
    if (trimmed.isEmpty) return null;

    // Intentar como número directo (minutos)
    final direct = int.tryParse(trimmed);
    if (direct != null) return direct;

    // Intentar formato "Xh Ym"
    final regex = RegExp(r'(\d+)\s*h(?:\s*(\d+)\s*m(?:in)?)?');
    final match = regex.firstMatch(trimmed.toLowerCase());
    if (match != null) {
      final hours = int.tryParse(match.group(1) ?? '') ?? 0;
      final mins = int.tryParse(match.group(2) ?? '') ?? 0;
      return hours * 60 + mins;
    }

    // Intentar formato "Xm" o "X min"
    final minRegex = RegExp(r'(\d+)\s*m(?:in)?');
    final minMatch = minRegex.firstMatch(trimmed.toLowerCase());
    if (minMatch != null) {
      return int.tryParse(minMatch.group(1) ?? '');
    }

    return null;
  }

  String _formatDuration(int minutes) {
    if (minutes < 60) return '${minutes}min';
    final h = minutes ~/ 60;
    final m = minutes % 60;
    if (m == 0) return '${h}h';
    return '${h}h ${m}min';
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return ValueListenableBuilder<TextEditingValue>(
      valueListenable: controller,
      builder: (_, value, _) {
        final currentMinutes = _parseMinutes(value.text);

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (label.isNotEmpty) ...[
              Text(
                label,
                style: textTheme.labelLarge?.copyWith(
                  color: colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
            ],

            // ── Chips de presets ──────────────────────────────────────
            Wrap(
              spacing: AppSpacing.sm,
              runSpacing: AppSpacing.sm,
              children: _durationPresets.map((minutes) {
                final isSelected = currentMinutes == minutes;
                return ChoiceChip(
                  label: Text(_formatDuration(minutes)),
                  selected: isSelected,
                  onSelected: (_) {
                    controller.text = _formatDuration(minutes);
                  },
                  labelStyle: textTheme.labelMedium?.copyWith(
                    color: isSelected
                        ? colorScheme.onPrimary
                        : colorScheme.onSurface,
                    fontWeight: isSelected
                        ? FontWeight.w600
                        : FontWeight.normal,
                  ),
                  selectedColor: colorScheme.primary,
                  showCheckmark: false,
                  visualDensity: VisualDensity.compact,
                );
              }).toList(),
            ),
            const SizedBox(height: AppSpacing.md),

            // ── Input manual ─────────────────────────────────────────
            TextFormField(
              controller: controller,
              decoration: InputDecoration(
                hintText: '1h 30min',
                helperText: 'Ej: 45min, 1h, 2h 30min',
                prefixIcon: Icon(
                  Icons.timer_outlined,
                  color: currentMinutes != null
                      ? colorScheme.primary
                      : colorScheme.outline,
                ),
                suffixText: currentMinutes != null
                    ? '= $currentMinutes min'
                    : null,
              ),
              validator: validator,
            ),
          ],
        );
      },
    );
  }
}
