import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/theme/app_radius.dart';

class HelpSectionCard extends StatelessWidget {
  const HelpSectionCard({
    super.key,
    required this.icon,
    required this.title,
    required this.children,
  });

  final IconData icon;
  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forCard,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: Theme.of(context).colorScheme.primary),
              const SizedBox(width: 10),
              Text(
                title,
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const Divider(height: 24),
          ...children,
        ],
      ),
    );
  }
}
