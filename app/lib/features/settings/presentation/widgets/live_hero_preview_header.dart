import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../../core/theme/app_colors.dart';

// ── File-level helpers ────────────────────────────────────────────────────────

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

// ── LiveHeroPreviewSignature ──────────────────────────────────────────────────

/// Renders the owner signature + illustration section of the hero preview.
/// Used at the bottom of the mobile layout and inline for desktop.
class LiveHeroPreviewSignature extends StatelessWidget {
  const LiveHeroPreviewSignature({
    super.key,
    required this.vals,
    required this.extraCtrls,
    required this.owner,
    this.pendingIllustration,
    required this.currentIllustrationUrl,
    required this.isMobile,
    required this.isDarkMode,
  });

  final Map<String, dynamic> vals;
  final Map<String, TextEditingController> extraCtrls;
  final String owner;
  final File? pendingIllustration;
  final String currentIllustrationUrl;
  final bool isMobile;
  final bool isDarkMode;

  Widget _buildIllustration() {
    if (pendingIllustration != null) {
      return Image.file(pendingIllustration!, fit: BoxFit.contain);
    }
    if (currentIllustrationUrl.isNotEmpty) {
      return CachedNetworkImage(
        imageUrl: currentIllustrationUrl,
        fit: BoxFit.contain,
        errorWidget: (context, url, error) =>
            const Center(child: Icon(Icons.broken_image)),
      );
    }
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.pink.withValues(alpha: 70), width: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final effOwnX = _eff(
      vals,
      'ownerNameOffsetX',
      'ownerNameMobileOffsetX',
      0,
      isMobile,
    );
    final effOwnY = _eff(
      vals,
      'ownerNameOffsetY',
      'ownerNameMobileOffsetY',
      0,
      isMobile,
    );
    final effOwnSize = _eff(
      vals,
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

    final effIllX = _eff(
      vals,
      'illustrationOffsetX',
      'illustrationMobileOffsetX',
      0,
      isMobile,
    );
    final effIllY = _eff(
      vals,
      'illustrationOffsetY',
      'illustrationMobileOffsetY',
      0,
      isMobile,
    );
    final effIllScale =
        _eff(
          vals,
          'illustrationSize',
          'illustrationMobileSize',
          isMobile ? 60 : 100,
          isMobile,
        ) /
        100.0;
    final effIllRot = _eff(
      vals,
      'illustrationRotation',
      'illustrationMobileRotation',
      0,
      isMobile,
    );
    final illOpac = (vals['illustrationOpacity'] as num?)?.toDouble() ?? 100.0;

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
              child: _buildIllustration(),
            ),
          ),
        ),
      ),
    );

    return isMobile
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
  }
}

// ── LiveHeroPreviewHeader ─────────────────────────────────────────────────────

/// Renders the hero header text section: title1 + title2.
/// For desktop, also includes [LiveHeroPreviewSignature] below the titles.
class LiveHeroPreviewHeader extends StatelessWidget {
  const LiveHeroPreviewHeader({
    super.key,
    required this.vals,
    required this.extraCtrls,
    required this.title1,
    required this.title2,
    required this.owner,
    this.pendingIllustration,
    required this.currentIllustrationUrl,
    required this.isMobile,
    required this.isDarkMode,
    required this.primaryColor,
  });

  final Map<String, dynamic> vals;
  final Map<String, TextEditingController> extraCtrls;
  final String title1;
  final String title2;
  final String owner;
  final File? pendingIllustration;
  final String currentIllustrationUrl;
  final bool isMobile;
  final bool isDarkMode;
  final Color primaryColor;

  @override
  Widget build(BuildContext context) {
    final effT1X = _eff(
      vals,
      'heroTitle1OffsetX',
      'heroTitle1MobileOffsetX',
      0,
      isMobile,
    );
    final effT1Y = _eff(
      vals,
      'heroTitle1OffsetY',
      'heroTitle1MobileOffsetY',
      0,
      isMobile,
    );
    final effT1Size = _eff(
      vals,
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

    final effT2X = _eff(
      vals,
      'heroTitle2OffsetX',
      'heroTitle2MobileOffsetX',
      0,
      isMobile,
    );
    final effT2Y = _eff(
      vals,
      'heroTitle2OffsetY',
      'heroTitle2MobileOffsetY',
      0,
      isMobile,
    );
    final effT2Size = _eff(
      vals,
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

    if (isMobile) {
      return Column(children: [title1Widget, title2Widget]);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        title1Widget,
        title2Widget,
        const SizedBox(height: 24),
        LiveHeroPreviewSignature(
          vals: vals,
          extraCtrls: extraCtrls,
          owner: owner,
          pendingIllustration: pendingIllustration,
          currentIllustrationUrl: currentIllustrationUrl,
          isMobile: false,
          isDarkMode: isDarkMode,
        ),
      ],
    );
  }
}
