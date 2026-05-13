import 'dart:io';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';

/// Preview en vivo de la sección About.
/// Muestra foto de perfil (con forma y sombra configuradas) y el título de bio
/// con su color. Se escala para encajar en el panel de preview.
class LiveAboutPreview extends StatelessWidget {
  const LiveAboutPreview({
    super.key,
    required this.bioTitle,
    required this.bioTitleColorHex,
    required this.bioTitleColorDarkHex,
    required this.profileImageUrl,
    required this.pendingProfileImage,
    required this.profileImageShape,
    required this.shadowEnabled,
    required this.shadowColorHex,
    required this.shadowOpacity,
    required this.shadowBlur,
    required this.shadowSpread,
    required this.shadowOffsetX,
    required this.shadowOffsetY,
    required this.isDarkMode,
    this.onToggleDark,
  });

  final String bioTitle;
  final String bioTitleColorHex;
  final String bioTitleColorDarkHex;
  final String? profileImageUrl;
  final File? pendingProfileImage;
  final String profileImageShape;
  final bool shadowEnabled;
  final String shadowColorHex;
  final int shadowOpacity;
  final int shadowBlur;
  final int shadowSpread;
  final int shadowOffsetX;
  final int shadowOffsetY;
  final bool isDarkMode;
  final ValueChanged<bool>? onToggleDark;

  static const double _kVpW = 900;
  static const double _kVpH = 500;
  static const double _kMaxDisplayH = 420;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _PreviewHeader(isDarkMode: isDarkMode, onToggle: onToggleDark),
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: LayoutBuilder(
            builder: (context, constraints) {
              final scale = math.min(constraints.maxWidth / _kVpW, 1.0);
              final displayH = math.min(_kVpH * scale, _kMaxDisplayH);
              return SizedBox(
                height: displayH,
                width: constraints.maxWidth,
                child: ClipRect(
                  child: OverflowBox(
                    alignment: Alignment.topCenter,
                    maxHeight: _kVpH * scale,
                    child: Align(
                      alignment: Alignment.topCenter,
                      child: Transform.scale(
                        scale: scale,
                        alignment: Alignment.topLeft,
                        filterQuality: FilterQuality.medium,
                        child: SizedBox(
                          width: _kVpW,
                          height: _kVpH,
                          child: _AboutScene(preview: this),
                        ),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          'Vista previa de /sobre-mí',
          style: TextStyle(
            fontSize: 11,
            color: Theme.of(
              context,
            ).colorScheme.onSurface.withValues(alpha: 0.45),
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}

// ── Escena interna ──────────────────────────────────────────────────────────

class _AboutScene extends StatelessWidget {
  const _AboutScene({required this.preview});
  final LiveAboutPreview preview;

  @override
  Widget build(BuildContext context) {
    final bg = preview.isDarkMode
        ? AppColors.darkBackground
        : AppColors.lightBackground;
    final textColor = _resolveColor(
      preview.isDarkMode
          ? preview.bioTitleColorDarkHex
          : preview.bioTitleColorHex,
      preview.isDarkMode ? AppColors.darkForeground : AppColors.lightForeground,
    );

    return Container(
      color: bg,
      padding: const EdgeInsets.symmetric(horizontal: 60, vertical: 48),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            flex: 5,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  preview.bioTitle.isEmpty ? 'Título de bio' : preview.bioTitle,
                  style: TextStyle(
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 12),
                Container(
                  height: 4,
                  width: 60,
                  decoration: BoxDecoration(
                    color: textColor.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 12),
                Container(
                  height: 10,
                  width: 220,
                  decoration: BoxDecoration(
                    color: textColor.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  height: 10,
                  width: 180,
                  decoration: BoxDecoration(
                    color: textColor.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 60),
          Expanded(
            flex: 4,
            child: Center(child: _ProfileImageBox(preview: preview)),
          ),
        ],
      ),
    );
  }

  Color _resolveColor(String hex, Color fallback) {
    final clean = hex.trim();
    if (clean.length == 7 && clean.startsWith('#')) {
      try {
        return Color(int.parse('0xFF${clean.substring(1)}'));
      } catch (_) {}
    }
    return fallback;
  }
}

// ── Foto de perfil con forma y sombra ──────────────────────────────────────

class _ProfileImageBox extends StatelessWidget {
  const _ProfileImageBox({required this.preview});
  final LiveAboutPreview preview;

  @override
  Widget build(BuildContext context) {
    final shadow = _buildShadow();
    final radius = _buildRadius();
    const size = 220.0;

    Widget imageChild;
    if (preview.pendingProfileImage != null) {
      imageChild = Image.file(preview.pendingProfileImage!, fit: BoxFit.cover);
    } else if (preview.profileImageUrl?.isNotEmpty == true) {
      imageChild = AppNetworkImage(
        imageUrl: preview.profileImageUrl!,
        fit: BoxFit.cover,
        placeholder: ColoredBox(
          color: AppColors.lightPrimary.withValues(alpha: 0.12),
        ),
        errorWidget: const _EmptyPhotoPlaceholder(size: size),
      );
    } else {
      imageChild = const _EmptyPhotoPlaceholder(size: size);
    }

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        borderRadius: radius,
        boxShadow: shadow != null ? [shadow] : null,
      ),
      clipBehavior: Clip.antiAlias,
      child: imageChild,
    );
  }

  BoxShadow? _buildShadow() {
    if (!preview.shadowEnabled) return null;
    final hex = preview.shadowColorHex.trim();
    Color color;
    if (hex.length == 7 && hex.startsWith('#')) {
      try {
        color = Color(int.parse('0xFF${hex.substring(1)}'));
      } catch (_) {
        color = AppColors.lightPrimary;
      }
    } else {
      color = AppColors.lightPrimary;
    }
    return BoxShadow(
      color: color.withValues(alpha: preview.shadowOpacity / 100),
      blurRadius: preview.shadowBlur.toDouble(),
      spreadRadius: preview.shadowSpread.toDouble(),
      offset: Offset(
        preview.shadowOffsetX.toDouble(),
        preview.shadowOffsetY.toDouble(),
      ),
    );
  }

  BorderRadius _buildRadius() => switch (preview.profileImageShape) {
    'circle' || 'ellipse' => BorderRadius.circular(9999),
    'rounded' => AppRadius.forCard,
    _ => BorderRadius.zero,
  };
}

class _EmptyPhotoPlaceholder extends StatelessWidget {
  const _EmptyPhotoPlaceholder({required this.size});
  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      color: AppColors.lightPrimary.withValues(alpha: 0.10),
      child: const Icon(
        Icons.person_outline_rounded,
        size: 64,
        color: AppColors.lightPrimary,
      ),
    );
  }
}

// ── Header con toggle de modo ──────────────────────────────────────────────

class _PreviewHeader extends StatelessWidget {
  const _PreviewHeader({required this.isDarkMode, this.onToggle});
  final bool isDarkMode;
  final ValueChanged<bool>? onToggle;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.xs),
      child: Row(
        children: [
          Text(
            'Preview',
            style: Theme.of(context).textTheme.labelMedium?.copyWith(
              color: Theme.of(
                context,
              ).colorScheme.onSurface.withValues(alpha: 0.6),
            ),
          ),
          const Spacer(),
          InkWell(
            borderRadius: BorderRadius.circular(20),
            onTap: onToggle != null ? () => onToggle!(!isDarkMode) : null,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    isDarkMode
                        ? Icons.dark_mode_outlined
                        : Icons.light_mode_outlined,
                    size: 14,
                    color: Theme.of(
                      context,
                    ).colorScheme.onSurface.withValues(alpha: 0.5),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    isDarkMode ? 'Dark' : 'Light',
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: Theme.of(
                        context,
                      ).colorScheme.onSurface.withValues(alpha: 0.5),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
