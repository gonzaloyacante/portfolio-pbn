import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

/// Preview en vivo del navbar de la web pública.
/// Renderiza un mock fiel del encabezado con el brand text
/// usando la fuente, tamaño y colores configurados.
class LiveNavbarPreview extends StatelessWidget {
  const LiveNavbarPreview({
    super.key,
    required this.brandText,
    required this.brandFont,
    required this.brandFontSize,
    required this.brandColorHex,
    required this.brandColorDarkHex,
    required this.isDarkMode,
    this.onToggleDark,
  });

  final String brandText;
  final String? brandFont;
  final int brandFontSize;
  final String brandColorHex;
  final String brandColorDarkHex;
  final bool isDarkMode;
  final ValueChanged<bool>? onToggleDark;

  static const _kNavItems = ['Sobre Mí', 'Portfolio', 'Servicios', 'Contacto'];

  Color get _bgColor => isDarkMode ? AppColors.darkCard : AppColors.lightCard;

  Color get _borderColor =>
      isDarkMode ? const Color(0xFF2A1015) : const Color(0xFFE5E5E5);

  Color get _navItemColor =>
      isDarkMode ? AppColors.darkForeground : AppColors.lightForeground;

  Color get _iconColor =>
      isDarkMode ? AppColors.darkForeground : AppColors.lightForeground;

  Color _parseBrandColor() {
    final hex = isDarkMode ? brandColorDarkHex : brandColorHex;
    if (hex.length == 7 && hex.startsWith('#')) {
      try {
        return Color(int.parse('FF${hex.substring(1)}', radix: 16));
      } catch (_) {}
    }
    return isDarkMode ? AppColors.darkPrimary : AppColors.lightPrimary;
  }

  TextStyle _brandStyle() {
    final color = _parseBrandColor();
    final base = TextStyle(
      fontSize: brandFontSize.toDouble().clamp(14, 48),
      color: color,
      fontWeight: FontWeight.w600,
      letterSpacing: 0.5,
    );
    if (brandFont != null && brandFont!.isNotEmpty) {
      try {
        return GoogleFonts.getFont(brandFont!, textStyle: base);
      } catch (_) {}
    }
    return base;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _PreviewHeader(isDarkMode: isDarkMode, onToggle: onToggleDark),
        Container(
          decoration: BoxDecoration(
            color: _bgColor,
            border: Border.all(color: _borderColor),
            borderRadius: const BorderRadius.vertical(
              bottom: Radius.circular(12),
            ),
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.sm,
          ),
          child: Row(
            children: [
              // Brand text
              Flexible(
                child: Text(
                  brandText.isEmpty ? 'Paola BN' : brandText,
                  style: _brandStyle(),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const Spacer(),
              // Nav items (compact, hidden on very small widths)
              ..._kNavItems.map(
                (item) => Padding(
                  padding: const EdgeInsets.only(left: AppSpacing.sm),
                  child: Text(
                    item,
                    style: TextStyle(
                      fontSize: 12,
                      color: _navItemColor.withValues(alpha: 0.75),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              // Dark mode icon (decorative)
              Icon(
                isDarkMode
                    ? Icons.light_mode_outlined
                    : Icons.dark_mode_outlined,
                size: 18,
                color: _iconColor.withValues(alpha: 0.6),
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Center(
          child: Text(
            'Vista previa del encabezado web',
            style: TextStyle(
              fontSize: 11,
              color: Theme.of(
                context,
              ).colorScheme.onSurface.withValues(alpha: 0.45),
            ),
          ),
        ),
      ],
    );
  }
}

class _PreviewHeader extends StatelessWidget {
  const _PreviewHeader({required this.isDarkMode, this.onToggle});
  final bool isDarkMode;
  final ValueChanged<bool>? onToggle;

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Container(
      decoration: BoxDecoration(
        color: cs.surfaceContainerLowest,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
        border: Border.all(
          color: cs.outlineVariant.withValues(alpha: 80 / 255),
        ),
      ),
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.base,
        vertical: AppSpacing.xs,
      ),
      child: Row(
        children: [
          Icon(Icons.web_outlined, size: 15, color: cs.primary),
          const SizedBox(width: 6),
          Text(
            'Navbar — Vista previa',
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
              color: cs.primary,
              fontWeight: FontWeight.w600,
            ),
          ),
          const Spacer(),
          if (onToggle != null)
            InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () => onToggle!(!isDarkMode),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      isDarkMode
                          ? Icons.dark_mode_rounded
                          : Icons.light_mode_rounded,
                      size: 14,
                      color: cs.onSurfaceVariant,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      isDarkMode ? 'Oscuro' : 'Claro',
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: cs.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
