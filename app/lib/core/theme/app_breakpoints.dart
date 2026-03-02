import 'package:flutter/material.dart';

/// Sistema de breakpoints responsive basado en Material 3 / Material You.
///
/// Compact  (<600dp)   → Móvil portrait. 4 cols, margin 16dp, gutter 16dp.
/// Medium   (600–839)  → Móvil landscape / Tablet portrait. 8 cols, margin 24dp.
/// Expanded (≥840dp)   → Tablet landscape / desktop. 12 cols, margin 24dp.
///
/// Uso:
/// ```dart
/// if (AppBreakpoints.isCompact(context)) { ... }
/// final cols = AppBreakpoints.gridColumns(context, compact: 2, medium: 3, expanded: 4);
/// ```
abstract final class AppBreakpoints {
  AppBreakpoints._();

  static const double _compact = 600;
  static const double _expanded = 840;

  // ── Comprobaciones ───────────────────────────────────────────────────────

  static bool isCompact(BuildContext context) =>
      MediaQuery.sizeOf(context).width < _compact;

  static bool isMedium(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    return w >= _compact && w < _expanded;
  }

  static bool isExpanded(BuildContext context) =>
      MediaQuery.sizeOf(context).width >= _expanded;

  static bool isMobile(BuildContext context) =>
      MediaQuery.sizeOf(context).width < _compact;

  static bool isTablet(BuildContext context) =>
      MediaQuery.sizeOf(context).width >= _compact;

  // ── Helpers de valor por breakpoint ─────────────────────────────────────

  /// Devuelve un valor tipado según el breakpoint actual.
  static T value<T>(
    BuildContext context, {
    required T compact,
    required T medium,
    required T expanded,
  }) {
    final w = MediaQuery.sizeOf(context).width;
    if (w < _compact) return compact;
    if (w < _expanded) return medium;
    return expanded;
  }

  // ── Grid ─────────────────────────────────────────────────────────────────

  /// Columnas para SliverGrid / GridView adaptativo.
  static int gridColumns(
    BuildContext context, {
    int compact = 2,
    int medium = 3,
    int expanded = 4,
  }) {
    return value(context, compact: compact, medium: medium, expanded: expanded);
  }

  // ── Layout ───────────────────────────────────────────────────────────────

  /// Margen horizontal de página según breakpoint.
  static double pageMargin(BuildContext context) =>
      value(context, compact: 16, medium: 24, expanded: 24);

  /// Gutter entre elementos de grid.
  static double gutter(BuildContext context) =>
      value(context, compact: 12, medium: 16, expanded: 20);

  /// Padding de página completo (horizontal + vertical).
  static EdgeInsets pagePadding(BuildContext context, {double? vertical}) {
    final h = pageMargin(context);
    final v = vertical ?? 16.0;
    return EdgeInsets.symmetric(horizontal: h, vertical: v);
  }

  /// Padding solo horizontal de página.
  static EdgeInsets horizontalPadding(BuildContext context) =>
      EdgeInsets.symmetric(horizontal: pageMargin(context));

  // ── Drawer ───────────────────────────────────────────────────────────────

  /// Ancho del drawer en tablet medium (Navigation Rail collapsed).
  static const double railWidth = 72.0;

  /// Ancho del drawer expandido en tablet.
  static const double drawerWidth = 280.0;

  // ── Orientación ──────────────────────────────────────────────────────────

  static bool isLandscape(BuildContext context) =>
      MediaQuery.orientationOf(context) == Orientation.landscape;

  static bool isPortrait(BuildContext context) =>
      MediaQuery.orientationOf(context) == Orientation.portrait;

  /// En móvil landscape (ancho ≥ 600 pero alto < 600) → tratar como medium.
  static bool isMobileLandscape(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    return size.width >= _compact &&
        size.height < _compact &&
        isLandscape(context);
  }
}
