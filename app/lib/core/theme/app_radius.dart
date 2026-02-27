import 'package:flutter/material.dart';

/// Sistema de border-radius por nivel — Material 3 style.
///
/// Uso:
/// ```dart
/// borderRadius: AppRadius.card     // tarjetas
/// borderRadius: AppRadius.tile     // tiles de lista
/// borderRadius: AppRadius.dialog   // diálogos
/// ```
abstract final class AppRadius {
  AppRadius._();

  // ── Escala ───────────────────────────────────────────────────────────────
  static const double none = 0;
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double lg = 16;
  static const double xl = 20;
  static const double xxl = 28;
  static const double full = 50;

  // ── Semánticos ───────────────────────────────────────────────────────────
  /// Chips y badges.
  static const double chip = full;

  /// Tiles de lista y contenedores pequeños.
  static const double tile = lg;

  /// Tarjetas estándar.
  static const double card = xl;

  /// Diálogos y bottom sheets.
  static const double dialog = xxl;

  /// Botones.
  static const double button = md;

  /// Inputs de formulario.
  static const double input = md;

  /// Imágenes y contenedores de imagen.
  static const double image = lg;

  /// Iconos en círculo (contenedor).
  static const double iconContainer = md;

  // ── BorderRadius helpers ─────────────────────────────────────────────────

  static BorderRadius asRounded(double radius) => BorderRadius.circular(radius);

  static BorderRadius get forChip => BorderRadius.circular(chip);
  static BorderRadius get forTile => BorderRadius.circular(tile);
  static BorderRadius get forCard => BorderRadius.circular(card);
  static BorderRadius get forDialog => BorderRadius.circular(dialog);
  static BorderRadius get forButton => BorderRadius.circular(button);
  static BorderRadius get forInput => BorderRadius.circular(input);
  static BorderRadius get forImage => BorderRadius.circular(image);
  static BorderRadius get forIconContainer =>
      BorderRadius.circular(iconContainer);
  static BorderRadius get forFull => BorderRadius.circular(full);
}
