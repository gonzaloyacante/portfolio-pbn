import 'dart:io';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/theme/app_colors.dart';
import '../home_editor_panel.dart';
import 'live_hero_immersive_helpers.dart';
import 'live_hero_preview_gallery.dart';
import 'live_hero_preview_header.dart';

/// Viewports alineados con web `VisualEditorLayout` (`VIEWPORT_CONFIGS`).
const double _kVpDesktopW = 1280;
const double _kVpDesktopH = 900;
const double _kVpTabletW = 768;
const double _kVpTabletH = 1024;
const double _kVpMobileW = 375;
const double _kVpMobileH = 812;

const double _kPreviewMaxDisplayHeight = 650;

class LiveHeroPreview extends StatelessWidget {
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
    this.onSelectPanel,
  });

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

  final String device;
  final bool isDarkMode;

  final ValueChanged<HomeEditorPanel>? onSelectPanel;

  @override
  Widget build(BuildContext context) {
    final isMobileDevice = device == 'mobile';
    final bgColor = isDarkMode
        ? AppColors.darkBackground
        : AppColors.lightBackground;
    final primaryColor = isDarkMode
        ? AppColors.darkPrimary
        : AppColors.lightPrimary;

    final vpW = switch (device) {
      'mobile' => _kVpMobileW,
      'tablet' => _kVpTabletW,
      _ => _kVpDesktopW,
    };
    final vpH = switch (device) {
      'mobile' => _kVpMobileH,
      'tablet' => _kVpTabletH,
      _ => _kVpDesktopH,
    };

    final immersive = vals['heroImmersiveEnabled'] == true;
    final kind = (vals['heroBackdropMediaKind'] as String?) ?? 'auto';
    final rawBackdrop =
        (isMobileDevice && (_strVal('heroBackdropMobileUrl').trim().isNotEmpty))
        ? _strVal('heroBackdropMobileUrl')
        : _strVal('heroBackdropUrl');
    final mainPortrait = currentHeroImageUrl;
    final backdropUrl = rawBackdrop.isNotEmpty ? rawBackdrop : mainPortrait;

    /// Igual que web pública: inmersivo = una sola capa (fondo), sin retrato duplicado.
    final hidePortrait = immersive;

    final extent = _effectiveScrimExtent(isMobileDevice);
    final opacity = _effectiveScrimOpacity(isMobileDevice);
    final feather = (vals['heroScrimFeatherPercent'] as num?)?.toDouble() ?? 50;
    final edge = (vals['heroScrimEdge'] as String?) ?? 'left';
    final scrimLight = extraCtrls['heroScrimColor']?.text;
    final scrimDark = extraCtrls['heroScrimColorDark']?.text;
    final fgFallback = isDarkMode
        ? AppColors.darkForeground
        : AppColors.lightForeground;

    final scrimGradient = immersive
        ? buildHeroScrimGradient(
            edge: edge,
            extentPercent: extent,
            opacityPercent: opacity,
            featherPercent: feather,
            colorLightHex: scrimLight,
            colorDarkHex: scrimDark,
            prefersDark: isDarkMode,
            fallbackForeground: fgFallback,
          )
        : null;

    final tintPct = (vals['heroBackdropTintOpacity'] as num?)?.toDouble() ?? 0;
    final tintColor = tintPct > 0
        ? Colors.black.withValues(alpha: (tintPct / 100).clamp(0.0, 1.0))
        : null;

    final header = LiveHeroPreviewHeader(
      vals: vals,
      extraCtrls: extraCtrls,
      title1: title1,
      title2: title2,
      owner: owner,
      pendingIllustration: pendingIllustration,
      currentIllustrationUrl: currentIllustrationUrl,
      isMobile: isMobileDevice,
      isDarkMode: isDarkMode,
      primaryColor: primaryColor,
      onTapTexts: onSelectPanel == null
          ? null
          : () => onSelectPanel!(HomeEditorPanel.texts),
      onTapIllustration: onSelectPanel == null
          ? null
          : () => onSelectPanel!(HomeEditorPanel.illustration),
      onTapOwnerName: onSelectPanel == null
          ? null
          : () => onSelectPanel!(HomeEditorPanel.texts),
    );

    final gallery = LiveHeroPreviewGallery(
      vals: vals,
      extraCtrls: extraCtrls,
      cta: cta,
      pendingHeroImage: pendingHeroImage,
      currentHeroImageUrl: currentHeroImageUrl,
      isMobile: isMobileDevice,
      isDarkMode: isDarkMode,
      primaryColor: primaryColor,
      hidePortrait: hidePortrait,
      onTapHeroImage: onSelectPanel == null
          ? null
          : () => onSelectPanel!(HomeEditorPanel.heroImage),
      onTapCta: onSelectPanel == null
          ? null
          : () => onSelectPanel!(HomeEditorPanel.cta),
    );

    final heroBody = isMobileDevice
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
                onTapIllustration: onSelectPanel == null
                    ? null
                    : () => onSelectPanel!(HomeEditorPanel.illustration),
                onTapOwnerName: onSelectPanel == null
                    ? null
                    : () => onSelectPanel!(HomeEditorPanel.texts),
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

    final inner = Stack(
      clipBehavior: Clip.hardEdge,
      fit: StackFit.expand,
      children: [
        Container(color: bgColor),
        if (immersive && backdropUrl.isNotEmpty)
          GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: onSelectPanel == null
                ? null
                : () => onSelectPanel!(HomeEditorPanel.immersive),
            child: _BackdropLayer(
              backdropUrl: backdropUrl,
              mediaKind: kind,
              posterUrl: _strVal('heroBackdropPosterUrl'),
              objectFit: (vals['heroBackdropObjectFit'] as String?) ?? 'cover',
              primaryColor: primaryColor,
            ),
          ),
        if (immersive && scrimGradient != null)
          GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: onSelectPanel == null
                ? null
                : () => onSelectPanel!(HomeEditorPanel.immersive),
            child: DecoratedBox(
              decoration: BoxDecoration(gradient: scrimGradient),
            ),
          ),
        if (immersive && tintColor != null)
          GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: onSelectPanel == null
                ? null
                : () => onSelectPanel!(HomeEditorPanel.immersive),
            child: ColoredBox(color: tintColor),
          ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
          child: heroBody,
        ),
      ],
    );

    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final containerWidth = constraints.maxWidth;
          final scaleToFit = containerWidth / vpW;
          final effectiveScale = math.min(scaleToFit, 1.0);
          final scaledHeight = vpH * effectiveScale;
          final displayHeight = math.min(
            scaledHeight,
            _kPreviewMaxDisplayHeight,
          );

          return SizedBox(
            height: displayHeight,
            width: containerWidth,
            child: ClipRect(
              child: OverflowBox(
                alignment: Alignment.topCenter,
                maxHeight: scaledHeight,
                child: Align(
                  alignment: Alignment.topCenter,
                  child: Transform.scale(
                    scale: effectiveScale,
                    alignment: Alignment.topLeft,
                    filterQuality: FilterQuality.medium,
                    child: SizedBox(width: vpW, height: vpH, child: inner),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  String _strVal(String key) =>
      (vals[key] as String?) ?? extraCtrls[key]?.text ?? '';

  double _effectiveScrimExtent(bool isMobileD) {
    if (isMobileD) {
      final m = vals['heroScrimMobileExtentPercent'];
      if (m is num) return m.toDouble();
    }
    return (vals['heroScrimExtentPercent'] as num?)?.toDouble() ?? 45;
  }

  double _effectiveScrimOpacity(bool isMobileD) {
    if (isMobileD) {
      final m = vals['heroScrimMobileOpacity'];
      if (m is num) return m.toDouble();
    }
    return (vals['heroScrimOpacity'] as num?)?.toDouble() ?? 80;
  }
}

class _BackdropLayer extends StatelessWidget {
  const _BackdropLayer({
    required this.backdropUrl,
    required this.mediaKind,
    required this.posterUrl,
    required this.objectFit,
    required this.primaryColor,
  });

  final String backdropUrl;
  final String mediaKind;
  final String posterUrl;
  final String objectFit;
  final Color primaryColor;

  @override
  Widget build(BuildContext context) {
    final boxFit = objectFit == 'contain' ? BoxFit.contain : BoxFit.cover;
    final isVid = isHeroBackdropVideoUrl(backdropUrl, mediaKind);

    if (isVid) {
      final poster = posterUrl.isNotEmpty ? posterUrl : null;
      return Stack(
        fit: StackFit.expand,
        children: [
          if (poster != null)
            AppNetworkImage(
              imageUrl: poster,
              fit: boxFit,
              placeholder: ColoredBox(
                color: primaryColor.withValues(alpha: 0.15),
              ),
              errorWidget: ColoredBox(
                color: primaryColor.withValues(alpha: 0.12),
              ),
            )
          else
            ColoredBox(color: primaryColor.withValues(alpha: 0.12)),
          Center(
            child: Icon(
              Icons.play_circle_outline_rounded,
              size: 72,
              color: Colors.white.withValues(alpha: 0.85),
            ),
          ),
        ],
      );
    }

    final isHttp =
        backdropUrl.startsWith('http://') || backdropUrl.startsWith('https://');
    if (!isHttp) {
      final file = File(backdropUrl);
      if (file.existsSync()) {
        return Image.file(file, fit: boxFit);
      }
    }

    return AppNetworkImage(
      imageUrl: backdropUrl,
      fit: boxFit,
      placeholder: ColoredBox(color: primaryColor.withValues(alpha: 0.12)),
      errorWidget: ColoredBox(color: primaryColor.withValues(alpha: 0.12)),
    );
  }
}
