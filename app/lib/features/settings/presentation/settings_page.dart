import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
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
    final hPad = AppBreakpoints.pageMargin(context);
    return AppScaffold(
      title: 'Configuración',
      body: ListView.separated(
        padding: EdgeInsets.all(hPad),
        itemCount: _items.length,
        separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.sm),
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
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Card(
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: AppRadius.forTile),
      child: InkWell(
        borderRadius: AppRadius.forTile,
        onTap: () => context.pushNamed(item.routeName),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
          child: Row(
            children: [
              // ── Icon container ──────────────────────────────
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      colorScheme.primary.withValues(alpha: 0.15),
                      colorScheme.primary.withValues(alpha: 0.06),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(item.icon, size: 22, color: colorScheme.primary),
              ),
              const SizedBox(width: 14),
              // ── Text ───────────────────────────────────────
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      style: theme.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      item.subtitle,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: colorScheme.outline,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              // ── Chevron ────────────────────────────────────
              Icon(
                Icons.chevron_right_rounded,
                size: 20,
                color: colorScheme.outline,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
