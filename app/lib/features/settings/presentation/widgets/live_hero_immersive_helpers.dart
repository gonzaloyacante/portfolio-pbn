import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'live_hero_preview_utils.dart';

bool isHeroBackdropVideoUrl(String url, String kind) {
  if (kind == 'video') return true;
  if (kind == 'image') return false;
  final u = url.toLowerCase();
  return u.contains('/video/upload/') ||
      RegExp(
        r'\.(mp4|webm|mov|m4v)(\?[^#]*)?$',
        caseSensitive: false,
      ).hasMatch(u);
}

Color _mixForeground(Color foreground, double opacityPercent, double alphaMul) {
  final pct = math.min(100, math.max(0, opacityPercent * alphaMul));
  return foreground.withValues(alpha: pct / 100);
}

/// Réplica de `buildHeroScrimBackground` (web `hero-backdrop-styles.ts`) para preview Flutter.
Gradient? buildHeroScrimGradient({
  required String edge,
  required double extentPercent,
  required double opacityPercent,
  required double featherPercent,
  String? colorLightHex,
  String? colorDarkHex,
  required bool prefersDark,
  required Color fallbackForeground,
}) {
  if (edge == 'none') return null;

  final extent = math.min(100, math.max(5.0, extentPercent));
  final feather = math.min(100, math.max(0.0, featherPercent));
  final op = math.min(1.0, math.max(0.0, opacityPercent / 100));

  final colorHex =
      prefersDark &&
          colorDarkHex != null &&
          colorDarkHex.replaceAll('#', '').length == 6
      ? colorDarkHex
      : (colorLightHex != null && colorLightHex.replaceAll('#', '').length == 6
            ? colorLightHex
            : null);

  Color solidStart;
  Color midTone;
  if (colorHex != null && colorHex.isNotEmpty) {
    final base = parseHexColor(
      colorHex.startsWith('#') ? colorHex : '#$colorHex',
    );
    if (base != null) {
      solidStart = base.withValues(alpha: op);
      midTone = base.withValues(alpha: op * 0.38);
    } else {
      solidStart = _mixForeground(fallbackForeground, opacityPercent, 1);
      midTone = _mixForeground(fallbackForeground, opacityPercent, 0.38);
    }
  } else {
    solidStart = _mixForeground(fallbackForeground, opacityPercent, 1);
    midTone = _mixForeground(fallbackForeground, opacityPercent, 0.38);
  }

  final softness = math.max(0.08, feather / 120);
  final softStopPct = math.min(extent - 0.25, extent * softness);

  const transparent = Colors.transparent;

  if (edge == 'left') {
    return LinearGradient(
      begin: Alignment.centerLeft,
      end: Alignment.centerRight,
      colors: [solidStart, midTone, transparent],
      stops: [0, softStopPct / 100, extent / 100],
    );
  }
  if (edge == 'right') {
    return LinearGradient(
      begin: Alignment.centerRight,
      end: Alignment.centerLeft,
      colors: [solidStart, midTone, transparent],
      stops: [0, softStopPct / 100, extent / 100],
    );
  }
  if (edge == 'both') {
    final half = extent / 2;
    final softHalfPct = math.min(half - 0.25, half * softness);
    final edgeMid = colorHex != null && colorHex.isNotEmpty
        ? (parseHexColor(colorHex.startsWith('#') ? colorHex : '#$colorHex') ??
                  fallbackForeground)
              .withValues(alpha: op * 0.42)
        : _mixForeground(fallbackForeground, opacityPercent, 0.42);

    return LinearGradient(
      begin: Alignment.centerLeft,
      end: Alignment.centerRight,
      colors: [
        solidStart,
        edgeMid,
        transparent,
        transparent,
        edgeMid,
        solidStart,
      ],
      stops: [
        0,
        softHalfPct / 100,
        half / 100,
        1 - half / 100,
        1 - softHalfPct / 100,
        1,
      ],
    );
  }
  return null;
}
