import 'package:flutter/material.dart';

/// Paleta de colores — réplica exacta de los tokens CSS de globals.css.
/// NUNCA hardcodear colores en otro lugar de la app.
class AppColors {
  AppColors._();

  // ── Light Mode ────────────────────────────────────────────────────────────
  static const Color lightPrimary = Color(0xFF6C0A0A);
  static const Color lightBackground = Color(0xFFFFF8FC);
  static const Color lightForeground = Color(0xFF1A050A);
  static const Color lightCard = Color(0xFFFFFFFF);
  static const Color lightSecondary = Color(0xFFFCE7F3);
  static const Color lightMuted = Color(0xFFF5F5F5);
  static const Color lightAccent = Color(0xFFFFF1F9);
  static const Color lightBorder = Color(0xFFE5E5E5);

  // ── Dark Mode ─────────────────────────────────────────────────────────────
  static const Color darkPrimary = Color(0xFFFB7185);
  static const Color darkBackground = Color(0xFF0F0505);
  static const Color darkForeground = Color(0xFFFAFAFA);
  static const Color darkCard = Color(0xFF1C0A0F);
  static const Color darkSecondary = Color(0xFF881337);
  static const Color darkMuted = Color(0xFF2A1015);
  static const Color darkAccent = Color(0xFF2A1015);
  static const Color darkBorder = Color(0xFF2A1015);
  static const Color darkShimmerHighlight = Color(0xFF3A2020);

  // ── Semánticos (igual en ambos modos) ────────────────────────────────────
  // ── Colores de categorías de entidades ─────────────────────────────────────
  static const Color categoriesColor = Color(0xFF7C3AED);
  static const Color servicesColor = Color(0xFF0891B2);

  // ── Semánticos (igual en ambos modos) ────────────────────────────────────
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color destructive = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);

  // ── Variantes de estado ───────────────────────────────────────────────────
  static const Color successLight = Color(0xFFD1FAE5);
  static const Color warningLight = Color(0xFFFEF3C7);
  static const Color destructiveLight = Color(0xFFFEE2E2);
  static const Color infoLight = Color(0xFFDBEAFE);

  // ── Prioridad (para contactos y otras entidades) ───────────────────────────
  static const Color priorityHigh = Color(0xFFEF4444); // red
  static const Color priorityMedium = Color(0xFFF59E0B); // amber
  static const Color priorityLow = Color(0xFF9CA3AF); // gray

  static const Color priorityHighLight = Color(0xFFFEE2E2);
  static const Color priorityMediumLight = Color(0xFFFEF3C7);
  static const Color priorityLowLight = Color(0xFFF3F4F6);

  // ── Neutros y misceláneos ─────────────────────────────────────────────────
  static const Color neutral = Color(0xFF6B7280); // gris ui (inactivo/borrador)
  static const Color neutralMedium = Color(0xFF9E9E9E); // gris placeholder imgs
  static const Color featured = Color(0xFF8B5CF6); // violeta para "Destacado"

  // ── Switch / Divider / Form (Light + Dark) ────────────────────────────────
  static const Color lightSwitchThumb = Color(
    0xFFFFFFFF,
  ); // blanco visible ON/OFF
  static const Color darkSwitchThumb = Color(
    0xFF6B6B6B,
  ); // gris visible en dark OFF
  static const Color lightSwitchTrack = Color(0xFFD9D9D9); // track OFF light
  static const Color darkSwitchTrack = Color(0xFF3A3A3A); // track OFF dark
  static const Color lightSwitchOutline = Color(
    0xFFB0B0B0,
  ); // borde visible OFF light
  static const Color darkSwitchOutline = Color(
    0xFF555555,
  ); // borde visible OFF dark

  // ── Redes sociales ────────────────────────────────────────────────────────
  static const Color instagramPink = Color(0xFFE1306C); // Instagram brand color
}
