import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

Color? parseHexColor(String? hexColor) {
  if (hexColor == null || hexColor.isEmpty) return null;
  var hex = hexColor.replaceAll('#', '').trim();
  if (hex.length == 6) hex = 'FF$hex';
  if (hex.length == 8) {
    final val = int.tryParse(hex, radix: 16);
    if (val != null) return Color(val);
  }
  return null;
}

TextStyle getFontSafe(String fontName, TextStyle fallback) {
  if (fontName.isEmpty) return fallback;
  try {
    return GoogleFonts.getFont(fontName);
  } catch (_) {
    return fallback;
  }
}

double effectivePreviewValue(
  Map<String, Object?> vals,
  String baseKey,
  String mobileKey,
  double fallback,
  bool isMobile,
) {
  final mVal = vals[mobileKey];
  if (isMobile && mVal is num) return mVal.toDouble();
  final dVal = vals[baseKey];
  return dVal is num ? dVal.toDouble() : fallback;
}
