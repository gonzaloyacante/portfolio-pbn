import 'package:flutter/material.dart';

/// Sombras adaptativas — sutiles en dark, más visibles en light.
///
/// Uso:
/// ```dart
/// BoxShadow shadows = AppShadows.sm(brightness);
/// decoration: BoxDecoration(boxShadow: AppShadows.md(brightness))
/// ```
abstract final class AppShadows {
  AppShadows._();

  static List<BoxShadow> sm(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return [
      BoxShadow(
        color: isDark ? Colors.black.withAlpha(40) : Colors.black.withAlpha(10),
        blurRadius: 4,
        offset: const Offset(0, 1),
      ),
    ];
  }

  static List<BoxShadow> md(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return [
      BoxShadow(
        color: isDark ? Colors.black.withAlpha(60) : Colors.black.withAlpha(15),
        blurRadius: 8,
        offset: const Offset(0, 2),
      ),
      BoxShadow(
        color: isDark ? Colors.black.withAlpha(30) : Colors.black.withAlpha(8),
        blurRadius: 4,
        offset: const Offset(0, 1),
      ),
    ];
  }

  static List<BoxShadow> lg(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return [
      BoxShadow(
        color: isDark ? Colors.black.withAlpha(80) : Colors.black.withAlpha(20),
        blurRadius: 16,
        offset: const Offset(0, 4),
      ),
      BoxShadow(
        color: isDark ? Colors.black.withAlpha(40) : Colors.black.withAlpha(10),
        blurRadius: 8,
        offset: const Offset(0, 2),
      ),
    ];
  }

  /// Sombra elevada para cards flotantes (FABs, modales).
  static List<BoxShadow> elevated(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return [
      BoxShadow(
        color: isDark ? Colors.black.withAlpha(100) : Colors.black.withAlpha(25),
        blurRadius: 24,
        offset: const Offset(0, 8),
      ),
    ];
  }
}
