import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class LiveServicesPagePreview extends StatelessWidget {
  const LiveServicesPagePreview({
    super.key,
    required this.listTitle,
    required this.listIntro,
    required this.listTitleFont,
    required this.listTitleFontSize,
    required this.listTitleMobileFontSize,
    required this.listTitleColorHex,
    required this.listTitleColorDarkHex,
    required this.isDarkMode,
    this.onToggleDark,
  });

  final String listTitle;
  final String listIntro;
  final String? listTitleFont;
  final int listTitleFontSize;
  final int listTitleMobileFontSize;
  final String? listTitleColorHex;
  final String? listTitleColorDarkHex;
  final bool isDarkMode;
  final ValueChanged<bool>? onToggleDark;

  Color get _background =>
      isDarkMode ? AppColors.darkBackground : AppColors.lightBackground;

  Color get _bodyColor =>
      isDarkMode ? AppColors.darkForeground : AppColors.lightForeground;

  Color get _accentColor =>
      isDarkMode ? AppColors.darkPrimary : AppColors.lightPrimary;

  Color _resolveTitleColor() {
    final raw = (isDarkMode ? listTitleColorDarkHex : listTitleColorHex)
        ?.trim();
    if (raw != null && raw.length == 7 && raw.startsWith('#')) {
      try {
        return Color(int.parse('0xFF${raw.substring(1)}'));
      } catch (_) {}
    }
    return _bodyColor;
  }

  TextStyle _titleStyle() {
    final base = TextStyle(
      fontSize: listTitleFontSize.clamp(12, 72).toDouble(),
      fontWeight: FontWeight.w700,
      height: 1.1,
      color: _resolveTitleColor(),
    );
    final font = listTitleFont?.trim();
    if (font != null && font.isNotEmpty) {
      try {
        return GoogleFonts.getFont(font, textStyle: base);
      } catch (_) {}
    }
    return base;
  }

  @override
  Widget build(BuildContext context) {
    final title = listTitle.trim().isEmpty ? 'Mis Servicios' : listTitle.trim();
    final intro = listIntro.trim().isEmpty
        ? 'Servicios pensados para novias, editorial, social y caracterización.'
        : listIntro.trim();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _PreviewHeader(isDarkMode: isDarkMode, onToggle: onToggleDark),
        DecoratedBox(
          decoration: BoxDecoration(
            color: _background,
            borderRadius: const BorderRadius.vertical(
              bottom: Radius.circular(12),
            ),
            border: Border.all(
              color: _resolveTitleColor().withValues(alpha: 0.12),
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.sm,
                    vertical: AppSpacing.xs,
                  ),
                  decoration: BoxDecoration(
                    color: _accentColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    'Servicios',
                    style: TextStyle(
                      fontSize: 11,
                      color: _accentColor,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
                Text(title, style: _titleStyle()),
                const SizedBox(height: AppSpacing.sm),
                ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 420),
                  child: Text(
                    intro,
                    style: TextStyle(
                      fontSize: listTitleMobileFontSize
                          .clamp(12, 32)
                          .toDouble(),
                      height: 1.45,
                      color: _bodyColor.withValues(alpha: 0.78),
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
                const Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.sm,
                  children: [
                    _MiniServiceCard(
                      icon: Icons.face_retouching_natural_outlined,
                      title: 'Novias',
                    ),
                    _MiniServiceCard(
                      icon: Icons.auto_awesome_outlined,
                      title: 'Editorial',
                    ),
                    _MiniServiceCard(
                      icon: Icons.movie_creation_outlined,
                      title: 'Caracterización',
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Center(
          child: Text(
            'Vista previa de /servicios',
            style: TextStyle(
              fontSize: 11,
              color: Theme.of(
                context,
              ).colorScheme.onSurface.withValues(alpha: 0.45),
            ),
          ),
        ),
      ],
    );
  }
}

class _PreviewHeader extends StatelessWidget {
  const _PreviewHeader({required this.isDarkMode, this.onToggle});

  final bool isDarkMode;
  final ValueChanged<bool>? onToggle;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerLowest,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
        border: Border.all(
          color: colorScheme.outlineVariant.withValues(alpha: 80 / 255),
        ),
      ),
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.base,
        vertical: AppSpacing.xs,
      ),
      child: Row(
        children: [
          Icon(Icons.web_asset_outlined, size: 15, color: colorScheme.primary),
          const SizedBox(width: 6),
          Text(
            'Servicios públicos — Vista previa',
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
              color: colorScheme.primary,
              fontWeight: FontWeight.w600,
            ),
          ),
          const Spacer(),
          if (onToggle != null)
            InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () => onToggle!(!isDarkMode),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      isDarkMode
                          ? Icons.dark_mode_rounded
                          : Icons.light_mode_rounded,
                      size: 14,
                      color: colorScheme.onSurfaceVariant,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      isDarkMode ? 'Oscuro' : 'Claro',
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: colorScheme.onSurfaceVariant,
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

class _MiniServiceCard extends StatelessWidget {
  const _MiniServiceCard({required this.icon, required this.title});

  final IconData icon;
  final String title;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Container(
      width: 148,
      padding: const EdgeInsets.all(AppSpacing.base),
      decoration: BoxDecoration(
        color: colorScheme.surface.withValues(alpha: 0.92),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: colorScheme.outlineVariant),
      ),
      child: Row(
        children: [
          Icon(icon, size: 18, color: colorScheme.primary),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(
                context,
              ).textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}
