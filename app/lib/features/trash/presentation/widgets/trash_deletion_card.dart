import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

class TrashDeletionCard extends StatelessWidget {
  const TrashDeletionCard({
    super.key,
    required this.deletedAt,
    required this.formattedDate,
    required this.isExpiringSoon,
    required this.daysLeft,
  });

  final DateTime deletedAt;
  final String formattedDate;
  final bool isExpiringSoon;
  final int daysLeft;

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    return AppCard(
      borderRadius: BorderRadius.circular(16),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          Icon(
            Icons.delete_outline,
            size: 18,
            color: cs.onSurface.withValues(alpha: 0.5),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Eliminado el',
                  style: tt.labelSmall?.copyWith(
                    color: cs.onSurface.withValues(alpha: 0.55),
                  ),
                ),
                Text(formattedDate, style: tt.bodyMedium),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: isExpiringSoon
                  ? cs.errorContainer
                  : cs.onSurface.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              daysLeft == 0 ? 'Expira hoy' : '$daysLeft días restantes',
              style: tt.labelSmall?.copyWith(
                color: isExpiringSoon
                    ? cs.onErrorContainer
                    : cs.onSurface.withValues(alpha: 0.7),
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
