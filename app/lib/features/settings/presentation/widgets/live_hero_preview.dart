import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../../core/theme/app_colors.dart';

class LiveHeroPreview extends StatelessWidget {
  final Map<String, dynamic> vals;
  final Map<String, TextEditingController> extraCtrls;

  final String title1;
  final String title2;
  final String owner;
  final String cta;

  final File? pendingHeroImage;
  final String currentHeroImageUrl;
  final File? pendingIllustration;
  final String currentIllustrationUrl;

  final String device; // 'mobile', 'tablet', 'desktop'
  final bool isDarkMode;

  const LiveHeroPreview({
    super.key,
    required this.vals,
    required this.extraCtrls,
    required this.title1,
    required this.title2,
    required this.owner,
    required this.cta,
    this.pendingHeroImage,
    required this.currentHeroImageUrl,
    this.pendingIllustration,
    required this.currentIllustrationUrl,
    required this.device,
    required this.isDarkMode,
  });

  Color? _parseHexColor(String? hexColor) {
    if (hexColor == null || hexColor.isEmpty) return null;
    var hex = hexColor.replaceAll('#', '').trim();
    if (hex.length == 6) hex = 'FF$hex';
    if (hex.length == 8) {
      final val = int.tryParse(hex, radix: 16);
      if (val != null) return Color(val);
    }
    return null;
  }

  TextStyle _getFont(String fontName, TextStyle fallback) {
    if (fontName.isEmpty) return fallback;
    try {
      return GoogleFonts.getFont(fontName);
    } catch (_) {
      return fallback;
    }
  }

  double _eff(
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

  @override
  Widget build(BuildContext context) {
    final bool isMobile = device == 'mobile';

    // Colores base replicando CSS tokens (Background, accent, etc.)
    final bgColor = isDarkMode
        ? AppColors.darkBackground
        : AppColors.lightBackground;
    final primaryColor = isDarkMode
        ? AppColors.darkPrimary
        : AppColors.lightPrimary;

    // Título 1
    final effT1X = _eff(
      'heroTitle1OffsetX',
      'heroTitle1MobileOffsetX',
      0,
      isMobile,
    );
    final effT1Y = _eff(
      'heroTitle1OffsetY',
      'heroTitle1MobileOffsetY',
      0,
      isMobile,
    );
    final effT1Size = _eff(
      'heroTitle1FontSize',
      'heroTitle1MobileFontSize',
      isMobile ? 56 : 112,
      isMobile,
    );
    final t1ColorStr = isDarkMode
        ? extraCtrls['heroTitle1ColorDark']?.text
        : extraCtrls['heroTitle1Color']?.text;
    final t1Color =
        _parseHexColor(
          t1ColorStr?.isNotEmpty == true
              ? t1ColorStr
              : extraCtrls['heroTitle1Color']?.text,
        ) ??
        primaryColor;
    final t1FontName = extraCtrls['heroTitle1Font']?.text ?? 'Great Vibes';

    // Título 2
    final effT2X = _eff(
      'heroTitle2OffsetX',
      'heroTitle2MobileOffsetX',
      0,
      isMobile,
    );
    final effT2Y = _eff(
      'heroTitle2OffsetY',
      'heroTitle2MobileOffsetY',
      0,
      isMobile,
    );
    final effT2Size = _eff(
      'heroTitle2FontSize',
      'heroTitle2MobileFontSize',
      isMobile ? 72 : 96,
      isMobile,
    );
    final t2ColorStr = isDarkMode
        ? extraCtrls['heroTitle2ColorDark']?.text
        : extraCtrls['heroTitle2Color']?.text;
    final t2Color =
        _parseHexColor(
          t2ColorStr?.isNotEmpty == true
              ? t2ColorStr
              : extraCtrls['heroTitle2Color']?.text,
        ) ??
        (isDarkMode ? AppColors.darkAccent : AppColors.lightAccent);
    final t2FontName = extraCtrls['heroTitle2Font']?.text ?? 'Poppins';

    // Owner (Firma)
    final effOwnX = _eff(
      'ownerNameOffsetX',
      'ownerNameMobileOffsetX',
      0,
      isMobile,
    );
    final effOwnY = _eff(
      'ownerNameOffsetY',
      'ownerNameMobileOffsetY',
      0,
      isMobile,
    );
    final effOwnSize = _eff(
      'ownerNameFontSize',
      'ownerNameMobileFontSize',
      isMobile ? 28 : 36,
      isMobile,
    );
    final ownColorStr = isDarkMode
        ? extraCtrls['ownerNameColorDark']?.text
        : extraCtrls['ownerNameColor']?.text;
    final ownColor =
        _parseHexColor(
          ownColorStr?.isNotEmpty == true
              ? ownColorStr
              : extraCtrls['ownerNameColor']?.text,
        ) ??
        (isDarkMode ? AppColors.darkForeground : AppColors.lightForeground);
    final ownFontName = extraCtrls['ownerNameFont']?.text ?? 'Poppins';

    // Imagen
    final effImgX = _eff(
      'heroMainImageOffsetX',
      'heroMainImageMobileOffsetX',
      0,
      isMobile,
    );
    final effImgY = _eff(
      'heroMainImageOffsetY',
      'heroMainImageMobileOffsetY',
      0,
      isMobile,
    );
    final imgStyle = (vals['heroImageStyle'] as String?) ?? 'original';

    // Ilustración
    final effIllX = _eff(
      'illustrationOffsetX',
      'illustrationMobileOffsetX',
      0,
      isMobile,
    );
    final effIllY = _eff(
      'illustrationOffsetY',
      'illustrationMobileOffsetY',
      0,
      isMobile,
    );
    final effIllScale =
        _eff(
          'illustrationSize',
          'illustrationMobileSize',
          isMobile ? 60 : 100,
          isMobile,
        ) /
        100.0;
    final effIllRot = _eff(
      'illustrationRotation',
      'illustrationMobileRotation',
      0,
      isMobile,
    );
    final illOpac = (vals['illustrationOpacity'] as num?)?.toDouble() ?? 100.0;

    // CTA
    final effCtaX = _eff('ctaOffsetX', 'ctaMobileOffsetX', 0, isMobile);
    final effCtaY = _eff('ctaOffsetY', 'ctaMobileOffsetY', 0, isMobile);
    final effCtaSize = _eff(
      'ctaFontSize',
      'ctaMobileFontSize',
      isMobile ? 14 : 16,
      isMobile,
    );
    final ctaFontName = extraCtrls['ctaFont']?.text ?? 'Poppins';

    Widget buildImage() {
      if (pendingHeroImage != null) {
        return Image.file(pendingHeroImage!, fit: BoxFit.cover);
      }
      if (currentHeroImageUrl.isNotEmpty) {
        return CachedNetworkImage(
          imageUrl: currentHeroImageUrl,
          fit: BoxFit.cover,
          errorWidget: (context, url, error) =>
              const Center(child: const Icon(Icons.broken_image)),
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

    Widget buildIllustration() {
      if (pendingIllustration != null) {
        return Image.file(pendingIllustration!, fit: BoxFit.contain);
      }
      if (currentIllustrationUrl.isNotEmpty) {
        return CachedNetworkImage(
          imageUrl: currentIllustrationUrl,
          fit: BoxFit.contain,
          errorWidget: (context, url, error) =>
              const Center(child: const Icon(Icons.broken_image)),
        );
      }
      return Container(
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: Colors.pink.withValues(alpha: 70),
            width: 2,
          ),
        ),
      );
    }

    // Resolviendo el orden de apilamiento (Z-Index).
    // Usamos variables locales envueltas en posicionadores absolutos en un Stack si fuera necesario,
    // PERO la forma web los agrupa en filas y columnas y usa translate.
    // Para simplificar la previsualización y respetar el Z-Index general sin complicar el Box constraints:
    // Mantenemos la estructura semántica de React pero usando Transform.translate

    final title1Widget = Transform.translate(
      offset: Offset(effT1X, effT1Y),
      child: Text(
        title1,
        textAlign: isMobile ? TextAlign.center : TextAlign.left,
        style: _getFont(
          t1FontName,
          const TextStyle(),
        ).copyWith(fontSize: effT1Size, color: t1Color, height: 0.9),
      ),
    );

    final title2Widget = Transform.translate(
      offset: Offset(effT2X, effT2Y),
      child: Text(
        title2,
        textAlign: isMobile ? TextAlign.center : TextAlign.left,
        style:
            _getFont(
              t2FontName,
              const TextStyle(fontWeight: FontWeight.bold),
            ).copyWith(
              fontSize: effT2Size,
              color: t2Color,
              height: 1.0,
              letterSpacing: -1,
            ),
      ),
    );

    final signatureWidget = Transform.translate(
      offset: Offset(effOwnX, effOwnY),
      child: Text(
        owner,
        style: _getFont(
          ownFontName,
          const TextStyle(fontWeight: FontWeight.w700),
        ).copyWith(fontSize: effOwnSize, color: ownColor, letterSpacing: 2.0),
      ),
    );

    final illustrationWidget = Transform.translate(
      offset: Offset(effIllX, effIllY),
      child: Transform.rotate(
        angle: effIllRot * 3.14159 / 180,
        child: Opacity(
          opacity: (illOpac / 100).clamp(0.0, 1.0),
          child: SizedBox(
            width: isMobile ? 96 : 320,
            height: isMobile ? 96 : 320,
            child: Transform.scale(
              scale: effIllScale,
              child: buildIllustration(),
            ),
          ),
        ),
      ),
    );

    // Signature + Illustration group
    final signatureAndIllWidget = isMobile
        ? Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              illustrationWidget,
              const SizedBox(width: 8),
              signatureWidget,
            ],
          )
        : Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [illustrationWidget, signatureWidget],
          );

    final ctaWidget = Transform.translate(
      offset: Offset(effCtaX, effCtaY),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        decoration: BoxDecoration(
          color: primaryColor,
          borderRadius: const BorderRadius.circular(100),
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

    final imgShapeRadius = imgStyle == 'rounded'
        ? const BorderRadius.circular(32)
        : (imgStyle == 'circle'
              ? const BorderRadius.circular(9999)
              : BorderRadius.zero);
    final imgAspectRatio = imgStyle == 'circle'
        ? 1.0
        : (imgStyle == 'portrait' ? 3 / 4 : (isMobile ? 1.0 : 4 / 5));

    final imageWidget = Transform.translate(
      offset: Offset(effImgX, effImgY),
      child: AspectRatio(
        aspectRatio: imgAspectRatio,
        child: ClipRRect(borderRadius: imgShapeRadius, child: buildImage()),
      ),
    );

    final isDesktop = device == 'desktop';
    final viewportWidth = device == 'mobile'
        ? 390.0
        : (device == 'tablet' ? 768.0 : 1200.0);

    return ClipRRect(
      borderRadius: const BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
        color: bgColor,
        // Wrap everything in an AspectRatio scaled box to emulate the web viewport seamlessly
        child: AspectRatio(
          aspectRatio: isDesktop ? (16 / 9) : (isMobile ? (9 / 18) : (3 / 4)),
          child: LayoutBuilder(
            builder: (context, constraints) {
              final scale = constraints.maxWidth / viewportWidth;

              // El layout interno completo
              final Widget content = isMobile
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Column(children: [title1Widget, title2Widget]),
                        const SizedBox(height: 32),
                        imageWidget,
                        const SizedBox(height: 24),
                        ctaWidget,
                        const SizedBox(height: 32),
                        signatureAndIllWidget,
                      ],
                    )
                  : Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Expanded(
                          flex: 5,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              title1Widget,
                              title2Widget,
                              const SizedBox(height: 24),
                              signatureAndIllWidget,
                            ],
                          ),
                        ),
                        const SizedBox(width: 48),
                        Expanded(
                          flex: 7,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              imageWidget,
                              const SizedBox(height: 32),
                              ctaWidget,
                            ],
                          ),
                        ),
                      ],
                    );

              return Transform.scale(
                scale: scale,
                alignment: Alignment.topCenter,
                child: SizedBox(
                  width: viewportWidth,
                  height:
                      viewportWidth /
                      (constraints.maxWidth / constraints.maxHeight),
                  child: content,
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
