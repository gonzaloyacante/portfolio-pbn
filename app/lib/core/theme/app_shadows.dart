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
        color: isDark
            ? Colors.black.withValues(alpha: 40 / 255)
            : Colors.black.withValues(alpha: 10 / 255),
        blurRadius: 4,
        offset: const Offset(0, 1),
      ),
    ];
  }

  static List<BoxShadow> md(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return [
      BoxShadow(
        color: isDark
            ? Colors.black.withValues(alpha: 60 / 255)
            : Colors.black.withValues(alpha: 15 / 255),
        blurRadius: 8,
        offset: const Offset(0, 2),
      ),
      BoxShadow(
        color: isDark
            ? Colors.black.withValues(alpha: 30 / 255)
            : Colors.black.withValues(alpha: 8 / 255),
        blurRadius: 4,
        offset: const Offset(0, 1),
      ),
    ];
  }

  static List<BoxShadow> lg(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return [
      BoxShadow(
        color: isDark
            ? Colors.black.withValues(alpha: 80 / 255)
            : Colors.black.withValues(alpha: 20 / 255),
        blurRadius: 16,
        offset: const Offset(0, 4),
      ),
      BoxShadow(
        color: isDark
            ? Colors.black.withValues(alpha: 40 / 255)
            : Colors.black.withValues(alpha: 10 / 255),
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
        color: isDark
            ? Colors.black.withValues(alpha: 100 / 255)
            : Colors.black.withValues(alpha: 25 / 255),
        blurRadius: 24,
        offset: const Offset(0, 8),
      ),
    ];
  }
}
