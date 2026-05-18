import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

/// Preview vivo de tema con capas semánticas, no solo muestras de color.
class ThemeColorPreview extends StatelessWidget {
  const ThemeColorPreview({
    super.key,
    required this.lightPrimary,
    required this.lightSecondary,
    required this.lightAccent,
    required this.lightBg,
    required this.lightText,
    required this.lightCard,
    required this.darkPrimary,
    required this.darkSecondary,
    required this.darkAccent,
    required this.darkBg,
    required this.darkText,
    required this.darkCard,
    required this.headingFont,
    required this.bodyFont,
    required this.scriptFont,
    required this.borderRadius,
  });

  final String lightPrimary;
  final String lightSecondary;
  final String lightAccent;
  final String lightBg;
  final String lightText;
  final String lightCard;
  final String darkPrimary;
  final String darkSecondary;
  final String darkAccent;
  final String darkBg;
  final String darkText;
  final String darkCard;
  final String headingFont;
  final String bodyFont;
  final String scriptFont;
  final int borderRadius;

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
    final light = _PreviewPalette(
      label: 'Modo claro',
      primary: _parse(lightPrimary) ?? colorScheme.primary,
      secondary: _parse(lightSecondary) ?? colorScheme.secondary,
      accent: _parse(lightAccent) ?? colorScheme.tertiaryContainer,
      background: _parse(lightBg) ?? colorScheme.surface,
      text: _parse(lightText) ?? colorScheme.onSurface,
      card: _parse(lightCard) ?? colorScheme.surfaceContainerLowest,
      isDark: false,
    );
    final dark = _PreviewPalette(
      label: 'Modo oscuro',
      primary: _parse(darkPrimary) ?? AppColors.darkPrimary,
      secondary: _parse(darkSecondary) ?? AppColors.darkSecondary,
      accent: _parse(darkAccent) ?? AppColors.darkAccent,
      background: _parse(darkBg) ?? AppColors.darkBackground,
      text: _parse(darkText) ?? AppColors.darkForeground,
      card: _parse(darkCard) ?? AppColors.darkCard,
      isDark: true,
    );

    return DecoratedBox(
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: colorScheme.outlineVariant.withValues(alpha: 90 / 255),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _sectionHeader(context),
            const SizedBox(height: AppSpacing.base),
            LayoutBuilder(
              builder: (context, constraints) {
                final stacked = constraints.maxWidth < 620;
                final cards = [
                  _modePreview(context, light),
                  _modePreview(context, dark),
                ];
                if (stacked) {
                  return Column(
                    children: [
                      cards[0],
                      const SizedBox(height: AppSpacing.base),
                      cards[1],
                    ],
                  );
                }
                return Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(child: cards[0]),
                    const SizedBox(width: AppSpacing.base),
                    Expanded(child: cards[1]),
                  ],
                );
              },
            ),
            const SizedBox(height: AppSpacing.base),
            _typographyPreview(context, light),
          ],
        ),
      ),
    );
  }

  Widget _sectionHeader(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final colorScheme = Theme.of(context).colorScheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              Icons.visibility_outlined,
              size: 18,
              color: colorScheme.primary,
            ),
            const SizedBox(width: AppSpacing.sm),
            Text(
              'Preview vivo del tema',
              style: textTheme.titleSmall?.copyWith(
                color: colorScheme.primary,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          'Cada bloque muestra qué superficie cambia: navegación, tarjetas, botones, formularios y tipografía.',
          style: textTheme.bodySmall?.copyWith(
            color: colorScheme.onSurface.withValues(alpha: 0.72),
          ),
        ),
      ],
    );
  }

  Widget _modePreview(BuildContext context, _PreviewPalette palette) {
    final radius = BorderRadius.circular(borderRadius.clamp(12, 48).toDouble());
    return DecoratedBox(
      decoration: BoxDecoration(
        color: palette.background,
        borderRadius: radius,
        border: Border.all(
          color: palette.isDark
              ? Colors.white.withValues(alpha: 28 / 255)
              : Colors.black.withValues(alpha: 18 / 255),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: palette.isDark ? 0.2 : 0.07),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              palette.label,
              style: _fontStyle(
                headingFont,
                color: palette.text,
                size: 15,
                weight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: AppSpacing.base),
            _navigationSample(palette),
            const SizedBox(height: AppSpacing.base),
            _cardSample(palette),
            const SizedBox(height: AppSpacing.base),
            _buttonAndLinkSample(palette),
            const SizedBox(height: AppSpacing.base),
            _formSample(palette),
            const SizedBox(height: AppSpacing.base),
            _swatchGrid(palette),
          ],
        ),
      ),
    );
  }

  Widget _navigationSample(_PreviewPalette palette) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _caption('Navegación', palette),
      const SizedBox(height: AppSpacing.xs),
      Row(
        children: [
          _navPill('Inicio', palette, active: true),
          const SizedBox(width: AppSpacing.xs),
          _navPill('Portfolio', palette),
          const SizedBox(width: AppSpacing.xs),
          _navPill('Hover', palette, hover: true),
        ],
      ),
    ],
  );

  Widget _cardSample(_PreviewPalette palette) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _caption('Superficie / tarjetas', palette),
      const SizedBox(height: AppSpacing.xs),
      DecoratedBox(
        decoration: BoxDecoration(
          color: palette.card,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: palette.secondary.withValues(alpha: 0.55)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Row(
            children: [
              DecoratedBox(
                decoration: BoxDecoration(
                  color: palette.accent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.sm),
                  child: Icon(
                    Icons.auto_awesome,
                    size: 18,
                    color: palette.primary,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Tarjeta pública',
                      style: _fontStyle(
                        headingFont,
                        color: palette.text,
                        size: 13,
                        weight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      'Fondo card + texto + borde',
                      style: _fontStyle(
                        bodyFont,
                        color: palette.text.withValues(alpha: 0.65),
                        size: 11,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    ],
  );

  Widget _buttonAndLinkSample(_PreviewPalette palette) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _caption('Botones y enlaces', palette),
      const SizedBox(height: AppSpacing.xs),
      Wrap(
        spacing: AppSpacing.sm,
        runSpacing: AppSpacing.sm,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          _buttonSample('Principal', palette.primary, palette.buttonText),
          _buttonSample('Secundario', palette.secondary, palette.primary),
          Text(
            'Link de texto',
            style: _fontStyle(
              bodyFont,
              color: palette.primary,
              size: 12,
              weight: FontWeight.w700,
            ).copyWith(decoration: TextDecoration.underline),
          ),
        ],
      ),
    ],
  );

  Widget _formSample(_PreviewPalette palette) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _caption('Formulario', palette),
      const SizedBox(height: AppSpacing.xs),
      DecoratedBox(
        decoration: BoxDecoration(
          color: palette.card,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: palette.primary.withValues(alpha: 0.35)),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.sm,
          ),
          child: Row(
            children: [
              Icon(Icons.mail_outline, size: 15, color: palette.primary),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Text(
                  'Campo formulario',
                  style: _fontStyle(
                    bodyFont,
                    color: palette.text.withValues(alpha: 0.72),
                    size: 12,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    ],
  );

  Widget _typographyPreview(BuildContext context, _PreviewPalette palette) {
    final colorScheme = Theme.of(context).colorScheme;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerHighest.withValues(alpha: 0.45),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Tipografías',
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                fontWeight: FontWeight.w800,
                color: colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: AppSpacing.xs),
            Text(
              'Títulos / Cuerpo / Marca',
              style: _fontStyle(
                headingFont,
                color: palette.text,
                size: 16,
                weight: FontWeight.w800,
              ),
            ),
            Text(
              'Texto de cuerpo para descripciones y formularios.',
              style: _fontStyle(
                bodyFont,
                color: palette.text.withValues(alpha: 0.72),
                size: 12,
              ),
            ),
            Text(
              'Firma decorativa',
              style: _fontStyle(
                scriptFont,
                color: palette.primary,
                size: 22,
                weight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _swatchGrid(_PreviewPalette palette) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _caption('Canvas de página', palette),
      const SizedBox(height: AppSpacing.xs),
      Wrap(
        spacing: AppSpacing.xs,
        runSpacing: AppSpacing.xs,
        children: [
          _swatch('Fondo', palette.background, palette.text),
          _swatch('Texto', palette.text, palette.background),
          _swatch('Card', palette.card, palette.text),
          _swatch('Acento', palette.accent, palette.primary),
          _swatch('CTA', palette.primary, palette.buttonText),
        ],
      ),
    ],
  );

  Widget _caption(String text, _PreviewPalette palette) => Text(
    text,
    style: _fontStyle(
      bodyFont,
      color: palette.text.withValues(alpha: 0.74),
      size: 11,
      weight: FontWeight.w800,
    ),
  );

  Widget _navPill(
    String label,
    _PreviewPalette palette, {
    bool active = false,
    bool hover = false,
  }) {
    final bg = active
        ? palette.primary
        : hover
        ? palette.accent
        : palette.card;
    final fg = active ? palette.buttonText : palette.text;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: palette.primary.withValues(alpha: 0.25)),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.sm,
          vertical: 6,
        ),
        child: Text(
          label,
          style: _fontStyle(
            bodyFont,
            color: fg,
            size: 10,
            weight: FontWeight.w700,
          ),
        ),
      ),
    );
  }

  Widget _buttonSample(String label, Color bg, Color fg) => DecoratedBox(
    decoration: BoxDecoration(
      color: bg,
      borderRadius: BorderRadius.circular(
        borderRadius.clamp(10, 28).toDouble(),
      ),
    ),
    child: Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: 9,
      ),
      child: Text(
        label,
        style: _fontStyle(
          bodyFont,
          color: fg,
          size: 11,
          weight: FontWeight.w800,
        ),
      ),
    ),
  );

  Widget _swatch(String label, Color color, Color textColor) => DecoratedBox(
    decoration: BoxDecoration(
      color: color,
      borderRadius: BorderRadius.circular(10),
      border: Border.all(color: Colors.black.withValues(alpha: 0.08)),
    ),
    child: SizedBox(
      width: 74,
      height: 42,
      child: Center(
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: _fontStyle(
            bodyFont,
            color: textColor,
            size: 10,
            weight: FontWeight.w800,
          ),
        ),
      ),
    ),
  );

  TextStyle _fontStyle(
    String fontName, {
    required Color color,
    required double size,
    FontWeight weight = FontWeight.w600,
  }) {
    final base = TextStyle(color: color, fontSize: size, fontWeight: weight);
    try {
      return GoogleFonts.getFont(fontName, textStyle: base);
    } catch (_) {
      return base.copyWith(fontFamily: fontName);
    }
  }
}

class _PreviewPalette {
  const _PreviewPalette({
    required this.label,
    required this.primary,
    required this.secondary,
    required this.accent,
    required this.background,
    required this.text,
    required this.card,
    required this.isDark,
  });

  final String label;
  final Color primary;
  final Color secondary;
  final Color accent;
  final Color background;
  final Color text;
  final Color card;
  final bool isDark;

  Color get buttonText => isDark ? AppColors.darkBackground : Colors.white;
}
