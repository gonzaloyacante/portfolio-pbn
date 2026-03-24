import 'package:flutter/material.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_scaffold.dart';
import 'widgets/settings_tile.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  static const _items = [
    SettingsItem(
      icon: Icons.home_outlined,
      title: 'Página de inicio',
      subtitle: 'Hero, imagen, CTA y proyectos destacados',
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
      subtitle: 'Colores y tipografías del sitio',
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
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    return AppScaffold(
      title: 'Configuración',
      body: ListView.separated(
        padding: EdgeInsets.all(hPad),
        itemCount: _items.length,
        separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.sm),
        itemBuilder: (_, i) => SettingsTile(_items[i]),
      ),
    );
  }
}
