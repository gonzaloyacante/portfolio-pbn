import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../data/trash_model.dart';

IconData trashTypeIcon(String type) => switch (type) {
  'category' => Icons.category_outlined,
  'service' => Icons.home_repair_service_outlined,
  'testimonial' => Icons.star_border,
  'contact' => Icons.mail_outline,
  'booking' => Icons.event_outlined,
  _ => Icons.delete_outline,
};

class TrashHeroCard extends StatelessWidget {
  const TrashHeroCard({super.key, required this.item});

  final TrashItem item;

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    return AppCard(
      borderRadius: BorderRadius.circular(20),
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          CircleAvatar(
            radius: 32,
            backgroundColor: cs.primaryContainer,
            child: Icon(
              trashTypeIcon(item.type),
              size: 28,
              color: cs.onPrimaryContainer,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.displayName,
                  style: tt.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 3,
                  ),
                  decoration: BoxDecoration(
                    color: cs.secondaryContainer,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    trashTypeLabel(item.type),
                    style: tt.labelSmall?.copyWith(
                      color: cs.onSecondaryContainer,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
