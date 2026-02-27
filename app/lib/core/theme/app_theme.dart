import 'package:flutter/material.dart';

import 'app_colors.dart';
import 'app_radius.dart';
import 'app_typography.dart';

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
        shadowColor: border.withAlpha(80),
        centerTitle: false,
        titleTextStyle: AppTypography.textTheme(
          brightness,
        ).titleLarge?.copyWith(fontWeight: FontWeight.w600),
        iconTheme: IconThemeData(color: foreground, size: 22),
        actionsIconTheme: IconThemeData(color: foreground, size: 22),
      ),

      // ── Card ────────────────────────────────────────────────────────────
      cardTheme: CardThemeData(
        color: card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: AppRadius.forCard,
          side: BorderSide(color: border.withAlpha(180)),
        ),
        margin: const EdgeInsets.all(0),
        surfaceTintColor: Colors.transparent,
      ),

      // ── ElevatedButton ──────────────────────────────────────────────────
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: isLight ? Colors.white : AppColors.darkBackground,
          shape: RoundedRectangleBorder(borderRadius: AppRadius.forButton),
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
          shape: RoundedRectangleBorder(borderRadius: AppRadius.forButton),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          textStyle: AppTypography.textTheme(brightness).labelLarge,
        ),
      ),

      // ── TextButton ──────────────────────────────────────────────────────
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primary,
          shape: RoundedRectangleBorder(borderRadius: AppRadius.forButton),
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
          borderRadius: AppRadius.forInput,
          borderSide: BorderSide(color: border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: AppRadius.forInput,
          borderSide: BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: AppRadius.forInput,
          borderSide: BorderSide(color: primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: AppRadius.forInput,
          borderSide: const BorderSide(color: AppColors.destructive),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: AppRadius.forInput,
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
        side: BorderSide(color: border.withAlpha(150)),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
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
        surfaceTintColor: Colors.transparent,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
            topRight: Radius.circular(AppRadius.xxl),
            bottomRight: Radius.circular(AppRadius.xxl),
          ),
        ),
      ),

      // ── SnackBar ────────────────────────────────────────────────────────
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: AppRadius.forButton),
        backgroundColor: isLight ? AppColors.lightForeground : card,
        contentTextStyle: AppTypography.textTheme(brightness).bodyMedium
            ?.copyWith(color: isLight ? AppColors.lightBackground : foreground),
      ),

      // ── ListTile ────────────────────────────────────────────────────────
      listTileTheme: ListTileThemeData(
        shape: RoundedRectangleBorder(borderRadius: AppRadius.forTile),
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
      ),

      // ── Dialog ──────────────────────────────────────────────────────────
      dialogTheme: DialogThemeData(
        backgroundColor: card,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: AppRadius.forDialog),
        elevation: 8,
      ),

      // ── BottomSheet ─────────────────────────────────────────────────────
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: card,
        surfaceTintColor: Colors.transparent,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(AppRadius.dialog),
            topRight: Radius.circular(AppRadius.dialog),
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
