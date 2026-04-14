import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/theme/app_radius.dart';
import '../../../../core/theme/app_spacing.dart';

class SettingsItem {
  const SettingsItem({
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

class SettingsTile extends StatelessWidget {
  const SettingsTile(this.item, {super.key});
  final SettingsItem item;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
      onTap: () => context.pushNamed(item.routeName),
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
              borderRadius: const BorderRadius.circular(14),
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
          const SizedBox(width: AppSpacing.sm),
          // ── Chevron ────────────────────────────────────
          Icon(
            Icons.chevron_right_rounded,
            size: 20,
            color: colorScheme.outline,
          ),
        ],
      ),
    );
  }
}
