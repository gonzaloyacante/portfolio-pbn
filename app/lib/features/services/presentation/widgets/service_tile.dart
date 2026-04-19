import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/utils/currency_helper.dart';
import '../../data/service_model.dart';

class ServiceTile extends StatelessWidget {
  const ServiceTile({super.key, required this.item});

  final ServiceItem item;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final color = scheme.primary;

    final priceText = item.price != null
        ? '${item.priceLabel ?? 'desde'} ${currencySymbol(item.currency)}${item.price}'
        : 'Sin precio';

    return AppCard(
      borderRadius: AppRadius.forTile,
      onTap: () => context.pushNamed(
        RouteNames.serviceEdit,
        pathParameters: {'id': item.id},
      ),
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      child: Row(
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
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        item.name,
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 4),
                    StatusBadge(
                      status: item.isActive
                          ? AppStatus.active
                          : AppStatus.inactive,
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  '$priceText${item.duration != null ? ' · ${item.duration}' : ''}',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: scheme.outline,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                if (item.shortDesc != null && item.shortDesc!.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(
                    item.shortDesc!,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: scheme.onSurfaceVariant,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
