import 'dart:io';
import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';
import '../../../../core/theme/app_colors.dart';
import 'live_hero_preview_utils.dart';

// ── File-level helpers ────────────────────────────────────────────────────────

double _eff(
  Map<String, Object?> vals,
  String baseKey,
  String mobileKey,
  double fallback,
  bool isMobile,
) => effectivePreviewValue(vals, baseKey, mobileKey, fallback, isMobile);

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

  final Map<String, Object?> vals;
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
      return AppNetworkImage(
        imageUrl: currentHeroImageUrl,
        fit: BoxFit.cover,
        placeholder: const ColoredBox(color: AppColors.lightBorder),
        errorWidget: const Center(child: Icon(Icons.broken_image)),
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
          style: getFontSafe(
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
