import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

/// Sistema de tipografía — réplica exacta de la web.
/// Poppins (headings) · Open Sans (body) · Great Vibes (decorativo)
class AppTypography {
  AppTypography._();

  // ── Fuentes base ──────────────────────────────────────────────────────────
  static TextStyle get _poppinsBase => GoogleFonts.poppins();
  static TextStyle get _openSansBase => GoogleFonts.openSans();
  static TextStyle get _greatVibesBase => GoogleFonts.greatVibes();

  // ── TextTheme completo ────────────────────────────────────────────────────
  static TextTheme textTheme(Brightness brightness) {
    final baseColor = brightness == Brightness.light
        ? AppColors.lightForeground
        : AppColors.darkForeground;
    final mutedColor = brightness == Brightness.light
        ? AppColors.lightForeground.withAlpha(153) // ~60%
        : AppColors.darkForeground.withAlpha(153);

    return TextTheme(
      // Display — Great Vibes para títulos decorativos
      displayLarge: _greatVibesBase.copyWith(
        fontSize: 57,
        fontWeight: FontWeight.w400,
        color: baseColor,
      ),
      displayMedium: _greatVibesBase.copyWith(
        fontSize: 45,
        fontWeight: FontWeight.w400,
        color: baseColor,
      ),
      displaySmall: _greatVibesBase.copyWith(
        fontSize: 36,
        fontWeight: FontWeight.w400,
        color: baseColor,
      ),

      // Headline — Poppins para secciones y títulos de página
      headlineLarge: _poppinsBase.copyWith(
        fontSize: 32,
        fontWeight: FontWeight.w700,
        color: baseColor,
      ),
      headlineMedium: _poppinsBase.copyWith(
        fontSize: 28,
        fontWeight: FontWeight.w700,
        color: baseColor,
      ),
      headlineSmall: _poppinsBase.copyWith(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: baseColor,
      ),

      // Title — Poppins para cards y secciones
      titleLarge: _poppinsBase.copyWith(
        fontSize: 22,
        fontWeight: FontWeight.w600,
        color: baseColor,
      ),
      titleMedium: _poppinsBase.copyWith(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: baseColor,
      ),
      titleSmall: _poppinsBase.copyWith(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: baseColor,
      ),

      // Body — Open Sans para contenido
      bodyLarge: _openSansBase.copyWith(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: baseColor,
      ),
      bodyMedium: _openSansBase.copyWith(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: baseColor,
      ),
      bodySmall: _openSansBase.copyWith(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: mutedColor,
      ),

      // Label — Open Sans para etiquetas y metadatos
      labelLarge: _openSansBase.copyWith(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: baseColor,
      ),
      labelMedium: _openSansBase.copyWith(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: baseColor,
      ),
      labelSmall: _openSansBase.copyWith(
        fontSize: 11,
        fontWeight: FontWeight.w500,
        color: mutedColor,
      ),
    );
  }

  // ── Estilo decorativo ─────────────────────────────────────────────────────
  static TextStyle decorativeTitle(Color color, {double fontSize = 48}) =>
      _greatVibesBase.copyWith(fontSize: fontSize, color: color);
}
