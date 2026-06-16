import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:portfolio_pbn/features/settings/data/settings_model.dart';

import 'app_colors.dart';
import 'app_radius.dart';
import 'app_typography.dart';

part 'app_theme_helpers.dart';
part 'app_theme_builder.dart';

/// Construcción de [ThemeData] light y dark — Material 3.
/// Sistema de border-radius por nivel: tile=16, card=20, dialog=28. [AppRadius]
/// Espaciado basado en escala 4px. [AppSpacing]
/// Breakpoints responsivos: compact/medium/expanded. [AppBreakpoints]
class AppTheme {
  AppTheme._();

  // Aliases para compatibilidad (usan AppRadius internamente)
  static BorderRadius get cardRadius => AppRadius.forCard;
  static BorderRadius get buttonRadius => AppRadius.forButton;
  static BorderRadius get inputRadius => AppRadius.forInput;
  static BorderRadius get smallCardRadius => AppRadius.forTile;

  // ── Light ─────────────────────────────────────────────────────────────────
  static ThemeData get light => _build(Brightness.light);

  // ── Dark ──────────────────────────────────────────────────────────────────
  static ThemeData get dark => _build(Brightness.dark);

  /// Tema admin completo desde la misma fuente que la web (ThemeSettings en BD).
  static ThemeData fromThemeSettings(ThemeSettings s, Brightness brightness) {
    final isLight = brightness == Brightness.light;

    final primary = _parseThemeHex(
      isLight ? s.primaryColor : s.darkPrimaryColor,
      isLight ? AppColors.lightPrimary : AppColors.darkPrimary,
    );
    final background = _parseThemeHex(
      isLight ? s.backgroundColor : s.darkBackgroundColor,
      isLight ? AppColors.lightBackground : AppColors.darkBackground,
    );
    final foreground = _parseThemeHex(
      isLight ? s.textColor : s.darkTextColor,
      isLight ? AppColors.lightForeground : AppColors.darkForeground,
    );
    final card = _parseThemeHex(
      isLight ? s.cardBgColor : s.darkCardBgColor,
      isLight ? AppColors.lightCard : AppColors.darkCard,
    );
    final secondary = _parseThemeHex(
      isLight ? s.secondaryColor : s.darkSecondaryColor,
      isLight ? AppColors.lightSecondary : AppColors.darkSecondary,
    );
    final accent = _parseThemeHex(
      isLight ? s.accentColor : s.darkAccentColor,
      isLight ? AppColors.lightAccent : AppColors.darkAccent,
    );
    final border = _mixSrgbFgIntoBg(
      foreground,
      background,
      isLight ? 0.14 : 0.18,
    );
    final muted = _mixSrgbFgIntoBg(
      foreground,
      background,
      isLight ? 0.06 : 0.08,
    );
    final mutedFg = _mixSrgbFgIntoBg(
      foreground,
      background,
      isLight ? 0.52 : 0.55,
    );
    final textTheme = _dynamicTextTheme(s, brightness, foreground, mutedFg);
    final radii = _Radii.fromBorderRadiusPx(s.borderRadius);

    return _buildFromParts(
      brightness: brightness,
      isLight: isLight,
      primary: primary,
      background: background,
      foreground: foreground,
      card: card,
      secondary: secondary,
      accent: accent,
      border: border,
      muted: muted,
      textTheme: textTheme,
      radii: radii,
      snackBarBgLightAsForeground: true,
      onPrimary: secondary,
    );
  }

  // ── Builder ───────────────────────────────────────────────────────────────
  static ThemeData _build(Brightness brightness) {
    final isLight = brightness == Brightness.light;

    final primary = isLight ? AppColors.lightPrimary : AppColors.darkPrimary;
    final background = isLight
        ? AppColors.lightBackground
        : AppColors.darkBackground;
    final foreground = isLight
        ? AppColors.lightForeground
        : AppColors.darkForeground;
    final card = isLight ? AppColors.lightCard : AppColors.darkCard;
    final secondary = isLight
        ? AppColors.lightSecondary
        : AppColors.darkSecondary;
    final border = isLight ? AppColors.lightBorder : AppColors.darkBorder;
    final muted = isLight ? AppColors.lightMuted : AppColors.darkMuted;

    return _buildFromParts(
      brightness: brightness,
      isLight: isLight,
      primary: primary,
      background: background,
      foreground: foreground,
      card: card,
      secondary: secondary,
      accent: isLight ? AppColors.lightAccent : AppColors.darkAccent,
      border: border,
      muted: muted,
      textTheme: AppTypography.textTheme(brightness),
      radii: _Radii.defaults(),
      snackBarBgLightAsForeground: false,
    );
  }
}
