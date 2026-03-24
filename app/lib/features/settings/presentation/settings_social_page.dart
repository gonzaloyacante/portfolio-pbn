import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../providers/settings_provider.dart';
import 'widgets/social_link_tile.dart';

class SettingsSocialPage extends ConsumerWidget {
  const SettingsSocialPage({super.key});

  static const _kPlatforms = [
    (
      'Instagram',
      'instagram',
      Icons.photo_camera_outlined,
      'https://instagram.com/tu_usuario',
    ),
    (
      'TikTok',
      'tiktok',
      Icons.music_note_outlined,
      'https://tiktok.com/@tu_usuario',
    ),
    (
      'YouTube',
      'youtube',
      Icons.play_circle_outlined,
      'https://youtube.com/@tu_canal',
    ),
    (
      'WhatsApp',
      'whatsapp',
      Icons.chat_outlined,
      'https://wa.me/549XXXXXXXXXX',
    ),
    (
      'LinkedIn',
      'linkedin',
      Icons.work_outline,
      'https://linkedin.com/in/tu_perfil',
    ),
    (
      'Facebook',
      'facebook',
      Icons.facebook_outlined,
      'https://facebook.com/tu_pagina',
    ),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(socialLinksProvider);

    return AppScaffold(
      title: 'Redes Sociales',
      body: async.when(
        loading: () => const SkeletonSocialList(),
        error: (e, _) => ErrorState(
          message: e.toString(),
          onRetry: () => ref.invalidate(socialLinksProvider),
        ),
        data: (links) => ListView.separated(
          padding: AppBreakpoints.pagePadding(context),
          itemCount: _kPlatforms.length,
          separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.sm),
          itemBuilder: (_, i) {
            final platform = _kPlatforms[i];
            final existing = links.where((l) => l.platform == platform.$2);
            final link = existing.isEmpty ? null : existing.first;

            return RepaintBoundary(
              child: SocialLinkTile(
                platform: platform.$1,
                platformId: platform.$2,
                icon: platform.$3,
                urlHint: platform.$4,
                link: link,
                onSaved: () => ref.invalidate(socialLinksProvider),
              ),
            );
          },
        ),
      ),
    );
  }
}
