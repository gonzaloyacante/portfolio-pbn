import 'package:flutter/material.dart';

import '../../core/theme/app_radius.dart';
import '../../core/theme/app_spacing.dart';

/// Widget genérico de chips de filtro horizontalmente scrolleables.
/// Reemplaza los `_FilterChip` privados duplicados en contacts y testimonials.
///
/// Uso:
/// ```dart
/// AppFilterChips<ContactStatus>(
///   options: ContactStatus.values,
///   selected: currentFilter,
///   onSelected: (v) => ref.read(...).state = v,
///   labelBuilder: (v) => v.label,
///   colorBuilder: (v) => v.color, // opcional
/// )
/// ```
class AppFilterChips<T> extends StatelessWidget {
  const AppFilterChips({
    super.key,
    required this.options,
    required this.selected,
    required this.onSelected,
    required this.labelBuilder,
    this.colorBuilder,
    this.countBuilder,
    this.padding,
    this.showAll = true,
    this.allLabel = 'Todos',
  });

  final List<T> options;
  final T? selected;
  final ValueChanged<T?> onSelected;
  final String Function(T option) labelBuilder;
  final Color Function(T option)? colorBuilder;
  final int Function(T option)? countBuilder;
  final EdgeInsetsGeometry? padding;

  /// Mostrar opción "Todos" al inicio (al seleccionarla, llama onSelected(null))
  final bool showAll;
  final String allLabel;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return SizedBox(
      height: 40,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: padding ?? EdgeInsets.symmetric(horizontal: AppSpacing.base),
        children: [
          if (showAll) ...[
            _FilterChipItem(
              label: allLabel,
              isSelected: selected == null,
              onTap: () => onSelected(null),
              color: colorScheme.primary,
              textTheme: textTheme,
              colorScheme: colorScheme,
            ),
            const SizedBox(width: AppSpacing.sm),
          ],
          ...options.asMap().entries.map((entry) {
            final option = entry.value;
            final isSelected = selected == option;
            final color = colorBuilder?.call(option) ?? colorScheme.primary;
            final count = countBuilder?.call(option);
            final labelText = count != null ? '${labelBuilder(option)} ($count)' : labelBuilder(option);
            return Padding(
              padding: const EdgeInsets.only(right: AppSpacing.sm),
              child: _FilterChipItem(
                label: labelText,
                isSelected: isSelected,
                onTap: () => onSelected(isSelected ? null : option),
                color: color,
                textTheme: textTheme,
                colorScheme: colorScheme,
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _FilterChipItem extends StatelessWidget {
  const _FilterChipItem({
    required this.label,
    required this.isSelected,
    required this.onTap,
    required this.color,
    required this.textTheme,
    required this.colorScheme,
  });

  final String label;
  final bool isSelected;
  final VoidCallback onTap;
  final Color color;
  final TextTheme textTheme;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.xs + 2),
        decoration: BoxDecoration(
          color: isSelected ? color.withAlpha(30) : Colors.transparent,
          borderRadius: AppRadius.forChip,
          border: Border.all(
            color: isSelected ? color : colorScheme.outline.withAlpha(100),
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Text(
          label,
          style: (textTheme.labelSmall ?? const TextStyle()).copyWith(
            color: isSelected ? color : colorScheme.onSurface.withAlpha(160),
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ),
    );
  }
}
