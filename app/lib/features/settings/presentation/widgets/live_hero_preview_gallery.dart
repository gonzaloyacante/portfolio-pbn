import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';

// ── File-level helpers ────────────────────────────────────────────────────────

TextStyle _getFont(String fontName, TextStyle fallback) {
  if (fontName.isEmpty) return fallback;
  try {
    return GoogleFonts.getFont(fontName);
  } catch (_) {
    return fallback;
  }
}

double _eff(
  Map<String, dynamic> vals,
  String baseKey,
  String mobileKey,
  double fallback,
  bool isMobile,
) {
  final mVal = vals[mobileKey];
  if (isMobile && mVal != null) return (mVal as num).toDouble();
  final dVal = vals[baseKey];
  return dVal != null ? (dVal as num).toDouble() : fallback;
}

// ── LiveHeroPreviewGallery ────────────────────────────────────────────────────

/// Renders the hero gallery section: the main portfolio image + CTA button.
class LiveHeroPreviewGallery extends StatelessWidget {
  const LiveHeroPreviewGallery({
    super.key,
    required this.vals,
    required this.extraCtrls,
    required this.cta,
    this.pendingHeroImage,
    required this.currentHeroImageUrl,
    required this.isMobile,
    required this.isDarkMode,
    required this.primaryColor,
  });

  final Map<String, dynamic> vals;
  final Map<String, TextEditingController> extraCtrls;
  final String cta;
  final File? pendingHeroImage;
  final String currentHeroImageUrl;
  final bool isMobile;
  final bool isDarkMode;
  final Color primaryColor;

  Widget _buildImage() {
    if (pendingHeroImage != null) {
      return Image.file(pendingHeroImage!, fit: BoxFit.cover);
    }
    if (currentHeroImageUrl.isNotEmpty) {
      return CachedNetworkImage(
        imageUrl: currentHeroImageUrl,
        fit: BoxFit.cover,
        errorWidget: (context, url, error) =>
            const Center(child: Icon(Icons.broken_image)),
      );
    }
    return Container(
      color: primaryColor.withValues(alpha: 25),
      padding: const EdgeInsets.all(16),
      child: Center(
        child: Text(
          'Sin Imagen',
          style: TextStyle(color: primaryColor.withValues(alpha: 150)),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final effImgX = _eff(
      vals,
      'heroMainImageOffsetX',
      'heroMainImageMobileOffsetX',
      0,
      isMobile,
    );
    final effImgY = _eff(
      vals,
      'heroMainImageOffsetY',
      'heroMainImageMobileOffsetY',
      0,
      isMobile,
    );
    final imgStyle = (vals['heroImageStyle'] as String?) ?? 'original';
    final imgShapeRadius = imgStyle == 'rounded'
        ? BorderRadius.circular(32)
        : (imgStyle == 'circle'
              ? BorderRadius.circular(9999)
              : BorderRadius.zero);
    final imgAspectRatio = imgStyle == 'circle'
        ? 1.0
        : (imgStyle == 'portrait' ? 3 / 4 : (isMobile ? 1.0 : 4 / 5));

    final imageWidget = Transform.translate(
      offset: Offset(effImgX, effImgY),
      child: AspectRatio(
        aspectRatio: imgAspectRatio,
        child: ClipRRect(borderRadius: imgShapeRadius, child: _buildImage()),
      ),
    );

    final effCtaX = _eff(vals, 'ctaOffsetX', 'ctaMobileOffsetX', 0, isMobile);
    final effCtaY = _eff(vals, 'ctaOffsetY', 'ctaMobileOffsetY', 0, isMobile);
    final effCtaSize = _eff(
      vals,
      'ctaFontSize',
      'ctaMobileFontSize',
      isMobile ? 14 : 16,
      isMobile,
    );
    final ctaFontName = extraCtrls['ctaFont']?.text ?? 'Poppins';

    final ctaWidget = Transform.translate(
      offset: Offset(effCtaX, effCtaY),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        decoration: BoxDecoration(
          color: primaryColor,
          borderRadius: BorderRadius.circular(100),
        ),
        child: Text(
          cta,
          style: _getFont(
            ctaFontName,
            const TextStyle(fontWeight: FontWeight.w600),
          ).copyWith(color: Colors.white, fontSize: effCtaSize),
        ),
      ),
    );

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [imageWidget, const SizedBox(height: 32), ctaWidget],
    );
  }
}
