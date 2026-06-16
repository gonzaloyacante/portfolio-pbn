part of 'app_theme.dart';

// ── Helpers privados ──────────────────────────────────────────────────────────

Color _parseThemeHex(String hex, Color fallback) {
  var h = hex.replaceAll('#', '').trim();
  if (h.length == 6) {
    h = 'FF$h';
  }
  if (h.length == 8) {
    final v = int.tryParse(h, radix: 16);
    if (v != null) {
      return Color(v);
    }
  }
  return fallback;
}

/// Alineado con `color-mix(in srgb, fg p%, bg)` en `web/src/lib/theme-ssr-css.ts`.
Color _mixSrgbFgIntoBg(Color fg, Color bg, double fgFraction) {
  final t = fgFraction.clamp(0.0, 1.0);
  return Color.lerp(bg, fg, t) ?? bg;
}

TextStyle _safeGoogleFont(String name, TextStyle fallback) {
  final t = name.trim();
  if (t.isEmpty) {
    return fallback;
  }
  try {
    return GoogleFonts.getFont(t);
  } catch (_) {
    return fallback;
  }
}

/// Escalas de texto alineadas con [AppTypography.textTheme], pero con fuentes DB.
TextTheme _dynamicTextTheme(
  ThemeSettings s,
  Brightness brightness,
  Color foreground,
  Color mutedColor,
) {
  final headingBase = _safeGoogleFont(s.headingFont, GoogleFonts.poppins());
  final bodyBase = _safeGoogleFont(s.bodyFont, GoogleFonts.openSans());
  final scriptBase = _safeGoogleFont(s.scriptFont, GoogleFonts.greatVibes());
  final hs = s.headingFontSize.toDouble();
  final bs = s.bodyFontSize.toDouble();
  final ss = s.scriptFontSize.toDouble();

  return TextTheme(
    displayLarge: scriptBase.copyWith(
      fontSize: ss + 21,
      fontWeight: FontWeight.w400,
      color: foreground,
    ),
    displayMedium: scriptBase.copyWith(
      fontSize: ss + 9,
      fontWeight: FontWeight.w400,
      color: foreground,
    ),
    displaySmall: scriptBase.copyWith(
      fontSize: ss + 3,
      fontWeight: FontWeight.w400,
      color: foreground,
    ),
    headlineLarge: headingBase.copyWith(
      fontSize: hs,
      fontWeight: FontWeight.w700,
      color: foreground,
    ),
    headlineMedium: headingBase.copyWith(
      fontSize: hs - 4,
      fontWeight: FontWeight.w700,
      color: foreground,
    ),
    headlineSmall: headingBase.copyWith(
      fontSize: hs - 8,
      fontWeight: FontWeight.w600,
      color: foreground,
    ),
    titleLarge: headingBase.copyWith(
      fontSize: hs - 10,
      fontWeight: FontWeight.w600,
      color: foreground,
    ),
    titleMedium: headingBase.copyWith(
      fontSize: 16,
      fontWeight: FontWeight.w600,
      color: foreground,
    ),
    titleSmall: headingBase.copyWith(
      fontSize: 14,
      fontWeight: FontWeight.w600,
      color: foreground,
    ),
    bodyLarge: bodyBase.copyWith(
      fontSize: bs,
      fontWeight: FontWeight.w400,
      color: foreground,
    ),
    bodyMedium: bodyBase.copyWith(
      fontSize: bs - 2,
      fontWeight: FontWeight.w400,
      color: foreground,
    ),
    bodySmall: bodyBase.copyWith(
      fontSize: bs - 4,
      fontWeight: FontWeight.w400,
      color: mutedColor,
    ),
    labelLarge: bodyBase.copyWith(
      fontSize: bs - 2,
      fontWeight: FontWeight.w600,
      color: foreground,
    ),
    labelMedium: bodyBase.copyWith(
      fontSize: 12,
      fontWeight: FontWeight.w500,
      color: foreground,
    ),
    labelSmall: bodyBase.copyWith(
      fontSize: 11,
      fontWeight: FontWeight.w500,
      color: mutedColor,
    ),
  );
}

// ── _Radii ────────────────────────────────────────────────────────────────────

class _Radii {
  _Radii({
    required this.card,
    required this.button,
    required this.input,
    required this.tile,
    required this.dialog,
    required this.drawerCorner,
    required this.bottomSheetTop,
  });

  final BorderRadius card;
  final BorderRadius button;
  final BorderRadius input;
  final BorderRadius tile;
  final BorderRadius dialog;
  final double drawerCorner;
  final double bottomSheetTop;

  factory _Radii.defaults() {
    return _Radii(
      card: AppRadius.forCard,
      button: AppRadius.forButton,
      input: AppRadius.forInput,
      tile: AppRadius.forTile,
      dialog: AppRadius.forDialog,
      drawerCorner: AppRadius.xxl,
      bottomSheetTop: AppRadius.dialog,
    );
  }

  factory _Radii.fromBorderRadiusPx(int raw) {
    final clampR = raw.clamp(8, 56).toDouble();
    final btn = (clampR * 0.35).clamp(8.0, 18.0);
    final tile = (clampR * 0.42).clamp(12.0, clampR);
    final dlg = (clampR * 0.72).clamp(18.0, clampR + 12);
    final drawer = (clampR * 0.65).clamp(22.0, 36.0);
    final sheet = (clampR * 0.72).clamp(20.0, dlg);
    return _Radii(
      card: BorderRadius.circular(clampR),
      button: BorderRadius.circular(btn),
      input: BorderRadius.circular(btn),
      tile: BorderRadius.circular(tile),
      dialog: BorderRadius.circular(dlg),
      drawerCorner: drawer,
      bottomSheetTop: sheet,
    );
  }
}
