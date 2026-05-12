import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../core/debug/debug_provider.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import 'widgets/settings_tile.dart';

class SettingsPage extends ConsumerWidget {
  const SettingsPage({super.key});

  static const _items = [
    SettingsItem(
      icon: Icons.home_outlined,
      title: 'Página de inicio',
      subtitle: 'Hero, imagen, CTA e imágenes destacadas',
      routeName: RouteNames.settingsHome,
    ),
    SettingsItem(
      icon: Icons.face_outlined,
      title: 'Sobre mí',
      subtitle: 'Bio, habilidades, imagen de perfil',
      routeName: RouteNames.settingsAbout,
    ),
    SettingsItem(
      icon: Icons.contact_mail_outlined,
      title: 'Contacto',
      subtitle: 'Email, teléfono, WhatsApp, dirección',
      routeName: RouteNames.settingsContact,
    ),
    SettingsItem(
      icon: Icons.palette_outlined,
      title: 'Tema',
      subtitle: 'Capas visuales, tipografías y preview del sitio',
      routeName: RouteNames.settingsTheme,
    ),
    SettingsItem(
      icon: Icons.web_outlined,
      title: 'Sitio Web',
      subtitle: 'SEO, mantenimiento, visibilidad de páginas',
      routeName: RouteNames.settingsSite,
    ),
    SettingsItem(
      icon: Icons.share_outlined,
      title: 'Redes Sociales',
      subtitle: 'Instagram, TikTok, YouTube, WhatsApp…',
      routeName: RouteNames.settingsSocial,
    ),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final hPad = AppBreakpoints.pageMargin(context);
    final gridHub = AppBreakpoints.isTabletLandscapeWide(context);

    final scrollChild = gridHub
        ? GridView.builder(
            padding: EdgeInsets.all(hPad),
            physics: const AlwaysScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: AppSpacing.sm,
              crossAxisSpacing: AppSpacing.sm,
              childAspectRatio: 2.75,
            ),
            itemCount: _items.length,
            itemBuilder: (_, i) => SettingsTile(_items[i]),
          )
        : ListView.separated(
            padding: EdgeInsets.all(hPad),
            physics: const AlwaysScrollableScrollPhysics(),
            itemCount: _items.length,
            separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.sm),
            itemBuilder: (_, i) => SettingsTile(_items[i]),
          );

    return AppScaffold(
      title: 'Configuración',
      body: RefreshIndicator(
        onRefresh: () async => ref.invalidate(appBuildInfoProvider),
        child: scrollChild,
      ),
    );
  }
}
