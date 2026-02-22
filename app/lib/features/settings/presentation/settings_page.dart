import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../shared/widgets/app_scaffold.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  static const _items = [
    _SettingsItem(
      icon: Icons.face_outlined,
      title: 'Sobre mí',
      subtitle: 'Bio, habilidades, imagen de perfil',
      routeName: RouteNames.settingsAbout,
    ),
    _SettingsItem(
      icon: Icons.contact_mail_outlined,
      title: 'Contacto',
      subtitle: 'Email, teléfono, WhatsApp, dirección',
      routeName: RouteNames.settingsContact,
    ),
    _SettingsItem(
      icon: Icons.palette_outlined,
      title: 'Tema',
      subtitle: 'Colores y tipografías del sitio',
      routeName: RouteNames.settingsTheme,
    ),
    _SettingsItem(
      icon: Icons.web_outlined,
      title: 'Sitio Web',
      subtitle: 'SEO, mantenimiento, visibilidad de páginas',
      routeName: RouteNames.settingsSite,
    ),
    _SettingsItem(
      icon: Icons.share_outlined,
      title: 'Redes Sociales',
      subtitle: 'Instagram, TikTok, YouTube, WhatsApp…',
      routeName: RouteNames.settingsSocial,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Configuración',
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _items.length,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (_, i) => _SettingsTile(_items[i]),
      ),
    );
  }
}

// ── Modelo auxiliar ───────────────────────────────────────────────────────────

class _SettingsItem {
  const _SettingsItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.routeName,
  });
  final IconData icon;
  final String title;
  final String subtitle;
  final String routeName;
}

// ── Tile ──────────────────────────────────────────────────────────────────────

class _SettingsTile extends StatelessWidget {
  const _SettingsTile(this.item);
  final _SettingsItem item;

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: CircleAvatar(
          backgroundColor: Theme.of(
            context,
          ).colorScheme.primary.withValues(alpha: 0.12),
          child: Icon(item.icon, color: Theme.of(context).colorScheme.primary),
        ),
        title: Text(
          item.title,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Text(item.subtitle),
        trailing: const Icon(Icons.chevron_right),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        onTap: () => context.pushNamed(item.routeName),
      ),
    );
  }
}
