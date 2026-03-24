import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../../shared/widgets/app_card.dart';
import '../../data/trash_model.dart';

final _dateFmt = DateFormat('d MMM yyyy', 'es');

IconData trashTypeIcon(String type) => switch (type) {
  'project' => Icons.work_outline,
  'category' => Icons.category_outlined,
  'service' => Icons.home_repair_service_outlined,
  'testimonial' => Icons.star_border,
  'contact' => Icons.mail_outline,
  'booking' => Icons.event_outlined,
  _ => Icons.delete_outline,
};

class TrashCard extends StatelessWidget {
  const TrashCard({
    super.key,
    required this.item,
    required this.onTap,
    required this.onRestore,
    required this.onPurge,
  });

  final TrashItem item;
  final VoidCallback onTap;
  final VoidCallback onRestore;
  final VoidCallback onPurge;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final deletedStr = _dateFmt.format(item.deletedAt.toLocal());
    final daysElapsed = DateTime.now().difference(item.deletedAt).inDays;
    final daysLeft = (30 - daysElapsed).clamp(0, 30);
    final isExpiringSoon = daysLeft <= 7;

    return AppCard(
      borderRadius: BorderRadius.circular(16),
      padding: const EdgeInsets.all(16),
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Icono + nombre
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              CircleAvatar(
                radius: 22,
                backgroundColor: colorScheme.primaryContainer,
                child: Icon(
                  trashTypeIcon(item.type),
                  size: 20,
                  color: colorScheme.onPrimaryContainer,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.displayName,
                      style: textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      trashTypeLabel(item.type),
                      style: textTheme.labelSmall?.copyWith(
                        color: colorScheme.onSurface.withValues(alpha: 0.6),
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.chevron_right,
                size: 18,
                color: colorScheme.onSurface.withValues(alpha: 0.35),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Divider(
            height: 1,
            color: colorScheme.onSurface.withValues(alpha: 0.08),
          ),
          const SizedBox(height: 10),
          // Fecha eliminado + badge expiración
          Row(
            children: [
              Icon(
                Icons.calendar_today_outlined,
                size: 13,
                color: colorScheme.onSurface.withValues(alpha: 0.5),
              ),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  deletedStr,
                  style: textTheme.bodySmall?.copyWith(
                    color: colorScheme.onSurface.withValues(alpha: 0.6),
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isExpiringSoon
                      ? colorScheme.errorContainer
                      : colorScheme.onSurface.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  daysLeft == 0 ? 'Hoy expira' : '$daysLeft d restantes',
                  style: textTheme.labelSmall?.copyWith(
                    color: isExpiringSoon
                        ? colorScheme.onErrorContainer
                        : colorScheme.onSurface.withValues(alpha: 0.7),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Acciones rápidas
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onRestore,
                  icon: const Icon(Icons.restore, size: 16),
                  label: const Text('Restaurar'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: colorScheme.primary,
                    side: BorderSide(color: colorScheme.primary),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: onPurge,
                icon: const Icon(Icons.delete_forever, size: 20),
                tooltip: 'Eliminar permanentemente',
                style: IconButton.styleFrom(
                  backgroundColor: colorScheme.errorContainer,
                  foregroundColor: colorScheme.onErrorContainer,
                  minimumSize: const Size(40, 40),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
