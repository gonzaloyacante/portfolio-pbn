import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

/// Muestra una vista previa visual de los colores del tema en tiempo real.
class ThemeColorPreview extends StatelessWidget {
  const ThemeColorPreview({
    super.key,
    required this.lightPrimary,
    required this.lightSecondary,
    required this.lightBg,
    required this.darkPrimary,
    required this.darkBg,
  });

  final String lightPrimary;
  final String lightSecondary;
  final String lightBg;
  final String darkPrimary;
  final String darkBg;

  Color? _parse(String hex) {
    try {
      final h = hex.trim().replaceAll('#', '');
      if (h.length < 6) return null;
      return Color(int.parse('FF${h.substring(0, 6)}', radix: 16));
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    final lPrimary = _parse(lightPrimary) ?? colorScheme.primary;
    final lSecondary = _parse(lightSecondary) ?? colorScheme.secondary;
    final lBg = _parse(lightBg) ?? colorScheme.surface;
    final dPrimary = _parse(darkPrimary) ?? colorScheme.primary;
    final dBg = _parse(darkBg) ?? AppColors.darkBackground;

    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: colorScheme.outlineVariant.withValues(alpha: 80 / 255),
        ),
      ),
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.palette_outlined,
                size: 16,
                color: colorScheme.primary,
              ),
              const SizedBox(width: 6),
              Text(
                'Vista previa del tema',
                style: textTheme.labelMedium?.copyWith(
                  color: colorScheme.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              Expanded(
                child: _MiniThemeCard(
                  label: 'Modo claro',
                  primary: lPrimary,
                  secondary: lSecondary,
                  background: lBg,
                  isDark: false,
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: _MiniThemeCard(
                  label: 'Modo oscuro',
                  primary: dPrimary,
                  secondary: lSecondary,
                  background: dBg,
                  isDark: true,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _MiniThemeCard extends StatelessWidget {
  const _MiniThemeCard({
    required this.label,
    required this.primary,
    required this.secondary,
    required this.background,
    required this.isDark,
  });

  final String label;
  final Color primary;
  final Color secondary;
  final Color background;
  final bool isDark;

  @override
  Widget build(BuildContext context) {
    final textColor = isDark ? Colors.white : Colors.black87;
    final subtextColor = isDark ? Colors.white54 : Colors.black45;

    return Container(
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: (isDark ? 60 : 18) / 255),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(AppSpacing.sm),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 9,
              color: subtextColor,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Container(
            decoration: BoxDecoration(
              color: isDark
                  ? Colors.white.withValues(alpha: 12 / 255)
                  : Colors.white.withValues(alpha: 230 / 255),
              borderRadius: BorderRadius.circular(8),
            ),
            padding: const EdgeInsets.all(6),
            child: Row(
              children: [
                Container(
                  width: 20,
                  height: 20,
                  decoration: BoxDecoration(
                    color: primary.withValues(alpha: (isDark ? 90 : 40) / 255),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Icon(Icons.photo_outlined, size: 12, color: primary),
                ),
                const SizedBox(width: 6),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        height: 5,
                        decoration: BoxDecoration(
                          color: textColor.withValues(alpha: 180 / 255),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(height: 3),
                      Container(
                        height: 4,
                        width: 40,
                        decoration: BoxDecoration(
                          color: subtextColor,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Row(
            children: [
              _Swatch(color: primary),
              const SizedBox(width: 4),
              _Swatch(color: secondary),
              const SizedBox(width: 4),
              _SwatchOutlined(color: background),
            ],
          ),
        ],
      ),
    );
  }
}

class _Swatch extends StatelessWidget {
  const _Swatch({required this.color});
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 14,
      height: 14,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(
          color: Colors.black.withValues(alpha: 30 / 255),
          width: 0.5,
        ),
      ),
    );
  }
}

class _SwatchOutlined extends StatelessWidget {
  const _SwatchOutlined({required this.color});
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 14,
      height: 14,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(
          color: Colors.grey.withValues(alpha: 100 / 255),
          width: 1,
        ),
      ),
    );
  }
}
