import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:portfolio_pbn/features/settings/data/settings_model.dart';

import 'app_colors.dart';
import 'app_radius.dart';
import 'app_typography.dart';

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
    final border = isLight ? AppColors.lightBorder : AppColors.darkBorder;
    final muted = isLight ? AppColors.lightMuted : AppColors.darkMuted;

    final mutedFg = foreground.withValues(alpha: 153 / 255);
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

  static ThemeData _buildFromParts({
    required Brightness brightness,
    required bool isLight,
    required Color primary,
    required Color background,
    required Color foreground,
    required Color card,
    required Color secondary,
    required Color accent,
    required Color border,
    required Color muted,
    required TextTheme textTheme,
    required _Radii radii,
    required bool snackBarBgLightAsForeground,
  }) {
    final onPrimaryContrasting = isLight ? Colors.white : background;

    final colorScheme = ColorScheme(
      brightness: brightness,
      primary: primary,
      onPrimary: onPrimaryContrasting,
      primaryContainer: secondary,
      onPrimaryContainer: primary,
      secondary: secondary,
      onSecondary: primary,
      secondaryContainer: muted,
      onSecondaryContainer: foreground,
      tertiary: accent,
      onTertiary: foreground,
      error: AppColors.destructive,
      onError: Colors.white,
      surface: card,
      onSurface: foreground,
      surfaceContainerHighest: muted,
      outline: border,
    );

    final snackBg = isLight
        ? (snackBarBgLightAsForeground ? foreground : AppColors.lightForeground)
        : card;
    final snackFg = isLight
        ? (snackBarBgLightAsForeground ? background : AppColors.lightBackground)
        : foreground;

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: background,
      textTheme: textTheme,

      // ── AppBar ──────────────────────────────────────────────────────────
      appBarTheme: AppBarTheme(
        backgroundColor: card,
        foregroundColor: foreground,
        elevation: 0,
        scrolledUnderElevation: 1,
        shadowColor: border.withValues(alpha: 80 / 255),
        centerTitle: false,
        titleTextStyle: textTheme.titleLarge?.copyWith(
          fontWeight: FontWeight.w600,
        ),
        iconTheme: IconThemeData(color: foreground, size: 22),
        actionsIconTheme: IconThemeData(color: foreground, size: 22),
      ),

      // ── Card ────────────────────────────────────────────────────────────
      cardTheme: CardThemeData(
        color: card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: radii.card,
          side: BorderSide(color: border.withValues(alpha: 180 / 255)),
        ),
        margin: const EdgeInsets.all(0),
        surfaceTintColor: Colors.transparent,
      ),

      // ── ElevatedButton ──────────────────────────────────────────────────
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: onPrimaryContrasting,
          shape: RoundedRectangleBorder(borderRadius: radii.button),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          textStyle: textTheme.labelLarge,
          elevation: 0,
        ),
      ),

      // ── OutlinedButton ──────────────────────────────────────────────────
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primary,
          side: BorderSide(color: primary),
          shape: RoundedRectangleBorder(borderRadius: radii.button),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          textStyle: textTheme.labelLarge,
        ),
      ),

      // ── TextButton ──────────────────────────────────────────────────────
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primary,
          shape: RoundedRectangleBorder(borderRadius: radii.button),
          textStyle: textTheme.labelLarge,
        ),
      ),

      // ── InputDecoration ─────────────────────────────────────────────────
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: muted,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: radii.input,
          borderSide: BorderSide(color: border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: radii.input,
          borderSide: BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: radii.input,
          borderSide: BorderSide(color: primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: radii.input,
          borderSide: const BorderSide(color: AppColors.destructive),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: radii.input,
          borderSide: const BorderSide(color: AppColors.destructive, width: 2),
        ),
        labelStyle: textTheme.bodyMedium,
        hintStyle: textTheme.bodyMedium?.copyWith(
          color: foreground.withValues(alpha: 102 / 255),
        ),
      ),

      // ── Divider ─────────────────────────────────────────────────────────
      dividerTheme: DividerThemeData(color: border, thickness: 1),

      // ── BottomNavigationBar ─────────────────────────────────────────────
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: card,
        selectedItemColor: primary,
        unselectedItemColor: foreground.withValues(alpha: 102 / 255),
        elevation: 0,
        type: BottomNavigationBarType.fixed,
      ),

      // ── Chip ────────────────────────────────────────────────────────────
      chipTheme: ChipThemeData(
        backgroundColor: muted,
        selectedColor: secondary,
        labelStyle: textTheme.labelSmall,
        shape: const StadiumBorder(),
        side: BorderSide(color: border.withValues(alpha: 150 / 255)),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      ),

      // ── Switch ──────────────────────────────────────────────────────────
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return isLight ? Colors.white : background;
          }
          return isLight
              ? AppColors.lightSwitchThumb
              : AppColors.darkSwitchThumb;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return primary;
          }
          return isLight
              ? AppColors.lightSwitchTrack
              : AppColors.darkSwitchTrack;
        }),
        trackOutlineColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return Colors.transparent;
          }
          return isLight
              ? AppColors.lightSwitchOutline
              : AppColors.darkSwitchOutline;
        }),
        thumbIcon: WidgetStateProperty.resolveWith((states) {
          return null;
        }),
      ),

      // ── Drawer ──────────────────────────────────────────────────────────
      drawerTheme: DrawerThemeData(
        backgroundColor: card,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
            topRight: Radius.circular(radii.drawerCorner),
            bottomRight: Radius.circular(radii.drawerCorner),
          ),
        ),
      ),

      // ── SnackBar ────────────────────────────────────────────────────────
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: radii.button),
        backgroundColor: snackBg,
        contentTextStyle: textTheme.bodyMedium?.copyWith(color: snackFg),
      ),

      // ── ListTile ────────────────────────────────────────────────────────
      listTileTheme: ListTileThemeData(
        shape: RoundedRectangleBorder(borderRadius: radii.tile),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
      ),

      // ── Dialog ──────────────────────────────────────────────────────────
      dialogTheme: DialogThemeData(
        backgroundColor: card,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: radii.dialog),
        elevation: 8,
      ),

      // ── BottomSheet ─────────────────────────────────────────────────────
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: card,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(radii.bottomSheetTop),
            topRight: Radius.circular(radii.bottomSheetTop),
          ),
        ),
      ),

      // ── PageTransitions ─────────────────────────────────────────────────
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: {
          TargetPlatform.android: FadeUpwardsPageTransitionsBuilder(),
          TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
        },
      ),
    );
  }
}
