import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_radius.dart';
import '../../data/contact_model.dart';
import 'contact_tile_avatar.dart';
import 'contact_tile_content.dart';

class ContactTile extends StatelessWidget {
  const ContactTile({
    super.key,
    required this.item,
    required this.priorityColor,
    required this.statusIcon,
  });

  final ContactItem item;
  final Color priorityColor;
  final IconData statusIcon;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final unread = !item.isRead;

    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      elevation: unread ? 2 : 0,
      color: unread ? scheme.surfaceVariant.withValues(alpha: 0.03) : null,
      onTap: () => context.pushNamed(
        RouteNames.contactDetail,
        pathParameters: {'id': item.id},
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          ContactTileAvatar(
            statusIcon: statusIcon,
            unread: unread,
            scheme: scheme,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: ContactTileContent(
              item: item,
              unread: unread,
              theme: theme,
              scheme: scheme,
            ),
          ),
        ],
      ),
    );
  }
}
