import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/utils/date_utils.dart';
import '../../data/contact_model.dart';

class ContactTile extends StatelessWidget {
  const ContactTile({
    super.key,
    required this.item,
    required this.priorityColor,
    required this.statusIcon,
    required this.onDelete,
  });

  final ContactItem item;
  final Color priorityColor;
  final IconData statusIcon;
  final Future<void> Function(BuildContext, ContactItem) onDelete;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final unread = !item.isRead;

    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 12, 12, 12),
      elevation: unread ? 2 : 0,
      color: unread ? scheme.surfaceVariant.withValues(alpha: 0.03) : null,
      onTap: () => context.pushNamed(
        RouteNames.contactDetail,
        pathParameters: {'id': item.id},
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Avatar with unread dot
          Stack(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: scheme.primary.withValues(alpha: unread ? 0.15 : 0.07),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(
                  statusIcon,
                  color: unread ? scheme.primary : scheme.outline,
                  size: 20,
                ),
              ),
              if (unread)
                Positioned(
                  right: 0,
                  top: 0,
                  child: Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: scheme.error,
                      shape: BoxShape.circle,
                      border: Border.all(color: scheme.surface, width: 1.5),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 12),
          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Text(
                        item.name,
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: unread
                              ? FontWeight.w700
                              : FontWeight.w600,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
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
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: scheme.outline,
                  ),
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
                      color: unread
                          ? scheme.onSurface
                          : scheme.onSurfaceVariant,
                      fontWeight: unread ? FontWeight.w600 : FontWeight.w500,
                    ),
                  ),
                ],
              ],
            ),
          ),
          // Menu
          PopupMenuButton<String>(
            iconSize: 20,
            padding: EdgeInsets.zero,
            icon: Icon(
              Icons.more_vert_rounded,
              size: 20,
              color: scheme.outline,
            ),
            itemBuilder: (_) => [
              const PopupMenuItem(value: 'view', child: Text('Ver detalle')),
              const PopupMenuItem(
                value: 'delete',
                child: Text(
                  'Eliminar',
                  style: TextStyle(color: AppColors.destructive),
                ),
              ),
            ],
            onSelected: (action) {
              if (action == 'view') {
                context.pushNamed(
                  RouteNames.contactDetail,
                  pathParameters: {'id': item.id},
                );
              } else if (action == 'delete') {
                onDelete(context, item);
              }
            },
          ),
        ],
      ),
    );
  }
}
