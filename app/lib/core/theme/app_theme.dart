import 'package:flutter/material.dart';

import 'app_colors.dart';
import 'app_typography.dart';

/// Construcción de [ThemeData] light y dark.
/// BorderRadius de cards: 40px (= rounded-[2.5rem] del web).
/// Transiciones: 500ms (= duration-500).
class AppTheme {
  AppTheme._();

  static const BorderRadius cardRadius = BorderRadius.all(Radius.circular(20));
  static const BorderRadius buttonRadius = BorderRadius.all(
    Radius.circular(12),
  );
  static const BorderRadius inputRadius = BorderRadius.all(Radius.circular(12));
  static const BorderRadius smallCardRadius = BorderRadius.all(
    Radius.circular(12),
  );

  // ── Light ─────────────────────────────────────────────────────────────────
  static ThemeData get light => _build(Brightness.light);

  // ── Dark ──────────────────────────────────────────────────────────────────
  static ThemeData get dark => _build(Brightness.dark);

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

    final colorScheme = ColorScheme(
      brightness: brightness,
      primary: primary,
      onPrimary: isLight ? Colors.white : AppColors.darkBackground,
      primaryContainer: secondary,
      onPrimaryContainer: primary,
      secondary: secondary,
      onSecondary: primary,
      secondaryContainer: muted,
      onSecondaryContainer: foreground,
      tertiary: isLight ? AppColors.lightAccent : AppColors.darkAccent,
      onTertiary: foreground,
      error: AppColors.destructive,
      onError: Colors.white,
      surface: card,
      onSurface: foreground,
      surfaceContainerHighest: muted,
      outline: border,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: background,
      textTheme: AppTypography.textTheme(brightness),

      // ── AppBar ──────────────────────────────────────────────────────────
      appBarTheme: AppBarTheme(
        backgroundColor: card,
        foregroundColor: foreground,
        elevation: 0,
        scrolledUnderElevation: 1,
        shadowColor: border,
        titleTextStyle: AppTypography.textTheme(brightness).titleLarge,
      ),

      // ── Card ────────────────────────────────────────────────────────────
      cardTheme: CardThemeData(
        color: card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: cardRadius,
          side: BorderSide(color: border),
        ),
        margin: const EdgeInsets.all(0),
      ),

      // ── ElevatedButton ──────────────────────────────────────────────────
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: isLight ? Colors.white : AppColors.darkBackground,
          shape: const RoundedRectangleBorder(borderRadius: buttonRadius),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          textStyle: AppTypography.textTheme(brightness).labelLarge,
          elevation: 0,
        ),
      ),

      // ── OutlinedButton ──────────────────────────────────────────────────
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primary,
          side: BorderSide(color: primary),
          shape: const RoundedRectangleBorder(borderRadius: buttonRadius),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          textStyle: AppTypography.textTheme(brightness).labelLarge,
        ),
      ),

      // ── TextButton ──────────────────────────────────────────────────────
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primary,
          shape: const RoundedRectangleBorder(borderRadius: buttonRadius),
          textStyle: AppTypography.textTheme(brightness).labelLarge,
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
          borderRadius: inputRadius,
          borderSide: BorderSide(color: border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: inputRadius,
          borderSide: BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: inputRadius,
          borderSide: BorderSide(color: primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: inputRadius,
          borderSide: const BorderSide(color: AppColors.destructive),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: inputRadius,
          borderSide: const BorderSide(color: AppColors.destructive, width: 2),
        ),
        labelStyle: AppTypography.textTheme(brightness).bodyMedium,
        hintStyle: AppTypography.textTheme(
          brightness,
        ).bodyMedium?.copyWith(color: foreground.withAlpha(102)),
      ),

      // ── Divider ─────────────────────────────────────────────────────────
      dividerTheme: DividerThemeData(color: border, thickness: 1),

      // ── BottomNavigationBar ─────────────────────────────────────────────
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: card,
        selectedItemColor: primary,
        unselectedItemColor: foreground.withAlpha(102),
        elevation: 0,
        type: BottomNavigationBarType.fixed,
      ),

      // ── Chip ────────────────────────────────────────────────────────────
      chipTheme: ChipThemeData(
        backgroundColor: muted,
        selectedColor: secondary,
        labelStyle: AppTypography.textTheme(brightness).labelSmall,
        shape: const StadiumBorder(),
        side: BorderSide(color: border),
      ),

      // ── Switch ──────────────────────────────────────────────────────────
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return primary;
          return border;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return primary.withAlpha(77);
          }
          return muted;
        }),
      ),

      // ── Drawer ──────────────────────────────────────────────────────────
      drawerTheme: DrawerThemeData(
        backgroundColor: card,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
            topRight: Radius.circular(24),
            bottomRight: Radius.circular(24),
          ),
        ),
      ),

      // ── SnackBar ────────────────────────────────────────────────────────
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(12)),
        ),
        backgroundColor: isLight ? AppColors.lightForeground : card,
        contentTextStyle: AppTypography.textTheme(brightness).bodyMedium
            ?.copyWith(color: isLight ? AppColors.lightBackground : foreground),
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
