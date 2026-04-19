import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/theme/app_colors.dart';
import '../../data/testimonial_model.dart';

/// Fila de badges de estado, destacado y verificado de un testimonio.
class TestimonialStatusRow extends StatelessWidget {
  const TestimonialStatusRow({
    super.key,
    required this.item,
    required this.statusOf,
    required this.colorScheme,
  });

  final TestimonialItem item;
  final AppStatus Function(String) statusOf;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      children: [
        StatusBadge(status: statusOf(item.status), small: true),
        if (item.featured) ...[
          const SizedBox(width: 6),
          const Icon(Icons.star_rounded, size: 14, color: AppColors.warning),
          const SizedBox(width: 2),
          Text(
            'Destacado',
            style: theme.textTheme.labelSmall?.copyWith(
              color: AppColors.warning,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
        if (item.verified) ...[
          const SizedBox(width: 6),
          Icon(Icons.verified_rounded, size: 14, color: colorScheme.primary),
        ],
      ],
    );
  }
}
