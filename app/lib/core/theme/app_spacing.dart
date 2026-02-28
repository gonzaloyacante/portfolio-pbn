import 'package:flutter/material.dart';

/// Sistema de espaciado basado en escala de 4px.
///
/// Uso directo:
/// ```dart
/// SizedBox(height: AppSpacing.md)
/// Padding(padding: EdgeInsets.all(AppSpacing.base))
/// ```
abstract final class AppSpacing {
  AppSpacing._();

  // ── Escala de 4px ────────────────────────────────────────────────────────
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double base = 16;
  static const double lg = 20;
  static const double xl = 24;
  static const double xxl = 32;
  static const double xxxl = 48;

  // ── Semánticos ───────────────────────────────────────────────────────────

  /// Separación entre ítems de lista.
  static const double itemGap = sm;

  /// Separación entre ítems de lista más grande.
  static const double itemGapLg = md;

  /// Padding interno de cards.
  static const double cardPadding = base;

  /// Padding interno de tiles de lista.
  static const double tilePadding = md;

  /// Padding para formularios.
  static const double formSpacing = base;

  /// Separación entre secciones dentro de una pantalla.
  static const double sectionGap = xl;

  // ── EdgeInsets helpers ───────────────────────────────────────────────────

  static const EdgeInsets cardInsets = EdgeInsets.all(base);
  static const EdgeInsets tileInsets = EdgeInsets.all(tilePadding);
  static const EdgeInsets pageInsets = EdgeInsets.all(base);
  static const EdgeInsets listInsets = EdgeInsets.symmetric(horizontal: base, vertical: sm);
}
