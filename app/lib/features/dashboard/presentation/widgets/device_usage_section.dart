import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../shared/widgets/app_card.dart';

class DeviceUsageSection extends StatelessWidget {
  const DeviceUsageSection({
    super.key,
    required this.deviceUsage,
    required this.total,
  });

  final Map<String, int> deviceUsage;
  final int total;

  static const _icons = {
    'mobile': Icons.smartphone_outlined,
    'tablet': Icons.tablet_outlined,
    'desktop': Icons.computer_outlined,
  };

  static const _labels = {
    'mobile': 'Móvil',
    'tablet': 'Tablet',
    'desktop': 'Escritorio',
  };

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final safeTotal = total > 0 ? total : 1;

    final colors = {
      'mobile': colorScheme.primary,
      'tablet': AppColors.info,
      'desktop': AppColors.success,
    };

    final sorted = deviceUsage.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    return AppCard(
      elevation: 0,
      borderRadius: BorderRadius.circular(16),
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Row(
        children: sorted.map((entry) {
          final pct = (entry.value / safeTotal * 100).round();
          final color = colors[entry.key] ?? colorScheme.primary;
          return Expanded(
            child: Column(
              children: [
                Icon(
                  _icons[entry.key] ?? Icons.devices_outlined,
                  color: color,
                  size: 28,
                ),
                const SizedBox(height: 4),
                Text(
                  '$pct%',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
                Text(
                  _labels[entry.key] ?? entry.key,
                  style: theme.textTheme.bodySmall,
                ),
                Text(
                  '${entry.value} visitas',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}
