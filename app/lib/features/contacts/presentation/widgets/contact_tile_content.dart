import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/date_utils.dart';
import '../../data/contact_model.dart';
import 'contact_badge.dart';

/// Columna de contenido central de ContactTile (nombre, email, asunto, badges).
class ContactTileContent extends StatelessWidget {
  const ContactTileContent({
    super.key,
    required this.item,
    required this.unread,
    required this.theme,
    required this.scheme,
  });

  final ContactItem item;
  final bool unread;
  final ThemeData theme;
  final ColorScheme scheme;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Text(
                item.name,
                style: theme.textTheme.titleSmall?.copyWith(
                  fontWeight: unread ? FontWeight.w700 : FontWeight.w600,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: 8),
            if (item.isImportant)
              const Padding(
                padding: EdgeInsets.only(right: 4),
                child: Icon(
                  Icons.star_rounded,
                  size: 14,
                  color: AppColors.warning,
                ),
              ),
            Text(
              AppDateUtils.toRelative(item.createdAt),
              style: theme.textTheme.labelSmall?.copyWith(
                color: scheme.outline,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Text(
          item.email,
          style: theme.textTheme.bodySmall?.copyWith(color: scheme.outline),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        if (item.subject != null && item.subject!.isNotEmpty) ...[
          const SizedBox(height: 6),
          Text(
            item.subject!,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: unread ? scheme.onSurface : scheme.onSurfaceVariant,
              fontWeight: unread ? FontWeight.w600 : FontWeight.w500,
            ),
          ),
        ],
        const SizedBox(height: 6),
        Wrap(
          spacing: 4,
          runSpacing: 4,
          children: [
            ContactBadge(
              label: contactStatusLabel(item.status),
              color: contactStatusColor(item.status, scheme),
            ),
            if (item.priority == 'URGENT')
              const ContactBadge(
                label: 'Urgente',
                color: AppColors.priorityHigh,
              ),
            if (item.priority == 'HIGH')
              const ContactBadge(
                label: 'Alta',
                color: AppColors.priorityMedium,
              ),
          ],
        ),
      ],
    );
  }
}
