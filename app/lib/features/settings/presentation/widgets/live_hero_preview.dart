import 'dart:io';
import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import 'live_hero_preview_gallery.dart';
import 'live_hero_preview_header.dart';

class LiveHeroPreview extends StatelessWidget {
  final Map<String, Object?> vals;
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

  @override
  Widget build(BuildContext context) {
    final isMobile = device == 'mobile';
    final isDesktop = device == 'desktop';
    final bgColor = isDarkMode
        ? AppColors.darkBackground
        : AppColors.lightBackground;
    final primaryColor = isDarkMode
        ? AppColors.darkPrimary
        : AppColors.lightPrimary;
    final viewportWidth = device == 'mobile'
        ? 390.0
        : (device == 'tablet' ? 768.0 : 1200.0);

    final header = LiveHeroPreviewHeader(
      vals: vals,
      extraCtrls: extraCtrls,
      title1: title1,
      title2: title2,
      owner: owner,
      pendingIllustration: pendingIllustration,
      currentIllustrationUrl: currentIllustrationUrl,
      isMobile: isMobile,
      isDarkMode: isDarkMode,
      primaryColor: primaryColor,
    );

    final gallery = LiveHeroPreviewGallery(
      vals: vals,
      extraCtrls: extraCtrls,
      cta: cta,
      pendingHeroImage: pendingHeroImage,
      currentHeroImageUrl: currentHeroImageUrl,
      isMobile: isMobile,
      isDarkMode: isDarkMode,
      primaryColor: primaryColor,
    );

    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
        color: bgColor,
        child: AspectRatio(
          aspectRatio: isDesktop ? (16 / 9) : (isMobile ? (9 / 18) : (3 / 4)),
          child: LayoutBuilder(
            builder: (context, constraints) {
              final scale = constraints.maxWidth / viewportWidth;
              final content = isMobile
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        header,
                        const SizedBox(height: 32),
                        gallery,
                        const SizedBox(height: 32),
                        LiveHeroPreviewSignature(
                          vals: vals,
                          extraCtrls: extraCtrls,
                          owner: owner,
                          pendingIllustration: pendingIllustration,
                          currentIllustrationUrl: currentIllustrationUrl,
                          isMobile: true,
                          isDarkMode: isDarkMode,
                        ),
                      ],
                    )
                  : Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Expanded(flex: 5, child: header),
                        const SizedBox(width: 48),
                        Expanded(flex: 7, child: gallery),
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
