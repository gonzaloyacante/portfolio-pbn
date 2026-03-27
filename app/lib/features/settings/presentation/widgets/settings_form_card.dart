import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/theme/app_spacing.dart';

/// Tarjeta de sección reutilizable para todos los formularios de Settings.
class SettingsFormCard extends StatelessWidget {
  const SettingsFormCard({
    super.key,
    required this.title,
    required this.children,
    this.leadingIcon,
    this.color,
    this.trailing,
  });

  final String title;
  final List<Widget> children;
  final IconData? leadingIcon;
  final Color? color;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      title: title,
      leading: leadingIcon != null ? Icon(leadingIcon, size: 18) : null,
      trailing: trailing,
      color: color,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: AppSpacing.md - AppSpacing.sm),
          ...children,
        ],
      ),
    );
  }
}
