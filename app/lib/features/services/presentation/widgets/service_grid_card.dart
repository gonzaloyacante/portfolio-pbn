import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../core/utils/currency_helper.dart';
import '../../data/service_model.dart';

class ServiceGridCard extends StatelessWidget {
  const ServiceGridCard({super.key, required this.item});

  final ServiceItem item;

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
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
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
