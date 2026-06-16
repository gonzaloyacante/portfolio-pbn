part of 'app_theme.dart';

// ── _buildFromParts ───────────────────────────────────────────────────────────
// Extraído de AppTheme como función privada de nivel superior para poder
// vivir en su propio part file. Los call sites dentro de AppTheme no cambian
// (static methods de una clase llaman a funciones privadas del mismo scope).

ThemeData _buildFromParts({
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
  Color? onPrimary,
}) {
  final onPrimaryContrasting =
      onPrimary ?? (isLight ? Colors.white : background);

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
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
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
        return isLight ? AppColors.lightSwitchThumb : AppColors.darkSwitchThumb;
      }),
      trackColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return primary;
        }
        return isLight ? AppColors.lightSwitchTrack : AppColors.darkSwitchTrack;
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
