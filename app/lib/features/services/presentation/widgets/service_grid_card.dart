import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/utils/currency_helper.dart';
import '../../../../shared/widgets/app_card.dart';
import '../../../../shared/widgets/status_badge.dart';
import '../../data/service_model.dart';

class ServiceGridCard extends StatelessWidget {
  const ServiceGridCard({
    super.key,
    required this.item,
    required this.onDelete,
  });

  final ServiceItem item;
  final Future<void> Function(BuildContext, ServiceItem) onDelete;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final color = scheme.primary;

    final priceText = item.price != null
        ? '${currencySymbol(item.currency)}${item.price}'
        : null;

    return AppCard(
      borderRadius: AppRadius.forTile,
      onTap: () => context.pushNamed(
        RouteNames.serviceEdit,
        pathParameters: {'id': item.id},
      ),
      padding: const EdgeInsets.fromLTRB(12, 14, 4, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Icon + menu row
          Row(
            children: [
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Center(
                  child: Icon(Icons.design_services, color: color, size: 22),
                ),
              ),
              const Spacer(),
              PopupMenuButton<String>(
                iconSize: 18,
                padding: EdgeInsets.zero,
                icon: Icon(
                  Icons.more_vert_rounded,
                  size: 18,
                  color: scheme.outline,
                ),
                itemBuilder: (_) => [
                  const PopupMenuItem(
                    value: 'edit',
                    child: Row(
                      children: [
                        Icon(Icons.edit_outlined, size: 18),
                        SizedBox(width: 10),
                        Text('Editar'),
                      ],
                    ),
                  ),
                  PopupMenuItem(
                    value: 'delete',
                    child: Row(
                      children: [
                        Icon(
                          Icons.delete_outline,
                          size: 18,
                          color: AppColors.destructive,
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'Eliminar',
                          style: TextStyle(color: AppColors.destructive),
                        ),
                      ],
                    ),
                  ),
                ],
                onSelected: (action) {
                  if (action == 'edit') {
                    context.pushNamed(
                      RouteNames.serviceEdit,
                      pathParameters: {'id': item.id},
                    );
                  } else if (action == 'delete') {
                    onDelete(context, item);
                  }
                },
              ),
            ],
          ),
          const SizedBox(height: 10),
          // Name
          Text(
            item.name,
            style: theme.textTheme.titleSmall?.copyWith(
              fontWeight: FontWeight.w700,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          // Price
          if (priceText != null)
            Text(
              priceText,
              style: theme.textTheme.bodySmall?.copyWith(
                color: scheme.outline,
                fontWeight: FontWeight.w600,
              ),
            ),
          const Spacer(),
          // Status
          StatusBadge(
            status: item.isActive ? AppStatus.active : AppStatus.inactive,
            small: true,
          ),
        ],
      ),
    );
  }
}
